import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";
import UploadPage from "./pages/UploadPage";
import ViewImagesPage from "./pages/ViewImagesPage";
import AnalyticsPage from "./pages/AnalyticsPage"; // NEW IMPORT
import LoginPage from "./pages/LoginPage";
import SuperAdminLogin from "./pages/SuperAdminLogin";
import "./App.css";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch {
        localStorage.removeItem("user");
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  if (loading) return null;

  // Determine landing page based on role
  const getLandingPage = () => {
    if (!user) return "/login";
    return user.role === "user" ? "/images" : "/upload";
  };

  return (
    <div className="app-root">
      {/* Sidebar only renders if a user session is active */}
      {user && <Sidebar user={user} setUser={setUser} />}
      
      <main className={user ? "main-content" : "auth-content"}>
        <Routes>
          {/* AUTH ROUTES: Redirect to landing page if already logged in */}
          <Route 
            path="/login" 
            element={user ? <Navigate to={getLandingPage()} replace /> : <LoginPage setUser={setUser} />} 
          />
          <Route 
            path="/super-login" 
            element={user ? <Navigate to={getLandingPage()} replace /> : <SuperAdminLogin setUser={setUser} />} 
          />

          {/* PROTECTED ROUTES */}
          <Route 
            path="/upload" 
            element={
              <ProtectedRoute user={user} requiredRoles={["admin", "superadmin"]}>
                <UploadPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/images" 
            element={
              <ProtectedRoute user={user}>
                <ViewImagesPage user={user} />
              </ProtectedRoute>
            } 
          />
          
          {/* NEW: Analytics Route (Available to verified users) */}
          <Route 
            path="/analytics" 
            element={
              <ProtectedRoute user={user}>
                <AnalyticsPage user={user} />
              </ProtectedRoute>
            } 
          />

          {/* ROOT & CATCH-ALL */}
          <Route path="/" element={<Navigate to={getLandingPage()} replace />} />
          <Route path="*" element={<Navigate to={getLandingPage()} replace />} />
        </Routes>
      </main>
    </div>
  );
}