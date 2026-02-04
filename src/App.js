import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { AuthProvider, useAuth } from '@/hooks/AuthContext';

import Index from './pages/Index';

// Investor Pages
import InvestorRegister from './pages/Investor/InvestorRegister';
import InvestorLogin from './pages/Investor/InvestorLogin';
import Projects from './pages/Investor/Projects';
import ProjectDetail from './pages/Investor/ProjectDetail';

// Builder Pages
import BuilderRegister from './pages/Partner/BuilderRegister';
import BuilderLogin from './pages/Partner/BuilderLogin';
import BuilderDashboard from './pages/Partner/BuilderDashboard';

// Admin Pages
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminProjects from './pages/Admin/AdminProjects';
import AdminBuilders from './pages/Admin/AdminBuilders';
import AdminInquiries from './pages/Admin/AdminInquiries';

const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Public Routes */}
          <Route path="/" element={<Index />} />

          {/* Investor Routes */}
          <Route path="/login" element={<InvestorLogin />} />
          <Route path="/register" element={<InvestorRegister />} />
          <Route path="/projects" element={<ProtectedRoute role="investor"><Projects /></ProtectedRoute>} />
          <Route path="/projects/:id" element={<ProtectedRoute role="investor"><ProjectDetail /></ProtectedRoute>} />

          {/* Partner Routes */}
          <Route path="/partner/register" element={<BuilderRegister />} />
          <Route path="/partner/login" element={<BuilderLogin />} />
          <Route path="/partner/dashboard" element={<ProtectedRoute role="builder"><BuilderDashboard /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/projects" element={<ProtectedRoute role="admin"><AdminProjects /></ProtectedRoute>} />
          <Route path="/admin/builders" element={<ProtectedRoute role="admin"><AdminBuilders /></ProtectedRoute>} />
          <Route path="/admin/inquiries" element={<ProtectedRoute role="admin"><AdminInquiries /></ProtectedRoute>} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
