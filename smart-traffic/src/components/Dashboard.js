import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="container">
      <h1>Smart Dashboard for Authorities</h1>
      <div className="row">
        <div className="col-md-4">
          <Link to="/accident-detection" className="btn btn-outline-primary accident-btn">Accident Detection</Link>
        </div>
        <div className="col-md-4">
          <Link to="/traffic-congestion" className="btn btn-outline-success congestion-btn">Traffic Congestion</Link>
        </div>
        <div className="col-md-4">
          <Link to="/violation-detection" className="btn btn-outline-danger violation-btn">Violation Detection</Link>
        </div>
        {/* <div className="col-md-4">
          <Link to="/vehicle-detection" className="btn btn-outline-warning vehicle-btn">Vehicle Detection</Link>
        </div> */}
        <div className="col-md-4">
          <Link to="/live-traffic" className="btn btn-outline-info live-traffic-btn">Live Traffic</Link>
        </div>
        <div className="col-md-4">
          <Link to="/user-reports" className="btn btn-outline-dark reports-btn">Report Issue</Link>
        </div>
        <div className="col-md-4">
          <Link to="/traffic-flow" className="btn btn-outline-secondary traffic-flow-btn">Traffic Flow</Link>
        </div>
        <div className="col-md-4">
          <Link to="/admin-user-reports" className="btn btn-outline-primary issue-tracker-btn">Admin User Reports</Link>
        </div>
        <div className="col-md-4">
          <Link to="/user-management" className="btn btn-outline-info user-management-btn">User Management</Link>
        </div>
        <div className="col-md-4">
          <Link to="/issue-tracker" className="btn btn-outline-primary issue-tracker-btn">Issue Tracker</Link>
        </div>
        <div className="col-md-4">
          <Link to="/traffic-monitoring" className="btn btn-outline-success traffic-monitoring-btn">Traffic Monitoring</Link>
        </div>
        <div className="col-md-4">
          <Link to="/pothole-monitoring" className="btn btn-outline-danger pothole-monitoring-btn">Pothole Monitoring</Link>
        </div>
        <div className="col-md-4">
          <Link to="/Chatbot" className="btn btn-outline-warning chatbot-btn">Chatbot</Link>
        </div>
        <div className="col-md-4">
          <Link to="/admin-login" className="btn btn-outline-dark admin-login-btn">Admin Login</Link>
        </div>
        <div className="col-md-4">
          <Link to="/drowsiness-monitoring" className="btn btn-outline-danger drowsiness-monitoring-btn">Drowsiness Monitoring</Link>
        </div>
        <div className="col-md-4">
          <Link to="/analytics" className="btn btn-outline-primary analytics-btn">Analytics</Link>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;