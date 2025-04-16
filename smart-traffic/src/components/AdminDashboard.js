import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaSignOutAlt, FaClipboardList, FaCog, FaCar, FaTrafficLight, FaUsers, FaBug,FaChartBar 
} from "react-icons/fa"; 
import "./AdminDashboard.css";
//import TrafficFlow from "./TrafficFlow";
import Analytics from "./Analytics"
import AdminUserReports from "./AdminUserReports";

const AdminDashboard = ({ setAdminAuthenticated }) => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [reports, setReports] = useState([]);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Load reports from localStorage
  useEffect(() => {
    const storedReports = JSON.parse(localStorage.getItem("reports")) || [];
    setReports(storedReports);
  }, []);

  const handleLogout = () => {
    setAdminAuthenticated(false);
    localStorage.removeItem("isAdmin");
    navigate("/");
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning, Admin!";
    else if (hour < 18) return "Good Afternoon, Admin!";
    return "Good Evening, Admin!";
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar Navigation */}
      <div className="sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li onClick={() => navigate("/analytics")}>
            <FaChartBar  className="icon" /> Analytics
          </li>
          <li onClick={() => navigate("/admin-user-reports")}>
            <FaClipboardList className="icon" /> View Reports
          </li>
          <li onClick={() => navigate("/user-management")}>
            <FaUsers className="icon" /> Manage Users
          </li>
          <li onClick={() => navigate("/settings")}>
            <FaCog className="icon" /> Settings
          </li>
          <li onClick={handleLogout} className="logout">
            <FaSignOutAlt className="icon" /> Logout
          </li>
        </ul>
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        <h2>{getGreeting()}</h2>
        <div className="clock">
          🕒 {currentTime.toLocaleTimeString()}
        </div>
        <p>Monitor and manage the system efficiently.</p>

        {/* Quick Actions */}
        <div className="cards">
          <div className="card" onClick={() => navigate("/traffic-flow")}>
            <FaCar className="card-icon" />
            <p>Traffic Flow</p>
          </div>
          <div className="card" onClick={() => navigate("/traffic-monitoring")}>
            <FaTrafficLight className="card-icon" />
            <p>Traffic Monitoring</p>
          </div>
          <div className="card" onClick={() => navigate("/admin-user-reports")}>
            <FaClipboardList className="card-icon" />
            <p>Reports</p>
          </div>
          <div className="card" onClick={() => navigate("/issue-tracker")}>
            <FaBug className="card-icon" />
            <p>Issue Tracker</p>
          </div>
        </div>


        {/* ✅ Reports Section */}
        <AdminUserReports />
      </div>
    </div>
  );
};

export default AdminDashboard;
