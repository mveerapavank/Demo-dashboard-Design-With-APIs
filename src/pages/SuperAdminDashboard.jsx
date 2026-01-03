import React, { useState } from "react";
import { Bell, MapPin, Search, ExternalLink, CheckCircle, Clock, Layout, AlertTriangle, X, Upload, Users, Eye, Plus, ArrowLeft } from "lucide-react"; 
import "./SuperAdminDashboard.css";

const SuperAdminDashboard = () => {
  // 1. Industries (The 6 main categories)
  const industries = [
    { id: "IND01", name: "Smart City Monitoring", img: "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=500" },
    { id: "IND02", name: "Logistic and Warehouse", img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=500" },
    { id: "IND03", name: "Mining and Cementery", img: "https://images.unsplash.com/photo-1578319439584-104c94d37305?q=80&w=500" },
    { id: "IND04", name: "Energy and Utilities", img: "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=500" },
    { id: "IND05", name: "Surveillance and Security", img: "https://images.unsplash.com/photo-1557597774-9d2739f8fa00?q=80&w=500" },
    { id: "IND06", name: "Forest and Environment", img: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=500" },
  ];

  // 2. Client Projects Data (Example: 3 projects per Industry/Client)
  const [allProjects, setAllProjects] = useState([
    { id: "P001", name: "Traffic Flow AI", industryId: "IND01", clientId: "AWS", location: "Bangalore", img: "https://images.unsplash.com/photo-1545147986-a9d6f210df77?q=80&w=500" },
    { id: "P002", name: "Smart Grid Hub", industryId: "IND01", clientId: "Google Cloud", location: "Pune", img: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=500" },
    { id: "P003", name: "CCTV Analytics", industryId: "IND01", clientId: "Microsoft", location: "Delhi", img: "https://images.unsplash.com/photo-1557597774-9d2739f8fa00?q=80&w=500" },
    { id: "P004", name: "Inventory Bot", industryId: "IND02", clientId: "AWS", location: "Mumbai", img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=500" },
  ]);

  const [clients, setClients] = useState([
    { name: "AWS", logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" },
    { name: "T-Hub", logo: "https://t-hub.co/wp-content/uploads/2022/06/Logo.png" },
    { name: "Maruti Suzuki", logo: "https://upload.wikimedia.org/wikipedia/commons/1/12/Suzuki_logo_2.svg" },
    { name: "Google Cloud", logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg" },
    { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" },
    { name: "Intel", logo: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Intel-logo.svg" }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all"); 
  const [selectedView, setSelectedView] = useState({ type: null, id: null, title: "" }); 

  // --- Filtering Logic ---
  // 1. Filter Industries and Clients for the main dashboard
  const filteredIndustries = industries.filter(ind => ind.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredClients = clients.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // 2. Filter Projects when inside an Industry or Client view
  const projectList = allProjects.filter(proj => {
    const matchesSearch = proj.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (selectedView.type === "industry") return matchesSearch && proj.industryId === selectedView.id;
    if (selectedView.type === "client") return matchesSearch && proj.clientId === selectedView.id;
    return matchesSearch;
  });

  return (
    <div className="admin-page dashboard-wrapper">
      {/* Top Utility Bar */}
      <div className="top-utility-bar">
        <div className="search-pill-container">
          <div className="search-inner-wrapper">
            <Search size={18} className="search-icon-inside" />
            <input 
              type="text" 
              placeholder={selectedView.type ? `Search in ${selectedView.title}...` : "Search industries or clients..."}
              className="search-input-clean"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="header-right-tools">
          <div className="bell-wrapper">
            <span className="notif-dot-active"></span>
            <Bell size={28} className="bell-icon-large" />
          </div>
        </div>
      </div>

      <header className="page-header-row">
        <h1 className="main-title">
          {selectedView.type ? (
            <div className="back-button" onClick={() => setSelectedView({ type: null, id: null, title: "" })}>
               <ArrowLeft size={24} /> {selectedView.title}
            </div>
          ) : "SuperAdmin Dashboard"}
        </h1>
      </header>

      {!selectedView.type && (
        <>
          {/* KPI GRID */}
          <div className="kpi-white-grid">
            <div className="kpi-card-white">
              <div className="kpi-info"><span className="kpi-label">Active Tasks</span><span className="kpi-number">24</span></div>
              <div className="kpi-icon-pill blue-light-bg"><Clock size={24} /></div>
            </div>
            <div className="kpi-card-white">
              <div className="kpi-info"><span className="kpi-label">Industries</span><span className="kpi-number">{industries.length}</span></div>
              <div className="kpi-icon-pill purple-light-bg"><Layout size={24} /></div>
            </div>
            <div className="kpi-card-white">
              <div className="kpi-info"><span className="kpi-label">Active Clients</span><span className="kpi-number">{clients.length}</span></div>
              <div className="kpi-icon-pill green-light-bg"><Users size={24} /></div>
            </div>
            <div className="kpi-card-white">
              <div className="kpi-info"><span className="kpi-label">Active Alerts</span><span className="kpi-number">03</span></div>
              <div className="kpi-icon-pill red-light-bg"><AlertTriangle size={24} /></div>
            </div>
          </div>

          {/* CATEGORY FILTER TABS */}
          <div className="category-tabs-container">
            <button className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>All Overview</button>
            <button className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => setActiveTab('projects')}>Industries Only</button>
            <button className={`tab-btn ${activeTab === 'clients' ? 'active' : ''}`} onClick={() => setActiveTab('clients')}>Clients Only</button>
          </div>

          {/* CLIENT SECTION */}
          {(activeTab === 'all' || activeTab === 'clients') && (
            <div className="client-management-wrapper">
              <h2 className="section-title">Client Management</h2>
              <div className="client-logo-grid">
                {filteredClients.map((client, index) => (
                  <div className="client-card clickable" key={index} onClick={() => setSelectedView({ type: "client", id: client.name, title: client.name })}>
                    <div className="client-logo-wrapper">
                      <img src={client.logo} alt={client.name} className="client-logo-img" />
                    </div>
                    <div className="client-details">
                      <span className="client-name-text">{client.name}</span>
                      <span className="client-status-tag">View Projects</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* INDUSTRIES SECTION */}
          {(activeTab === 'all' || activeTab === 'projects') && (
            <div className="project-management-wrapper">
              <h2 className="section-title">Industries</h2>
              <div className="project-grid-row">
                {filteredIndustries.map((ind) => (
                  <div className="project-card-item" key={ind.id}>
                    <div className="card-thumb"><img src={ind.img} alt={ind.name} /></div>
                    <div className="card-info">
                      <h3>{ind.name}</h3>
                      <button className="view-projects-btn secondary-btn" onClick={() => setSelectedView({ type: "industry", id: ind.id, title: ind.name })}>
                        <Eye size={14} /> View Projects
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* DETAILED PROJECT VIEW (Triggered when Industry or Client is clicked) */}
      {selectedView.type && (
        <div className="project-management-wrapper">
          <h2 className="section-title">Showing Projects for: {selectedView.title}</h2>
          <div className="project-grid-row">
            {projectList.length > 0 ? (
              projectList.map((proj) => (
                <div className="project-card-item" key={proj.id}>
                  <div className="card-thumb"><img src={proj.img} alt={proj.name} /></div>
                  <div className="card-info">
                    <h3>{proj.name}</h3>
                    <div className="loc"><MapPin size={14} /> {proj.location}</div>
                    <button className="view-details-btn primary-btn">View Full Details <ExternalLink size={14} /></button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results-text">No projects found for this selection.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard;