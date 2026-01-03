import React, { useState } from "react";
import "./TrustBin.css";

const TrustBinPage = ({ user }) => {
  const userRole = user?.role?.toLowerCase() || "";

  // Mock Data
  const [deletedProjects, setDeletedProjects] = useState([{ id: 1, name: "Old Website Redesign", date: "2026-01-01" }]);
  const [deletedAdmins, setDeletedAdmins] = useState([{ id: 2, name: "John Admin", email: "john@test.com" }]);
  const [deletedUsers, setDeletedUsers] = useState([{ id: 3, name: "Sarah User", email: "sarah@user.com" }]);

  const handleRecover = (id, type) => {
    if (type === "Project") setDeletedProjects(deletedProjects.filter(p => p.id !== id));
    else if (type === "Admin") setDeletedAdmins(deletedAdmins.filter(a => a.id !== id));
    else if (type === "User") setDeletedUsers(deletedUsers.filter(u => u.id !== id));

    alert(`${type} has been successfully recovered!`);
  };

  return (
    <div className="admin-page">
      <header className="page-header">
        <div>
          <h1 className="title">Trust Bin</h1>
          <p className="subtitle">Restore deleted items to their original sections</p>
        </div>
      </header>

      {/* SUPERADMIN VIEW */}
      {userRole === "superadmin" && (
        <>
          <div className="content-card" style={{ marginBottom: "24px" }}>
            <div className="toolbar">
              <span style={{ fontWeight: 700, fontSize: "14px" }}>Deleted Projects</span>
            </div>
            <div className="table-responsive">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Project Name</th>
                    <th>Deleted Date</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {deletedProjects.length > 0 ? deletedProjects.map(proj => (
                    <tr key={proj.id}>
                      <td><span style={{ fontWeight: 600 }}>{proj.name}</span></td>
                      <td>{proj.date}</td>
                      <td style={{ textAlign: "right" }}>
                        <button onClick={() => handleRecover(proj.id, "Project")} className="btn-create" style={{ padding: "6px 12px", fontSize: "12px", display: "inline-flex" }}>Recovery</button>
                      </td>
                    </tr>
                  )) : <tr><td colSpan="3" className="empty-msg">No deleted projects found.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>

          <div className="content-card">
            <div className="toolbar">
              <span style={{ fontWeight: 700, fontSize: "14px" }}>Deleted Admins</span>
            </div>
            <div className="table-responsive">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Admin Name</th>
                    <th>Email</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {deletedAdmins.length > 0 ? deletedAdmins.map(adm => (
                    <tr key={adm.id}>
                      <td className="profile-cell">
                        <div className="avatar">{adm.name.charAt(0)}</div>
                        <div className="info"><span className="name">{adm.name}</span></div>
                      </td>
                      <td>{adm.email}</td>
                      <td style={{ textAlign: "right" }}>
                        <button onClick={() => handleRecover(adm.id, "Admin")} className="btn-create" style={{ padding: "6px 12px", fontSize: "12px", display: "inline-flex" }}>Recovery</button>
                      </td>
                    </tr>
                  )) : <tr><td colSpan="3" className="empty-msg">No deleted admins found.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ADMIN VIEW */}
      {userRole === "admin" && (
        <div className="content-card">
          <div className="toolbar">
            <span style={{ fontWeight: 700, fontSize: "14px" }}>Deleted Users</span>
          </div>
          <div className="table-responsive">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>User Details</th>
                  <th>Email Address</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {deletedUsers.length > 0 ? deletedUsers.map(u => (
                  <tr key={u.id}>
                    <td className="profile-cell">
                      <div className="avatar">{u.name.charAt(0)}</div>
                      <div className="info"><span className="name">{u.name}</span></div>
                    </td>
                    <td>{u.email}</td>
                    <td style={{ textAlign: "right" }}>
                      <button onClick={() => handleRecover(u.id, "User")} className="btn-create" style={{ padding: "6px 12px", fontSize: "12px", display: "inline-flex" }}>Recovery</button>
                    </td>
                  </tr>
                )) : <tr><td colSpan="3" className="empty-msg">No deleted users found.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrustBinPage;