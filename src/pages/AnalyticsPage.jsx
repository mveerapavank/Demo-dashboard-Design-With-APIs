import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell, AreaChart, Area, LineChart, Line 
} from 'recharts';

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // REPLACE THIS URL with the real endpoint provided by your backend team
        const response = await fetch("http://172.18.1.25:5000/analytics");
        
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

  if (loading) {
    return (
      <div style={{ backgroundColor: '#000', color: '#fff', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        Loading Dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ backgroundColor: '#000', color: '#ef4444', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <h2>Error Loading Data</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} style={{ padding: '10px 20px', marginTop: '20px', cursor: 'pointer' }}>Retry</button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#000', color: '#fff', fontFamily: 'sans-serif' }}>
      
      {/* SIDEBAR - (Assuming you have a Sidebar component or keeping specific layout here) */}
      <aside style={{ width: '240px', borderRight: '1px solid #111', padding: '20px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '40px' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>Akin Analytics</div>
          <div style={{ fontSize: '10px', color: '#666' }}>Enterprise Platform</div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <div style={{ 
            padding: '10px 15px', color: '#4a90e2', background: '#1a73e822', 
            borderRadius: '4px', borderLeft: '3px solid #4a90e2', fontSize: '14px', fontWeight: '500' 
          }}>
            Analytics
          </div>
        </div>

        <div style={{ marginTop: 'auto', textAlign: 'center', padding: '20px 0' }}>
          <p style={{ fontSize: '9px', color: '#444', marginBottom: '10px' }}>POWERED BY</p>
          {/* Logo Placeholder */}
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#333' }}>LOGO</div> 
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header style={{ height: '60px', borderBottom: '1px solid #111', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '0 30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '13px', fontWeight: 'bold' }}>Akin Platform</div>
              <div style={{ fontSize: '10px', color: '#666' }}>Administrator</div>
            </div>
            <div style={{ width: '32px', height: '32px', background: '#1a73e8', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px' }}>AK</div>
          </div>
        </header>

        <div style={{ padding: '20px', overflowY: 'auto', height: 'calc(100vh - 60px)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', paddingBottom: '20px' }}>
            
            {/* 1. BAR CHART */}
            <div style={{ background: '#0c0c0e', border: '1px solid #1a1a1c', padding: '20px', borderRadius: '12px', height: '360px' }}>
              <div style={{ fontSize: '14px', color: '#eee', fontWeight: '600', marginBottom: '20px' }}>Food & Civil Supplies (Tons)</div>
              <ResponsiveContainer width="100%" height="80%">
                <BarChart data={data.barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                  <XAxis dataKey="name" stroke="#555" fontSize={10} />
                  <YAxis stroke="#555" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="Rice" fill="#3b82f6" barSize={8} />
                  <Bar dataKey="Wheat" fill="#10b981" barSize={8} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* 2. PIE CHART */}
            <div style={{ background: '#0c0c0e', border: '1px solid #1a1a1c', padding: '20px', borderRadius: '12px', height: '360px' }}>
              <div style={{ fontSize: '14px', color: '#eee', fontWeight: '600', marginBottom: '20px' }}>Stock Distribution (%)</div>
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

            {/* 3. AREA CHART */}
            <div style={{ background: '#0c0c0e', border: '1px solid #1a1a1c', padding: '20px', borderRadius: '12px', height: '360px' }}>
              <div style={{ fontSize: '14px', color: '#eee', fontWeight: '600', marginBottom: '20px' }}>Distributed Grains</div>
              <ResponsiveContainer width="100%" height="80%">
                <AreaChart data={data.areaData}>
                  <CartesianGrid stroke="#222" vertical={false} />
                  <XAxis dataKey="name" stroke="#555" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }} />
                  <Area type="monotone" dataKey="Rice" stroke="#3b82f6" fill="#3b82f633" strokeWidth={2} />
                  <Area type="monotone" dataKey="Wheat" stroke="#10b981" fill="#10b98122" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* 4. LINE CHART */}
            <div style={{ background: '#0c0c0e', border: '1px solid #1a1a1c', padding: '20px', borderRadius: '12px', height: '360px' }}>
              <div style={{ fontSize: '14px', color: '#eee', fontWeight: '600', marginBottom: '20px' }}>Supply Chain Efficiency (%)</div>
              <ResponsiveContainer width="100%" height="80%">
                <LineChart data={data.lineData}>
                  <CartesianGrid stroke="#222" vertical={false} />
                  <XAxis dataKey="name" stroke="#555" fontSize={10} />
                  <YAxis domain={[80, 100]} stroke="#555" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Line type="monotone" dataKey="Procurement" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="Distribution" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}