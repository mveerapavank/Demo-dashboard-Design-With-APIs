import React, { useState, useEffect } from "react";
import { 
  Search, 
  Bell, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Filter, 
  MoreHorizontal, 
  Info,
  ChevronDown,
  Eye,
  X,
  Check
} from "lucide-react";
import "./alerts.css"; 

// --- 1. CONFIGS ---
const severityConfig = {
  critical: { color: "text-red", icon: AlertTriangle, bg: "sev-critical" },
  warning: { color: "text-orange", icon: AlertTriangle, bg: "sev-warning" },
  info: { color: "text-blue", icon: Info, bg: "sev-info" },
};

const statusConfig = {
  active: { color: "dot-red", label: "Active" },
  acknowledged: { color: "dot-yellow", label: "Acknowledged" },
  resolved: { color: "dot-green", label: "Resolved" },
};

export default function Alerts() {
  // State for Data
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");

  // State for Action Menu
  const [openMenuId, setOpenMenuId] = useState(null);

  // --- 2. FETCH DATA FROM API ---
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch("http://172.18.1.34:8000/get-alerts");
        if (!response.ok) {
          throw new Error("Failed to fetch alerts");
        }
        const data = await response.json();
        setAlerts(data || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching alerts:", err);
        // Set empty array on error so page doesn't crash
        setAlerts([]); 
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  // --- FILTERS ---
  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || alert.status === statusFilter;
    const matchesSeverity = severityFilter === "all" || alert.severity === severityFilter;

    return matchesSearch && matchesStatus && matchesSeverity;
  });

  // Stats Calculations
  const activeCount = alerts.filter(a => a.status === "active").length;
  const criticalCount = alerts.filter(a => a.severity === "critical").length;
  const resolvedCount = alerts.filter(a => a.status === "resolved").length; 

  // Toggle Menu Handler
  const toggleMenu = (e, id) => {
    e.stopPropagation(); 
    setOpenMenuId(openMenuId === id ? null : id);
  };

  if (loading) return <div style={{padding:'40px', textAlign:'center', color: '#64748b'}}>Loading Alerts...</div>;

  return (
    <div className="alerts-page">
      
      {/* HEADER */}
      <div className="alerts-header">
        <h1 className="page-title">System Alerts</h1>
      </div>

      {/* STATS GRID */}
      <div className="stats-grid">
        <div className="stat-card">
          <div><p className="stat-label">Total Alerts</p><h3 className="stat-value">{alerts.length}</h3></div>
          <div className="stat-icon-box bg-blue"><Bell size={20} color="white" /></div>
        </div>
        <div className="stat-card">
          <div><p className="stat-label">Active Alerts</p><h3 className="stat-value text-red">{activeCount}</h3></div>
          <div className="stat-icon-box bg-red"><AlertTriangle size={20} color="white" /></div>
        </div>
        <div className="stat-card">
          <div><p className="stat-label">Critical</p><h3 className="stat-value text-orange">{criticalCount}</h3></div>
          <div className="stat-icon-box bg-orange"><AlertTriangle size={20} color="white" /></div>
        </div>
        <div className="stat-card">
          <div><p className="stat-label">Resolved Today</p><h3 className="stat-value text-green">{resolvedCount}</h3></div>
          <div className="stat-icon-box bg-green"><CheckCircle size={20} color="white" /></div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="filters-bar">
        <div className="search-wrapper">
          <Search className="search-icon" />
          <input 
            className="search-input"
            placeholder="Search alerts by ID, title..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-select-wrapper">
          <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="acknowledged">Acknowledged</option>
            <option value="resolved">Resolved</option>
          </select>
          <ChevronDown className="select-icon" />
        </div>
        <div className="filter-select-wrapper">
          <select className="filter-select" value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)}>
            <option value="all">All Severity</option>
            <option value="critical">Critical</option>
            <option value="warning">Warning</option>
            <option value="info">Info</option>
          </select>
          <ChevronDown className="select-icon" />
        </div>
      </div>

      {/* TABLE */}
      <div className="table-card">
        <div className="table-header">
          <h3 className="table-title">Alerts List ({filteredAlerts.length})</h3>
          <button className="btn-outline"><Filter size={14} /> Advanced Filters</button>
        </div>
        
        <div className="table-responsive">
          <table className="alerts-table">
            <thead>
              <tr>
                <th>Alert ID</th>
                <th>Details</th>
                <th>Date & Time</th>
                <th>Source</th>
                <th>Recipient</th>
                <th>Status</th>
                <th>Severity</th>
                <th style={{textAlign: 'right'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlerts.length > 0 ? (
                filteredAlerts.map((alert) => {
                  const sInfo = severityConfig[alert.severity] || severityConfig.info;
                  const stInfo = statusConfig[alert.status] || statusConfig.active;
                  const SIcon = sInfo.icon;

                  return (
                    <tr key={alert.id}>
                      <td className="td-id">{alert.id}</td>
                      <td className="td-main">
                        <span className="alert-title">{alert.title}</span>
                        <span className="alert-desc">{alert.description}</span>
                      </td>
                      <td>
                        <div className="flex-center">
                          <Clock size={14} /> {alert.dateTime}
                        </div>
                      </td>
                      <td>{alert.source}</td>
                      <td>{alert.recipient}</td>
                      <td>
                        <div className="flex-center">
                          <span className={`status-dot ${stInfo.color}`}></span>
                          <span style={{textTransform:'capitalize'}}>{alert.status}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`severity-badge ${sInfo.bg}`}>
                          <SIcon size={12} />
                          <span style={{textTransform:'capitalize', marginLeft: '4px'}}>{alert.severity}</span>
                        </span>
                      </td>
                      
                      {/* ACTIONS COLUMN WITH DROPDOWN */}
                      <td style={{textAlign: 'right', position: 'relative'}}>
                        <button 
                          className="btn-icon" 
                          onClick={(e) => toggleMenu(e, alert.id)}
                        >
                          <MoreHorizontal size={16} />
                        </button>

                        {/* DROPDOWN MENU */}
                        {openMenuId === alert.id && (
                          <div className="action-menu-dropdown" onClick={(e) => e.stopPropagation()}>
                            <div className="menu-item">
                              <Eye size={14} /> View Details
                            </div>
                            <div className="menu-item">
                              <CheckCircle size={14} /> Acknowledge
                            </div>
                            <div className="menu-item">
                              <CheckCircle size={14} /> Mark as Resolved
                            </div>
                            <div className="menu-item text-red">
                              <X size={14} /> Dismiss Alert
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="empty-row">No alerts found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}