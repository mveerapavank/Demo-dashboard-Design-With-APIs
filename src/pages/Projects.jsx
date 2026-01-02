import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  MoreHorizontal,
  MapPin,
  Calendar,
  Users,
  FileText,
  Eye,
  Edit,
  Trash2,
  BarChart3
} from "lucide-react";
import "./projects.css"; 

// --- 1. CONFIGS ---
const statusColors = {
  "Active": "bg-green",
  "In Progress": "bg-blue",
  "Planning": "bg-yellow",
  "Completed": "bg-gray",
  "On Hold": "bg-orange",
};

export default function Projects({ onNavigateToAnalytics }) {
  // State for Data
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [industryFilter, setIndustryFilter] = useState("all");
  
  // Action Menu State
  const [openMenuId, setOpenMenuId] = useState(null);

  // --- 2. FETCH DATA FROM API ---
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("http://172.18.1.34:5000/get-projects");
        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }
        const data = await response.json();
        setProjects(data || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching projects:", err);
        // Optional: Set empty array or handle error UI
        setProjects([]); 
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Toggle Menu
  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  // Close menu on outside click
  useEffect(() => {
    const closeMenu = () => setOpenMenuId(null);
    if (openMenuId) window.addEventListener('click', closeMenu);
    return () => window.removeEventListener('click', closeMenu);
  }, [openMenuId]);

  // Filtering Logic
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    const matchesIndustry = industryFilter === "all" || project.industryType === industryFilter;

    return matchesSearch && matchesStatus && matchesIndustry;
  });

  if (loading) return <div style={{padding:'40px', textAlign:'center', color: '#64748b'}}>Loading Projects...</div>;

  return (
    <div className="projects-page">
      
      {/* Header */}
      <div className="projects-header">
        <h1 className="page-title">Projects Management</h1>
      </div>

      {/* Filters Section */}
      <div className="filters-card">
        <div className="search-container">
          <Search className="search-icon" />
          <input
            className="search-input"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select 
          className="filter-select" 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="Active">Active</option>
          <option value="In Progress">In Progress</option>
          <option value="Planning">Planning</option>
          <option value="Completed">Completed</option>
        </select>

        <select 
          className="filter-select" 
          value={industryFilter} 
          onChange={(e) => setIndustryFilter(e.target.value)}
        >
          <option value="all">All Industries</option>
          <option value="Infrastructure">Infrastructure</option>
          <option value="Public Health">Public Health</option>
          <option value="Smart City Living">Smart City Living</option>
          <option value="Energy & Utilities">Energy & Utilities</option>
          <option value="Mining">Mining</option>
        </select>
      </div>

      {/* Table Section */}
      <div className="table-card">
        <div className="table-header">
          <h3 className="table-header-title">Projects List ({filteredProjects.length})</h3>
          <button className="btn-outline">
            <Filter size={14} /> Advanced Filters
          </button>
        </div>

        <div className="projects-table-wrapper">
          <table className="projects-table">
            <thead>
              <tr>
                <th>Project ID</th>
                <th>Project Name</th>
                <th>Industry</th>
                <th>Location</th>
                <th>Status</th>
                <th>Progress</th>
                <th>Team</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project) => (
                  <tr key={project.id}>
                    {/* ID */}
                    <td className="project-id">{project.id}</td>
                    
                    {/* Name & Date */}
                    <td>
                      <div className="project-name">{project.name}</div>
                      <div className="project-meta">
                        <Calendar size={12} />
                        Started {new Date(project.startDate).toLocaleDateString()}
                      </div>
                    </td>

                    {/* Industry */}
                    <td>
                      <span className="badge-industry">{project.industryType}</span>
                    </td>

                    {/* Location */}
                    <td>
                      <div className="project-meta" style={{ fontSize: "13px" }}>
                        <MapPin size={13} style={{ marginRight: "4px" }} />
                        {project.location}
                      </div>
                    </td>

                    {/* Status */}
                    <td>
                      <div className="status-indicator">
                        <span className={`status-dot ${statusColors[project.status] || "bg-gray"}`} />
                        <span>{project.status}</span>
                      </div>
                    </td>

                    {/* Progress */}
                    <td>
                      <div className="progress-wrapper">
                        <div className="progress-text">{project.progress}%</div>
                        <div className="progress-track">
                          <div 
                            className="progress-fill" 
                            style={{ width: `${project.progress}%` }} 
                          />
                        </div>
                      </div>
                    </td>

                    {/* Team */}
                    <td>
                      <div className="project-meta" style={{ fontSize: "13px" }}>
                        <Users size={14} style={{ marginRight: "4px" }} />
                        {project.team}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="action-cell">
                      <button 
                        className="btn-icon" 
                        onClick={(e) => { e.stopPropagation(); toggleMenu(project.id); }}
                      >
                        <MoreHorizontal size={16} />
                      </button>

                      {/* Dropdown Menu */}
                      {openMenuId === project.id && (
                        <div className="menu-dropdown" onClick={(e) => e.stopPropagation()}>
                          <button className="menu-item">
                            <Eye size={14} /> View Details
                          </button>
                          <button className="menu-item">
                            <Edit size={14} /> Edit Project
                          </button>
                          <button className="menu-item">
                            <FileText size={14} /> Generate Report
                          </button>
                          <button className="menu-item danger">
                            <Trash2 size={14} /> Delete Project
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
                    No projects found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}