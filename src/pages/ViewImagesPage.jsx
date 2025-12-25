import React, { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./view.css";

export default function ViewImagesPage({ user }) {
  const [selectedImg, setSelectedImg] = useState(null);
  const pdfRef = useRef(); // Reference for PDF generation
  
  // Data State
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Workflow Permission States
  const [isSentToAdmin, setIsSentToAdmin] = useState(() => localStorage.getItem("workflow_sent_to_admin") === "true");
  const [isSentToUser, setIsSentToUser] = useState(() => localStorage.getItem("workflow_sent_to_user") === "true");

  // App States
  const [rejectedIds, setRejectedIds] = useState([]);
  const [acceptedIds, setAcceptedIds] = useState([]); 
  const [adminSelectedIds, setAdminSelectedIds] = useState([]); 
  const [itemsRejectedByAdmin, setItemsRejectedByAdmin] = useState([]);
  
  // Notification States
  const [showNotif, setShowNotif] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Normalize Role
  const userRole = user?.role?.toLowerCase() || "";

  // 1. Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://172.18.1.25:5000/get-result");
        if (!response.ok) throw new Error("Failed to fetch images");
        const data = await response.json();
        setImages(data.images || []); 
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data from server.");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 2. Sync Local Storage
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
  const handleUnlockForAdmin = () => {
    localStorage.setItem("workflow_sent_to_admin", "true");
    setIsSentToAdmin(true);
    window.dispatchEvent(new Event("storage"));
    alert("✅ Pipeline Unlocked! Admin can now view the images.");
  };

  const handlePublishToUser = () => {
    localStorage.setItem("workflow_sent_to_user", "true");
    setIsSentToUser(true);
    window.dispatchEvent(new Event("storage"));
    alert("🚀 Live! Users can now view the gallery.");
  };

  const handleSuperAdminAction = (action, id) => {
    const strId = String(id);
    if (action === "Reject") {
      const newRejected = rejectedIds.includes(strId) ? rejectedIds : [...rejectedIds, strId];
      const newAccepted = acceptedIds.filter(i => i !== strId);
      const newAdminRejects = itemsRejectedByAdmin.filter(i => i !== strId); 
      setRejectedIds(newRejected); setAcceptedIds(newAccepted); setItemsRejectedByAdmin(newAdminRejects);
      localStorage.setItem("superadmin_rejected", JSON.stringify(newRejected));
      localStorage.setItem("superadmin_approved", JSON.stringify(newAccepted));
      localStorage.setItem("admin_rejected_ids", JSON.stringify(newAdminRejects));
    } else {
      const newAccepted = acceptedIds.includes(strId) ? acceptedIds : [...acceptedIds, strId];
      const newRejected = rejectedIds.filter(i => i !== strId);
      const newAdminRejects = itemsRejectedByAdmin.filter(i => i !== strId); 
      setAcceptedIds(newAccepted); setRejectedIds(newRejected); setItemsRejectedByAdmin(newAdminRejects);
      localStorage.setItem("superadmin_approved", JSON.stringify(newAccepted));
      localStorage.setItem("superadmin_rejected", JSON.stringify(newRejected));
      localStorage.setItem("admin_rejected_ids", JSON.stringify(newAdminRejects));
    }
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
    if (window.confirm("RESET PIPELINE? This clears all progress.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleSendToAnnotation = async () => {
    if (itemsRejectedByAdmin.length === 0) { alert("No items to send."); return; }
    setIsSending(true);
    const itemsToSend = images.filter(img => itemsRejectedByAdmin.includes(String(img.id)));

    let successCount = 0;
    for (const item of itemsToSend) {
        const payload = { image_id: String(item.id), image_url: String(item.mainImage) };
        try {
            const response = await fetch("http://172.18.1.25:5000/reject-image", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (response.ok) successCount++;
        } catch (error) { console.error(error); }
    }
    setIsSending(false);
    if (successCount > 0) {
        alert(`🚀 Success! Sent ${successCount} items.`);
        setItemsRejectedByAdmin([]);
        localStorage.removeItem("admin_rejected_ids");
        setShowNotif(false);
    } else {
        alert("❌ Failed to send items.");
    }
  };

  // --- PDF GENERATION ---
  const handleDownloadPDF = async () => {
    const input = pdfRef.current;
    if (!input) return;

    setIsGeneratingPdf(true);
    try {
        const canvas = await html2canvas(input, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL("image/png");
        
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("Detection_Report.pdf");
        alert("✅ Report downloaded successfully!");
    } catch (err) {
        console.error("PDF Error:", err);
        alert("❌ Failed to generate PDF.");
    } finally {
        setIsGeneratingPdf(false);
    }
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

  const allAccepted = images.length > 0 && acceptedIds.length === images.length;

  return (
    <div className="view-page-wrapper">
      <div className="view-header">
        <div className="header-top-row">
            <h1 className="page-title">Data Pipeline</h1>
            
            <div className="header-actions">
                {/* PDF BUTTON FOR ADMIN & USER */}
                {(userRole === "admin" || userRole === "user") && (
                    <button 
                        className="debug-reset-btn" 
                        onClick={handleDownloadPDF} 
                        style={{ background: "#e0f2fe", color: "#0284c7", border: "1px solid #0ea5e9", marginRight: "10px" }}
                        disabled={isGeneratingPdf}
                    >
                        {isGeneratingPdf ? "Generating..." : "📥 Report"}
                    </button>
                )}

                {/* SUPER ADMIN ACTIONS */}
                {userRole === "superadmin" && (
                    <>
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
                                ))
                                }
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
                        <button className="debug-reset-btn" onClick={resetSystem}>Reset</button>
                    </>
                )}
            </div>
        </div>
        <p className="page-desc">Viewing as: <strong>{user.role}</strong></p>
      </div>

      {/* ATTACH REF HERE FOR PDF */}
      <div className="results-list" ref={pdfRef}>
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
                  </div>
                  <div className="result-details">
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
                    <div className="det-footer">{getStatusBadge(item.id)}</div>
                  </div>
                </div>

                {userRole === "superadmin" && (
                  <div className="superadmin-button-container">
                    <button className={`action-btn-outline accept ${acceptedIds.includes(String(item.id)) ? "active-choice" : ""}`} onClick={() => handleSuperAdminAction("Accept", item.id)}>Accept</button>
                    <button className={`action-btn-outline reject ${rejectedIds.includes(String(item.id)) ? "active-choice" : ""}`} onClick={() => handleSuperAdminAction("Reject", item.id)}>Reject</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="final-submit-wrapper">
        {userRole === "superadmin" && allAccepted && !isSentToAdmin && (
            <button className="global-submit-btn superadmin-theme" onClick={handleUnlockForAdmin}>
                🔓 Unlock for Admin
            </button>
        )}
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