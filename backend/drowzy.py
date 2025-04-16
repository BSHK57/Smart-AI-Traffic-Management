import cv2
import mediapipe as mp
import numpy as np
import time
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