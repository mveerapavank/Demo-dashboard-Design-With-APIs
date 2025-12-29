// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

export default function LoginPage({ setUser }) {
  // View State: 'select' (choose role) or 'form' (enter details)
  const [view, setView] = useState("select"); 
  
  // Login Flow State: 1 = Credentials, 2 = OTP
  const [step, setStep] = useState(1); 

  const [selectedRole, setSelectedRole] = useState("");
  const [email, setEmail] = useState(""); // This maps to 'username' in API
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  // --- STEP 1: SEND CREDENTIALS ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // API Call: Validate Username & Password
      const response = await fetch("http://172.18.1.34:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          username: email, // Assuming email is the username
          password: password 
        }),
      });

      if (!response.ok) {
        throw new Error(`Invalid credentials for ${selectedRole}`);
      }

      // If success, backend sends OTP
      const data = await response.json();
      console.log(`${selectedRole} Login Success:`, data);
      
      setLoading(false);
      setStep(2); // Move to OTP Step
    } catch (err) {
      console.error(err);
      setError("❌ Invalid Credentials or Server Error");
      setLoading(false);
    }
  };

  // --- STEP 2: VERIFY OTP ---
  const handleOtpVerify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // API Call: Verify OTP
      const response = await fetch("http://172.18.1.34:8000/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          username: email, 
          otp: parseInt(otp, 10) // Convert string to integer
        }),
      });

      if (!response.ok) {
        throw new Error("Invalid OTP");
      }

      // Login Successful
      const userData = { 
        name: selectedRole === "admin" ? "Admin User" : "Standard User", 
        role: selectedRole 
      };
      
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      navigate("/upload"); // Go to Dashboard

    } catch (err) {
      console.error(err);
      setError("❌ Invalid OTP Code");
      setLoading(false);
    }
  };

  // Helper to reset view when clicking "Back"
  const handleBackToSelect = () => {
    setView("select");
    setStep(1);
    setEmail("");
    setPassword("");
    setOtp("");
    setError("");
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        
        <div className="login-header">
          <h1>DataDash Portal</h1>
          <p>{view === "select" ? "Choose your login type" : `Login as ${selectedRole}`}</p>
        </div>

        {error && <div style={{ color: "red", fontSize: "14px", marginBottom: "15px", background: "#fee2e2", padding: "10px", borderRadius: "6px" }}>{error}</div>}

        {/* --- VIEW 1: ROLE SELECTION --- */}
        {view === "select" ? (
          <div className="portal-selector">
            <button className="portal-btn admin" onClick={() => { setSelectedRole("admin"); setView("form"); setStep(1); }}>
              <div className="portal-icon">🛡️</div>
              <span>Login as Administrator</span>
            </button>
            <button className="portal-btn user" onClick={() => { setSelectedRole("user"); setView("form"); setStep(1); }}>
              <div className="portal-icon">👤</div>
              <span>Login as User</span>
            </button>
          </div>
        ) : (
          /* --- VIEW 2: LOGIN FORMS --- */
          <>
            {/* STEP 1: CREDENTIALS */}
            {step === 1 && (
              <form onSubmit={handleLogin} className="login-form">
                <div className="form-group">
                  <label>Email / Username</label>
                  <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder={`Enter ${selectedRole} ID`} />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Enter password" />
                </div>
                <button type="submit" className="login-btn" disabled={loading}>
                  {loading ? "Verifying..." : "Sign In"}
                </button>
                <button type="button" className="back-link" onClick={handleBackToSelect}>← Back to selection</button>
              </form>
            )}

            {/* STEP 2: OTP */}
            {step === 2 && (
              <form onSubmit={handleOtpVerify} className="login-form" style={{ animation: "fadeIn 0.5s" }}>
                <div style={{ background: "#ecfdf5", padding: "10px", borderRadius: "6px", marginBottom: "10px", border: "1px solid #10b981", color: "#065f46", fontSize: "13px" }}>
                  🔒 OTP sent to {email}
                </div>

                <div className="form-group">
                  <label>One-Time Password</label>
                  <input 
                    type="number" 
                    value={otp} 
                    onChange={(e) => setOtp(e.target.value)} 
                    required 
                    placeholder="Enter OTP"
                    autoFocus
                    style={{ letterSpacing: "5px", fontSize: "18px", textAlign: "center" }}
                  />
                </div>

                <button type="submit" className="login-btn" style={{ background: "#10b981" }} disabled={loading}>
                  {loading ? "Checking..." : "Verify OTP"}
                </button>
                
                <button type="button" className="back-link" onClick={() => { setStep(1); setOtp(""); setError(""); }}>
                  ← Back to Login
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}