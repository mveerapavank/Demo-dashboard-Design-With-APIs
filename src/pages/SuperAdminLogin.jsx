// src/pages/SuperAdminLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css"; // Reuse the professional login styles

export default function SuperAdminLogin({ setUser }) {
  const [key, setKey] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSuperLogin = (e) => {
    e.preventDefault();
    // Use a unique set of credentials for Super Admin
    if (key === "SUPER_ADMIN_ID" && password === "superpass123") {
      const userData = { name: "Super Admin", role: "superadmin" };
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      navigate("/upload");
    } else {
      alert("Invalid Super Admin Credentials");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card" style={{ borderColor: "#4f46e5", borderWidth: "2px" }}>
        <div className="login-header">
          <div className="login-logo" style={{ background: "#4338ca" }}>🔑</div>
          <h1>System Control</h1>
          <p>Super Admin Access Only</p>
        </div>
        <form onSubmit={handleSuperLogin} className="login-form">
          <div className="form-group">
            <label>Admin Key</label>
            <input type="text" value={key} onChange={(e) => setKey(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Master Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="login-btn" style={{ background: "#4338ca" }}>Authorize Access</button>
        </form>
      </div>
    </div>
  );
}