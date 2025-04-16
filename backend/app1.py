from flask import Flask, request, jsonify
import cv2
import numpy as np
from ultralytics import YOLO
import tempfile
import os

app = Flask(__name__)

# Load YOLO model once
model = YOLO("yolov8n.pt")

@app.route('/monitor-traffic', methods=['POST'])
def monitor_traffic():
    if 'video' not in request.files:
        return jsonify({"error": "No video provided."}), 400

    video_file = request.files['video']

    # Create a temp file safely and explicitly close it after saving
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".mp4")
    video_file.save(temp_file.name)
    temp_file.close()

    cap = cv2.VideoCapture(temp_file.name)

    if not cap.isOpened():
        os.unlink(temp_file.name)
        return jsonify({"error": "Failed to open video file."}), 400

    total_car_count = 0
    frame_count = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        frame_resized = cv2.resize(frame, (800, 450))
        results = model(frame_resized)[0]

        car_count = sum(1 for result in results.boxes.data if int(result[5]) in [2, 3, 5, 7])

        total_car_count += car_count
        frame_count += 1

    cap.release()
    os.unlink(temp_file.name)  # Safely delete temp file

    average_car_count = total_car_count / frame_count if frame_count else 0

    if average_car_count > 10:
        congestion_level = "High Traffic"
    elif average_car_count > 5:
        congestion_level = "Moderate Traffic"
    else:
        congestion_level = "Low Traffic"

    return jsonify({"level": congestion_level, "average_vehicle_count": average_car_count})

if __name__ == '__main__':
    app.run(debug=True)
