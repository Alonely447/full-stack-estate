import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";

function VerifyEmail() {
  const [searchParams, setSearchParams] = useSearchParams(); // Extract query parameters
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token"); // Get the token from the URL
      console.log("Token from URL:", token); // Debugging

      if (!token) {
        setError("Token is missing!");
        return;
      }

      try {
        const res = await apiRequest.get(`/auth/verify-email?token=${token}`);
        setMessage(res.data.message);
        setTimeout(() => navigate("/login"), 3000); // Redirect to login after 3 seconds
      } catch (err) {
        setError(err.response?.data?.message || "Verification failed!");
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="registerPage">
      <div className="formContainer">
        {message && <h1 style={{ color: "green" }}>{message}</h1>}
        {error && <h1 style={{ color: "red" }}></h1>}
      </div>
    </div>
  );
}

export default VerifyEmail;