import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LiveTraffic = () => {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [causeType, setCauseType] = useState("Accident");
  const [messagesSent, setMessagesSent] = useState("");
  const [trafficStatus, setTrafficStatus] = useState("Moderate");
  const [vehicleCount, setVehicleCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    window.addEventListener("message", (event) => {
      const { lat, lng, trafficInfo } = event.data;
      if (lat && lng) {
        setLatitude(lat);
        setLongitude(lng);
      }
      if (trafficInfo) {
        setTrafficStatus(trafficInfo.status);
        setVehicleCount(trafficInfo.vehicleCount);
      }
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newReport = {
      latitude,
      longitude,
      causeType,
      timestamp: new Date().toLocaleString(),
    };

    // Save to localStorage for admin to read
    const existingReports = JSON.parse(localStorage.getItem("reports")) || [];
    existingReports.push(newReport);
    localStorage.setItem("reports", JSON.stringify(existingReports));

    // If Traffic Monitoring is selected, extract valid info from the map
    if (causeType === "Traffic Monitoring") {
      const trafficData = JSON.parse(localStorage.getItem("trafficData")) || [];
      trafficData.push({
        location: `Lat: ${latitude}, Lng: ${longitude}`,
        status: trafficStatus,
        vehicleCount: vehicleCount,
      });
      localStorage.setItem("trafficData", JSON.stringify(trafficData));
      navigate("/traffic-monitoring"); // Redirect to Traffic Monitoring page
    }

    // Notify based on cause type
    let message = "";
    if (causeType === "Accident") {
      message = "Emergency services notified: 911, nearby hospitals.";
    } else if (causeType === "Road Construction") {
      message = "Municipal department notified.";
    } else if (causeType === "Flood") {
      message = "Disaster management team notified.";
    } else if (causeType === "Heavy Traffic") {
      message = "Traffic control center notified.";
    } else if (causeType === "Vehicle Breakdown") {
      message = "Roadside assistance notified.";
    } else if (causeType === "Hazardous Spill") {
      message = "Hazardous materials team notified.";
    }

    setMessagesSent(message);
    alert("Report submitted successfully!");

    setLatitude("");
    setLongitude("");
    setCauseType("Accident");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Live Traffic Map</h2>
      <div style={{ width: "100%", height: "500px", marginBottom: "20px" }}>
        <iframe
          src="maps.html"
          style={{ width: "100%", height: "100%", border: "none" }}
          title="Live Traffic Map"
        ></iframe>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: "500px",
          margin: "auto",
          padding: "20px",
          backgroundColor: "#f8f9fa",
          borderRadius: "10px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h3>Report an Issue</h3>
        <input
          type="text"
          placeholder="Latitude"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Longitude"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
          required
        />
        <select
          value={causeType}
          onChange={(e) => setCauseType(e.target.value)}
        >
          <option value="Accident">Accident</option>
          <option value="Road Construction">Road Construction</option>
          <option value="Flood">Flood</option>
          <option value="Heavy Traffic">Heavy Traffic</option>
          <option value="Vehicle Breakdown">Vehicle Breakdown</option>
          <option value="Hazardous Spill">Hazardous Spill</option>
          <option value="Traffic Monitoring">Traffic Monitoring</option>
        </select>
        <button type="submit">Submit Report</button>

        {/* ✅ Messages Sent Display */}
        <textarea
          readOnly
          value={messagesSent}
          placeholder="Messages sent to..."
          style={{ width: "100%", height: "30px", marginTop: "10px" }}
        ></textarea>
      </form>
    </div>
  );
};

export default LiveTraffic;
