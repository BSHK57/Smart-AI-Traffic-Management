import React, { useState, useEffect } from "react";
import "./TrafficMonitoring.css";
import { FaCar, FaTrafficLight } from "react-icons/fa";

const TrafficMonitoring = () => {
  const [trafficData, setTrafficData] = useState([]);

  useEffect(() => {
    const fetchTrafficData = () => {
      const storedData = JSON.parse(localStorage.getItem("trafficData")) || [];
      setTrafficData(storedData);
    };
    fetchTrafficData();
    const interval = setInterval(fetchTrafficData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="traffic-monitoring-container">
      <h2>Traffic Monitoring</h2>
      <p className="info-text">Live traffic updates and congestion monitoring.</p>
      {trafficData.length === 0 ? (
        <p className="no-data">No traffic data available.</p>
      ) : (
        <table className="traffic-table">
          <thead>
            <tr>
              <th>Location</th>
              <th>Status</th>
              <th>Vehicles</th>
            </tr>
          </thead>
          <tbody>
            {trafficData.map((data, index) => (
              <tr key={index}>
                <td>{data.location}</td>
                <td>
                  {data.status === "Heavy" ? (
                    <FaTrafficLight className="traffic-icon heavy" />
                  ) : data.status === "Moderate" ? (
                    <FaTrafficLight className="traffic-icon moderate" />
                  ) : (
                    <FaTrafficLight className="traffic-icon light" />
                  )}
                  {data.status}
                </td>
                <td>
                  <FaCar className="vehicle-icon" /> {data.vehicleCount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TrafficMonitoring;
