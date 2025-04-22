
import { useEffect, useState } from "react";
import apiRequest from "../../lib/apiRequest";

function ManagePosts() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await apiRequest.get("/posts");
        setPosts(res.data);
      } catch (err) {
        setError("Failed to fetch posts.");
      }
    };

    fetchPosts();
  }, []);

  return (
    <div>
      <h1>Manage Posts</h1>
      {error && <p>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id}>
              <td>{post.id}</td>
              <td>{post.title}</td>
              <td>{post.price}</td>
              <td>
                <button>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManagePosts;