import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";
import UploadPage from "./pages/UploadPage";
import ViewImagesPage from "./pages/ViewImagesPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import LoginPage from "./pages/LoginPage";
import SuperAdminLogin from "./pages/SuperAdminLogin";
import Alerts from "./pages/Alerts"; 
import Projects from "./pages/Projects"; 
import AdminManagement from "./pages/AdminManagement"; 
import UserManagement from "./pages/UserManagement"; 
import TrustBinPage from "./pages/TrustBinPage"; 

// ✅ NEW IMPORT
import SuperAdminDashboard from "./pages/SuperAdminDashboard"; 

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

  // Landing page logic
  const getLandingPage = () => {
    if (!user) return "/login";
    // If superadmin, land on the new dashboard; otherwise follow old logic
    if (user.role === "superadmin") return "/superadmin-dashboard";
    return user.role === "user" ? "/images" : "/upload";
  };

  return (
    <div className="app-root">
      {/* Sidebar renders if user is logged in */}
      {user && <Sidebar user={user} setUser={setUser} />}
      
      <main className={user ? "main-content" : "auth-content"}>
        <Routes>
          {/* AUTH ROUTES */}
          <Route 
            path="/login" 
            element={user ? <Navigate to={getLandingPage()} replace /> : <LoginPage setUser={setUser} />} 
          />
          <Route 
            path="/super-login" 
            element={user ? <Navigate to={getLandingPage()} replace /> : <SuperAdminLogin setUser={setUser} />} 
          />

          {/* ✅ NEW: SUPER ADMIN DASHBOARD ROUTE */}
          <Route 
            path="/superadmin-dashboard" 
            element={
              <ProtectedRoute user={user} requiredRoles={["superadmin"]}>
                <SuperAdminDashboard />
              </ProtectedRoute>
            } 
          />

          {/* PROTECTED ROUTES (Admin & Super Admin) */}
          <Route 
            path="/upload" 
            element={
              <ProtectedRoute user={user} requiredRoles={["admin", "superadmin"]}>
                <UploadPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/trust-bin" 
            element={
              <ProtectedRoute user={user} requiredRoles={["admin", "superadmin"]}>
                <TrustBinPage user={user} />
              </ProtectedRoute>
            } 
          />

          {/* SHARED ROUTES (Everyone) */}
          <Route 
            path="/images" 
            element={
              <ProtectedRoute user={user}>
                <ViewImagesPage user={user} />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/analytics" 
            element={
              <ProtectedRoute user={user}>
                <AnalyticsPage user={user} setUser={setUser} />
              </ProtectedRoute>
            } 
          />

          {/* ADMIN ONLY ROUTE */}
          <Route 
            path="/user-management" 
            element={
              <ProtectedRoute user={user} requiredRoles={["admin"]}>
                <UserManagement />
              </ProtectedRoute>
            } 
          />

          {/* SUPER ADMIN ONLY ROUTES */}
          <Route 
            path="/alerts" 
            element={
              <ProtectedRoute user={user} requiredRoles={["superadmin"]}>
                <Alerts />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/projects" 
            element={
              <ProtectedRoute user={user} requiredRoles={["superadmin"]}>
                <Projects />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/admin-management" 
            element={
              <ProtectedRoute user={user} requiredRoles={["superadmin"]}>
                <AdminManagement />
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