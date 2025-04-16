import React, { useState, useEffect } from "react";
import "./IssueTracker.css";

const IssueTracker = () => {
  const [issues, setIssues] = useState([]);
  const [newIssue, setNewIssue] = useState("");

  useEffect(() => {
    const storedIssues = JSON.parse(localStorage.getItem("issues")) || [];
    setIssues(storedIssues);
  }, []);

  const handleAddIssue = (issue) => {
    if (!issue.trim()) return;
    const updatedIssues = [...issues, { description: issue, status: "Pending" }];
    setIssues(updatedIssues);
    localStorage.setItem("issues", JSON.stringify(updatedIssues));
  };

  const handleResolveIssue = (index) => {
    const updatedIssues = issues.map((issue, i) =>
      i === index ? { ...issue, status: "Resolved" } : issue
    );
    setIssues(updatedIssues);
    localStorage.setItem("issues", JSON.stringify(updatedIssues));
  };

  return (
    <div className="issue-tracker-container">
      <h2>Issue Tracker</h2>
      <div className="issue-input">
        <input
          type="text"
          placeholder="Describe the issue..."
          value={newIssue}
          onChange={(e) => setNewIssue(e.target.value)}
        />
        <button onClick={() => handleAddIssue(newIssue)}>Add Issue</button>
      </div>
      {issues.length === 0 ? (
        <p className="no-issues">No issues reported.</p>
      ) : (
        <table className="issues-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{issue.description}</td>
                <td>{issue.status}</td>
                <td>
                  {issue.status === "Pending" && (
                    <button className="resolve-btn" onClick={() => handleResolveIssue(index)}>
                      Resolve
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default IssueTracker;