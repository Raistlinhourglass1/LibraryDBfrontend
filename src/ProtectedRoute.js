// src/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token'); // Retrieve token from localStorage
  
  if (!token) {
    return (
      <Navigate 
        to="/signin" 
        replace
        state={{ message: 'Please log in to access this page.' }}
      />
    );
  }
  
  return children;
}

export default ProtectedRoute;
