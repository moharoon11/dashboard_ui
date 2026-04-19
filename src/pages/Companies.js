import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Building2, Plus, Edit, Trash2, MapPin, Search } from 'lucide-react';
import './Companies.css';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/v1/companies');
      // Assume API returns data array or object with data property
      setCompanies(response.data?.data || response.data || []);
    } catch (error) {
      console.error('Failed to fetch companies', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCompanies = companies.filter(c => 
    c.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="companies-container">
      <div className="page-header flex-between">
        <div>
          <h1>Companies</h1>
          <p>Manage all registered tour companies.</p>
        </div>
        <button className="premium-button" onClick={() => navigate('/companies/create')}>
          <Plus size={18} /> Add Company
        </button>
      </div>

      <div className="controls-bar glass-panel">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search companies by name or city..." 
            className="input-field"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading-state">Loading companies...</div>
      ) : (
        <div className="companies-grid">
          {filteredCompanies.length > 0 ? (
            filteredCompanies.map((company, index) => (
              <div key={company.id || index} className="company-card glass-panel">
                <div className="company-header">
                  <div className="company-avatar">
                    <Building2 size={24} />
                  </div>
                  <div className="company-actions">
                    <button className="icon-btn edit" onClick={() => navigate(`/companies/${company.id}`)}>
                      <Edit size={16} />
                    </button>
                  </div>
                </div>
                <div className="company-info">
                  <h3>{company.companyName || 'Unknown Company'}</h3>
                  <p className="owner-name">Owner: {company.ownerName || 'N/A'}</p>
                  <p className="location">
                    <MapPin size={14} /> {company.city || 'N/A'}, {company.state || 'N/A'}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state glass-panel">
              <Building2 size={48} className="empty-icon" />
              <h3>No companies found</h3>
              <p>Try adjusting your search or add a new company.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Companies;
