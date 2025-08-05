

import React from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import Courses from './pages/Courses';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Instructors from './pages/Instructors';

function Home() {
  return <Navigate to="/dashboard" />;
}


function LoginWrapper({ onLogin }) {
  const access = localStorage.getItem('access');
  if (access) {
    return <Navigate to="/dashboard" />;
  }
  return <Login onLogin={onLogin} />;
}


export default function App() {
  const navigate = useNavigate();


  const handleLogin = () => {
    navigate('/dashboard');
  };


  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    navigate('/login');
  };

  // Determine page title based on route
  const getPageTitle = () => {
    const path = window.location.pathname;
    if (path.startsWith('/dashboard')) return 'Dashboard';
    if (path.startsWith('/login')) return 'Login';
    return '';
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f6f8fa' }}>
      <Sidebar />
      <div style={{ flex: 1, marginLeft: 210, minHeight: '100vh', background: '#f6f8fa' }}>
        {localStorage.getItem('access') && (
          <Topbar pageTitle={getPageTitle()} onLogout={handleLogout} />
        )}
        <div style={{ paddingTop: 60 }}>
          <Routes>
            <Route path="/login" element={<LoginWrapper onLogin={handleLogin} />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/categories"
              element={
                <PrivateRoute>
                  <Categories />
                </PrivateRoute>
              }
            />
            <Route
              path="/courses"
              element={
                <PrivateRoute>
                  <Courses />
                </PrivateRoute>
              }
            />
            <Route
              path="/instructors"
              element={
                <PrivateRoute>
                  <Instructors />
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
