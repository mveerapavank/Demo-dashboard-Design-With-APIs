import React, { useState, useEffect } from "react";
import imageData from "../data/imageData.json"; 
import "./view.css";

export default function ViewImagesPage({ user }) {
  const [selectedImg, setSelectedImg] = useState(null);
  const [rejectedIds, setRejectedIds] = useState([]);
  const [acceptedIds, setAcceptedIds] = useState([]); 
  const [adminSelectedIds, setAdminSelectedIds] = useState([]); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [superAdminSubmitted, setSuperAdminSubmitted] = useState(false);
  const [isPublishedToUser, setIsPublishedToUser] = useState(false);

  useEffect(() => {
    // Load states and parse them to actual booleans
    const loadStates = () => {
      const approved = JSON.parse(localStorage.getItem("superadmin_approved") || "[]");
      const submitted = localStorage.getItem("data_sent_to_admin") === "true";
      const published = localStorage.getItem("data_published_to_user") === "true";
      
      setAcceptedIds(approved);
      setSuperAdminSubmitted(submitted);
      setIsPublishedToUser(published);
    };

    // Load on mount
    loadStates();

    // Listen for storage changes from other tabs
    const handleStorageChange = () => {
      loadStates();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // --- SUPER ADMIN LOGIC ---
  const handleSuperAdminAction = (action, id) => {
    if (action === "Reject") {
      setRejectedIds((prev) => {
        // Toggle: if already rejected, remove it; otherwise add it
        if (prev.includes(id)) {
          return prev.filter(item => item !== id);
        } else {
          return [...prev, id];
        }
      });
      // Remove from accepted when rejecting
      setAcceptedIds((prev) => {
        const updated = prev.filter(item => item !== id);
        localStorage.setItem("superadmin_approved", JSON.stringify(updated));
        return updated;
      });
    } else {
      setAcceptedIds((prev) => {
        // Toggle: if already accepted, remove it; otherwise add it
        if (prev.includes(id)) {
          const updated = prev.filter(item => item !== id);
          localStorage.setItem("superadmin_approved", JSON.stringify(updated));
          return updated;
        } else {
          const updated = [...prev, id];
          localStorage.setItem("superadmin_approved", JSON.stringify(updated));
          return updated;
        }
      });
      // Remove from rejected when accepting
      setRejectedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  const handleFinalSubmitToAdmin = () => {
    localStorage.setItem("data_sent_to_admin", "true");
    setSuperAdminSubmitted(true);
    alert("✅ Dataset verified and submitted to the Admin panel.");
    // No need to reload - storage event listener will sync other tabs
  };

  // --- ADMIN PUBLISH LOGIC ---
  const handlePublishToUser = () => {
    localStorage.setItem("data_published_to_user", "true");
    setIsPublishedToUser(true);
    alert("🚀 Data published! Users can now view the gallery.");
    // No need to reload - storage event listener will sync other tabs
  };

  const submitRejections = async () => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert("Rejections processed.");
      setRejectedIds([]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdminCheckbox = (id) => {
    setAdminSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const submitToSuperAdmin = () => {
    const selectedData = imageData.images.filter(img => adminSelectedIds.includes(img.id));
    const existing = JSON.parse(localStorage.getItem("superadmin_notifications") || "[]");
    localStorage.setItem("superadmin_notifications", JSON.stringify([...existing, ...selectedData]));
    alert(`Sent ${adminSelectedIds.length} items to Super Admin.`);
    setAdminSelectedIds([]);
  };

  // --- LOGIC: CHECK IF ALL ARE APPROVED ---
  const allApprovedBySuper = imageData.images.length > 0 && 
                             imageData.images.every(img => acceptedIds.includes(img.id));
  
  // Debug: Log the state
  useEffect(() => {
    console.log("Accepted IDs:", acceptedIds);
    console.log("Image IDs:", imageData.images.map(img => img.id));
    console.log("All Approved:", allApprovedBySuper);
  }, [acceptedIds]);

  // --- FILTERING LOGIC: CORRECTED ---
  const filteredImages = imageData.images.filter((item) => {
    // 1. Super Admin sees everything
    if (user.role === "superadmin") return true; 

    // 2. Admin sees images ONLY if superAdminSubmitted is true
    if (user.role === "admin") return superAdminSubmitted === true;

    // 3. User sees images ONLY if isPublishedToUser is true
    if (user.role === "user") return isPublishedToUser === true;

    return false;
  });

  return (
    <div className="view-page-wrapper">
      <div className="view-header">
        <h1 className="page-title">
          {user.role === "user" ? "Public Gallery" : "Data Verification Pipeline"}
        </h1>
        <p className="page-desc">
          {user.role === "superadmin" && "Verify all data cards to release them to Admin."}
          {user.role === "admin" && "Dataset verified by Super Admin. Review and Publish for Users."}
          {user.role === "user" && "Viewing verified high-quality data."}
        </p>
      </div>

      <div className="results-list">
        {filteredImages.length === 0 ? (
          <div className="empty-pipeline">
            <div className="empty-icon">🔒</div>
            <h2>Access Restricted</h2>
            <p>
              {user.role === "admin" 
                ? "The Admin panel is locked until the Super Admin submits the verified dataset." 
                : "The gallery is currently being updated."}
            </p>
          </div>
        ) : (
          filteredImages.map((item) => (
            <div className="card-outer-wrapper" key={item.id}>
              <div className="card-and-check">
                {user.role === "admin" && (
                  <div className="selection-area">
                    <input 
                      type="checkbox" 
                      className="card-checkbox"
                      checked={adminSelectedIds.includes(item.id)}
                      onChange={() => handleAdminCheckbox(item.id)}
                    />
                  </div>
                )}

                <div className={`result-card ${rejectedIds.includes(item.id) ? "card-rejected" : ""} ${adminSelectedIds.includes(item.id) ? "card-selected-admin" : ""}`}>
                  <div className="card-main-content">
                    <div className="result-image-container" onClick={() => setSelectedImg(item.mainImage)}>
                      <img src={item.mainImage} alt="" className="result-img" />
                      <div className="zoom-hint">Click to expand 🔍</div>
                    </div>
                    
                    <div className="result-details">
                      <div className="top-meta">
                        <span className={`badge-status ${acceptedIds.includes(item.id) ? "verified-badge" : ""}`}>
                          {acceptedIds.includes(item.id) ? "Verified" : `ID: ${item.id}`}
                        </span>
                        <h2 className="card-side-title">{item.cardTitle}</h2>
                        <div className="meta-info-mini">
                          <div className="mini-block">
                            <span className="detail-label">Location</span>
                            <span className="detail-value">{item.meta.location}</span>
                          </div>
                        </div>
                      </div>
                      <div className="bottom-meta">
                        <div className="metrics-group">
                          <span className="detail-label">{item.sectionTitle}</span>
                          <div className="metrics-grid">
                            {item.metrics.map(m => (
                              <div key={m.id} className="metric-row">
                                <span className="m-label">{m.label}</span>
                                <span className="m-value">{m.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {user.role === "superadmin" && (
                    <div className="superadmin-button-container">
                      <button 
                        className={`action-btn-outline accept ${acceptedIds.includes(item.id) ? "active-choice" : ""}`} 
                        onClick={() => handleSuperAdminAction("Accept", item.id)}
                      >
                        {acceptedIds.includes(item.id) ? "Accepted" : "Accept"}
                      </button>
                      <button 
                        className={`action-btn-outline reject ${rejectedIds.includes(item.id) ? "active-choice" : ""}`} 
                        onClick={() => handleSuperAdminAction("Reject", item.id)}
                      >
                        {rejectedIds.includes(item.id) ? "Rejected" : "Reject"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="final-submit-wrapper">
        {/* SUPER ADMIN: SUBMIT TO ADMIN */}
        {user.role === "superadmin" && allApprovedBySuper && !superAdminSubmitted && (
          <button className="global-submit-btn superadmin-theme" onClick={handleFinalSubmitToAdmin}>
            Submit to Admin
          </button>
        )}

        {/* ADMIN: PUBLISH TO USER */}
        {user.role === "admin" && superAdminSubmitted && !isPublishedToUser && (
          <button className="global-submit-btn admin-theme" onClick={handlePublishToUser}>
            Publish to User View
          </button>
        )}

        {/* ADMIN: SEND BACK TO SUPER ADMIN */}
        {user.role === "admin" && adminSelectedIds.length > 0 && (
          <button className="global-submit-btn admin-theme" onClick={submitToSuperAdmin}>
            Send {adminSelectedIds.length} to Super Admin
          </button>
        )}
      </div>

      {selectedImg && (
        <div className="image-modal-overlay" onClick={() => setSelectedImg(null)}>
          <span className="close-modal">&times;</span>
          <img src={selectedImg} className="modal-content-img" alt="" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}