import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { ArrowLeft, Save, UploadCloud, Building2, AlertCircle } from 'lucide-react';
import './CompanyDetails.css';

const CompanyDetails = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const { role } = useContext(AuthContext);
  const isNew = !companyId;
  
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    CompanyName: '', OwnerName: '', Phone: '', Email: '', Password: '',
    Address: '', City: '', State: '', Pincode: '', PanNumber: '',
    AadharNumber: '', GstNumber: '', BankAccount: '', IfscCode: '', UpiId: ''
  });
  const [logoFile, setLogoFile] = useState(null);
  const [companyPicsFiles, setCompanyPicsFiles] = useState([]);

  useEffect(() => {
    if (!isNew) {
      fetchCompany();
    }
  }, [companyId]);

  const fetchCompany = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/v1/companies/${companyId}`);
      const data = res.data?.data || res.data;
      setFormData({
        ...formData,
        ...data
      });
    } catch (err) {
      setError('Failed to load company details.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e, type) => {
    if (type === 'logo') {
      setLogoFile(e.target.files[0]);
    } else if (type === 'pics') {
      setCompanyPicsFiles(Array.from(e.target.files));
    }
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
      
      if (logoFile) {
        data.append('Logo', logoFile);
      }
      
      companyPicsFiles.forEach(file => {
        data.append('CompanyPics', file);
      });

      if (isNew) {
        await api.post('/api/v1/companies/create', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setSuccess(true);
        setTimeout(() => navigate('/companies'), 1500);
      } else {
        // Assume PUT endpoint exists for updates as per requirements
        await api.put(`/api/v1/companies/${companyId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setSuccess(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save company.');
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
            <h1>{isNew ? 'Create New Company' : 'Company Details'}</h1>
            <p>{isNew ? 'Enter the details to register a new company.' : 'View and update company information.'}</p>
          </div>
        </div>
      </div>

      {error && <div className="alert error-alert"><AlertCircle size={18} /> {error}</div>}
      {success && <div className="alert success-alert">Successfully saved company!</div>}

      <form onSubmit={handleSubmit} className="details-form glass-panel">
        <div className="form-section">
          <h3><Building2 size={18} /> Basic Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Company Name</label>
              <input type="text" name="CompanyName" className="input-field" value={formData.CompanyName} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Owner Name</label>
              <input type="text" name="OwnerName" className="input-field" value={formData.OwnerName} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input type="text" name="Phone" className="input-field" value={formData.Phone} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="Email" className="input-field" value={formData.Email} onChange={handleInputChange} required />
            </div>
            {isNew && (
              <div className="form-group">
                <label>Password</label>
                <input type="password" name="Password" className="input-field" value={formData.Password} onChange={handleInputChange} required />
              </div>
            )}
          </div>
        </div>

        <div className="form-section">
          <h3>Location Information</h3>
          <div className="form-grid">
            <div className="form-group full-width">
              <label>Address</label>
              <input type="text" name="Address" className="input-field" value={formData.Address} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>City</label>
              <input type="text" name="City" className="input-field" value={formData.City} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>State</label>
              <input type="text" name="State" className="input-field" value={formData.State} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Pincode</label>
              <input type="text" name="Pincode" className="input-field" value={formData.Pincode} onChange={handleInputChange} required />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Legal & Banking</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>PAN Number</label>
              <input type="text" name="PanNumber" className="input-field" value={formData.PanNumber} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Aadhar Number</label>
              <input type="text" name="AadharNumber" className="input-field" value={formData.AadharNumber} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>GST Number</label>
              <input type="text" name="GstNumber" className="input-field" value={formData.GstNumber} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Bank Account Number</label>
              <input type="text" name="BankAccount" className="input-field" value={formData.BankAccount} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>IFSC Code</label>
              <input type="text" name="IfscCode" className="input-field" value={formData.IfscCode} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>UPI ID</label>
              <input type="text" name="UpiId" className="input-field" value={formData.UpiId} onChange={handleInputChange} required />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Media Uploads</h3>
          <div className="form-grid">
            <div className="form-group file-upload-group">
              <label>Company Logo</label>
              <div className="file-upload-box">
                <UploadCloud size={24} />
                <span>Select Logo</span>
                <input type="file" onChange={(e) => handleFileChange(e, 'logo')} accept="image/*" />
              </div>
              {logoFile && <p className="file-name">{logoFile.name}</p>}
            </div>
            <div className="form-group file-upload-group">
              <label>Company Pictures</label>
              <div className="file-upload-box">
                <UploadCloud size={24} />
                <span>Select Pictures</span>
                <input type="file" multiple onChange={(e) => handleFileChange(e, 'pics')} accept="image/*" />
              </div>
              {companyPicsFiles.length > 0 && <p className="file-name">{companyPicsFiles.length} files selected</p>}
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="danger-button" onClick={() => navigate(-1)}>Cancel</button>
          <button type="submit" className="premium-button" disabled={saving}>
            <Save size={18} /> {saving ? 'Saving...' : 'Save Company'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompanyDetails;
