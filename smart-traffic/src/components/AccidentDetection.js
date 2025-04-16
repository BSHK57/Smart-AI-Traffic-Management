import React, { useState } from "react";
import "./AccidentDetection.css";

const AccidentDetection = () => {
  const [videoInput, setVideoInput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [detectionResult, setDetectionResult] = useState(null);

  const handleVideoUpload = (e) => {
    setVideoInput(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!videoInput) return alert("Please upload a video.");

    setLoading(true);
    const formData = new FormData();
    formData.append("video", videoInput);

    try {
      const response = await fetch("http://localhost:5000/detect-accident", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setDetectionResult(data.message);
    } catch (error) {
      alert("Error detecting accident.");
    }
    setLoading(false);
  };

  return (
    <div className="accident-container">
      <h2>Accident Detection System</h2>
      <input type="file" accept="video/*" onChange={handleVideoUpload} />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Processing..." : "Detect Accident"}
      </button>
      {detectionResult && (
        <p>
          Detection Result: <strong>{detectionResult}</strong>
        </p>
      )}
    </div>
  );
};

export default AccidentDetection;









// import React, { useState } from "react";
// import "./AccidentDetection.css";

// const AccidentDetection = () => {
//   const [videoInput, setVideoInput] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState(null);
//   const [videoUrl, setVideoUrl] = useState(null);
//   const [latitude, setLatitude] = useState("");
//   const [longitude, setLongitude] = useState("");
//   const [location, setLocation] = useState("");
//   const [isFilePickerOpen, setIsFilePickerOpen] = useState(false);

//   const handleVideoUpload = (e) => {
//     setVideoInput(e.target.files[0]);
//   };

//   const handleSubmit = async () => {
//     if (!videoInput) return alert("Please upload a video.");

//     setLoading(true);

//     // Simulating video processing
//     setTimeout(() => {
//       setResult("Accident detected successfully!");
//       fetchLatestVideo(); // Get the latest video after "processing"
//       saveReport();
//       setLoading(false);
//     }, 3000);
//   };

//   // Save report to localStorage (admin reports)
//   const saveReport = () => {
//     const report = {
//       causeType: "Accident",
//       latitude,
//       longitude,
//       location,
//       timestamp: new Date().toLocaleString(),
//     };

//     const existingReports = JSON.parse(localStorage.getItem("reports")) || [];
//     existingReports.push(report);
//     localStorage.setItem("reports", JSON.stringify(existingReports));
//   };

//   // Select folder and fetch the latest processed accident video
//   const fetchLatestVideo = async () => {
//     if (isFilePickerOpen) return; // Prevent multiple clicks

//     setIsFilePickerOpen(true); // Mark picker as open
//     try {
//       const directoryHandle = await window.showDirectoryPicker();
      
//       let latestFile = null;
//       let latestModifiedTime = 0;

//       for await (const entry of directoryHandle.values()) {
//         if (entry.kind === "file" && entry.name.endsWith(".mp4")) { // Filter only video files
//           const file = await entry.getFile();
//           if (file.lastModified > latestModifiedTime) {
//             latestModifiedTime = file.lastModified;
//             latestFile = file;
//           }
//         }
//       }

//       if (latestFile) {
//         setVideoUrl(URL.createObjectURL(latestFile));
//       } else {
//         alert("No videos found in the selected folder.");
//       }
//     } catch (error) {
//       if (error.name === "AbortError") {
//         console.warn("User aborted the directory selection.");
//       } else {
//         console.error("Error accessing directory:", error);
//       }
//     } finally {
//       setIsFilePickerOpen(false); // Reset after operation completes
//     }
//   };

//   return (
//     <div className="container accident-page">
//       <h1>Accident Detection and Reporting</h1>
//       <p>Upload a video to detect accidents and notify authorities automatically.</p>

//       <input type="file" accept="video/*" onChange={handleVideoUpload} className="form-control" />

//       <input
//         type="text"
//         placeholder="Latitude"
//         value={latitude}
//         onChange={(e) => setLatitude(e.target.value)}
//         className="form-control mt-2"
//       />
//       <input
//         type="text"
//         placeholder="Longitude"
//         value={longitude}
//         onChange={(e) => setLongitude(e.target.value)}
//         className="form-control mt-2"
//       />
//       <input
//         type="text"
//         placeholder="Location"
//         value={location}
//         onChange={(e) => setLocation(e.target.value)}
//         className="form-control mt-2"
//       />

//       <button onClick={handleSubmit} className="btn btn-primary mt-3" disabled={loading}>
//         {loading ? "Processing..." : "Detect Accident"}
//       </button>

//       {result && <p className="result-message">{result}</p>}
      
//       {/* Display latest processed video */}
//       {/* {videoUrl && (
//         <div className="video-container mt-3">
//           <h3>Latest Processed Video:</h3>
//           <video controls width="600">
//             <source src={videoUrl} type="video/mp4" />
//             Your browser does not support the video tag.
//           </video>
//         </div>
//       )}

//       <button onClick={fetchLatestVideo} className="btn btn-secondary mt-3" disabled={isFilePickerOpen}>
//         {isFilePickerOpen ? "Opening Folder..." : "Select Folder & Fetch Latest Video"}
//       </button> */ }

//     </div>
//   );
// };

// export default AccidentDetection;
