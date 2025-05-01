import { useEffect, useState } from "react";
import apiRequest from "../../lib/apiRequest";

function ManagePosts() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

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
    try {
      await apiRequest.put(`/posts/${postId}/verify`);
      fetchPosts(search);
    } catch (err) {
      setError("Failed to verify post.");
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }
    try {
      await apiRequest.delete(`/posts/${postId}`);
      fetchPosts(search);
    } catch (err) {
      alert("Failed to delete post.");
    }
  };

  return (
    <div>
      <h1>Manage Posts</h1>
      <input
        type="text"
        placeholder="Search posts..."
        value={search}
        onChange={handleSearchChange}
        style={{ marginBottom: "10px", padding: "5px", width: "300px" }}
      />
      {error && <p>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Price</th>
            <th>Verified</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id}>
              <td>{post.id}</td>
              <td>{post.title}</td>
              <td>{post.price}</td>
              <td>{post.verified ? "Yes" : "No"}</td>
              <td>
                {!post.verified && (
                  <button onClick={() => handleVerify(post.id)}>Verify</button>
                )}
                <button onClick={() => handleDelete(post.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManagePosts;
