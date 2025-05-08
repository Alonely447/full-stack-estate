import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import "./manage.scss";

function ManagePosts() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("manage"); // "manage", "new", or "flagged"

  const fetchPosts = async (searchQuery = "") => {
    try {
      const res = await apiRequest.get("/posts", {
        params: searchQuery ? { search: searchQuery } : {},
      });
      setPosts(res.data);
    } catch (err) {
      setError("Failed to fetch posts.");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    fetchPosts(value);
  };

  const handleVerify = async (postId) => {
    setLoading(true);
    try {
      await apiRequest.put(`/posts/${postId}/verify`);
      fetchPosts(search);
    } catch (err) {
      setError("Failed to verify post.");
    }
    setLoading(false);
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }
    setLoading(true);
    try {
      await apiRequest.delete(`/posts/${postId}`);
      fetchPosts(search);
    } catch (err) {
      alert("Failed to delete post.");
    }
    setLoading(false);
  };

  // Filter posts based on active tab
  const filteredPosts = posts.filter((post) => {
    if (activeTab === "manage") {
      return post.status !== "flagged" && post.verified;
    } else if (activeTab === "new") {
      return post.status !== "flagged" && !post.verified;
    } else if (activeTab === "flagged") {
      return post.status === "flagged";
    }
    return true;
  });

  return (
    <div className="manageContainer">
      <h1>Manage Posts</h1>
      <div className="tabs">
        <button
          className={activeTab === "manage" ? "active" : ""}
          onClick={() => setActiveTab("manage")}
        >
          Manage Posts
        </button>
        <button
          className={activeTab === "new" ? "active" : ""}
          onClick={() => setActiveTab("new")}
        >
          New Posts
        </button>
        <button
          className={activeTab === "flagged" ? "active" : ""}
          onClick={() => setActiveTab("flagged")}
        >
          Flagged Posts
        </button>
      </div>
      <input
        type="text"
        placeholder="Search posts..."
        value={search}
        onChange={handleSearchChange}
        className="searchInput"
      />
      {error && <p className="error">{error}</p>}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredPosts.map((post) => (
            <tr key={post.id}>
              <td data-label="ID">
                <Link to={`/${post.id}`}>{post.id}</Link>
              </td>
              <td data-label="Title">{post.title}</td>
              <td data-label="Price">{post.price}</td>
              <td data-label="Status">{post.status}</td>
              <td data-label="Actions">
                {!post.verified && activeTab === "new" && (
                  <button
                    onClick={() => handleVerify(post.id)}
                    disabled={loading}
                    className="verify"
                  >
                    {loading ? "Verifying..." : "Verify"}
                  </button>
                )}
                <button
                  onClick={() => handleDelete(post.id)}
                  disabled={loading}
                  className="delete"
                >
                  {loading ? "Deleting..." : "Delete"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManagePosts;
