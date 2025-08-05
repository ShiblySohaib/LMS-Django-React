import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import api from '../api';
import './Sidebar.css';

export default function Sidebar() {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem('access'));

  useEffect(() => {
    async function fetchUserInfo() {
      setLoading(true);
      try {
        const res = await api.get('/accounts/userinfo/');
        setUserInfo(res.data);
      } catch (err) {
        setUserInfo(null);
      } finally {
        setLoading(false);
      }
    }
    if (accessToken) {
      fetchUserInfo();
    } else {
      setUserInfo(null);
      setLoading(false);
    }
  }, [accessToken]);


  // Listen for localStorage changes in other tabs and in this tab (via custom event)
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'access') {
        setAccessToken(localStorage.getItem('access'));
      }
    };
    const handleCustomStorage = (e) => {
      if (e.detail && e.detail.key === 'access') {
        setAccessToken(localStorage.getItem('access'));
      }
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('access-token-changed', handleCustomStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('access-token-changed', handleCustomStorage);
    };
  }, []);

  // Patch localStorage.setItem/removeItem to dispatch a custom event for 'access' key
  useEffect(() => {
    const origSetItem = localStorage.setItem;
    const origRemoveItem = localStorage.removeItem;
    localStorage.setItem = function(key, value) {
      origSetItem.apply(this, arguments);
      if (key === 'access') {
        window.dispatchEvent(new CustomEvent('access-token-changed', { detail: { key, value } }));
      }
    };
    localStorage.removeItem = function(key) {
      origRemoveItem.apply(this, arguments);
      if (key === 'access') {
        window.dispatchEvent(new CustomEvent('access-token-changed', { detail: { key } }));
      }
    };
    return () => {
      localStorage.setItem = origSetItem;
      localStorage.removeItem = origRemoveItem;
    };
  }, []);

  // Also update accessToken if it changes in this tab (e.g., login/logout)
  useEffect(() => {
    const checkToken = () => {
      setAccessToken(localStorage.getItem('access'));
    };
    window.addEventListener('focus', checkToken);
    return () => window.removeEventListener('focus', checkToken);
  }, []);

  const isLoggedIn = !!accessToken;
  return (
    <aside className="sidebar">
      <div className="sidebar-title">LMS</div>
      {isLoggedIn && (loading || userInfo) && (
        <div className="sidebar-userinfo">
          {loading ? (
            <span>Loading...</span>
          ) : userInfo ? (
              <div className="sidebar-role">Role: {userInfo.role === 'admin' ? 'Admin' : 'Instructor'}</div>
          ) : null}
        </div>
      )}
      <nav className="sidebar-nav">
        {isLoggedIn && (
          <>
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
              Dashboard
            </NavLink>
            {userInfo && userInfo.role === 'admin' && (
              <>
                <NavLink to="/categories" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
                  Categories
                </NavLink>
                <NavLink to="/courses" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
                  Courses
                </NavLink>
                <NavLink to="/instructors" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
                  Instructors
                </NavLink>
              </>
            )}
          </>
        )}
      </nav>
    </aside>
  );
}
