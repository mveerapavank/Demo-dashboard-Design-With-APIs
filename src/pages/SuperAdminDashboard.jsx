import React, { useState } from "react";
import { Bell, MapPin, Search, ExternalLink, CheckCircle, Clock, Layout, AlertTriangle, X, Upload, Users, Eye, Plus, ArrowLeft, ChevronDown } from "lucide-react"; 
import "./SuperAdminDashboard.css";

const SuperAdminDashboard = () => {
  // 1. Industries State
  const [industries, setIndustries] = useState([
    { id: "IND01", name: "Smart City Monitoring", img: "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=500" },
    { id: "IND02", name: "Logistic and Warehouse", img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=500" },
    { id: "IND03", name: "Mining and Cementery", img: "https://images.unsplash.com/photo-1578319439584-104c94d37305?q=80&w=500" },
    { id: "IND04", name: "Energy and Utilities", img: "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=500" },
    { id: "IND05", name: "Surveillance and Security", img: "https://cdn.pixabay.com/photo/2024/06/23/11/09/ai-generated-8847961_1280.png" },
    { id: "IND06", name: "Forest and Environment", img: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=500" },
  ]);

  // 2. Projects State with Dates
  const [allProjects, setAllProjects] = useState([
    { id: "P001", name: "Traffic Flow AI", industryId: "IND01", clientId: "AWS", location: "Bangalore", img: "https://images.unsplash.com/photo-1545147986-a9d6f210df77?q=80&w=500", date: "2024-01-01" },
    { id: "P002", name: "Smart Grid Hub", industryId: "IND01", clientId: "Google Cloud", location: "Pune", img: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=500", date: "2023-12-15" },
    { id: "P004", name: "Inventory Bot", industryId: "IND02", clientId: "AWS", location: "Mumbai", img: "https://images.unsplash.com/photo-1519003722824-191d440bd502?q=80&w=500", date: "2024-01-04" },
  ]);

  // 3. Clients State
  const [clients, setClients] = useState([
    { name: "AWS", logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" },
    { name: "T-Hub", logo: "https://t-hub.co/wp-content/uploads/2022/06/Logo.png" },
    { name: "Maruti Suzuki", logo: "https://upload.wikimedia.org/wikipedia/commons/1/12/Suzuki_logo_2.svg" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all"); 
  const [selectedView, setSelectedView] = useState({ type: null, id: null, title: "" }); 
  const [sortBy, setSortBy] = useState("recent"); 
  
  const [showIndustryModal, setShowIndustryModal] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false); // New State
  
  const [industryForm, setIndustryForm] = useState({ name: "", imgPreview: "" });
  const [clientForm, setClientForm] = useState({ name: "", logoPreview: "" });
  const [projectForm, setProjectForm] = useState({ name: "", location: "", imgPreview: "" }); // New Form State

  const filteredIndustries = industries.filter(ind => ind.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredClients = clients.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
  
  const projectList = allProjects
    .filter(proj => {
      const matchesSearch = proj.name.toLowerCase().includes(searchTerm.toLowerCase());
      if (selectedView.type === "industry") return matchesSearch && proj.industryId === selectedView.id;
      if (selectedView.type === "client") return matchesSearch && proj.clientId === selectedView.id;
      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "recent") return b.id.localeCompare(a.id);
      if (sortBy === "date") return new Date(b.date) - new Date(a.date);
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (type === 'industry') setIndustryForm({ ...industryForm, imgPreview: url });
      else if (type === 'client') setClientForm({ ...clientForm, logoPreview: url });
      else if (type === 'project') setProjectForm({ ...projectForm, imgPreview: url });
    }
  };

  const handleIndustrySubmit = (e) => {
    e.preventDefault();
    const newInd = {
      id: `IND${Math.floor(100 + Math.random() * 900)}`,
      name: industryForm.name,
      img: industryForm.imgPreview || "https://via.placeholder.com/500"
    };
    setIndustries([...industries, newInd]);
    setShowIndustryModal(false);
    setIndustryForm({ name: "", imgPreview: "" });
  };

  const handleClientSubmit = (e) => {
    e.preventDefault();
    const newClient = { name: clientForm.name, logo: clientForm.logoPreview };
    setClients([...clients, newClient]);
    setShowClientModal(false);
    setClientForm({ name: "", logoPreview: "" });
  };

  const handleProjectSubmit = (e) => {
    e.preventDefault();
    const newProj = {
      id: `P${Math.floor(100 + Math.random() * 900)}`,
      name: projectForm.name,
      clientId: selectedView.id,
      location: projectForm.location,
      img: projectForm.imgPreview || "https://via.placeholder.com/500",
      date: new Date().toISOString().split('T')[0]
    };
    setAllProjects([...allProjects, newProj]);
    setShowProjectModal(false);
    setProjectForm({ name: "", location: "", imgPreview: "" });
  };

  return (
    <div className="admin-page dashboard-wrapper">
      <div className="top-utility-bar">
        <div className="search-pill-container">
          <div className="search-inner-wrapper">
            <Search size={18} className="search-icon-inside" />
            <input 
              type="text" 
              placeholder="Search industries, clients, or projects..."
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
              <div className="kpi-info"><span className="kpi-label">Clients</span><span className="kpi-number">{clients.length}</span></div>
              <div className="kpi-icon-pill green-light-bg"><Users size={24} /></div>
            </div>
            <div className="kpi-card-white">
              <div className="kpi-info"><span className="kpi-label">Projects</span><span className="kpi-number">{allProjects.length}</span></div>
              <div className="kpi-icon-pill red-light-bg"><CheckCircle size={24} /></div>
            </div>
          </div>

          <div className="category-tabs-container">
            <button className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>All Overview</button>
            <button className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => setActiveTab('projects')}>Industries Only</button>
            <button className={`tab-btn ${activeTab === 'clients' ? 'active' : ''}`} onClick={() => setActiveTab('clients')}>Clients Only</button>
            <button className={`tab-btn ${activeTab === 'allProjects' ? 'active' : ''}`} onClick={() => setActiveTab('allProjects')}>Projects Only</button>
          </div>

          {(activeTab === 'all' || activeTab === 'clients') && (
            <div className="client-management-wrapper">
              <div className="section-header-row">
                <h2 className="section-title">Client Management</h2>
                <button className="add-inline-btn" onClick={() => setShowClientModal(true)}>
                  <Plus size={16} /> New Client
                </button>
              </div>
              <div className={`client-logo-grid ${activeTab === 'clients' ? 'full-width-layout' : ''}`}>
                {filteredClients.map((client, index) => (
                  <div className="client-card clickable" key={index} onClick={() => setSelectedView({ type: "client", id: client.name, title: client.name })}>
                    <div className="client-logo-wrapper"><img src={client.logo} alt={client.name} className="client-logo-img" /></div>
                    <div className="client-details">
                      <span className="client-name-text">{client.name}</span>
                      <span className="client-status-tag">View Projects</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(activeTab === 'all' || activeTab === 'projects') && (
            <div className="project-management-wrapper">
              <div className="section-header-row">
                <h2 className="section-title">Industries</h2>
                <button className="add-inline-btn-industry" onClick={() => setShowIndustryModal(true)}>
                  <Plus size={16} /> New Industry
                </button>
              </div>
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

          {(activeTab === 'all' || activeTab === 'allProjects') && (
            <div className="project-management-wrapper">
              <div className="section-header-row">
                <h2 className="section-title">
                  {activeTab === 'all' ? "Recent Projects" : "All Project Records"}
                </h2>
                <div className="sort-wrapper">
                  <span className="sort-label">Sort by:</span>
                  <div className="select-container">
                    <select className="custom-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                      <option value="recent">Most Recent</option>
                      <option value="date">Date Created</option>
                      <option value="name">A-Z</option>
                    </select>
                    <ChevronDown size={14} className="select-arrow" />
                  </div>
                </div>
              </div>

              <div className="project-grid-row">
                {projectList.length > 0 ? (
                  projectList.map((proj) => (
                    <div className="project-card-item" key={proj.id}>
                      <div className="card-thumb"><img src={proj.img} alt={proj.name} /></div>
                      <div className="card-info">
                        <h3>{proj.name}</h3>
                        <div className="project-client-badge" onClick={() => setSelectedView({ type: "client", id: proj.clientId, title: proj.clientId })}><Users size={12} /> {proj.clientId}</div>
                        <div className="loc"><MapPin size={14} /> {proj.location}</div>
                        <button className="view-details-btn primary-btn">View Details <ExternalLink size={14} /></button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-results-text">No projects found.</div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {selectedView.type && (
        <div className="project-management-wrapper">
          <div className="section-header-row">
            <h2 className="section-title">Projects in {selectedView.title}</h2>
            {/* Added: Container for the New Project Button + Sort inside the filtered view */}
            <div className="header-actions-gap" style={{ display: 'flex', gap: '15px' }}>
              <button className="add-inline-btn" onClick={() => setShowProjectModal(true)}>
                <Plus size={16} /> New Project
              </button>
              <div className="sort-wrapper">
                <span className="sort-label">Sort by:</span>
                <div className="select-container">
                  <select className="custom-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="recent">Most Recent</option>
                    <option value="date">Date Created</option>
                    <option value="name">A-Z</option>
                  </select>
                  <ChevronDown size={14} className="select-arrow" />
                </div>
              </div>
            </div>
          </div>
          <div className="project-grid-row">
            {projectList.length > 0 ? (
              projectList.map((proj) => (
                <div className="project-card-item" key={proj.id}>
                  <div className="card-thumb"><img src={proj.img} alt={proj.name} /></div>
                  <div className="card-info">
                    <h3>{proj.name}</h3>
                    <div className="project-client-badge" onClick={() => setSelectedView({ type: "client", id: proj.clientId, title: proj.clientId })}><Users size={12} /> {proj.clientId}</div>
                    <div className="loc"><MapPin size={14} /> {proj.location}</div>
                    <button className="view-details-btn primary-btn">View Details <ExternalLink size={14} /></button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results-text">No projects found for this selection.</div>
            )}
          </div>
        </div>
      )}

      {/* --- MODALS --- */}
      {showIndustryModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add New Industry</h2>
              <X className="close-icon" onClick={() => setShowIndustryModal(false)} />
            </div>
            <form onSubmit={handleIndustrySubmit}>
              <div className="input-group">
                <label>Industry Name</label>
                <input type="text" required value={industryForm.name} onChange={(e)=>setIndustryForm({...industryForm, name: e.target.value})} placeholder="e.g. Smart City" />
              </div>
              <div className="input-group">
                <label>Industry Image</label>
                <div className="upload-box" onClick={() => document.getElementById('indImg').click()}>
                   {industryForm.imgPreview ? <img src={industryForm.imgPreview} className="upload-preview" /> : <Upload size={24} />}
                   <input type="file" id="indImg" hidden onChange={(e)=>handleFileUpload(e, 'industry')} />
                </div>
              </div>
              <button type="submit" className="modal-submit-btn">Add Industry</button>
            </form>
          </div>
        </div>
      )}

      {showClientModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add New Client</h2>
              <X className="close-icon" onClick={() => setShowClientModal(false)} />
            </div>
            <form onSubmit={handleClientSubmit}>
              <div className="input-group">
                <label>Client Name</label>
                <input type="text" required value={clientForm.name} onChange={(e)=>setClientForm({...clientForm, name: e.target.value})} />
              </div>
              <div className="input-group">
                <label>Client Logo</label>
                <div className="upload-box" onClick={() => document.getElementById('cliLogo').click()}>
                   {clientForm.logoPreview ? <img src={clientForm.logoPreview} className="upload-preview" /> : <Upload size={24} />}
                   <input type="file" id="cliLogo" hidden onChange={(e)=>handleFileUpload(e, 'client')} />
                </div>
              </div>
              <button type="submit" className="modal-submit-btn">Add Client</button>
            </form>
          </div>
        </div>
      )}

      {/* New Project Modal */}
      {showProjectModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add Project to {selectedView.title}</h2>
              <X className="close-icon" onClick={() => setShowProjectModal(false)} />
            </div>
            <form onSubmit={handleProjectSubmit}>
              <div className="input-group">
                <label>Project Name</label>
                <input type="text" required value={projectForm.name} onChange={(e)=>setProjectForm({...projectForm, name: e.target.value})} />
              </div>
              <div className="input-group">
                <label>Location</label>
                <input type="text" required value={projectForm.location} onChange={(e)=>setProjectForm({...projectForm, location: e.target.value})} />
              </div>
              <div className="input-group">
                <label>Project Cover Image</label>
                <div className="upload-box" onClick={() => document.getElementById('projImg').click()}>
                   {projectForm.imgPreview ? <img src={projectForm.imgPreview} className="upload-preview" /> : <Upload size={24} />}
                   <input type="file" id="projImg" hidden onChange={(e)=>handleFileUpload(e, 'project')} />
                </div>
              </div>
              <button type="submit" className="modal-submit-btn">Create Project</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard;