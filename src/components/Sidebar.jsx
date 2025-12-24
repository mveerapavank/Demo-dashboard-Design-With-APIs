import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./sidebar.css";

const IconUpload = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>;
const IconImages = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>;
const IconBell = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;

export default function Sidebar({ user, setUser }) {
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [notifs, setNotifs] = useState([]);

  useEffect(() => {
    const key = user.role === "superadmin" ? "superadmin_notifications" : "admin_alerts";
    const data = JSON.parse(localStorage.getItem(key) || "[]");
    setNotifs(data);
  }, [isDrawerOpen, user.role]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const clearNotifs = () => {
    const key = user.role === "superadmin" ? "superadmin_notifications" : "admin_alerts";
    localStorage.removeItem(key);
    setNotifs([]);
  };

  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-top">
          {/* RESTORED BRANDING AREA */}
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

            {(user.role === "admin" || user.role === "superadmin") && (
              <div 
                className={`nav-link notification-trigger ${isDrawerOpen ? "active" : ""}`} 
                onClick={() => setIsDrawerOpen(true)}
              >
                <div className="icon-wrapper">
                  <IconBell />
                  {notifs.length > 0 && <span className="notification-badge-pulse">{notifs.length}</span>}
                </div>
                <span>Notifications</span>
              </div>
            )}
          </nav>
        </div>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">{user.name ? user.name.charAt(0) : "U"}</div>
            <div className="user-info">
              <h4 className="profile-name">{user.name || "Super Admin"}</h4>
              <p className="profile-role">{user.role}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-btn">Sign Out</button>
        </div>
      </aside>

      {/* NOTIFICATION DRAWER */}
      <div className={`notif-drawer ${isDrawerOpen ? "open" : ""}`}>
        <div className="drawer-header">
          <div className="header-text">
            <h3>{user.role === "superadmin" ? "Admin Submissions" : "Notifications"}</h3>
            <p className="drawer-subtitle">{notifs.length} items pending</p>
          </div>
          <button className="close-drawer-btn" onClick={() => setIsDrawerOpen(false)}>✕</button>
        </div>

        <div className="drawer-body">
          {notifs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔔</div>
              <p>Your inbox is clear</p>
            </div>
          ) : (
            notifs.map((n, i) => (
              <div key={`${n.id}-${i}`} className="notif-card">
                <div className="notif-img-wrapper">
                  <img src={n.mainImage} alt="" className="notif-img-thumb" />
                </div>
                <div className="notif-content">
                  <p className="notif-title">{n.cardTitle}</p>
                  <p className="notif-meta">ID: {n.id} • Click to Review</p>
                </div>
              </div>
            ))
          )}
        </div>

        {notifs.length > 0 && (
          <div className="drawer-footer">
            <button className="clear-all-btn" onClick={clearNotifs}>Clear All Notifications</button>
          </div>
        )}
      </div>

      {isDrawerOpen && <div className="drawer-backdrop" onClick={() => setIsDrawerOpen(false)}></div>}
    </>
  );
}