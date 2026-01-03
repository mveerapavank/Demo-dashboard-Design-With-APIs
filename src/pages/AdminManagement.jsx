import React, { useState, useMemo } from 'react';
import './adminManagement.css';

// --- ICONS (Added Download, Trash, Sort, Chevron) ---
const IconSearch = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>;
const IconPlus = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>;
const IconMore = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>;
const IconX = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>;
const IconShield = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const IconDownload = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
const IconTrash = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>;
const IconSort = () => <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M7 15l5 5 5-5M7 9l5-5 5 5"/></svg>;
const IconChevronLeft = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>;
const IconChevronRight = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>;

const AdminManagement = () => {
  // --- STATE ---
  // Expanded Mock Data
  const [admins, setAdmins] = useState([
    { id: 1, name: 'Alice Walker', email: 'alice@akin.com', role: 'Senior Admin', users: 8, maxUsers: 10, status: 'Active', lastLogin: '2 mins ago' },
    { id: 2, name: 'Bob Martin', email: 'bob@akin.com', role: 'Admin', users: 2, maxUsers: 10, status: 'Inactive', lastLogin: '4 days ago' },
    { id: 3, name: 'Charlie Davis', email: 'charlie@akin.com', role: 'Admin', users: 10, maxUsers: 10, status: 'Active', lastLogin: '1 hour ago' },
    { id: 4, name: 'Diana Prince', email: 'diana@akin.com', role: 'Viewer', users: 0, maxUsers: 5, status: 'Active', lastLogin: 'Yesterday' },
    { id: 5, name: 'Evan Wright', email: 'evan@akin.com', role: 'Admin', users: 5, maxUsers: 10, status: 'Suspended', lastLogin: '1 month ago' },
    { id: 6, name: 'Fiona Green', email: 'fiona@akin.com', role: 'Admin', users: 1, maxUsers: 10, status: 'Active', lastLogin: '30 mins ago' },
  ]);

  const [selectedAdmin, setSelectedAdmin] = useState(null); 
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null); // { message, type }

  // Sorting, Filtering & Pagination State
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  // Bulk Selection State
  const [selectedRowIds, setSelectedRowIds] = useState([]);

  // --- LOGIC ---

  // 1. Show Notification Toast
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // 2. Filter & Sort Logic
  const filteredAdmins = useMemo(() => {
    let data = [...admins];

    // Search
    if (searchTerm) {
      data = data.filter(a => 
        a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        a.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Role Filter
    if (roleFilter !== 'All') {
      data = data.filter(a => a.role === roleFilter);
    }

    // Sorting
    if (sortConfig.key) {
      data.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return data;
  }, [admins, searchTerm, roleFilter, sortConfig]);

  // 3. Pagination Logic
  const totalPages = Math.ceil(filteredAdmins.length / itemsPerPage);
  const paginatedAdmins = filteredAdmins.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // --- HANDLERS ---

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleBulkSelect = (id) => {
    setSelectedRowIds(prev => 
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedRowIds.length === paginatedAdmins.length) {
      setSelectedRowIds([]);
    } else {
      setSelectedRowIds(paginatedAdmins.map(a => a.id));
    }
  };

  const handleDeleteSelected = () => {
    if (window.confirm(`Delete ${selectedRowIds.length} admins?`)) {
      setAdmins(prev => prev.filter(a => !selectedRowIds.includes(a.id)));
      setSelectedRowIds([]);
      showToast('Selected admins deleted successfully', 'error');
    }
  };

  const handleExportCSV = () => {
    const headers = ["ID,Name,Email,Role,Status,Users Used"];
    const rows = admins.map(a => `${a.id},${a.name},${a.email},${a.role},${a.status},${a.users}`);
    const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "admins_export.csv");
    document.body.appendChild(link);
    link.click();
    showToast('Data exported successfully');
  };

  return (
    <div className="admin-page">
      {/* --- TOAST NOTIFICATION --- */}
      {toast && (
        <div className={`toast-notification ${toast.type}`}>
          {toast.message}
        </div>
      )}

      {/* --- PAGE HEADER --- */}
      <div className="page-header">
        <div>
          <h1 className="title">Admin Management</h1>
          <p className="subtitle">Oversee admin access, monitor quotas, and audit activity.</p>
        </div>
        <div className="header-actions">
          <button className="btn-outline" onClick={handleExportCSV}>
            <IconDownload /> <span>Export</span>
          </button>
          <button className="btn-create" onClick={() => setShowModal(true)}>
            <IconPlus /> <span>New Admin</span>
          </button>
        </div>
      </div>

      {/* --- KPI CARDS (UNCHANGED) --- */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon blue"><IconShield /></div>
          <div><div className="kpi-value">{admins.length}</div><div className="kpi-label">Total Admins</div></div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon green"><span style={{fontWeight:'800'}}>%</span></div>
          <div><div className="kpi-value">98%</div><div className="kpi-label">System Health</div></div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon orange"><span style={{fontWeight:'800'}}>!</span></div>
          <div><div className="kpi-value">{admins.filter(a => a.users >= a.maxUsers).length}</div><div className="kpi-label">Limit Reached</div></div>
        </div>
      </div>

      {/* --- MAIN CONTENT CARD --- */}
      <div className="content-card">
        {/* Toolbar */}
        <div className="toolbar">
          <div className="search-box">
            <IconSearch />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="filters">
             {selectedRowIds.length > 0 && (
               <button className="btn-bulk-delete" onClick={handleDeleteSelected}>
                 <IconTrash /> Delete ({selectedRowIds.length})
               </button>
             )}
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
              <option value="All">All Roles</option>
              <option value="Senior Admin">Senior Admin</option>
              <option value="Admin">Admin</option>
              <option value="Viewer">Viewer</option>
            </select>
          </div>
        </div>

        {/* Rich Table */}
        <div className="table-responsive">
          <table className="modern-table">
            <thead>
              <tr>
                <th style={{width: '40px'}}>
                  <input 
                    type="checkbox" 
                    onChange={handleSelectAll} 
                    checked={selectedRowIds.length === paginatedAdmins.length && paginatedAdmins.length > 0} 
                  />
                </th>
                <th onClick={() => handleSort('name')} className="sortable">
                  Admin Profile <IconSort />
                </th>
                <th onClick={() => handleSort('role')} className="sortable">
                  Access Level <IconSort />
                </th>
                <th onClick={() => handleSort('users')} className="sortable">
                  Quota Usage <IconSort />
                </th>
                <th onClick={() => handleSort('status')} className="sortable">
                  Status <IconSort />
                </th>
                <th>Last Active</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {paginatedAdmins.map((admin) => (
                <tr key={admin.id} className={selectedRowIds.includes(admin.id) ? 'row-selected' : ''}>
                  <td>
                    <input 
                      type="checkbox" 
                      checked={selectedRowIds.includes(admin.id)} 
                      onChange={() => handleBulkSelect(admin.id)}
                    />
                  </td>
                  <td onClick={() => setSelectedAdmin(admin)} style={{cursor: 'pointer'}}>
                    <div className="profile-cell">
                      <div className="avatar">{admin.name.charAt(0)}</div>
                      <div className="info">
                        <span className="name">{admin.name}</span>
                        <span className="email">{admin.email}</span>
                      </div>
                    </div>
                  </td>
                  <td><span className={`role-pill ${admin.role.toLowerCase().replace(' ', '-')}`}>{admin.role}</span></td>
                  <td>
                    <div className="quota-cell">
                      <div className="quota-text">
                        <span style={{color: admin.users >= admin.maxUsers ? '#ef4444' : '#4f46e5'}}>{admin.users}</span> / {admin.maxUsers}
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="fill" 
                          style={{ 
                            width: `${(admin.users / admin.maxUsers) * 100}%`,
                            background: admin.users >= admin.maxUsers ? '#ef4444' : '#4f46e5'
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
                    <button className="btn-icon" onClick={() => setSelectedAdmin(admin)}><IconMore /></button>
                  </td>
                </tr>
              ))}
              {paginatedAdmins.length === 0 && (
                <tr>
                  <td colSpan="7" style={{textAlign: 'center', padding: '2rem'}}>No admins found matching your filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="pagination-footer">
          <span className="pagination-info">
            Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredAdmins.length)} to {Math.min(currentPage * itemsPerPage, filteredAdmins.length)} of {filteredAdmins.length}
          </span>
          <div className="pagination-btns">
            <button 
              disabled={currentPage === 1} 
              onClick={() => setCurrentPage(prev => prev - 1)}
            >
              <IconChevronLeft />
            </button>
            {Array.from({length: totalPages}, (_, i) => i + 1).map(num => (
               <button 
                 key={num} 
                 className={currentPage === num ? 'active' : ''}
                 onClick={() => setCurrentPage(num)}
               >
                 {num}
               </button>
            ))}
            <button 
              disabled={currentPage === totalPages} 
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
              <IconChevronRight />
            </button>
          </div>
        </div>
      </div>

      {/* --- DETAIL DRAWER (SLIDE OVER) --- */}
      <div className={`drawer-backdrop ${selectedAdmin ? 'open' : ''}`} onClick={() => setSelectedAdmin(null)}></div>
      <div className={`detail-drawer ${selectedAdmin ? 'open' : ''}`}>
        {selectedAdmin && (
          <>
            <div className="drawer-header">
              <h3>Admin Details</h3>
              <button className="btn-close" onClick={() => setSelectedAdmin(null)}><IconX /></button>
            </div>
            
            <div className="drawer-body">
              <div className="drawer-profile">
                <div className="big-avatar">{selectedAdmin.name.charAt(0)}</div>
                <h2>{selectedAdmin.name}</h2>
                <p>{selectedAdmin.email}</p>
                <div className="drawer-actions">
                  <button className="btn-secondary" onClick={() => showToast('Password reset email sent')}>Reset Pass</button>
                  <button className="btn-danger" onClick={() => {
                    setAdmins(prev => prev.filter(a => a.id !== selectedAdmin.id));
                    setSelectedAdmin(null);
                    showToast('Admin deleted', 'error');
                  }}>
                    Delete Admin
                  </button>
                </div>
              </div>

              <div className="drawer-section">
                <h4>Access Control</h4>
                <div className="info-row">
                  <label>Status</label>
                  <select 
                    value={selectedAdmin.status} 
                    onChange={(e) => {
                      // Update admin status logic
                      const updated = {...selectedAdmin, status: e.target.value};
                      setAdmins(prev => prev.map(a => a.id === updated.id ? updated : a));
                      setSelectedAdmin(updated);
                      showToast(`Status updated to ${e.target.value}`);
                    }}
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                    <option>Suspended</option>
                  </select>
                </div>
              </div>
              
              <div className="drawer-section">
                <h4>Quotas</h4>
                <div className="quota-card">
                  <span>Users Created</span>
                  <strong>{selectedAdmin.users} / {selectedAdmin.maxUsers}</strong>
                </div>
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
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const newAdmin = {
                id: Date.now(),
                name: formData.get('name'),
                email: formData.get('email'),
                role: 'Admin',
                users: 0,
                maxUsers: 10,
                status: 'Active',
                lastLogin: 'Never'
              };
              setAdmins([newAdmin, ...admins]);
              setShowModal(false);
              showToast('New admin created successfully');
            }}>
              <div className="form-row"><label>Name</label><input name="name" type="text" required /></div>
              <div className="form-row"><label>Email</label><input name="email" type="email" required /></div>
              <div className="modal-btns">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-confirm">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManagement;