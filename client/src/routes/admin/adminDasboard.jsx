import { Outlet, Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import "./adminDashboard.scss";

function AdminDashboard() {
  const { updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await apiRequest.post("/auth/logout");
      updateUser(null); // Clear user context
      navigate("/login"); // Redirect to login page
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="adminDashboard">
      <div className="sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li>
            <Link to="/admin/users">Manage Users</Link>
          </li>
          <li>
            <Link to="/admin/posts">Manage Posts</Link>
          </li>
          <li>
            <Link to="/admin/reports">View Reports</Link>
          </li>
        </ul>
        <button className="logoutButton" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminDashboard;