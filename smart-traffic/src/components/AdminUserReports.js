import React, { useState, useEffect } from "react";
import "./AdminUserReports.css";

const AdminUserReports = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const storedReports = JSON.parse(localStorage.getItem("reports")) || [];
    setReports(storedReports);
  }, []);

  return (
    <div className="reports-container">
      <h2>Recent Reports</h2>
      {reports.length === 0 ? (
        <p className="no-reports">No reports available.</p>
      ) : (
        <table className="reports-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Cause</th>
              <th>Location</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{report.causeType}</td>
                <td>
                  ({report.latitude}, {report.longitude})
                </td>
                <td>{report.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminUserReports;
