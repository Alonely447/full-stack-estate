import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import "./adminDashboard.scss";

function AdminDashboard() {
  const { updateUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = async () => {
    try {
      await apiRequest.post("/auth/logout");
      updateUser(null); // Clear user context
      navigate("/login"); // Redirect to login page
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className={`adminDashboard ${sidebarOpen ? "sidebarOpen" : "sidebarClosed"}`}>
      <div className="sidebar">
        <div className="sidebarHeader">
          <h2>Admin Panel</h2>
          <button className="toggleButton" onClick={toggleSidebar}>
            {sidebarOpen ? "⟨" : "⟩"}
          </button>
        </div>
        <nav>
          <ul>
            <li>
              <NavLink to="/admin/users" className={({ isActive }) => (isActive ? "active" : "")}>
                Manage Users
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/posts" className={({ isActive }) => (isActive ? "active" : "")}>
                Manage Posts
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/reports" className={({ isActive }) => (isActive ? "active" : "")}>
                View Reports
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/stats" className={({ isActive }) => (isActive ? "active" : "")}>
                Statistics
              </NavLink>
            </li>
          </ul>
        </nav>
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
