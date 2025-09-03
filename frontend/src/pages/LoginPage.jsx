import "./LoginPage.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";

function LoginPage() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true); // toggle login/signup
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false); // loader state
  const API_URL = import.meta.env.VITE_API_URL;

  const handleCreateAccount = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/auth/register`, {
        username,
        email,
        password,
      });
      if (res.status === 201) {
        alert("Account created successfully");
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/home");
        setUsername("");
        setEmail("");
        setPassword("");
      }
    } catch (err) {
      console.error(err);
      alert("Error registering user");
    }
    setLoading(false);
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });
      if (res.data.success) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/home");
        setErrorMessage("");
      } else {
        setErrorMessage("Invalid email or password");
      }
    } catch (error) {
      setErrorMessage(
        "Login failed: " + (error.response?.data?.message || "Server error")
      );
      console.error(error);
    }
    setLoading(false);
  };

  const handleGoogleLogin = async (credentialResponse) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/auth/google-login`, {
        credential: credentialResponse.credential,
      });
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/home");
    } catch (err) {
      console.error("Google login failed:", err);
      alert("Google login failed");
    }
    setLoading(false);
  };

  return (
    <div className="zoom-wrapper">
      {/* Loader Overlay */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="w-12 h-12 border-4 border-white border-dashed rounded-full animate-spin"></div>
        </div>
      )}

      <div className="background">
        <div className="card">
          <div className="card-content">
            <div className="logo-section">
              <div className="icon-circle">🐞</div>
              <h1>BugPilot</h1>
              <p>Track bugs across multiple projects with ease</p>
            </div>

            {!isLogin && (
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input"
              />
            )}

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
            />

            {errorMessage && (
              <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
            )}

            <div className="button-group">
              {isLogin ? (
                <>
                  <button className="btn primary" onClick={handleLogin}>
                    Login
                  </button>

                  <p className="text-sm mt-2">
                    Don’t have an account?{" "}
                    <span
                      className="text-blue-500 cursor-pointer"
                      onClick={() => {
                        setIsLogin(false);
                        setErrorMessage("");
                      }}
                    >
                      Sign up
                    </span>
                  </p>
                </>
              ) : (
                <>
                  <button className="btn primary" onClick={handleCreateAccount}>
                    Create Account
                  </button>

                  <p className="text-sm mt-2">
                    Already have an account?{" "}
                    <span
                      className="text-blue-500 cursor-pointer"
                      onClick={() => {
                        setIsLogin(true);
                        setErrorMessage("");
                      }}
                    >
                      Login
                    </span>
                  </p>
                </>
              )}
            </div>

            <div style={{ marginTop: "20px", textAlign: "center" }}>
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => {
                  console.log("Google Login Failed");
                  alert("Google Login Failed");
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
