import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const INVALID_TOKEN = "INVALID_TOKEN";
  const [token, setToken] = useState(INVALID_TOKEN);
  const [message, setMessage] = useState("");

  const handleSignIn = async () => {
    try {
      const response = await fetch("http://localhost:8000/login", {//"https://crumblist-g5htfcg7afh8ehdw.canadacentral-01.azurewebsites.net/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.status === 200) {
        const payload = await response.json();
        setToken(payload.token); 
        localStorage.setItem("token", payload.token);
        setMessage("Login successful; auth token saved");
        alert("Login successful!");
        navigate("/");
      } else {
        const errorText = await response.text(); 
        setMessage(`Login Error ${response.status}: ${errorText}`);
        alert(`Login failed: ${errorText}`);
      }
    } catch (err) {
      console.error("Login error:", err);
      setMessage(`Login Error: ${err.message}`);
      alert("Something went wrong.");
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
          <button className="butter-button" onClick={handleSignIn}>
            🧈 Sign In
          </button>
          <button
            className="signup-link-button"
            onClick={() => navigate("/signup")}
          >
            New? Sign Up →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
