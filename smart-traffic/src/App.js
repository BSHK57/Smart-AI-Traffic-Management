import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AccidentDetection from "./components/AccidentDetection";
import TrafficCongestion from "./components/TrafficCongestion";
import ViolationDetection from "./components/ViolationDetection";
import LiveTraffic from "./components/LiveTraffic";
import UserReports from "./components/UserReports";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import Settings from "./components/Settings";
import Dashboard from "./components/Dashboard";
import AdminNavbar from "./components/Navbar"; // Admin Navbar
import UserNavbar from "./components/UserNavbar"; // User Navbar (Always Visible)
import Footer from "./components/Footer";
import app from './firebase.js';
import './components/Footer.css';
import TrafficFlow from "./components/TrafficFlow.js";
import './components/TrafficFlow.css';
import AdminUserReports from "./components/AdminUserReports";
import UserManagement from "./components/UserManagement";
import IssueTracker from "./components/IssueTracker";
import TrafficMonitoring from "./components/TrafficMonitoring";
import Chatbot from "./components/Chatbot_ui";
import PotholeDetectionButton from "./components/PotholeDetectionButton";
import DrowsinessDetection from "./components/DrowsinessDetection";
import Analytics from "./components/Analytics";
import Rooting from "./components/Rooting";
import UserDashboard from "./components/UserDashboard";

function App() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    setIsAdminAuthenticated(localStorage.getItem("isAdmin") === "true");

    const storedIssues = JSON.parse(localStorage.getItem("issues")) || [];
    setIssues(storedIssues);
  }, []);

  const handleAddIssue = (issue) => {
    if (!issue.trim()) return;
    const updatedIssues = [...issues, { description: issue, status: "Pending" }];
    setIssues(updatedIssues);
    localStorage.setItem("issues", JSON.stringify(updatedIssues));
  };

  return (
    <Router>
      {/* ✅ Show Admin Navbar for Admins, User Navbar for others */}
      {isAdminAuthenticated ? (
        <AdminNavbar isAdminAuthenticated={isAdminAuthenticated} setAuth={setIsAdminAuthenticated} />
      ) : (
        <UserNavbar />
      )}

      <Routes>
        <Route path="/" element={<UserDashboard />} />
        <Route path="/accident-detection" element={<AccidentDetection />} />
        <Route path="/traffic-congestion" element={<TrafficCongestion />} />
        <Route path="/violation-detection" element={<ViolationDetection />} />
        <Route path="/live-traffic" element={<LiveTraffic />} />
        <Route path="/user-reports" element={<UserReports addIssue={handleAddIssue} />} />
        <Route path="/traffic-flow" element={<TrafficFlow />} />
        <Route path="/admin-user-reports" element={<AdminUserReports />} />
        <Route path="/user-management" element={<UserManagement />} />
        <Route path="/issue-tracker" element={<IssueTracker />} />
        <Route path="/traffic-monitoring" element={<TrafficMonitoring />} />
        <Route path="/pothole-monitoring" element={<PotholeDetectionButton />} />
        <Route path="/drowsiness-monitoring" element={<DrowsinessDetection />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/routing" element={<Rooting />} />
        <Route path="/Chatbot" element={<Chatbot />} />
        <Route path="/admin-login" element={<AdminLogin setAuth={setIsAdminAuthenticated} />} />

        {/* ✅ Protected Admin Routes */}
        {isAdminAuthenticated && (
          <>
            <Route path="/admin-dashboard" element={<AdminDashboard setAdminAuthenticated={setIsAdminAuthenticated} />} />
            <Route path="/admin-dashboard-all" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
          </>
        )}

        {/* ✅ Default Fallback Route */}
        <Route path="*" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
