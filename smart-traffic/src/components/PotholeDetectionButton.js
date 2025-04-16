import React, { useState } from "react";
import "./PotholeDetectionButton.css";

const PotholeDetectionButton = () => {
  const [videoInput, setVideoInput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);

  const handleVideoUpload = (e) => {
    setVideoInput(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!videoInput) return alert("Please upload a video.");

    setLoading(true);
    const formData = new FormData();
    formData.append("video", videoInput);

    try {
      const response = await fetch("http://localhost:5000/detect-potholes", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setDownloadUrl(`http://localhost:5000/download/${data.filename}`);
    } catch (error) {
      alert("Error processing video.");
    }

    setLoading(false);
  };

  return (
    <div className="pothole-container">
      <h2>Pothole Detection</h2>
      <input type="file" accept="video/*" onChange={handleVideoUpload} />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Processing..." : "Detect Potholes"}
      </button>
      {downloadUrl && (
        <p>
          Processed video: <a href={downloadUrl} download>Download</a>
        </p>
      )}
    </div>
  );
};

export default PotholeDetectionButton;
