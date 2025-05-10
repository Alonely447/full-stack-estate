import "./register.scss";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import apiRequest from "../../lib/apiRequest";

function Register() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    const formData = new FormData(e.target);
    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");

    // Password validation: at least 6 characters, contains letters and numbers
    const isValidPassword = (pwd) => {
      if (pwd.length < 6) return false;
      const hasLetter = /[a-zA-Z]/.test(pwd);
      const hasNumber = /[0-9]/.test(pwd);
      return hasLetter && hasNumber;
    };

    if (!isValidPassword(password)) {
      setError("Password must be at least 6 characters long and contain both letters and numbers.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await apiRequest.post("/auth/request-verification", {
        username,
        email,
        password,
      });

      setSuccessMessage("Đăng ký thành công, vui lòng kiểm tra email để xác thực tài khoản.");

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(err.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="registerPage">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Tạo tài khoản</h1>
          <input name="username" type="text" placeholder="Username" />
          <input name="email" type="text" placeholder="Email" />
          <input name="password" type="password" placeholder="Password" />
          <button disabled={isLoading}>Đăng ký</button>
          {error && <span>{error}</span>}
          {successMessage && <span style={{ color: "green" }}>{successMessage}</span>}
          <Link to="/login">Bạn đã có tài khoản?</Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default Register;
