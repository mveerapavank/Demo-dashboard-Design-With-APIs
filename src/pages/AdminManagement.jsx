import React, { useState } from 'react';
import './adminManagement.css';

// Simple Icons (SVG)
const IconSearch = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>;
const IconPlus = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>;
const IconMore = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>;
const IconX = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>;
const IconShield = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;

const AdminManagement = () => {
  // Mock Data
  const [admins, setAdmins] = useState([
    { id: 1, name: 'Alice Walker', email: 'alice@akin.com', role: 'Senior Admin', users: 8, maxUsers: 10, status: 'Active', lastLogin: '2 mins ago' },
    { id: 2, name: 'Bob Martin', email: 'bob@akin.com', role: 'Admin', users: 2, maxUsers: 10, status: 'Inactive', lastLogin: '4 days ago' },
    { id: 3, name: 'Charlie Davis', email: 'charlie@akin.com', role: 'Admin', users: 10, maxUsers: 10, status: 'Active', lastLogin: '1 hour ago' },
  ]);

  const [selectedAdmin, setSelectedAdmin] = useState(null); // For the drawer
  const [showModal, setShowModal] = useState(false); // For create modal

  const handleRowClick = (admin) => {
    setSelectedAdmin(admin);
  };

  const closeDrawer = () => {
    setSelectedAdmin(null);
  };

  return (
    <div className="admin-page">
      {/* --- PAGE HEADER --- */}
      <div className="page-header">
        <div>
          <h1 className="title">Admin Management</h1>
          <p className="subtitle">Oversee admin access, monitor user quotas, and audit activity.</p>
        </div>
        <button className="btn-create" onClick={() => setShowModal(true)}>
          <IconPlus /> <span>New Admin</span>
        </button>
      </div>

      {/* --- KPI CARDS --- */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon blue"><IconShield /></div>
          <div>
            <div className="kpi-value">{admins.length}</div>
            <div className="kpi-label">Total Admins</div>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon green"><span style={{fontWeight:'800'}}>%</span></div>
          <div>
            <div className="kpi-value">85%</div>
            <div className="kpi-label">System Health</div>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon orange"><span style={{fontWeight:'800'}}>!</span></div>
          <div>
            <div className="kpi-value">1</div>
            <div className="kpi-label">Limit Reached</div>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT CARD --- */}
      <div className="content-card">
        {/* Toolbar */}
        <div className="toolbar">
          <div className="search-box">
            <IconSearch />
            <input type="text" placeholder="Search by name, email, or ID..." />
          </div>
          <div className="filters">
            <select><option>All Status</option><option>Active</option><option>Inactive</option></select>
            <select><option>Newest First</option><option>Oldest First</option></select>
          </div>
        </div>

        {/* Rich Table */}
        <div className="table-responsive">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Admin Profile</th>
                <th>Access Level</th>
                <th>User Quota (10 Max)</th>
                <th>Status</th>
                <th>Last Active</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id} onClick={() => handleRowClick(admin)} className="clickable-row">
                  <td>
                    <div className="profile-cell">
                      <div className="avatar">{admin.name.charAt(0)}</div>
                      <div className="info">
                        <span className="name">{admin.name}</span>
                        <span className="email">{admin.email}</span>
                      </div>
                    </div>
                  </td>
                  <td><span className="role-pill">{admin.role}</span></td>
                  <td>
                    <div className="quota-cell">
                      <div className="quota-text">
                        <span style={{color: admin.users === 10 ? '#ef4444' : '#4f46e5'}}>{admin.users}</span> / {admin.maxUsers} Used
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="fill" 
                          style={{ 
                            width: `${(admin.users / admin.maxUsers) * 100}%`,
                            background: admin.users === 10 ? '#ef4444' : '#4f46e5'
                          }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className={`status-dot-wrapper ${admin.status.toLowerCase()}`}>
                      <div className="dot"></div>
                      <span>{admin.status}</span>
                    </div>
                  </td>
                  <td className="text-muted">{admin.lastLogin}</td>
                  <td className="action-cell">
                    <button className="btn-icon"><IconMore /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- DETAIL DRAWER (SLIDE OVER) --- */}
      <div className={`drawer-backdrop ${selectedAdmin ? 'open' : ''}`} onClick={closeDrawer}></div>
      <div className={`detail-drawer ${selectedAdmin ? 'open' : ''}`}>
        {selectedAdmin && (
          <>
            <div className="drawer-header">
              <h3>Admin Details</h3>
              <button className="btn-close" onClick={closeDrawer}><IconX /></button>
            </div>
            
            <div className="drawer-body">
              <div className="drawer-profile">
                <div className="big-avatar">{selectedAdmin.name.charAt(0)}</div>
                <h2>{selectedAdmin.name}</h2>
                <p>{selectedAdmin.email}</p>
                <div className="drawer-actions">
                  <button className="btn-secondary">Reset Pass</button>
                  <button className="btn-danger">Suspend</button>
                </div>
              </div>

              <div className="drawer-section">
                <h4>Quotas</h4>
                <div className="quota-card">
                  <span>Users Created</span>
                  <strong>{selectedAdmin.users} / 10</strong>
                </div>
              </div>

              <div className="drawer-section">
                <h4>Recent Activity Log</h4>
                <ul className="activity-list">
                  <li>
                    <span className="time">10:00 AM</span>
                    <p>Created user <strong>Mike Ross</strong></p>
                  </li>
                  <li>
                    <span className="time">Yesterday</span>
                    <p>Updated profile settings</p>
                  </li>
                  <li>
                    <span className="time">2 days ago</span>
                    <p>Logged in from New IP</p>
                  </li>
                </ul>
              </div>
            </div>
          </>
        )}
      </div>

      {/* --- MODAL FOR CREATE --- */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add New Admin</h2>
            <div className="form-row"><label>Name</label><input type="text" /></div>
            <div className="form-row"><label>Email</label><input type="email" /></div>
            <div className="modal-btns">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-confirm">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManagement;