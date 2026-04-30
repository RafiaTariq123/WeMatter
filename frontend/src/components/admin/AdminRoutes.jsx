import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoutes = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminAuth = () => {
      const token = localStorage.getItem('adminToken');
      const adminInfo = localStorage.getItem('adminInfo');
      
      if (token && adminInfo) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
      
      setLoading(false);
    };

    checkAdminAuth();
  }, []);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  return isAdmin ? children : <Navigate to="/admin/login" replace />;
};

export default AdminRoutes;
