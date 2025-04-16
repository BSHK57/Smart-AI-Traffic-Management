import React from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";
// import "./UserLogin.js"

const AdminLogin = () => {
  const navigate = useNavigate();

  const handleAdminLoginRedirect = () => {
    window.location.href = "/Login.html"; // Redirect to Admin Login page
  };

  const handleUserLoginRedirect = () => {
    window.location.href = "/UserLogin.html"; // Redirect to User Login page
  };

  return (
    <div className="admin-login-container">
      <h2>Login</h2>
      <p>Select your login type to proceed.</p>

      <button className="login-btn admin-login-btn" onClick={handleAdminLoginRedirect}>
        🔐 Go to Admin Login
      </button>

      <button className="login-btn user-login-btn" onClick={handleUserLoginRedirect}>
        👤 Go to User Login
      </button>

      <button className="back-home-btn" onClick={() => navigate("/")}>
        🔙 Back to Homepage
      </button>
    </div>
  );
};

export default AdminLogin;





/*
const AdminLogin = ({ setAdminAuthenticated }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Hardcoded credentials (replace with backend authentication)
    if (username === "admin" && password === "admin123") {
      setAdminAuthenticated(true);
      localStorage.setItem("isAdmin", "true");
      navigate("/admin-dashboard");
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="admin-login-container">
      <h2>Admin Login</h2>
      <form onSubmit={handleLogin}>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default AdminLogin;
*/