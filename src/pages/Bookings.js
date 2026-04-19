import React from 'react';
import { CalendarDays } from 'lucide-react';
import './Companies.css'; // Reusing styles

const Bookings = () => {
  return (
    <div className="companies-container">
      <div className="page-header">
        <h1>Bookings</h1>
        <p>Manage all tour bookings across all companies.</p>
      </div>

      <div className="empty-state glass-panel" style={{ marginTop: '2rem' }}>
        <CalendarDays size={48} className="empty-icon" />
        <h3>No Bookings Available</h3>
        <p>Bookings API integration is not available yet.</p>
      </div>
    </div>
  );
};

export default Bookings;
