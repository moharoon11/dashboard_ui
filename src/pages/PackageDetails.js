import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { ArrowLeft, Save, UploadCloud, Package, AlertCircle } from 'lucide-react';
import './CompanyDetails.css'; // Reuse form styles

const PackageDetails = () => {
  const { packageId } = useParams();
  const navigate = useNavigate();
  const { role } = useContext(AuthContext);
  const isNew = !packageId;
  
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    CompanyId: '', Place: '', Price: '', Days: ''
  });
  const [picsFiles, setPicsFiles] = useState([]);

  useEffect(() => {
    if (!isNew) {
      fetchPackage();
    }
  }, [packageId]);

  const fetchPackage = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/v1/tour_package/${packageId}`);
      const data = res.data?.data || res.data;
      setFormData({
        CompanyId: data.companyId || '',
        Place: data.place || '',
        Price: data.price || '',
        Days: data.days || ''
      });
    } catch (err) {
      setError('Failed to load package details.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setPicsFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key] || '');
      });
      
      picsFiles.forEach(file => {
        data.append('Pics', file);
      });

      if (isNew) {
        await api.post('/api/v1/tour_package', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setSuccess(true);
        setTimeout(() => navigate('/tour-packages'), 1500);
      } else {
        await api.put(`/api/v1/tour_package/${packageId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setSuccess(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save package.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading-state">Loading details...</div>;

  return (
    <div className="company-details-container">
      <div className="page-header flex-between">
        <div className="header-left">
          <button className="icon-btn back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1>{isNew ? 'Create New Package' : 'Package Details'}</h1>
            <p>{isNew ? 'Add a new tour package.' : 'View and update tour package information.'}</p>
          </div>
        </div>
      </div>

      {error && <div className="alert error-alert"><AlertCircle size={18} /> {error}</div>}
      {success && <div className="alert success-alert">Successfully saved package!</div>}

      <form onSubmit={handleSubmit} className="details-form glass-panel">
        <div className="form-section">
          <h3><Package size={18} /> Package Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Company ID</label>
              <input type="number" name="CompanyId" className="input-field" value={formData.CompanyId} onChange={handleInputChange} required readOnly={role !== 'supervisor'} />
            </div>
            <div className="form-group">
              <label>Destination Place</label>
              <input type="text" name="Place" className="input-field" value={formData.Place} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Price</label>
              <input type="number" step="0.01" name="Price" className="input-field" value={formData.Price} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Duration (Days)</label>
              <input type="number" name="Days" className="input-field" value={formData.Days} onChange={handleInputChange} required />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Media Uploads</h3>
          <div className="form-grid">
            <div className="form-group file-upload-group full-width">
              <label>Package Pictures</label>
              <div className="file-upload-box">
                <UploadCloud size={24} />
                <span>Select Pictures</span>
                <input type="file" multiple onChange={handleFileChange} accept="image/*" />
              </div>
              {picsFiles.length > 0 && <p className="file-name">{picsFiles.length} files selected</p>}
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="danger-button" onClick={() => navigate(-1)}>Cancel</button>
          <button type="submit" className="premium-button" disabled={saving}>
            <Save size={18} /> {saving ? 'Saving...' : 'Save Package'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PackageDetails;
