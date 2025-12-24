// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

export default function LoginPage({ setUser }) {
  const [view, setView] = useState("select"); // 'select' or 'form'
  const [selectedRole, setSelectedRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    let userData = null;

    if (selectedRole === "admin" && email === "admin@example.com" && password === "admin123") {
      userData = { name: "Pavan (Admin)", role: "admin" };
    } else if (selectedRole === "user" && email === "user@example.com" && password === "user123") {
      userData = { name: "Guest User", role: "user" };
    }

    if (userData) {
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      navigate("/upload");
    } else {
      alert("Invalid credentials for " + selectedRole);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-header">
          <h1>DataDash Portal</h1>
          <p>{view === "select" ? "Choose your login type" : `Login as ${selectedRole}`}</p>
        </div>

        {view === "select" ? (
          <div className="portal-selector">
            <button className="portal-btn admin" onClick={() => { setSelectedRole("admin"); setView("form"); }}>
              <div className="portal-icon">🛡️</div>
              <span>Login as Administrator</span>
            </button>
            <button className="portal-btn user" onClick={() => { setSelectedRole("user"); setView("form"); }}>
              <div className="portal-icon">👤</div>
              <span>Login as User</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="login-btn">Sign In</button>
            <button type="button" className="back-link" onClick={() => setView("select")}>← Back to selection</button>
          </form>
        )}
      </div>
    </div>
  );
}