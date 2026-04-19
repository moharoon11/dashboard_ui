import React, { useContext } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, Building2, Package, CalendarDays, LogOut } from 'lucide-react';
import './DashboardLayout.css';

const DashboardLayout = () => {
  const { role, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout-container">
      {/* Sidebar */}
      <aside className="sidebar glass-panel">
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo-icon">T</div>
            <span className="logo-text">TourAdmin</span>
          </div>
          <div className="role-badge">{role === 'supervisor' ? 'Supervisor' : 'Admin'}</div>
        </div>
        
        <nav className="sidebar-nav">
          <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>
          
          {role === 'supervisor' && (
            <NavLink to="/companies" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Building2 size={20} />
              <span>Companies</span>
            </NavLink>
          )}

          <NavLink to="/tour-packages" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Package size={20} />
            <span>Tour Packages</span>
          </NavLink>

          {role === 'supervisor' && (
            <NavLink to="/bookings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <CalendarDays size={20} />
              <span>Bookings</span>
            </NavLink>
          )}
        </nav>
        
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        <header className="top-navbar glass-panel">
          <div className="navbar-title">
            Welcome back, {role === 'supervisor' ? 'Supervisor' : 'Admin'}!
          </div>
          <div className="user-profile">
            <div className="avatar">
              {role === 'supervisor' ? 'S' : 'A'}
            </div>
          </div>
        </header>

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
