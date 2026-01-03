// src/pages/SuperAdminLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css"; 

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
      // 1. Send Login Request with required_role
      const response = await fetch("http://172.18.1.35:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          username: username, 
          password: password,
          required_role: "superadmin" // ✅ NEW REQUIREMENT
        }),
      });

      if (!response.ok) {
        throw new Error("Invalid Credentials or Unauthorized Role");
      }

      const data = await response.json();
      console.log("Step 1 Success:", data);
      
      setLoading(false);
      setStep(2); // Move to OTP step
    } catch (err) {
      console.error(err);
      setError("❌ Invalid Credentials or Server Error");
      setLoading(false);
    }
  };

  // --- STEP 2 & 3: VERIFY OTP & GET TOKEN ---
  const handleOtpVerify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 2. Verify OTP (POST)
      const otpResponse = await fetch("http://172.18.1.35:5000/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          username: username, 
          otp: parseInt(otp, 10) // Ensure OTP is an integer
        }),
      });

      if (!otpResponse.ok) {
        throw new Error("Invalid OTP Code");
      }

      console.log("OTP Verified. Fetching final details...");

      // 3. Final Success Check (GET) - ✅ NEW REQUIREMENT
      // We pass username as a query parameter
      const successResponse = await fetch(`http://172.18.1.35:5000/auth/success?username=${username}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });

      if (!successResponse.ok) {
        throw new Error("Failed to retrieve user session details");
      }

      const finalData = await successResponse.json();
      console.log("Final Auth Data:", finalData);

      // Check if status is success
      if (finalData.status === "success") {
        
        // Construct User Object
        const userData = { 
          name: "Super Admin", 
          username: username,
          role: finalData.role || "superadmin",
          token: finalData.access_token 
        };

        // Save Token & User to LocalStorage
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", finalData.access_token); // Store JWT specifically if needed for API calls

        // Update App State
        setUser(userData);
        
        // Redirect
        navigate("/upload"); 
      } else {
        throw new Error("Authentication failed in final step");
      }

    } catch (err) {
      console.error(err);
      setError("❌ Authentication Failed: " + err.message);
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

        {error && <div style={{ color: "#b91c1c", fontSize: "14px", marginBottom: "15px", background: "#fee2e2", padding: "10px", borderRadius: "6px", border: "1px solid #fca5a5" }}>{error}</div>}

        {/* --- STEP 1 FORM --- */}
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

        {/* --- STEP 2 FORM --- */}
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
              {loading ? "Finalizing..." : "Verify & Login"}
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