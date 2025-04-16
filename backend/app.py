from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import numpy as np
import cv2
from ultralytics import YOLO
import firebase_admin
from firebase_admin import credentials, auth, messaging
import tempfile
import os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Enable CORS for all routes

# Initialize Firebase
cred = credentials.Certificate("smarttrafficroadsafety-8bdb2-firebase-adminsdk-fbsvc-6c9bdfc767.json")
firebase_admin.initialize_app(cred)

# Load YOLO models
traffic_model = YOLO("yolov8n.pt")
accident_model = YOLO("best.pt")
pothole_model = YOLO("pothole.pt")  # Path to trained pothole detection model

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Flask Backend is Running!"})
@app.route("/monitor-traffic", methods=["POST"])
def monitor_traffic():
    file = request.files.get("video")
    if not file:
        return jsonify({"error": "No video provided"}), 400

    temp_video_path = "temp_uploaded_video.mp4"
    file.save(temp_video_path)

    cap = cv2.VideoCapture(temp_video_path)

    total_vehicle_count = 0
    frame_count = 0

    # Prepare output video
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    output_video_path = r"F:\Project\backend\processed_videos\congestion\traffic_output.mp4"
    fps = int(cap.get(cv2.CAP_PROP_FPS))
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    out = cv2.VideoWriter(output_video_path, fourcc, fps, (width, height))

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        image_resized = cv2.resize(frame, (800, 450))
        results = traffic_model(image_resized)[0]

        for r in results:
            if hasattr(r, "boxes") and r.boxes is not None:
                for box in r.boxes.data:
                    class_id = int(box[-1])
                    if class_id in [2, 3, 5, 7]:
                        total_vehicle_count += 1

        frame_count += 1

        # Draw detections and save
        annotated_frame = results[0].plot()
        out.write(annotated_frame)

    cap.release()
    out.release()
    avg_vehicle_count = total_vehicle_count / frame_count if frame_count else 0

    congestion_level = "High Traffic" if avg_vehicle_count > 10 else "Moderate Traffic" if avg_vehicle_count > 5 else "Low Traffic"

    return jsonify({"level": congestion_level, "average_vehicle_count": avg_vehicle_count, "video_url": output_video_path, "total_frames": frame_count}), 200

'''
@app.route("/monitor-traffic", methods=["POST"])
def monitor_traffic():
    file = request.files.get("video")
    if not file:
        return jsonify({"error": "No video provided"}), 400

    temp_video_path = "temp_uploaded_video.mp4"
    file.save(temp_video_path)

    cap = cv2.VideoCapture(temp_video_path)

    total_vehicle_count = 0
    frame_count = 0

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        image_resized = cv2.resize(frame, (800, 450))
        results = traffic_model(image_resized)[0]

        for r in results:
            if hasattr(r, "boxes") and r.boxes is not None:
                for box in r.boxes.data:
                    class_id = int(box[-1])
                    if class_id in [2, 3, 5, 7]:
                        total_vehicle_count += 1

        frame_count += 1

    cap.release()
    avg_vehicle_count = total_vehicle_count / frame_count if frame_count else 0

    congestion_level = "High Traffic" if avg_vehicle_count > 10 else "Moderate Traffic" if avg_vehicle_count > 5 else "Low Traffic"

    return jsonify({"level": congestion_level, "average_vehicle_count": avg_vehicle_count}), 200'''

@app.route("/detect-accident", methods=["POST"])
def detect_accident():
    file = request.files.get("video")
    if not file:
        return jsonify({"error": "No video provided"}), 400

    temp_video_path = tempfile.NamedTemporaryFile(delete=False, suffix=".mp4").name
    file.save(temp_video_path)

    cap = cv2.VideoCapture(temp_video_path)
    accident_detected = False
    frame_count = 0

    # Prepare output video
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    output_video_path = r"F:\Project\backend\processed_videos\accident\accident_output.mp4"
    fps = int(cap.get(cv2.CAP_PROP_FPS))
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    out = cv2.VideoWriter(output_video_path, fourcc, fps, (width, height))
    i=0
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        
        frame_count += 1
        results = accident_model(frame, conf=0.4)
        
        for r in results:
            if hasattr(r, "boxes") and r.boxes is not None:
                for box in r.boxes.data:
                    class_id = int(box[-1])
                    if class_id == 0:
                        accident_detected = True
                        break

        # Draw detections and save
        annotated_frame = results[0].plot()
        out.write(annotated_frame)

        if frame_count % 10 == 0:
            print(f"Processing Frame: {frame_count} - Accident Detected: {accident_detected}")
        
        if accident_detected:
            i+=1
            if i>=5:
                break

    cap.release()
    out.release()
    os.remove(temp_video_path)

    if accident_detected:
        send_alert("Accident detected! Immediate response needed.")
        return jsonify({"message": "Accident detected and alert sent", "video_url": output_video_path, "total_frames": frame_count}), 200
    else:
        return jsonify({"message": "No accident detected", "video_url": output_video_path, "total_frames": frame_count}), 200

