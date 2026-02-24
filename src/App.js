import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { AuthProvider, useAuth } from '@/hooks/AuthContext';

import Index from './pages/Index';
import TearmsAndCondition from './pages/TearmsAndCondition';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Disclaimer from './pages/Disclaimer';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import ProjectDetail from './pages/ProjectDetail';

// Investor Pages
import InvestorDashboard from './pages/Investor/InvestorDashboard';
import Projects from './pages/Investor/Projects';

// Builder Pages
import BuilderDashboard from './pages/Partner/BuilderDashboard';

// Admin Pages
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminProjects from './pages/Admin/AdminProjects';
import AdminBuilders from './pages/Admin/AdminBuilders';
import AdminInquiries from './pages/Admin/AdminInquiries';

import ScrollToTop from './hooks/ScrollToTop';
import NotFound from './pages/NotFound';

const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>

          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/terms" element={<TearmsAndCondition />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/project/:id" element={<ProjectDetail />} />

          {/* Investor Routes */}
          <Route path="/dashboard" element={<ProtectedRoute role="investor"><InvestorDashboard /></ProtectedRoute>} />
          <Route path="/projects" element={<ProtectedRoute role="investor"><Projects /></ProtectedRoute>} />

          {/* Partner Routes */}
          <Route path="/partner/dashboard" element={<ProtectedRoute role="builder"><BuilderDashboard /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/projects" element={<ProtectedRoute role="admin"><AdminProjects /></ProtectedRoute>} />
          <Route path="/admin/builders" element={<ProtectedRoute role="admin"><AdminBuilders /></ProtectedRoute>} />
          <Route path="/admin/inquiries" element={<ProtectedRoute role="admin"><AdminInquiries /></ProtectedRoute>} />

          
          <Route path="*" element={<NotFound />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
