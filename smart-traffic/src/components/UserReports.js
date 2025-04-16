import React, { useState } from "react";
import "./UserReports.css";
import { FaPaperPlane, FaExclamationCircle } from "react-icons/fa";
import 'bootstrap/dist/css/bootstrap.min.css';

const UserReports = ({ addIssue }) => {
  const [report, setReport] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!report.trim()) return alert("Please enter a report.");
    setIsSubmitting(true);
    setTimeout(() => {
      addIssue(report);
      alert("Report submitted successfully!");
      setReport("");
      setIsSubmitting(false);
    }, 1000); // Simulating a network request
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <div className="card shadow p-4">
            <h2 className="text-center mb-3 tct" >
              <FaExclamationCircle className="me-2" /> Report an Issue
            </h2>
            <p className="text-muted text-center">Help us improve by reporting issues you encounter.</p>
            <textarea
              className="form-control mb-3"
              placeholder="Describe the issue..."
              value={report}
              onChange={(e) => setReport(e.target.value)}
            />
            <button className="btn btn-primary w-100 d-flex align-items-center justify-content-center" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Report"} <FaPaperPlane className="ms-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserReports;