@app.route("/detect-potholes", methods=["POST"])
def detect_potholes():
    file = request.files.get("video")
    if not file:
        return jsonify({"error": "No video provided"}), 400

    temp_video_path = tempfile.NamedTemporaryFile(delete=False, suffix=".mp4").name
    file.save(temp_video_path)

    cap = cv2.VideoCapture(temp_video_path)

    # Prepare output video
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    output_video_path = r"F:\Project\backend\processed_videos\potholes\pothole_output.mp4"
    fps = int(cap.get(cv2.CAP_PROP_FPS))
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    out = cv2.VideoWriter(output_video_path, fourcc, fps, (width, height))

    pothole_detected = False
    frame_count = 0

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        
        frame_count += 1
        results = pothole_model.predict(frame, conf=0.2)

        for result in results:
            for box in result.boxes:
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                conf = box.conf[0]
                label = f"Pothole {conf:.2f}"

                cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                cv2.putText(frame, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

                pothole_detected = True

        out.write(frame)

    cap.release()
    out.release()
    os.remove(temp_video_path)

    if pothole_detected:
        return jsonify({"message": "Potholes detected", "video_url": output_video_path, "total_frames": frame_count}), 200
    else:
        return jsonify({"message": "No potholes detected", "video_url": output_video_path, "total_frames": frame_count}), 200

@app.route("/get-video", methods=["GET"])
def get_video():
    video_path = request.args.get("path")
    if not video_path or not os.path.exists(video_path):
        return jsonify({"error": "Video not found"}), 404
    return send_file(video_path, mimetype='video/mp4')

@app.route("/send-alert", methods=["POST"])
def send_alert(message):
    notification = messaging.Message(
        notification=messaging.Notification(
            title="Traffic Alert",
            body=message
        ),
        topic="traffic-alerts"
    )
    messaging.send(notification)
    return jsonify({"message": "Notification sent"}), 200





import google.generativeai as genai


# Configure Google AI API Key
genai.configure(api_key="YOUR API KEY")  

# Load the Gemini Model
model = genai.GenerativeModel("gemini-1.5-pro")
import requests


def get_routes(api_key, origin, destination):
    """Gets routes using the Routes API (without avoid locations)."""
    if not api_key:
        return "API Key not found."
    url = f"https://routes.googleapis.com/directions/v2:computeRoutes"

    headers = {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': api_key,
        'X-Goog-FieldMask': 'routes.legs' #adjust field mask as needed
    }

    payload = {
        "origin": {"address": origin},
        "destination": {"address": destination}
    }

    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        return f"Error during Routes API call: {e}"
        
@app.route("/chat", methods=["POST"])
def chat():
    try:
        # Get user input from the request
        user_input = request.json.get("message", "")

        if not user_input:
            return jsonify({"error": "Message cannot be empty"}), 400
        response = model.generate_content(f"just give me the places separeted by coma in this text {user_input} if nothing give hi")
        
        places=response.text.split(',')
        if len(places)>=2:
            origin =places[0]
            destination = places[1]
            
            api_key = "AIzaSyDhDDU1RplLSKE_uJohcgJTNVxcb13Em_4" #get from env, or hardcode.

            result = get_routes(api_key, origin, destination)
            
            return jsonify({"response":f"You should Travel {round((result['routes'][0]['legs'][0]['distanceMeters'])/1000,2)} KM and it will take {round(int(result['routes'][0]['legs'][0]['duration'][:-1])/60)} Minutes"})
        # Generate AI response
        response = model.generate_content(user_input)

        # Return the AI-generated response
        return jsonify({"response": response.text})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
        
@app.route('/get-routes', methods=['POST'])
def get_routes_endpoint():
    print("fjkl")
    data = request.get_json()
    origin = data.get('origin')
    destination = data.get('destination')
    api_key = "AIzaSyDhDDU1RplLSKE_uJohcgJTNVxcb13Em_4" #or get it from env variables
    result = get_routes(api_key, origin, destination)
    return jsonify(result)


# Load the YOLO model
hel_model = YOLO("helmet.pt")  # Path to trained model

@app.route("/detect", methods=["POST"])
def detect_violations():
    if "image" not in request.files:
        return "No image uploaded", 400

    file = request.files["image"]
    image_data = file.read()
    nparr = np.frombuffer(image_data, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # Run YOLO inference
    results = hel_model(image)
    output_image = results[0].plot()

    # Save and return the output image
    output_path = r"F:\Project\backend\processed_videos\accident\output_image.jpg"
    cv2.imwrite(output_path, output_image)

    return send_file(output_path, mimetype="image/jpeg")






import cv2
import numpy as np
import mediapipe as mp
import time
from flask import Flask, request, jsonify
from flask_cors import CORS


# Initialize MediaPipe Face Mesh
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(min_detection_confidence=0.5, min_tracking_confidence=0.5)

# Eye landmarks (left & right eye)
LEFT_EYE = [362, 385, 387, 263, 373, 380]
RIGHT_EYE = [33, 160, 158, 133, 153, 144]

# Lip landmarks for yawning
UPPER_LIP = [13, 14]
LOWER_LIP = [82, 87]

# Nose landmarks for head tilt detection
NOSE_TIP = 1
CHIN = 199

# Thresholds
BLINK_THRESHOLD = 0.2  # Eye Aspect Ratio (EAR) threshold for blink detection
MOUTH_OPEN_THRESHOLD = 20  # Threshold for yawning detection
HEAD_TILT_THRESHOLD = 15  # Head tilt threshold
BLINK_DURATION_THRESHOLD = 0.2  # Ignore very short blinks

# Blink tracking variables
blink_count = 0
blink_start_time = None

def calculate_ear(eye_landmarks, landmarks):
    """Calculate Eye Aspect Ratio (EAR) to detect eye closure."""
    try:
        A = np.linalg.norm(np.array(landmarks[eye_landmarks[1]]) - np.array(landmarks[eye_landmarks[5]]))
        B = np.linalg.norm(np.array(landmarks[eye_landmarks[2]]) - np.array(landmarks[eye_landmarks[4]]))
        C = np.linalg.norm(np.array(landmarks[eye_landmarks[0]]) - np.array(landmarks[eye_landmarks[3]]))
        return (A + B) / (2.0 * C)
    except:
        return 1.0  # Avoid errors if landmarks are missing

def calculate_mouth_open(landmarks):
    """Calculate mouth opening to detect yawning."""
    try:
        return np.linalg.norm(np.array(landmarks[UPPER_LIP[1]]) - np.array(landmarks[LOWER_LIP[1]]))
    except:
        return 0  # Avoid errors if landmarks are missing

def detect_head_tilt(landmarks):
    """Detect head tilt based on nose and chin position."""
    try:
        if NOSE_TIP in landmarks and CHIN in landmarks:
            nose_y = landmarks[NOSE_TIP][1]
            chin_y = landmarks[CHIN][1]
            return (chin_y - nose_y) > HEAD_TILT_THRESHOLD
    except:
        pass
    return False

@app.route('/detect_drowsiness', methods=['POST'])
def detect_drowsiness():
    global blink_count, blink_start_time

    # Read the image from the request
    file = request.files.get('frame')
    if not file:
        return jsonify({"error": "No frame received"}), 400

    # Convert image to OpenCV format
    img_np = np.frombuffer(file.read(), np.uint8)
    frame = cv2.imdecode(img_np, cv2.IMREAD_COLOR)

    # Convert to RGB for MediaPipe processing
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = face_mesh.process(rgb_frame)

    h, w, _ = frame.shape
    landmarks_dict = {}

    drowsy = False
    message = "No drowsiness detected"

    if results.multi_face_landmarks:
        for face_landmarks in results.multi_face_landmarks:
            for idx, landmark in enumerate(face_landmarks.landmark):
                x, y = int(landmark.x * w), int(landmark.y * h)
                landmarks_dict[idx] = (x, y)

            # Detect eye closure
            left_ear = calculate_ear(LEFT_EYE, landmarks_dict)
            right_ear = calculate_ear(RIGHT_EYE, landmarks_dict)
            ear_avg = (left_ear + right_ear) / 2

            if ear_avg < BLINK_THRESHOLD:
                if blink_start_time is None:
                    blink_start_time = time.time()
            else:
                if blink_start_time:
                    blink_duration = time.time() - blink_start_time
                    if blink_duration > BLINK_DURATION_THRESHOLD:
                        blink_count += 1
                    blink_start_time = None

            if ear_avg < BLINK_THRESHOLD:
                drowsy = True
                message = "Drowsy: Eyes Closed!"

            # Detect yawning
            mouth_opening = calculate_mouth_open(landmarks_dict)
            if mouth_opening > MOUTH_OPEN_THRESHOLD:
                drowsy = True
                message = "Drowsy: Yawning!"

            # Detect head tilt
            if detect_head_tilt(landmarks_dict):
                drowsy = True
                message = "Drowsy: Head Tilt Detected!"

    return jsonify({
        "drowsy": drowsy,
        "blinks": blink_count,
        "message": message
    })




if __name__ == "__main__":
    app.run(debug=True)
