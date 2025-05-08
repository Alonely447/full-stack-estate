import React, { useState } from "react";
import "./adminReportModal.scss";

function AdminReportModal({ report, onClose, onProcess, onCancel }) {
  const [hidePost, setHidePost] = useState(false);
  const [suspendUser, setSuspendUser] = useState(false);
  const [suspensionDuration, setSuspensionDuration] = useState(report.suspensionDuration || "");

  const handleProcess = () => {
    if (suspendUser && !suspensionDuration) {
      alert("Please select suspension duration.");
      return;
    }
    if (!hidePost && !suspendUser) {
      alert("Please select at least one action.");
      return;
    }
    onProcess({ hidePost, suspendUser, suspensionDuration });
  };

  return (
    <div className="adminReportModalOverlay">
      <div className="adminReportModal">
        <button className="closeButton" onClick={onClose}>
          &times;
        </button>
        <h2>Process Report</h2>
        <p><strong>Post ID:</strong> {report.postId ? (
          <a href={`/${report.postId}`} target="_blank" rel="noopener noreferrer" style={{color: "#007bff", cursor: "pointer", textDecoration: "underline"}}>
            {report.postId}
          </a>
        ) : "N/A"}</p>
        <p><strong>Reason:</strong> {report.reason}</p>
        {report.image && (
          <div className="reportImageContainer">
            <img src={report.image} alt="Report" />
          </div>
        )}
        <div className="actionButtons">
          <label>
            <input
              type="checkbox"
              checked={hidePost}
              onChange={() => setHidePost(!hidePost)}
            />
            Hide Post
          </label>
          <label>
            <input
              type="checkbox"
              checked={suspendUser}
              onChange={() => setSuspendUser(!suspendUser)}
            />
            Suspend User
          </label>
          {suspendUser && (
            <div className="suspensionOptions">
              <label>
                <input
                  type="radio"
                  name="suspensionDuration"
                  value="1_day"
                  checked={suspensionDuration === "1_day"}
                  onChange={() => setSuspensionDuration("1_day")}
                />
                Suspend for 1 Day
              </label>
              <label>
                <input
                  type="radio"
                  name="suspensionDuration"
                  value="1_week"
                  checked={suspensionDuration === "1_week"}
                  onChange={() => setSuspensionDuration("1_week")}
                />
                Suspend for 1 Week
              </label>
            </div>
          )}
          <button className="processButton" onClick={handleProcess}>Process</button>
          <button className="cancelButton" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default AdminReportModal;


