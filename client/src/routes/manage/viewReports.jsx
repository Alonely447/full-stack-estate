import { useEffect, useState } from "react";
import apiRequest from "../../lib/apiRequest";
import AdminReportModal from "../../components/reportModal/AdminReportModal";
import "./viewReports.scss";

function ViewReports() {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);
  const [search, setSearch] = useState("");
  const [filteredReports, setFilteredReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await apiRequest.get("/reports");
        setReports(res.data);
        setFilteredReports(res.data);
      } catch (err) {
        setError("Failed to fetch reports.");
      }
    };

    fetchReports();
  }, []);

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredReports(reports);
    } else {
      const lowerSearch = search.toLowerCase();
      setFilteredReports(
        reports.filter(
          (report) =>
            report.reporter.username.toLowerCase().includes(lowerSearch) ||
            report.suspect.username.toLowerCase().includes(lowerSearch) ||
            report.reason.toLowerCase().includes(lowerSearch)
        )
      );
    }
  }, [search, reports]);

  const handleReject = async (reportId) => {
    try {
      await apiRequest.patch(`/reports/${reportId}/reject`);
      setReports((prev) =>
        prev.map((r) => (r.id === reportId ? { ...r, status: "rejected" } : r))
      );
    } catch (err) {
      alert("Failed to reject report.");
    }
  };

  const handleProcess = (report) => {
    setSelectedReport(report);
  };

  const handleDeletePost = async () => {
    try {
      await apiRequest.patch(`/reports/${selectedReport.id}/process`, {
        action: "delete_post",
      });
      setReports((prev) =>
        prev.map((r) =>
          r.id === selectedReport.id
            ? { ...r, status: "completed", actionTaken: "delete_post" }
            : r
        )
      );
      setSelectedReport(null);
    } catch (err) {
      alert("Failed to delete post.");
    }
  };

  const handleSuspendUser = async (duration) => {
    try {
      await apiRequest.patch(`/reports/${selectedReport.id}/process`, {
        action: "suspend_user",
        suspensionDuration: duration,
      });
      setReports((prev) =>
        prev.map((r) =>
          r.id === selectedReport.id
            ? { ...r, status: "completed", actionTaken: "suspend_user" }
            : r
        )
      );
      setSelectedReport(null);
    } catch (err) {
      alert("Failed to suspend user.");
    }
  };

  const handleCancel = () => {
    setSelectedReport(null);
  };

  return (
    <div className="manageContainer">
      <h1>View Reports</h1>
      <input
        type="text"
        placeholder="Search reports..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="searchInput"
      />
      {error && <p className="error">{error}</p>}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Reporter</th>
            <th>Suspect</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredReports.map((report) => (
            <tr key={report.id}>
              <td data-label="ID">{report.id}</td>
              <td data-label="Reporter">{report.reporter.username}</td>
              <td data-label="Suspect">{report.suspect.username}</td>
              <td data-label="Reason">{report.reason}</td>
              <td data-label="Status">{report.status}</td>
              <td data-label="Actions">
                {report.status === "pending" && (
                  <>
                    <button className="refuse" onClick={() => handleReject(report.id)}>
                      Reject
                    </button>
                    <button className="approve" onClick={() => handleProcess(report)}>
                      Process
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedReport && (
        <AdminReportModal
          report={selectedReport}
          onClose={handleCancel}
          onDeletePost={handleDeletePost}
          onSuspendUser={handleSuspendUser}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}

export default ViewReports;
