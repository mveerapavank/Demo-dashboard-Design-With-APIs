import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./sidebar.css";

// --- ICONS ---
const IconUpload = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>;
const IconImages = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>;
const IconAnalytics = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>;
const IconProjects = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>;
const IconAlerts = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>;
// ✅ NEW: Admin Shield Icon
const IconAdmin = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;

export default function Sidebar({ user, setUser }) {
  const navigate = useNavigate();

  // Normalize role
  const userRole = user?.role?.toLowerCase() || "";

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="brand">
          <div className="brand-icon-box">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
               <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
             </svg>
          </div>
          <span className="brand-name">DashBoard</span>
        </div>

        <nav className="sidebar-nav">
          
          {/* 1. Upload: Admin & Superadmin */}
          {(userRole === "admin" || userRole === "superadmin") && (
            <NavLink to="/upload" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
              <IconUpload /><span>Upload Data</span>
            </NavLink>
          )}
          
          {/* 2. Images View: Everyone */}
          <NavLink to="/images" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            <IconImages /><span>Images View</span>
          </NavLink>

          {/* 3. Analytics: Everyone */}
          <NavLink to="/analytics" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            <IconAnalytics /><span>Analytics</span>
          </NavLink>

          {/* 4. Super Admin Only Tabs */}
          {userRole === "superadmin" && (
            <>
              <NavLink to="/projects" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                <IconProjects /><span>Projects</span>
              </NavLink>

              <NavLink to="/alerts" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                <IconAlerts /><span>Alerts</span>
              </NavLink>

              {/* ✅ NEW: Admin Management Tab */}
              <NavLink to="/admin-management" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                <IconAdmin /><span>Admins</span>
              </NavLink>
            </>
          )}

        </nav>
      </div>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">{user.name ? user.name.charAt(0).toUpperCase() : "U"}</div>
          <div className="user-info">
            <h4 className="profile-name">{user.name || "User"}</h4>
            <p className="profile-role" style={{textTransform:'capitalize'}}>{user.role}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="logout-btn">Sign Out</button>
      </div>
    </aside>
  );
}