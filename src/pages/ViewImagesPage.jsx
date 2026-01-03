import React, { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./view.css";

export default function ViewImagesPage({ user }) {
  const [selectedImg, setSelectedImg] = useState(null);
  const reportRef = useRef(); 
  
  // Data State
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Workflow States
  const [isSentToAdmin, setIsSentToAdmin] = useState(() => localStorage.getItem("workflow_sent_to_admin") === "true");
  const [isSentToUser, setIsSentToUser] = useState(() => localStorage.getItem("workflow_sent_to_user") === "true");

  // Selection States
  const [rejectedIds, setRejectedIds] = useState([]);
  const [acceptedIds, setAcceptedIds] = useState([]); 
  const [adminSelectedIds, setAdminSelectedIds] = useState([]); 
  const [itemsRejectedByAdmin, setItemsRejectedByAdmin] = useState([]);
  
  // UI States
  const [showNotif, setShowNotif] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Role Normalization
  const userRole = user?.role?.toLowerCase()?.trim() || "";

  // 1. FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://172.18.1.35:5000/get-result");
        if (!response.ok) throw new Error("Failed to fetch images");
        const data = await response.json();
        setImages(data.images || []); 
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Is the backend running?");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 2. SYNC LOCAL STORAGE
  useEffect(() => {
    const loadStates = () => {
      const approved = JSON.parse(localStorage.getItem("superadmin_approved") || "[]").map(String);
      const rejected = JSON.parse(localStorage.getItem("superadmin_rejected") || "[]").map(String);
      const adminRejects = JSON.parse(localStorage.getItem("admin_rejected_ids") || "[]").map(String);
      
      const sentToAdmin = localStorage.getItem("workflow_sent_to_admin") === "true";
      const sentToUser = localStorage.getItem("workflow_sent_to_user") === "true";

      setAcceptedIds(approved);
      setRejectedIds(rejected);
      setItemsRejectedByAdmin(adminRejects);
      setIsSentToAdmin(sentToAdmin);
      setIsSentToUser(sentToUser);
    };

    loadStates();
    window.addEventListener("storage", loadStates);
    return () => window.removeEventListener("storage", loadStates);
  }, []);

  // --- ACTIONS ---

  // UNLOCK (Super Admin -> Admin)
  const handleUnlockForAdmin = () => {
    localStorage.setItem("workflow_sent_to_admin", "true");
    setIsSentToAdmin(true);
    window.dispatchEvent(new Event("storage"));
    alert("✅ Pipeline Unlocked! Admin can now view the images.");
  };

  // RE-LOCK (For Testing/Resetting)
  const handleReLockPipeline = () => {
    localStorage.setItem("workflow_sent_to_admin", "false");
    setIsSentToAdmin(false);
    
    // Also reset User publish state to be safe
    localStorage.setItem("workflow_sent_to_user", "false");
    setIsSentToUser(false);

    window.dispatchEvent(new Event("storage"));
    alert("🔒 Pipeline LOCKED. Admin can no longer see images.");
  };

  // PUBLISH (Admin -> User)
  const handlePublishToUser = () => {
    localStorage.setItem("workflow_sent_to_user", "true");
    setIsSentToUser(true);
    window.dispatchEvent(new Event("storage"));
    alert("🚀 Live! Users can now view the gallery.");
  };

  // SUPER ADMIN ACCEPT/REJECT
  const handleSuperAdminAction = (action, id) => {
    const strId = String(id);
    let newAccepted = [...acceptedIds];
    let newRejected = [...rejectedIds];
    let newAdminRejects = [...itemsRejectedByAdmin];

    if (action === "Accept") {
      if (newAccepted.includes(strId)) {
        newAccepted = newAccepted.filter(i => i !== strId); // Toggle Off
      } else {
        newAccepted.push(strId);
        newRejected = newRejected.filter(i => i !== strId);
        newAdminRejects = newAdminRejects.filter(i => i !== strId); 
      }
    } 
    else if (action === "Reject") {
      if (newRejected.includes(strId)) {
        newRejected = newRejected.filter(i => i !== strId); // Toggle Off
        newAdminRejects = newAdminRejects.filter(i => i !== strId);
      } else {
        newRejected.push(strId);
        newAccepted = newAccepted.filter(i => i !== strId);
      }
    }

    setAcceptedIds(newAccepted);
    setRejectedIds(newRejected);
    setItemsRejectedByAdmin(newAdminRejects);
    
    localStorage.setItem("superadmin_approved", JSON.stringify(newAccepted));
    localStorage.setItem("superadmin_rejected", JSON.stringify(newRejected));
    localStorage.setItem("admin_rejected_ids", JSON.stringify(newAdminRejects));
  };

  const handleAdminCheckbox = (id) => {
    setAdminSelectedIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  };

  const submitToSuperAdmin = () => {
    const currentRejects = JSON.parse(localStorage.getItem("admin_rejected_ids") || "[]");
    const updatedRejects = [...new Set([...currentRejects, ...adminSelectedIds.map(String)])];
    localStorage.setItem("admin_rejected_ids", JSON.stringify(updatedRejects));
    setItemsRejectedByAdmin(updatedRejects);
    window.dispatchEvent(new Event("storage")); 
    alert(`✅ Sent ${adminSelectedIds.length} items back to Super Admin.`);
    setAdminSelectedIds([]);
  };

  const resetSystem = () => {
    if (window.confirm("RESET EVERYTHING? This clears all approvals and locks.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  // --- API CALLS ---
  const handleSendToAnnotation = async () => {
    await sendIdsToAnnotationAPI(itemsRejectedByAdmin, () => {
        setItemsRejectedByAdmin([]);
        localStorage.removeItem("admin_rejected_ids");
        setShowNotif(false);
    });
  };

  const handleSuperAdminSendRejections = async () => {
    await sendIdsToAnnotationAPI(rejectedIds, () => {
        setRejectedIds([]);
        localStorage.removeItem("superadmin_rejected");
    });
  };

  const sendIdsToAnnotationAPI = async (idList, onSuccessCallback) => {
    if (idList.length === 0) { alert("No items to send."); return; }
    setIsSending(true);
    
    const itemsToSend = images.filter(img => idList.includes(String(img.id)));
    let successCount = 0;
    
    for (const item of itemsToSend) {
        const payload = { image_id: String(item.id), image_url: String(item.mainImage) };
        try {
            const response = await fetch("http://172.18.1.35:5000/reject-image", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (response.ok) successCount++;
        } catch (error) { console.error(error); }
    }
    setIsSending(false);
    if (successCount > 0) {
        alert(`🚀 Success! Sent ${successCount} items to Annotation Team.`);
        if (onSuccessCallback) onSuccessCallback();
    } else {
        alert("❌ Failed to send items. Check console.");
    }
  };

  // --- PDF ---
  const handleDownloadPDF = async () => {
    const container = reportRef.current;
    if (!container) return;
    setIsGeneratingPdf(true);
    try {
        const pdf = new jsPDF("p", "mm", "a4");
        const items = container.querySelectorAll('.print-item');
        for (let i = 0; i < items.length; i++) {
            const canvas = await html2canvas(items[i], { scale: 2, useCORS: true });
            const imgData = canvas.toDataURL("image/png");
            const imgWidth = 210; 
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            if (i > 0) pdf.addPage();
            pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
        }
        pdf.save("Detection_Report.pdf");
        alert("✅ Report downloaded!");
    } catch (err) { console.error(err); alert("❌ PDF Error"); } 
    finally { setIsGeneratingPdf(false); }
  };

  // --- Helpers ---
  const getNotificationItems = () => images.filter(img => itemsRejectedByAdmin.includes(String(img.id)));
  const getCardClass = (itemId) => {
    const strId = String(itemId);
    if (itemsRejectedByAdmin.includes(strId)) return "card-admin-rejected";
    if (rejectedIds.includes(strId)) return "card-rejected";
    return "";
  };
  const getStatusBadge = (itemId) => {
    const strId = String(itemId);
    if (itemsRejectedByAdmin.includes(strId)) return <span className="status-pill pill-admin-reject">Rejected by Admin</span>;
    if (acceptedIds.includes(strId)) return <span className="status-pill pill-success">Verified</span>;
    if (rejectedIds.includes(strId)) return <span className="status-pill pill-danger">Rejected</span>;
    return <span className="status-pill pill-neutral">Pending Review</span>;
  };

  // --- RENDER GUARDS ---
  if (loading) return <div className="loading-screen">Loading Data...</div>;
  if (error) return <div className="error-screen">{error}</div>;

  // 1. ADMIN LOCK SCREEN
  if (userRole === "admin" && !isSentToAdmin) {
    return (
        <div className="view-page-wrapper">
            <div className="empty-pipeline">
                <div className="empty-icon">🚧</div>
                <h2>Pipeline Processing</h2>
                <p>Super Admin has not unlocked the data yet.</p>
                <button className="debug-reset-btn" onClick={() => window.location.reload()} style={{marginTop:'20px'}}>Check Again</button>
            </div>
        </div>
    );
  }

  // 2. USER LOCK SCREEN
  if (userRole === "user" && !isSentToUser) {
    return (
        <div className="view-page-wrapper">
            <div className="empty-pipeline">
                <div className="empty-icon">⏳</div>
                <h2>Gallery Locked</h2>
                <p>The images are currently under review by the Admin team.</p>
            </div>
        </div>
    );
  }

  // Calculate if All Visible Images are Accepted
  const allAccepted = images.length > 0 && images.every(img => acceptedIds.includes(String(img.id)));

  return (
    <div className="view-page-wrapper">
      <div className="view-header">
        <div className="header-top-row">
            <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
                <h1 className="page-title">Images View</h1>
                {/* Status Indicator */}
                {userRole === "superadmin" && (
                    <span style={{ fontSize: '12px', fontWeight: 'bold', padding: '5px 10px', borderRadius: '4px', background: isSentToAdmin ? '#dcfce7' : '#fee2e2', color: isSentToAdmin ? '#166534' : '#991b1b' }}>
                        {isSentToAdmin ? "STATUS: UNLOCKED" : "STATUS: LOCKED"}
                    </span>
                )}
            </div>
            
            <div className="header-actions">
                {/* REPORT BUTTON - Now visible for Super Admin too */}
                <button 
                    className="debug-reset-btn" 
                    onClick={handleDownloadPDF} 
                    disabled={isGeneratingPdf} 
                    style={{ background: "#e0f2fe", color: "#0284c7", border: "1px solid #0ea5e9", marginRight: "10px" }}
                >
                    {isGeneratingPdf ? "Generating..." : "📥 Report"}
                </button>

                {userRole === "superadmin" && (
                    <>
                        {/* --- RE-LOCK BUTTON FOR TESTING --- */}
                        {isSentToAdmin && (
                             <button className="debug-reset-btn" onClick={handleReLockPipeline} style={{background: '#fef3c7', color: '#b45309', border: '1px solid #f59e0b', marginRight: '10px'}}>
                                🔒 Re-Lock Pipeline
                             </button>
                        )}

                        <div className="notif-wrapper">
                            <button className="notif-bell-btn" onClick={() => setShowNotif(!showNotif)}>
                                🔔 {itemsRejectedByAdmin.length > 0 && <span className="notif-badge-count">{itemsRejectedByAdmin.length}</span>}
                            </button>
                            {showNotif && (
                                <div className="notif-dropdown">
                                    <div className="notif-dd-header">
                                        <span>Admin Rejections</span>
                                        <button className="close-dd" onClick={() => setShowNotif(false)}>×</button>
                                    </div>
                                    <div className="notif-dd-body">
                                        {itemsRejectedByAdmin.length === 0 ? <p className="empty-notif">No pending rejections.</p> : 
                                        getNotificationItems().map(item => (
                                            <div key={item.id} className="notif-dd-item">
                                                <span className="notif-item-title">{item.cardTitle}</span>
                                                <span className="notif-item-id">ID: {item.id}</span>
                                            </div>
                                        ))}
                                    </div>
                                    {itemsRejectedByAdmin.length > 0 && (
                                        <div className="notif-dd-footer">
                                            <button className="send-annotation-btn" onClick={handleSendToAnnotation} disabled={isSending}>
                                                {isSending ? "Sending..." : "Send to Annotation Team"}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <button className="debug-reset-btn" onClick={resetSystem} style={{marginLeft:'10px'}}>Reset All</button>
                    </>
                )}
            </div>
        </div>
        <p className="page-desc">Viewing as: <strong>{user.role}</strong></p>
      </div>

      <div className="results-list">
        {images.map((item) => (
          <div className="card-outer-wrapper" key={item.id}>
            <div className="card-and-check">
              {userRole === "admin" && (
                <div className="selection-area">
                  <input type="checkbox" className="card-checkbox" checked={adminSelectedIds.includes(item.id)} onChange={() => handleAdminCheckbox(item.id)} />
                </div>
              )}
              <div className={`result-card ${getCardClass(item.id)}`}>
                <div className="card-main-content">
                  <div className="result-image-container" onClick={() => setSelectedImg(item.mainImage)}>
                    <img src={item.mainImage} alt="" className="result-img" />
                    <div className="zoom-hint">Click to Zoom</div>
                  </div>
                  <div className="result-details">
                    <div>
                        <div className="det-header">
                            <h2 className="det-title">{item.cardTitle || "Result"}</h2>
                            <div className="det-meta-row">
                                <span className="det-meta-item">🗓️ {item.meta?.date || "N/A"}</span>
                                <span className="det-meta-item">📍 {item.meta?.location || "Lab"}</span>
                            </div>
                        </div>
                        <div className="det-stats-section">
                            <h3 className="stats-heading">{item.sectionTitle || "Statistics"}</h3>
                            <div className="stats-stack">
                                {item.metrics && item.metrics.map((metric, idx) => (
                                <div key={idx} className="stat-box-dark">
                                    <span className="sb-label">{metric.label}</span>
                                    <span className="sb-value">{metric.value}</span>
                                </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="det-footer">{getStatusBadge(item.id)}</div>
                  </div>
                </div>
                {userRole === "superadmin" && (
                  <div className="superadmin-button-container">
                    <button className={`action-btn-outline accept ${acceptedIds.includes(String(item.id)) ? "active-choice" : ""}`} onClick={() => handleSuperAdminAction("Accept", item.id)}>
                        {acceptedIds.includes(String(item.id)) ? "Accepted" : "Accept"}
                    </button>
                    <button className={`action-btn-outline reject ${rejectedIds.includes(String(item.id)) ? "active-choice" : ""}`} onClick={() => handleSuperAdminAction("Reject", item.id)}>
                        {rejectedIds.includes(String(item.id)) ? "Rejected" : "Reject"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* PDF HIDDEN TEMPLATE */}
      <div id="print-container" ref={reportRef}>
        {images.map((item) => (
            <div key={item.id} className="print-item">
                <div className="print-image-box">
                    <img src={item.mainImage} alt="Report" className="print-img" />
                </div>
                <div className="print-table-box">
                    <h3 className="print-title">{item.cardTitle} (ID: {item.id})</h3>
                    <table className="report-table">
                        <thead><tr><th>Parameter</th><th>Value</th></tr></thead>
                        <tbody>
                            <tr><td>Date</td><td>{item.meta?.date}</td></tr>
                            <tr><td>Location</td><td>{item.meta?.location}</td></tr>
                            {item.metrics?.map((m, i) => (<tr key={i}><td>{m.label}</td><td>{m.value}</td></tr>))}
                        </tbody>
                    </table>
                </div>
            </div>
        ))}
      </div>

      <div className="final-submit-wrapper">
        {/* BUTTON: Unlock for Admin (Only if SuperAdmin + All Accepted + Locked) */}
        {userRole === "superadmin" && allAccepted && !isSentToAdmin && (
            <button className="global-submit-btn superadmin-theme" onClick={handleUnlockForAdmin}>
                🔓 Unlock for Admin
            </button>
        )}
        
        {userRole === "superadmin" && rejectedIds.length > 0 && (
            <button className="global-submit-btn reject-theme" onClick={handleSuperAdminSendRejections} disabled={isSending}>
                {isSending ? "Sending..." : `Send ${rejectedIds.length} Rejected to Annotation Team`}
            </button>
        )}
        
        {/* MESSAGE: Tell user what to do if locked */}
        {userRole === "superadmin" && !allAccepted && !isSentToAdmin && rejectedIds.length === 0 && (
            <div className="pipeline-status-msg">⚠️ Accept all images to unlock Admin view</div>
        )}

        {/* ADMIN ACTIONS */}
        {userRole === "admin" && adminSelectedIds.length > 0 && (
          <button className="global-submit-btn reject-theme" onClick={submitToSuperAdmin}>
            Return {adminSelectedIds.length} to Super Admin
          </button>
        )}
        {userRole === "admin" && !isSentToUser && adminSelectedIds.length === 0 && (
           <button className="global-submit-btn admin-theme" onClick={handlePublishToUser}>
             🚀 Publish to User
           </button>
        )}
      </div>

      {selectedImg && (
        <div className="image-modal-overlay" onClick={() => setSelectedImg(null)}>
          <button className="close-modal">×</button>
          <img src={selectedImg} className="modal-content-img" alt="" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}