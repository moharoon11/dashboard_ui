import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Package, Plus, Edit, Trash2, Search, CalendarDays, DollarSign, MapPin } from 'lucide-react';
import './Companies.css'; // Reusing some grid styles

const TourPackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { role } = useContext(AuthContext);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/v1/tour_package');
      setPackages(response.data?.data || response.data || []);
    } catch (error) {
      console.error('Failed to fetch packages', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      try {
        await api.delete(`/api/v1/tour_package/${id}`);
        fetchPackages();
      } catch (error) {
        alert('Failed to delete package');
      }
    }
  };

  const filteredPackages = packages.filter(p => 
    p.place?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="companies-container">
      <div className="page-header flex-between">
        <div>
          <h1>Tour Packages</h1>
          <p>Manage all tour packages and their details.</p>
        </div>
        {role === 'supervisor' && (
          <button className="premium-button" onClick={() => navigate('/tour-packages/create')}>
            <Plus size={18} /> Add Package
          </button>
        )}
      </div>

      <div className="controls-bar glass-panel">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search by destination place..." 
            className="input-field"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading-state">Loading packages...</div>
      ) : (
        <div className="companies-grid">
          {filteredPackages.length > 0 ? (
            filteredPackages.map((pkg, index) => (
              <div key={pkg.id || index} className="company-card glass-panel">
                <div className="company-header">
                  <div className="company-avatar" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
                    <Package size={24} />
                  </div>
                  <div className="company-actions" style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="icon-btn edit" onClick={() => navigate(`/tour-packages/${pkg.id}`)}>
                      <Edit size={16} />
                    </button>
                    {role === 'supervisor' && (
                      <button className="icon-btn" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(pkg.id)}>
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
                <div className="company-info" style={{ marginTop: '0.5rem' }}>
                  <h3>{pkg.place || 'Unknown Destination'}</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                    <span className="location">
                      <DollarSign size={14} /> Price: ₹{pkg.price || 0}
                    </span>
                    <span className="location">
                      <CalendarDays size={14} /> Duration: {pkg.days || 0} Days
                    </span>
                    <span className="location">
                      <MapPin size={14} /> Company ID: {pkg.companyId}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state glass-panel">
              <Package size={48} className="empty-icon" />
              <h3>No packages found</h3>
              <p>Try adjusting your search or add a new package.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TourPackages;
