import React from 'react';
import { Link } from 'react-router-dom';
import './UserDashboard.css';

const UserDashboard = () => {
    return (
        <div className="container">
            <h1>Smart Dashboard for Users</h1>
            <div className="row">
                <div className="col-md-4">
                    <Link to="/live-traffic" className="btn btn-outline-info live-traffic-btn">Live Traffic</Link>
                </div>
                <div className="col-md-4">
                    <Link to="/routing" className="btn btn-outline-dark routing-btn">Live Routing</Link>
                </div>
                <div className="col-md-4">
                    <Link to="/Chatbot" className="btn btn-outline-warning chatbot-btn">Chatbot</Link>
                </div>
                <div className="col-md-4">
                    <Link to="/drowsiness-monitoring" className="btn btn-outline-dark drowsiness-monitoring-btn">Drowsiness Monitoring</Link>
                </div>

                <div className="col-md-4">
                    <Link to="/user-reports" className="btn btn-outline-dark reports-btn">Report Issue</Link>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;