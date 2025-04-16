from ultralytics import YOLO
import cv2

# Load your trained YOLOv8 model
model_path =r'best.pt'
model = YOLO(model_path)

# Load video file
video_path = r"testing.mp4"  # Replace with your video path
cap = cv2.VideoCapture(video_path)

# Get video properties
fps = cap.get(cv2.CAP_PROP_FPS)
width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

# Define output video writer (optional)
fourcc = cv2.VideoWriter_fourcc(*'mp4v')
out = cv2.VideoWriter(r'D:\new_video4.mp4', fourcc, fps, (width, height))

frame_count = 0

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    frame_count += 1
    print(f"Processing Frame: {frame_count}")

    # Perform YOLOv8 detection
    results = model(frame, conf=0.4)

    # Draw bounding boxes and confidence on each frame
    annotated_frame = results[0].plot()

    # Display the frame in Colab (optional, slow for large videos)
    if frame_count % 30 == 0:  # Display every 30th frame for speed
        cv2.imshow("Accident Detection",annotated_frame)

    # Save annotated frames to video
    out.write(annotated_frame)

# Release resources
cap.release()
out.release()

print("Video processing completed!")