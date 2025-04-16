import cv2
from ultralytics import YOLO

def detect_potholes(video_path, output_path, model_path="pothole.pt", conf_threshold=0.2):
    # Load trained model
    model = YOLO(model_path)

    # Load video
    cap = cv2.VideoCapture(video_path)

    # Get video properties
    frame_width = int(cap.get(3))
    frame_height = int(cap.get(4))
    fps = int(cap.get(cv2.CAP_PROP_FPS))

    # Save output video
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')  # Codec for MP4
    out = cv2.VideoWriter(output_path, fourcc, fps, (frame_width, frame_height))

    # Run YOLO on each frame
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        # Run YOLO prediction on frame
        results = model.predict(frame, conf=conf_threshold)  # Lower conf for more detections

        # Draw detections
        for result in results:
            for box in result.boxes:
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                conf = box.conf[0]
                label = f"Pothole {conf:.2f}"

                # Draw bounding box
                cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                cv2.putText(frame, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

        # Save frame to output video
        out.write(frame)

        # Show frame (optional)
        cv2.imshow("Pothole Detection", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    # Release resources
    cap.release()
    out.release()
    cv2.destroyAllWindows()

    print(f"✅ Processed video saved at: {output_path}")
