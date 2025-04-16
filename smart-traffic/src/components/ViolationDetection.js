import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ViolationDetection.css";

function ViolationDetection() {
  return (
    <div className="violation-container">
      <div className="animated-background"></div>
      <div className="video-container">
        {/* VIDEO ELEMENT */}
        <video
          src="/OverSpeeding.mp4"
          controls
          preload="auto"
          className="video-player"
          onError={(e) => console.error("Video failed to load:", e)}
        />
        {/* VIDEO LABEL */}
        <div className="video-label">
          Violation Detection Footage
        </div>
      </div>
    </div>
  );
}

export default ViolationDetection;




// import React, { useState } from "react";
// import "./ViolationDetection.css";

// const ViolationDetection = () => {
//   const [fileInput, setFileInput] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [violationResult, setViolationResult] = useState(null);

//   const handleFileUpload = (e) => {
//     setFileInput(e.target.files[0]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!fileInput) return alert("Please upload a video or image.");

//     setLoading(true);
//     const formData = new FormData();
//     formData.append("file", fileInput);

//     try {
//       const response = await fetch("http://localhost:5000/detect-violation", {
//         method: "POST",
//         body: formData,
//       });
//       const data = await response.json();
//       setViolationResult(data);
//     } catch (error) {
//       alert("Error detecting violations.");
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="violation-container">
//       <h2>Violation Detection</h2>
//       <form onSubmit={handleSubmit}>
//         <input type="file" accept="video/*, image/*" onChange={handleFileUpload} />
//         <button type="submit" disabled={loading}>
//           {loading ? "Processing..." : "Detect Violation"}
//         </button>
//       </form>

//       {violationResult && (
//         <div className="result">
//           <h3>Detection Results</h3>
//           <p><strong>Violation:</strong> {violationResult.violation ? "Yes" : "No"}</p>
//           {violationResult.image_url && (
//             <img src={`http://localhost:5000/${violationResult.image_url}`} alt="Detection Result" />
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ViolationDetection;
