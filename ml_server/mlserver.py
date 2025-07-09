from flask import Flask, request, send_file, jsonify
import torch
from PIL import Image, ImageDraw
from torchvision import transforms
from transformers import ViTForImageClassification
import torch.nn as nn
import io
from PIL import ImageFont
from flask_cors import CORS




# Mapping of class and severity labels
CLASS_LABELS = [
    "Longitudinal Crack",  # D00
    "Transverse Crack",    # D01
    "Alligator Crack",     # D10
    "Block Crack",         # D11
            # D44
]

SEVERITY_LABELS = ["Low", "Medium", "High"]

# --- Model class ---
class DamageViTModel(nn.Module):
    def __init__(self, num_classes, num_severity):
        super().__init__()
        self.vit = ViTForImageClassification.from_pretrained(
            "google/vit-base-patch16-224-in21k",
            num_labels=num_classes,
            ignore_mismatched_sizes=True
        )
        #for param in self.vit.vit.encoder.layer[-2:].parameters():
        #   param.requires_grad = True
        #for param in self.vit.classifier.parameters():
        #    param.requires_grad = True
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
        bbox_pred = torch.sigmoid(self.bbox_regressor(cls_token))  # Normalized bbox: [cx, cy, w, h]
        severity_logits = self.severity_classifier(cls_token)
        return {
            'class_logits': outputs.logits,
            'bbox_pred': bbox_pred,
            'severity_logits': severity_logits
        }

# --- Flask App Setup ---
app = Flask(__name__)
CORS(app)

NUM_CLASSES = 4
NUM_SEVERITY = 3
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

model = DamageViTModel(num_classes=NUM_CLASSES, num_severity=NUM_SEVERITY).to(device)
model.load_state_dict(torch.load(
    r"H:\sem 4\ps\SSPSfinal\ml_server\best_damage_vit_model (1).pth", map_location=device
))
model.eval()

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
])

@app.route("/analyze/annotate", methods=["POST"])
def analyze():
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    image_file = request.files['image']
    image = Image.open(image_file).convert("RGB")
    original_image = image.copy()
    image_tensor = transform(image).unsqueeze(0).to(device)

    with torch.no_grad():
        output = model(image_tensor)
        predicted_class = output['class_logits'].argmax(dim=1).item()
        severity_class = output['severity_logits'].argmax(dim=1).item()
        bbox = output['bbox_pred'][0].tolist()  # [cx, cy, w, h]

    # Convert normalized bbox [cx, cy, w, h] → [x1, y1, x2, y2]
    w_img, h_img = original_image.size
    cx, cy, bw, bh = bbox
    x1 = int((cx - bw / 2) * w_img)
    y1 = int((cy - bh / 2) * h_img)
    x2 = int((cx + bw / 2) * w_img)
    y2 = int((cy + bh / 2) * h_img)

    # Sort and clamp coordinates
    x1, x2 = sorted([max(0, x1), min(w_img, x2)])
    y1, y2 = sorted([max(0, y1), min(h_img, y2)])

    draw = ImageDraw.Draw(original_image)
    draw.rectangle([x1, y1, x2, y2], outline="red", width=3)
    #draw.text((x1, max(0, y1 - 10)), f"Class: {predicted_class}, Severity: {severity_class}", fill="red")
    class_label = CLASS_LABELS[predicted_class]
    severity_label = SEVERITY_LABELS[severity_class]
    # Load a larger TrueType font
    font = ImageFont.truetype("arial.ttf", size=30)  # You can adjust size here

# Then use it in your draw.text()
    draw.text((x1, max(0, y1 - 30)), f"{class_label} ({severity_label})", fill="red", font=font)
    #draw.text((x1, max(0, y1 - 10)), f"{class_label} ({severity_label})", fill="red")


    buffer = io.BytesIO()
    original_image.save(buffer, format="PNG")
    buffer.seek(0)

    return send_file(buffer, mimetype='image/png', as_attachment=True, download_name="result.png")
@app.route("/analyze/json", methods=["POST"])
def analyzeimage():
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    image_file = request.files['image']
    image = Image.open(image_file).convert("RGB")
    image_tensor = transform(image).unsqueeze(0).to(device)

    with torch.no_grad():
        output = model(image_tensor)
        predicted_class = output['class_logits'].argmax(dim=1).item()
        severity_class = output['severity_logits'].argmax(dim=1).item()
        bbox = output['bbox_pred'][0].tolist()

    # 🧠 Handle safe indexing
    class_label = CLASS_LABELS[predicted_class] if predicted_class < len(CLASS_LABELS) else "Unknown"
    severity_label = SEVERITY_LABELS[severity_class] if severity_class < len(SEVERITY_LABELS) else "Unknown"

    summary = f"A road damage of type '{class_label}' was detected with '{severity_label}' severity."
    print("🔍 Predicted class index:", predicted_class)
    print("🔍 Severity index:", severity_class)
    print("🔍 CLASS_LABELS length:", len(CLASS_LABELS))
    print("🔍 class_label:", class_label)


    return jsonify({
        "type": class_label,
        "severity": severity_label,
        "summary": summary,
        "bbox": bbox
    })
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)


# @app.route("/analyze/json", methods=["POST"])
# def analyzeimage():
#     if 'image' not in request.files:
#         return jsonify({"error": "No image uploaded"}), 400

#     image_file = request.files['image']
#     image = Image.open(image_file).convert("RGB")
#     image_tensor = transform(image).unsqueeze(0).to(device)

#     with torch.no_grad():
#         output = model(image_tensor)
#         predicted_class = output['class_logits'].argmax(dim=1).item()
#         severity_class = output['severity_logits'].argmax(dim=1).item()
#         bbox = output['bbox_pred'][0].tolist()

#     return jsonify({
#         "predicted_class": predicted_class,
#         "severity": severity_class,
#         "bbox": bbox
#     })


