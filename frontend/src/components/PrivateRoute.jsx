
import React from 'react';
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children }) {
  const access = localStorage.getItem('access');
  return access ? children : <Navigate to="/login" />;
}
