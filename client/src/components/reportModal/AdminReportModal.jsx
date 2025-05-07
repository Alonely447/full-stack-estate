import React from "react";
import "./adminReportModal.scss";

function AdminReportModal({ report, onClose, onDeletePost, onSuspendUser, onCancel }) {
  const [suspensionDuration, setSuspensionDuration] = React.useState(report.suspensionDuration || "");

  const handleSuspend = () => {
    if (!suspensionDuration) {
      alert("Please select suspension duration.");
      return;
    }
    onSuspendUser(suspensionDuration);
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
          {/*<button className="deletePostButton" onClick={onDeletePost}>Delete Post</button>*/}
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
          <button className="suspendUserButton" onClick={handleSuspend}>Suspend User</button>
          <button className="cancelButton" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default AdminReportModal;
