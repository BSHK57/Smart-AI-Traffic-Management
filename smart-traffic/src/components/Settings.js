import React, { useState, useEffect } from "react";
import "./Settings.css";

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [message, setMessage] = useState("");

  // Load preferences from localStorage
  useEffect(() => {
    setDarkMode(localStorage.getItem("darkMode") === "true");
    setNotifications(localStorage.getItem("notifications") === "true");
    document.body.classList.toggle("dark-mode", localStorage.getItem("darkMode") === "true");
  }, []);

  // Toggle Dark Mode
  const handleDarkModeToggle = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode);
    document.body.classList.toggle("dark-mode", newDarkMode);
    showMessage("Dark Mode " + (newDarkMode ? "Enabled" : "Disabled"));
  };

  // Toggle Notifications
  const handleNotificationToggle = () => {
    const newNotifications = !notifications;
    setNotifications(newNotifications);
    localStorage.setItem("notifications", newNotifications);
    showMessage("Notifications " + (newNotifications ? "Enabled" : "Disabled"));
  };

  // Show status messages
  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 2000);
  };

  return (
    <div className="settings-container">
      <h2>⚙️ Settings</h2>

      {message && <p className="message">{message}</p>}

      <div className="setting-item">
        <p>Enable Notifications</p>
        <label className="switch">
          <input type="checkbox" checked={notifications} onChange={handleNotificationToggle} />
          <span className="slider"></span>
        </label>
      </div>

      <div className="setting-item">
        <p>Dark Mode</p>
        <label className="switch">
          <input type="checkbox" checked={darkMode} onChange={handleDarkModeToggle} />
          <span className="slider"></span>
        </label>
      </div>

      <button className="save-btn" onClick={() => showMessage("Settings Saved!")}>Save Changes</button>
    </div>
  );
};

export default Settings;
