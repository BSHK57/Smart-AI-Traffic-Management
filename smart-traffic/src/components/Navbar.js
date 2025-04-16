import React from "react";
import { Link } from "react-router-dom";
import { FaCarCrash, FaTrafficLight, FaExclamationTriangle, FaMap, FaClipboardList, FaUserShield, FaCogs } from "react-icons/fa";
import "./Navbar.css";

const Navbar = ({ isAdminAuthenticated }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/admin-dashboard-all">
          Traffic System
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
              <Link className="nav-link" to="/accident-detection">
                <FaCarCrash /> Accident Detection
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/traffic-congestion">
                <FaTrafficLight /> Traffic Congestion
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/violation-detection">
                <FaExclamationTriangle /> Violation Detection
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/traffic-flow">
                <FaMap /> Traffic Flow
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/live-traffic">
                <FaClipboardList /> Live Traffic
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/user-reports">
                <FaClipboardList /> Report Issue
              </Link>
            </li>
          </ul>

          {/* Admin Login/Profile - Aligned to the Right */}
          <ul className="navbar-nav ms-auto">
            {isAdminAuthenticated ? (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="adminDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <FaUserShield /> Admin
                </a>
                <ul className="dropdown-menu" aria-labelledby="adminDropdown">
                  <li>
                    <Link className="dropdown-item" to="/admin-dashboard">
                      <FaCogs /> Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/settings">
                      Settings
                    </Link>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={() => {
                      localStorage.removeItem("isAdmin");
                      window.location.reload();
                    }}>
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <li className="nav-item">
                <Link className="nav-link btn btn-primary text-white" to="/admin-login">
                  <FaUserShield /> Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
