import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Companies from './pages/Companies';
import CompanyDetails from './pages/CompanyDetails';
import TourPackages from './pages/TourPackages';
import PackageDetails from './pages/PackageDetails';
import Bookings from './pages/Bookings';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Dashboard />} />
          
          {/* Supervisor Only Routes */}
          <Route element={<ProtectedRoute allowedRoles={['supervisor']} />}>
            <Route path="/companies" element={<Companies />} />
            <Route path="/companies/create" element={<CompanyDetails />} />
            <Route path="/bookings" element={<Bookings />} />
          </Route>
          
          {/* Routes accessible by both, handled internally or via specific ids */}
          <Route path="/companies/:companyId" element={<CompanyDetails />} />
          <Route path="/tour-packages" element={<TourPackages />} />
          <Route path="/tour-packages/create" element={<PackageDetails />} />
          <Route path="/tour-packages/:packageId" element={<PackageDetails />} />
        </Route>
      </Route>
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
