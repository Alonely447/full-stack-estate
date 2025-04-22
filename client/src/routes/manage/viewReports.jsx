import { useEffect, useState } from "react";
import apiRequest from "../../lib/apiRequest";

function ViewReports() {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await apiRequest.get("/reports");
        setReports(res.data);
      } catch (err) {
        setError("Failed to fetch reports.");
      }
    };

    fetchReports();
  }, []);

  return (
    <div>
      <h1>View Reports</h1>
      {error && <p>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Reporter</th>
            <th>Suspect</th>
            <th>Reason</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report.id}>
              <td>{report.id}</td>
              <td>{report.reporter.username}</td>
              <td>{report.suspect.username}</td>
              <td>{report.reason}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ViewReports;