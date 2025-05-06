import React, { useState, useContext } from "react";
import UploadWidget from "../uploadWidget/UploadWidget";
import "./reportModal.scss";
import { AuthContext } from "../../context/AuthContext";

function ReportModal({ postId, suspectId, onClose }) {
  const { currentUser } = useContext(AuthContext);
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(currentUser?.token && { Authorization: `Bearer ${currentUser.token}` }),
        },
        body: JSON.stringify({
          postId,
          description,
          images,
          suspectId,
        }),
      });
      if (response.ok) {
        alert("Report has been sent to admin.");
        onClose();
      } else {
        const errorData = await response.json();
        console.error("Report submission failed:", response.status, errorData);
        alert(`Failed to send report: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error sending report:", error);
      alert("Error sending report.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="reportModalOverlay">
      <div className="reportModal">
        <button className="closeButton" onClick={onClose}>
          &times;
        </button>
        <h2>Report Post</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Description:
            <textarea
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </label>
          <label>
            Upload Image:
            <UploadWidget
              uwConfig={{
                cloudName: "datstorage", 
                uploadPreset: "estate",
                multiple: false,
                maxImageFileSize: 2000000,
                folder: "reports",
              }}
              setState={setImages}
            />
          </label>
          <button type="submit" disabled={sending}>
            {sending ? "Sending..." : "Send Report"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ReportModal;
