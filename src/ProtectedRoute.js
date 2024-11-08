import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token'); // Retrieve token from localStorage
  return token ? children : <Navigate to="/signin" />; // Redirect to /signin if no token
}

export default ProtectedRoute;