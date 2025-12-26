import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell, AreaChart, Area, LineChart, Line 
} from 'recharts';
import "./view.css"; // Reusing your existing view styles

export default function AnalyticsPage({ user }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // FETCH FROM NEW API
        const response = await fetch("http://172.18.1.34:5000/get-analytics");
        
        if (!response.ok) {
          throw new Error("Failed to fetch analytics data");
        }
        
        const jsonData = await response.json();
        setData(jsonData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching analytics:", err);
        setError("Failed to load analytics data.");
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) return <div className="loading-screen">Loading Analytics...</div>;
  if (error) return <div className="error-screen">{error}</div>;

  return (
    <div className="view-page-wrapper">
      <div className="view-header">
        <div className="header-top-row">
            <h1 className="page-title">Analytics Dashboard</h1>
        </div>
        <p className="page-desc">Viewing as: <strong>{user.role}</strong></p>
      </div>

      <div style={{ padding: '20px', overflowY: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            
            {/* 1. BAR CHART [Modified for Total vs Images] */}
            <div style={{ background: '#0c0c0e', border: '1px solid #1a1a1c', padding: '20px', borderRadius: '12px', height: '360px' }}>
              <div style={{ fontSize: '14px', color: '#eee', fontWeight: '600', marginBottom: '20px' }}>Detections by Species</div>
              <ResponsiveContainer width="100%" height="80%">
                <BarChart data={data.barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                  <XAxis dataKey="name" stroke="#555" fontSize={10} />
                  <YAxis stroke="#555" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="Total" fill="#3b82f6" barSize={20} name="Total Count" />
                  <Bar dataKey="Images" fill="#10b981" barSize={20} name="Image Count" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* 2. PIE CHART [Same Structure, New Data] */}
            <div style={{ background: '#0c0c0e', border: '1px solid #1a1a1c', padding: '20px', borderRadius: '12px', height: '360px' }}>
              <div style={{ fontSize: '14px', color: '#eee', fontWeight: '600', marginBottom: '20px' }}>Species Distribution (%)</div>
              <ResponsiveContainer width="100%" height="80%">
                <PieChart>
                  <Pie data={data.pieData} innerRadius={70} outerRadius={90} dataKey="value">
                    {data.pieData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* 3. AREA CHART [Modified for Elephant/Deer/Zebra] */}
            <div style={{ background: '#0c0c0e', border: '1px solid #1a1a1c', padding: '20px', borderRadius: '12px', height: '360px' }}>
              <div style={{ fontSize: '14px', color: '#eee', fontWeight: '600', marginBottom: '20px' }}>Batch Analysis Trends</div>
              <ResponsiveContainer width="100%" height="80%">
                <AreaChart data={data.areaData}>
                  <CartesianGrid stroke="#222" vertical={false} />
                  <XAxis dataKey="name" stroke="#555" fontSize={10} />
                  <YAxis stroke="#555" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Area type="monotone" dataKey="Elephant" stroke="#3b82f6" fill="#3b82f633" strokeWidth={2} />
                  <Area type="monotone" dataKey="Deer" stroke="#10b981" fill="#10b98122" strokeWidth={2} />
                  <Area type="monotone" dataKey="Zebra" stroke="#f59e0b" fill="#f59e0b22" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* 4. LINE CHART [Modified for Detections vs Confidence] */}
            <div style={{ background: '#0c0c0e', border: '1px solid #1a1a1c', padding: '20px', borderRadius: '12px', height: '360px' }}>
              <div style={{ fontSize: '14px', color: '#eee', fontWeight: '600', marginBottom: '20px' }}>Model Performance</div>
              <ResponsiveContainer width="100%" height="80%">
                <LineChart data={data.lineData}>
                  <CartesianGrid stroke="#222" vertical={false} />
                  <XAxis dataKey="name" stroke="#555" fontSize={10} />
                  <YAxis yAxisId="left" stroke="#555" fontSize={10} />
                  <YAxis yAxisId="right" orientation="right" domain={[80, 100]} stroke="#555" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Line yAxisId="left" type="monotone" dataKey="Detections" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} name="Detections" />
                  <Line yAxisId="right" type="monotone" dataKey="Confidence" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} name="Avg Confidence %" />
                </LineChart>
              </ResponsiveContainer>
            </div>

          </div>
      </div>
    </div>
  );
}