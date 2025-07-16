# # Save this file as app.py
# import os
# import io
# from flask import Flask, request, send_file, jsonify
# from flask_cors import CORS
# from ultralytics import YOLO
# import cv2

# # === Flask Setup ===
# app = Flask(__name__)
# CORS(app) # Allows other web pages to make requests to your app

# # === CONFIG & MODEL LOADING ===
# # Get the directory where this script is located
# basedir = os.path.abspath(os.path.dirname(__file__))
# # Define the path to your YOLOv8 model
# # NEW, CORRECTED LINE
# MODEL_PATH = os.path.join(basedir, 'model', r'C:\safestreet\model\best (1).pt')

# print(f"--- Loading YOLOv8 model from: {MODEL_PATH} ---")
# # Load your custom-trained YOLOv8 model
# try:
#     model = YOLO(MODEL_PATH)
#     print("--- Model loaded successfully! ---")
# except Exception as e:
#     print(f"!!! ERROR loading model: {e} !!!")
#     # Exit if the model can't be loaded
#     exit()

# # Define Severity Thresholds (in pixels squared) for our rule-based logic
# LOW_AREA_THRESHOLD = 5000
# HIGH_AREA_THRESHOLD = 20000

# # === HELPER FUNCTION FOR PREDICTION ===
# def run_yolo_prediction(image_path):
#     """
#     Runs YOLOv8 model on an image and applies rule-based severity.
#     Returns a list of detected objects, each as a dictionary.
#     """
#     # The model.predict() method is cleaner for scripting
#     results = model.predict(image_path)
    
#     detections = []
#     # Loop through each result object
#     for r in results:
#         # Loop through each bounding box detected in the image
#         for box in r.boxes:
#             # Extract coordinates, class, and confidence
#             x1, y1, x2, y2 = [round(c) for c in box.xyxy[0].tolist()]
#             class_id = int(box.cls[0])
#             class_name = model.names[class_id]
#             confidence = round(float(box.conf[0]), 2)
            
#             # Rule-based severity logic
#             box_area = (x2 - x1) * (y2 - y1)
#             if box_area < LOW_AREA_THRESHOLD:
#                 severity = 'Low'
#             elif LOW_AREA_THRESHOLD <= box_area < HIGH_AREA_THRESHOLD:
#                 severity = 'Medium'
#             else:
#                 severity = 'High'

#             # Store the detection details
#             detections.append({
#                 'class_name': class_name,
#                 'severity': severity,
#                 'confidence': confidence,
#                 'bbox_pixels': [x1, y1, x2, y2],
#                 'area': box_area
#             })
            
#     return detections

# # === API ENDPOINTS ===

# @app.route("/analyze/json", methods=["POST"])
# def analyze_json():
#     if 'image' not in request.files:
#         return jsonify({"error": "No image file provided"}), 400
    
#     image_file = request.files['image']
    
#     # Save the image temporarily to run prediction
#     # (YOLO works best with file paths)
#     temp_path = "temp_image.jpg"
#     image_file.save(temp_path)
    
#     # Run our new prediction function
#     detections = run_yolo_prediction(temp_path)
#     os.remove(temp_path) # Clean up the temp file

#     if not detections:
#         return jsonify({"summary": "No road damage detected."})

#     # For this endpoint, we'll return the details of the largest detection
#     # This keeps the API consistent with your old single-detection model
#     main_detection = max(detections, key=lambda x: x['area'])

#     summary = f"A road damage of type '{main_detection['class_name']}' was detected with an estimated severity of '{main_detection['severity']}'."

#     return jsonify({
#         "type": main_detection['class_name'],
#         "severity": main_detection['severity'],
#         "confidence": main_detection['confidence'],
#         "summary": summary,
#         "bbox_pixels": main_detection['bbox_pixels'],
#         "all_detections_count": len(detections) # Bonus info
#     })

# @app.route("/analyze/annotate", methods=["POST"])
# def analyze_annotate():
#     if 'image' not in request.files:
#         return jsonify({"error": "No image file provided"}), 400
    
#     image_file = request.files['image']
#     temp_path = "temp_image.jpg"
#     image_file.save(temp_path)
    
#     detections = run_yolo_prediction(temp_path)
    
#     # Load the image to draw on using OpenCV
#     image_to_draw_on = cv2.imread(temp_path)
#     img_height, img_width, _ = image_to_draw_on.shape

#     # Loop through ALL detections and draw them
#     for det in detections:
#         x1, y1, x2, y2 = det['bbox_pixels']
#         label = f"{det['class_name']} {det['confidence']} | Sev: {det['severity']}"
        
#         # Use our robust, edge-aware drawing logic from Colab
#         (text_width, text_height), _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.7, 2)
#         label_x_start = x1
#         if (x1 + text_width) > img_width:
#             label_x_start = img_width - text_width
        
#         cv2.rectangle(image_to_draw_on, (label_x_start - 5, y1 - text_height - 15), (label_x_start + text_width + 5, y1 - 10), (0, 128, 0), cv2.FILLED)
#         cv2.putText(image_to_draw_on, label, (label_x_start, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
#         cv2.rectangle(image_to_draw_on, (x1, y1), (x2, y2), (0, 255, 0), 2)

#     os.remove(temp_path) # Clean up

#     # Save the annotated image to a memory buffer
#     _, buffer = cv2.imencode('.png', image_to_draw_on)
#     image_bytes = io.BytesIO(buffer)

#     # Send the image back as a response
#     return send_file(image_bytes, mimetype='image/png')

# # --- Run the App ---
# if __name__ == "__main__":
#     app.run(host="0.0.0.0", port=5000, debug=True)