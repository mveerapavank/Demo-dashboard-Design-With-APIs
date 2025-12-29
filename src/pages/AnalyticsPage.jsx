import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell, AreaChart, Area, LineChart, Line 
} from 'recharts';
import "./analytics.css"; 

export default function AnalyticsPage({ user }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch("http://172.18.1.34:8000/get-analytics");
        
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

  if (loading) return <div className="analytics-loading">Loading Analytics...</div>;
  if (error) return <div className="analytics-error">{error}</div>;

  if (!data) return <div className="analytics-error">No data available</div>;

  return (
    <div className="analytics-page">
      {/* --- HEADER --- */}
      <div className="analytics-header">
        <div>
           <h1 className="page-title">Analytics Dashboard</h1>
           <p className="page-desc">Viewing as: <strong style={{color: '#4f46e5'}}>{user?.role || 'Guest'}</strong></p>
        </div>
      </div>

      <div className="charts-grid-container">
          
          {/* 1. BAR CHART */}
          <div className="chart-card-light">
            <div className="chart-title">Detections by Species</div>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={data?.barData || []}>
                {/* Light gray grid lines */}
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                {/* Darker gray text for axes */}
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#0f172a', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} 
                  itemStyle={{ color: '#0f172a' }}
                  cursor={{ fill: '#f1f5f9' }}
                />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                <Bar dataKey="Total" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Total Count" />
                <Bar dataKey="Images" fill="#10b981" radius={[4, 4, 0, 0]} name="Image Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 2. PIE CHART */}
          <div className="chart-card-light">
            <div className="chart-title">Species Distribution (%)</div>
            <ResponsiveContainer width="100%" height="85%">
              <PieChart>
                <Pie 
                  data={data?.pieData || []} 
                  innerRadius={80} 
                  outerRadius={100} 
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data?.pieData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#0f172a', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* 3. AREA CHART */}
          <div className="chart-card-light">
            <div className="chart-title">Batch Analysis Trends</div>
            <ResponsiveContainer width="100%" height="85%">
              <AreaChart data={data?.areaData || []}>
                <CartesianGrid stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#0f172a', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                <Legend />
                <Area type="monotone" dataKey="Elephant" stroke="#3b82f6" fillOpacity={0.2} fill="#3b82f6" strokeWidth={2} />
                <Area type="monotone" dataKey="Deer" stroke="#10b981" fillOpacity={0.2} fill="#10b981" strokeWidth={2} />
                <Area type="monotone" dataKey="Zebra" stroke="#f59e0b" fillOpacity={0.2} fill="#f59e0b" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* 4. LINE CHART */}
          <div className="chart-card-light">
            <div className="chart-title">Model Performance</div>
            <ResponsiveContainer width="100%" height="85%">
              <LineChart data={data?.lineData || []}>
                <CartesianGrid stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis yAxisId="left" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis yAxisId="right" orientation="right" domain={[80, 100]} stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#0f172a', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="Detections" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill:'#3b82f6' }} activeDot={{ r: 6 }} />
                <Line yAxisId="right" type="monotone" dataKey="Confidence" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill:'#10b981' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

      </div>
    </div>
  );
}