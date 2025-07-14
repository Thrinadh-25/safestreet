from flask import Flask, request, send_file, jsonify
import torch
import torch.nn as nn
from PIL import Image, ImageDraw, ImageFont
from torchvision import transforms
from transformers import ViTForImageClassification
import io
from flask_cors import CORS

# === CONFIG ===
NUM_CLASSES = 4
NUM_SEVERITY = 3
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# === LABELS ===
CLASS_LABELS = [
    "Longitudinal Crack",  # D00
    "Transverse Crack",    # D01
    "Alligator Crack",     # D10
    "Block Crack"          # D11
]
SEVERITY_LABELS = ["Low", "Medium", "High"]

# === Flask Setup ===
app = Flask(__name__)
CORS(app)

# === Road Check Model (SmallCNN) ===
class RoadCheckModel(nn.Module):
    def __init__(self, num_classes=2):
        super(RoadCheckModel, self).__init__()
        self.features = nn.Sequential(
            nn.Conv2d(3, 16, 3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Conv2d(16, 32, 3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Conv2d(32, 64, 3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2)
        )
        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Linear(64 * 28 * 28, 128),  # 224 // 8 = 28
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(128, num_classes)
        )

    def forward(self, x):
        x = self.features(x)
        x = self.classifier(x)
        return x

road_model = RoadCheckModel().to(device)
road_model.load_state_dict(torch.load(r"D:\Safestreet\safestreet\model\road_classifier.pth", map_location=device))
road_model.eval()

road_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.5, 0.5, 0.5], std=[0.5, 0.5, 0.5])
])

# === ViT Damage Model ===
class DamageViTModel(nn.Module):
    def __init__(self, num_classes, num_severity):
        super().__init__()
        self.vit = ViTForImageClassification.from_pretrained(
            "google/vit-base-patch16-224-in21k",
            num_labels=num_classes,
            ignore_mismatched_sizes=True
        )
        for param in self.vit.vit.encoder.layer[-2:].parameters():
            param.requires_grad = True
        for param in self.vit.classifier.parameters():
            param.requires_grad = True
        self.bbox_regressor = nn.Sequential(
            nn.Linear(self.vit.config.hidden_size, 256),
            nn.ReLU(),
            nn.Linear(256, 4)
        )
        self.severity_classifier = nn.Sequential(
            nn.Linear(self.vit.config.hidden_size, 128),
            nn.ReLU(),
            nn.Linear(128, num_severity)
        )

    def forward(self, pixel_values):
        outputs = self.vit(pixel_values=pixel_values, output_hidden_states=True)
        cls_token = outputs.hidden_states[-1][:, 0]
        bbox_pred = torch.sigmoid(self.bbox_regressor(cls_token))
        severity_logits = self.severity_classifier(cls_token)
        return {
            'class_logits': outputs.logits,
            'bbox_pred': bbox_pred,
            'severity_logits': severity_logits
        }

damage_model = DamageViTModel(num_classes=NUM_CLASSES, num_severity=NUM_SEVERITY).to(device)
damage_model.load_state_dict(torch.load(r"D:\Safestreet\safestreet\model\best_damage_vit_model (2).pth", map_location=device))
damage_model.eval()

damage_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.5, 0.5, 0.5], std=[0.5, 0.5, 0.5])
])

# === ROUTES ===

@app.route("/analyze/annotate", methods=["POST"])
def analyze():
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    image_file = request.files['image']
    image = Image.open(image_file).convert("RGB")
    original_image = image.copy()

    # --- Step 1: Road Check ---
    road_tensor = road_transform(image).unsqueeze(0).to(device)
    with torch.no_grad():
        road_output = road_model(road_tensor)
        road_pred = torch.argmax(road_output, dim=1).item()

    if road_pred == 0:  # 0 = Not a road image
        return jsonify({"error": "Image is not a road photo. Please upload a road image."}), 400

    # --- Step 2: Damage Prediction ---
    image_tensor = damage_transform(image).unsqueeze(0).to(device)
    with torch.no_grad():
        output = damage_model(image_tensor)
        predicted_class = output['class_logits'].argmax(dim=1).item()
        severity_class = output['severity_logits'].argmax(dim=1).item()
        bbox = output['bbox_pred'][0].tolist()

    # --- Draw bounding box ---
    w_img, h_img = original_image.size
    MODEL_SIZE = 224

    # Option 1: Interpret bbox as [cx, cy, bw, bh]
    cx, cy, bw, bh = bbox
    # Cap width and height to match "Low" severity (area < 1%)
    bw = min(bw, 0.1)  # Limit to 10% of image
    bh = min(bh, 0.1)
    x1 = (cx - bw / 2) * MODEL_SIZE
    y1 = (cy - bh / 2) * MODEL_SIZE
    x2 = (cx + bw / 2) * MODEL_SIZE
    y2 = (cy + bh / 2) * MODEL_SIZE

    # Option 2: Interpret bbox as [xmin, ymin, xmax, ymax] (uncomment to test)
    # x1, y1, x2, y2 = bbox
    # x1 *= MODEL_SIZE
    # y1 *= MODEL_SIZE
    # x2 *= MODEL_SIZE
    # y2 *= MODEL_SIZE

    # Scale to original image size
    scale_x = w_img / MODEL_SIZE
    scale_y = h_img / MODEL_SIZE
    x1 = int(x1 * scale_x)
    y1 = int(y1 * scale_y)
    x2 = int(x2 * scale_x)
    y2 = int(y2 * scale_y)

    # Ensure coordinates are within bounds
    x1, x2 = sorted([max(0, x1), min(w_img, x2)])
    y1, y2 = sorted([max(0, y1), min(h_img, y2)])

    # Calculate box area as percentage of image
    box_area = (x2 - x1) * (y2 - y1)
    image_area = w_img * h_img
    area_percent = (box_area / image_area) * 100

    # Debug print statements
    print(f"Raw bbox: {bbox}")
    print(f"Capped bw, bh: {bw}, {bh}")
    print(f"Model pixel coords (224x224): x1={x1/scale_x:.2f}, y1={y1/scale_y:.2f}, x2={x2/scale_x:.2f}, y2={y2/scale_y:.2f}")
    print(f"Image size: {w_img}x{h_img}")
    print(f"Final pixel coords: x1={x1}, y1={y1}, x2={x2}, y2={y2}")
    print(f"Box size: width={x2-x1}, height={y2-y1}")
    print(f"Box area: {area_percent:.2f}% of image")

    draw = ImageDraw.Draw(original_image)
    try:
        font = ImageFont.truetype("arial.ttf", size=30)
    except IOError:
        font = ImageFont.load_default()

    class_label = CLASS_LABELS[predicted_class]
    severity_label = SEVERITY_LABELS[severity_class]
    draw.rectangle([x1, y1, x2, y2], outline="red", width=3)
    draw.text((x1, max(0, y1 - 30)), f"{class_label} ({severity_label})", fill="red", font=font)

    buffer = io.BytesIO()
    original_image.save(buffer, format="PNG")
    buffer.seek(0)

    return send_file(buffer, mimetype='image/png', as_attachment=True, download_name="result.png")


