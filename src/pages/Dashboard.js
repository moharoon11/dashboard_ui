import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Users, Building2, Package, TrendingUp } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const { role } = useContext(AuthContext);

  const stats = [
    { label: 'Total Companies', value: '12', icon: Building2, color: 'text-blue-500', visible: role === 'supervisor' },
    { label: 'Active Packages', value: '45', icon: Package, color: 'text-purple-500', visible: true },
    { label: 'Total Bookings', value: '128', icon: Users, color: 'text-green-500', visible: role === 'supervisor' },
    { label: 'Revenue Growth', value: '+14%', icon: TrendingUp, color: 'text-emerald-500', visible: role === 'supervisor' },
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <h1>Dashboard Overview</h1>
        <p>Welcome to TourAdmin system. Here's what's happening today.</p>
      </div>

      <div className="stats-grid">
        {stats.filter(s => s.visible).map((stat, idx) => (
          <div key={idx} className="stat-card glass-panel">
            <div className="stat-icon-wrapper">
              <stat.icon size={24} className="stat-icon" />
            </div>
            <div className="stat-details">
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-content">
        <div className="recent-activity glass-panel">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            <p className="empty-state">No recent activity found.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
