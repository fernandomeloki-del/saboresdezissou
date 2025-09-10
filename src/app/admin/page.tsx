'use client';

import React from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import AdminLogin from '@/components/AdminLogin';
import AdminDashboard from '@/components/AdminDashboard';
import Loading from '@/components/ui/Loading';

const AdminPageContent: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-pastel-vanilla">
        <Loading size="lg" className="py-20" />
      </div>
    );
  }

  return isAuthenticated ? <AdminDashboard /> : <AdminLogin />;
};

const AdminPage: React.FC = () => {
  return (
    <AuthProvider>
      <AdminPageContent />
    </AuthProvider>
  );
};

export default AdminPage;