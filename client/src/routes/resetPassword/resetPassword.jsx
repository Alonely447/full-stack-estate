import { useState } from "react";
import { Link } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import "../login/login.scss";

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const token = new URLSearchParams(window.location.search).get("token");

    try {
      const res = await apiRequest.post("/auth/reset-password", {
        token,
        newPassword,
      });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="login">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Khôi phục mật khẩu</h1>
          <input
            type="password"
            placeholder="Enter your new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button>Khôi phục mật khẩu</button>
          {message && <span style={{ color: "green" }}>{message}</span>}
          {error && <span style={{ color: "red" }}>{error}</span>}
          <Link to="/login">Trở về đăng nhập</Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default ResetPassword;