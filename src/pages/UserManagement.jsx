import React, { useState } from 'react';
import './adminManagement.css'; // We reuse the CSS so it looks exactly the same

// Icons
const IconSearch = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>;
const IconPlus = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>;
const IconMore = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>;

const UserManagement = () => {
  // Mock Data for Users
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@gmail.com', plan: 'Free', status: 'Active', joined: '2024-01-15' },
    { id: 2, name: 'Sarah Smith', email: 'sarah@yahoo.com', plan: 'Pro', status: 'Active', joined: '2024-02-20' },
    { id: 3, name: 'Mike Ross', email: 'mike@law.com', plan: 'Business', status: 'Inactive', joined: '2023-11-05' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  // Filter Logic
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-page">
      
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="title">User Management</h1>
          <p className="subtitle">Manage registered users and their subscriptions.</p>
        </div>
        <button className="btn-create" onClick={() => alert("Open Create User Modal")}>
          <IconPlus /> <span>New User</span>
        </button>
      </div>

      {/* Content Card */}
      <div className="content-card">
        {/* Toolbar */}
        <div className="toolbar">
          <div className="search-box">
            <IconSearch />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filters">
            <select><option>All Status</option><option>Active</option><option>Inactive</option></select>
          </div>
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="modern-table">
            <thead>
              <tr>
                <th>User Profile</th>
                <th>Plan</th>
                <th>Status</th>
                <th>Joined Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="profile-cell">
                      {/* Green Avatar for Users */}
                      <div className="avatar" style={{background: '#f0fdf4', color: '#15803d'}}>
                        {user.name.charAt(0)}
                      </div>
                      <div className="info">
                        <span className="name">{user.name}</span>
                        <span className="email">{user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="role-pill" style={{background: '#f3f4f6', color: '#374151'}}>
                      {user.plan}
                    </span>
                  </td>
                  <td>
                    <div className={`status-dot-wrapper ${user.status.toLowerCase()}`}>
                      <div className="dot"></div>
                      <span>{user.status}</span>
                    </div>
                  </td>
                  <td className="text-muted">{user.joined}</td>
                  <td className="action-cell">
                    <button className="btn-icon"><IconMore /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;