@app.route("/analyze/json", methods=["POST"])
def analyze_json():
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    image_file = request.files['image']
    image = Image.open(image_file).convert("RGB")

    # --- Step 1: Road Check ---
    road_tensor = road_transform(image).unsqueeze(0).to(device)
    with torch.no_grad():
        road_output = road_model(road_tensor)
        road_pred = torch.argmax(road_output, dim=1).item()

    if road_pred == 0:  # Not road image
        return jsonify({"error": "Image is not a road photo. Please upload a road image."}), 400

    # --- Step 2: Damage Prediction ---
    image_tensor = damage_transform(image).unsqueeze(0).to(device)
    with torch.no_grad():
        output = damage_model(image_tensor)
        predicted_class = output['class_logits'].argmax(dim=1).item()
        severity_class = output['severity_logits'].argmax(dim=1).item()
        bbox = output['bbox_pred'][0].tolist()

    # --- Convert bounding box to pixel coordinates ---
    w_img, h_img = image.size
    MODEL_SIZE = 224

    # Option 1: Interpret bbox as [cx, cy, bw, bh]
    cx, cy, bw, bh = bbox
    # Cap width and height to match "Low" severity
    bw = min(bw, 0.1)
    bh = min(bh, 0.1)
    x1 = (cx - bw / 2) * MODEL_SIZE
    y1 = (cy - bh / 2) * MODEL_SIZE
    x2 = (cx + bw / 2) * MODEL_SIZE
    y2 = (cy + bh / 2) * MODEL_SIZE

    # Option 2: Interpret bbox as [xmin, ymin, xmax, ymax] (uncomment to test)
    # x1, y1, x2, y2 = bbox
    # x1 *= MODEL_SIZE
    # y1 *= MODEL_SIZE
    # x2 *= MODEL_SIZE
    # y2 *= MODEL_SIZE

    # Scale to original image size
    scale_x = w_img / MODEL_SIZE
    scale_y = h_img / MODEL_SIZE
    x1 = int(x1 * scale_x)
    y1 = int(y1 * scale_y)
    x2 = int(x2 * scale_x)
    y2 = int(y2 * scale_y)

    # Ensure coordinates are within bounds
    x1, x2 = sorted([max(0, x1), min(w_img, x2)])
    y1, y2 = sorted([max(0, y1), min(h_img, y2)])

    # Calculate box area as percentage of image
    box_area = (x2 - x1) * (y2 - y1)
    image_area = w_img * h_img
    area_percent = (box_area / image_area) * 100

    # Debug print statements
    print(f"Raw bbox: {bbox}")
    print(f"Capped bw, bh: {bw}, {bh}")
    print(f"Model pixel coords (224x224): x1={x1/scale_x:.2f}, y1={y1/scale_y:.2f}, x2={x2/scale_x:.2f}, y2={y2/scale_y:.2f}")
    print(f"Image size: {w_img}x{h_img}")
    print(f"Final pixel coords: x1={x1}, y1={y1}, x2={x2}, y2={y2}")
    print(f"Box area: {area_percent:.2f}% of image")

    class_label = CLASS_LABELS[predicted_class] if predicted_class < len(CLASS_LABELS) else "Unknown"
    severity_label = SEVERITY_LABELS[severity_class] if severity_class < len(SEVERITY_LABELS) else "Unknown"

    summary = f"A road damage of type '{class_label}' was detected with '{severity_label}' severity."

    return jsonify({
        "type": class_label,
        "severity": severity_label,
        "summary": summary,
        "bbox": [x1, y1, x2, y2]
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)