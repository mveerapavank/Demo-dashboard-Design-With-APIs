import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./sidebar.css";

// Simple Icons
const IconUpload = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>;
const IconImages = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>;

export default function Sidebar({ user, setUser }) {
  const navigate = useNavigate();

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
          {(user.role === "admin" || user.role === "superadmin") && (
            <NavLink to="/upload" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
              <IconUpload /><span>Upload Data</span>
            </NavLink>
          )}
          
          <NavLink to="/images" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            <IconImages /><span>Images View</span>
          </NavLink>
        </nav>
      </div>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">{user.name ? user.name.charAt(0) : "U"}</div>
          <div className="user-info">
            <h4 className="profile-name">{user.name || "User"}</h4>
            <p className="profile-role">{user.role}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="logout-btn">Sign Out</button>
      </div>
    </aside>
  );
}