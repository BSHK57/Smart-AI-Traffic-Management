// import React from 'react';
// import { useState } from 'react';
// import './TrafficCongestion.css';
// const TrafficCongestion = () => {
//   const [imageInput, setImageInput] = useState(null);

//   const handleImageUpload = (e) => {
//     setImageInput(e.target.files[0]);
//   };

//   const handleSubmit = async () => {
//     const formData = new FormData();
//     formData.append('image', imageInput);
    
//     const response = await fetch('/monitor-traffic', {
//       method: 'POST',
//       body: formData,
//     });

//     const result = await response.json();
//     alert(result.message);
//   };

//   return (
//     <div className="container">
//       <h1>Traffic Congestion Monitoring</h1>
//       <p>Upload a junction image to analyze traffic congestion.</p>
//       <input type="file" accept="image/*" onChange={handleImageUpload} className="form-control" />
//       <button onClick={handleSubmit} className="btn btn-primary mt-3">Submit</button>
//     </div>
//   );
// };

// export default TrafficCongestion;


import React, { useState } from "react";
import "./TrafficCongestion.css";

const TrafficCongestion = () => {
  const [videoInput, setVideoInput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [congestionLevel, setCongestionLevel] = useState(null);
  const [avgVehicleCount, setAvgVehicleCount] = useState(null);

  const handleVideoUpload = (e) => {
    setVideoInput(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!videoInput) return alert("Please upload a video.");

    setLoading(true);
    const formData = new FormData();
    formData.append("video", videoInput);

    try {
      const response = await fetch("http://localhost:5000/monitor-traffic", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setCongestionLevel(data.level);
      setAvgVehicleCount(data.average_vehicle_count);
    } catch (error) {
      alert("Error analyzing traffic.");
    }
    setLoading(false);
  };

  return (
    <div className="traffic-container">
      <h2>Traffic Congestion Analysis</h2>
      <input type="file" accept="video/*" onChange={(e) => setVideoInput(e.target.files[0])} />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze Traffic"}
      </button>
      {congestionLevel && (
        <p>
          Congestion Level: <strong>{congestionLevel}</strong>
          <br />
          Average Vehicles Detected: <strong>{avgVehicleCount.toFixed(2)}</strong>
        </p>
      )}
    </div>
  );
};

export default TrafficCongestion;
