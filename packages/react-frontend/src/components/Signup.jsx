import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const INVALID_TOKEN = "INVALID_TOKEN";
  const [token, setToken] = useState(INVALID_TOKEN);
  const [message, setMessage] = useState("");

  const handleSignup = async () => {
    try {
      const response = await fetch("http://localhost:8000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

    if (response.status === 201) {
        const payload = await response.json();
        setToken(payload.token);
        localStorage.setItem("token", payload.token);
        setMessage(`Signup successful for user: ${username}; auth token saved`);
        alert("Signup successful!");
        navigate("/login"); 
      } else {
        const errorText = await response.text(); 
        setMessage(`Signup Error ${response.status}: ${errorText}`);
        alert(`Signup failed: ${errorText}`);
      }
    } catch (error) {
      console.error("Signup error:", error);
      setMessage(`Signup Error: ${error.message}`);
      alert("Something went wrong during signup.");
    } 
  };

  return (
    <div className="login-wrapper">
      <div className="flat-bread-shape">
        <div className="bread-inner">
          <div className="input-stack">
            <input
              type="text"
              placeholder="Username"
              className="butter-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="butter-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="butter-button" onClick={handleSignup}>
            🧈 Create Account
          </button>
          <button
            className="signup-link-button"
            onClick={() => navigate("/login")}
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
