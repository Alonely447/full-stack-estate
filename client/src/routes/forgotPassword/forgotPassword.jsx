import { useState } from "react";
import { Link } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import "../login/login.scss";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await apiRequest.post("/auth/forgot-password", { email });
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
            type="email"
            placeholder="Nhập email của bạn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button>Gửi link khôi phục </button>
          {message && <span style={{ color: "green" }}>{message}</span>}
          {error && <span style={{ color: "red" }}>{error}</span>}
          <Link to="/login">Về trang chủ </Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default ForgotPassword;