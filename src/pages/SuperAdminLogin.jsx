// src/pages/SuperAdminLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css"; // Reuse existing styles

export default function SuperAdminLogin({ setUser }) {
  const [step, setStep] = useState(1); // 1 = Login, 2 = OTP
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  // --- STEP 1: VALIDATE CREDENTIALS ---
  const handleSuperLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://172.18.1.34:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          username: username, 
          password: password 
        }),
      });

      if (!response.ok) {
        throw new Error("Invalid Credentials");
      }

      // If success, API usually sends OTP to email/phone here
      const data = await response.json();
      console.log("Login Success, waiting for OTP...", data);
      
      setLoading(false);
      setStep(2); // Move to Step 2 (OTP)
    } catch (err) {
      console.error(err);
      setError("❌ Invalid Admin Credentials or Server Error");
      setLoading(false);
    }
  };

  // --- STEP 2: VERIFY OTP ---
  const handleOtpVerify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://172.18.1.34:8000/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          username: username, 
          otp: parseInt(otp, 10) // Backend expects an integer (0)
        }),
      });

      if (!response.ok) {
        throw new Error("Invalid OTP");
      }

      // If OTP is correct
      const data = await response.json();
      console.log("OTP Verified:", data);

      const userData = { name: "Super Admin", role: "superadmin" };
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      navigate("/upload"); // Go to Dashboard

    } catch (err) {
      console.error(err);
      setError("❌ Invalid OTP Code");
      setLoading(false);
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

        {error && <div style={{ color: "red", fontSize: "14px", marginBottom: "15px", background: "#fee2e2", padding: "10px", borderRadius: "6px" }}>{error}</div>}

        {/* --- STEP 1 FORM: CREDENTIALS --- */}
        {step === 1 && (
          <form onSubmit={handleSuperLogin} className="login-form">
            <div className="form-group">
              <label>Admin Username</label>
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
                placeholder="Enter Username"
              />
            </div>
            <div className="form-group">
              <label>Master Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                placeholder="Enter Password"
              />
            </div>
            <button type="submit" className="login-btn" style={{ background: "#4338ca" }} disabled={loading}>
              {loading ? "Verifying..." : "Authorize Access"}
            </button>
          </form>
        )}

        {/* --- STEP 2 FORM: OTP --- */}
        {step === 2 && (
          <form onSubmit={handleOtpVerify} className="login-form" style={{ animation: "fadeIn 0.5s" }}>
            <div style={{ background: "#ecfdf5", padding: "10px", borderRadius: "6px", marginBottom: "10px", border: "1px solid #10b981", color: "#065f46", fontSize: "13px" }}>
              🔒 An OTP has been sent to your registered email.
            </div>

            <div className="form-group">
              <label>One-Time Password</label>
              <input 
                type="number" 
                value={otp} 
                onChange={(e) => setOtp(e.target.value)} 
                required 
                placeholder="Enter OTP Code"
                autoFocus
                style={{ letterSpacing: "5px", fontSize: "18px", textAlign: "center" }}
              />
            </div>

            <button type="submit" className="login-btn" style={{ background: "#10b981" }} disabled={loading}>
              {loading ? "Checking..." : "Verify OTP"}
            </button>
            
            <button 
              type="button" 
              className="back-link" 
              onClick={() => { setStep(1); setError(""); setOtp(""); }}
            >
              Back to Login
            </button>
          </form>
        )}

      </div>
    </div>
  );
}