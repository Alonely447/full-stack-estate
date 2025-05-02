import { useEffect, useState, useCallback } from "react";
import apiRequest from "../../lib/apiRequest";
import "./manage.scss";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("manage"); // "manage" or "newRegistrations"

  const fetchUsers = useCallback(async (searchQuery = "") => {
    try {
      const res = await apiRequest.get(`/users${searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ""}`);
      setUsers(res.data);
    } catch (err) {
      setError("Failed to fetch users.");
    }
  }, []);

  useEffect(() => {
    fetchUsers(search);
  }, [fetchUsers, search]);

  const handleApprove = async (userId) => {
    setLoading(true);
    try {
      await apiRequest.put(`/users/verify/${userId}`);
      // Update user list after approval
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, isAdminVerified: true } : user
        )
      );
    } catch (err) {
      setError("Failed to verify user.");
    }
    setLoading(false);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  // Filter users based on active tab
  const filteredUsers = users.filter(user =>
    activeTab === "manage" ? user.isAdminVerified : !user.isAdminVerified
  );

  return (
    <div className="manageContainer">
      <h1>Manage Users</h1>
      <div className="tabs">
        <button
          className={activeTab === "manage" ? "active" : ""}
          onClick={() => setActiveTab("manage")}
        >
          Manage Users
        </button>
        <button
          className={activeTab === "newRegistrations" ? "active" : ""}
          onClick={() => setActiveTab("newRegistrations")}
        >
          New Registrations
        </button>
      </div>
      <input
        type="text"
        placeholder="Search users by username or email"
        value={search}
        onChange={handleSearchChange}
        className="searchInput"
      />
      {error && <p className="error">{error}</p>}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Username</th>
            <th>Verified by Admin</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td data-label="ID">{user.id}</td>
              <td data-label="Email">{user.email}</td>
              <td data-label="Username">{user.username}</td>
              <td data-label="Verified by Admin">{user.isAdminVerified ? "Yes" : "No"}</td>
              <td data-label="Actions">
                {!user.isAdminVerified && activeTab === "newRegistrations" && (
                  <>
                    <button onClick={() => handleApprove(user.id)} disabled={loading} className="approve">
                      {loading ? "Approving..." : "Approve"}
                    </button>
                    <button
                      onClick={async () => {
                        if (!window.confirm("Are you sure you want to refuse this user?")) {
                          return;
                        }
                        setLoading(true);
                        try {
                          await apiRequest.delete(`/users/refuse/${user.id}`);
                          setUsers((prevUsers) => prevUsers.filter((u) => u.id !== user.id));
                        } catch (err) {
                          setError("Failed to refuse user.");
                        }
                        setLoading(false);
                      }}
                      disabled={loading}
                      className="refuse"
                    >
                      {loading ? "Refusing..." : "Refuse"}
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageUsers;
