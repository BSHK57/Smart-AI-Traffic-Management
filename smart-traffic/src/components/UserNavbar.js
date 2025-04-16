import React from "react";
import { Link } from "react-router-dom";
import { FaMap, FaComments, FaExclamationTriangle, FaRoute, FaUser, FaSignOutAlt } from "react-icons/fa";
import "./Navbar.css";

const UserNavbar = ({ isUserAuthenticated, setUserAuth }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          Smart Traffic System
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/live-traffic">
                <FaMap /> Live Traffic
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/routing">
                <FaRoute /> Live Routing
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/chatbot">
                <FaComments /> Chatbot
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/drowsiness-monitoring">
                <FaExclamationTriangle /> Drowsiness Monitoring
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/user-reports">
                <FaExclamationTriangle /> Report Issue
              </Link>
            </li>
          </ul>

          {/* User Profile & Logout - Right Aligned */}
          <ul className="navbar-nav ms-auto">
            {isUserAuthenticated ? (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="userDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <FaUser /> Profile
                </a>
                <ul className="dropdown-menu" aria-labelledby="userDropdown">
                  <li>
                    <Link className="dropdown-item" to="/user-dashboard">
                      <FaUser /> Dashboard
                    </Link>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        localStorage.removeItem("isUser");
                        setUserAuth(false);
                        window.location.href = "/";
                      }}
                    >
                      <FaSignOutAlt /> Logout
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <li className="nav-item">
                <Link className="nav-link btn btn-primary text-white" to="/admin-login">
                  <FaUser /> Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default UserNavbar;
