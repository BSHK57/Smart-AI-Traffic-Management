import React from "react";
import { useNavigate } from "react-router-dom";
import "./Rooting.css";
// import "./UserLogin.js"

const Rooting = () => {
  const navigate = useNavigate();

  const handleAdminLoginRedirect = () => {
    window.location.href = "/Rooting.html"; // Redirect to Admin Login page
  };


  return (
    <div className="admin-login-container">
      <h2>Login</h2>
      <p>Select the Routing Option </p>

      <button className="login-btn admin-login-btn" onClick={handleAdminLoginRedirect}>
        ↗️ Go to Rooting Page
      </button>

      <button className="back-home-btn" onClick={() => navigate("/")}>
        🔙 Back to Homepage
      </button>
    </div>
  );
};

export default Rooting;