import { useEffect, useRef, useState } from "react";

const DrowsinessDetection = () => {
  const videoRef = useRef(null);
  const [isDrowsy, setIsDrowsy] = useState(false);
  const [blinks, setBlinks] = useState(0);
  const [message, setMessage] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing webcam:", error);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    if (isCameraOn) {
      startCamera();
    } else {
      stopCamera();
    }
  }, [isCameraOn]);

  const captureFrame = async () => {
    if (!videoRef.current) return null;

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          console.error("Failed to capture frame.");
          resolve(null);
        }
      }, "image/jpeg");
    });
  };

  const sendFrameToBackend = async () => {
    if (!isRunning) return;
    const blob = await captureFrame();
    if (!blob) return;

    const formData = new FormData();
    formData.append("frame", blob, "frame.jpg");

    try {
      const response = await fetch("http://localhost:5000/detect_drowsiness", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setIsDrowsy(data.drowsy);
      setBlinks(data.blinks);
      setMessage(data.message);
    } catch (error) {
      console.error("Error sending frame:", error);
    }
  };

  useEffect(() => {
    let interval;
    if (isRunning) {
      setBlinks(0); // Reset blinks when detection starts
      interval = setInterval(sendFrameToBackend, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  return (
    <div className="p-4 flex flex-col items-center bg-gray-900 text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Drowsiness Detection</h1>

      {/* Container for Webcam (Left) and Status (Right) */}
      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Webcam on the Left */}
        <div className="flex justify-center">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-80 h-60 rounded-lg border border-gray-400"
          />
        </div>

        {/* Status Panel on the Right */}
        <div className="bg-gray-800 p-4 rounded-lg w-64 flex flex-col justify-center text-center">
          <p className={`text-lg font-semibold ${isDrowsy ? "text-red-500" : "text-green-500"}`}>
            {isDrowsy ? "Drowsy Detected!" : "Alert!"}
          </p>
          <p className="text-lg">Blinks: <span className="font-bold text-yellow-400">{blinks}</span></p>
          <p className="text-sm mt-2">{message}</p>
          
          {/* Button to Reset Blinks */}
          <button 
            onClick={() => setBlinks(0)} 
            className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition">
            Reset Blinks
          </button>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="mt-6 flex gap-4">
        <button 
          onClick={() => { setIsRunning(true); setBlinks(0); }} 
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">
          Start Detection
        </button>
        <button 
          onClick={() => setIsRunning(false)} 
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">
          Stop Detection
        </button>
        <button 
          onClick={() => {
            setIsCameraOn(!isCameraOn);
            if (!isCameraOn) stopCamera(); // Ensure camera stops properly
          }} 
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
          {isCameraOn ? "Turn Off Camera" : "Turn On Camera"}
        </button>
      </div>
    </div>
  );
};

export default DrowsinessDetection;
