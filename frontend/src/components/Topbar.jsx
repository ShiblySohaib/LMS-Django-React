import React, { useEffect, useState } from 'react';
import './Topbar.css';
import api from '../api';

export default function Topbar({ pageTitle, onLogout }) {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const res = await api.get('/accounts/userinfo/');
        setUserInfo(res.data);
      } catch (err) {
        setUserInfo(null);
      } finally {
        setLoading(false);
      }
    }
    fetchUserInfo();
  }, []);

  return (
    <header className="topbar" style={{ display: 'flex', alignItems: 'center' }}>
      <div className="topbar-title">{pageTitle}</div>
      <div style={{ flex: 1 }} />
      {(!loading && userInfo) && (
        <>
          <button className="topbar-logout-btn" type="button" style={{ display: 'flex', alignItems: 'center', cursor: 'default', marginRight: 12 }} disabled>
            <span className="topbar-profile-icon">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                alt="Profile"
                width={30}
                height={30}
                style={{ borderRadius: '50%', background: '#eaf1ff', marginRight: 8 }}
              />
            </span>
            <span className="topbar-username">{userInfo.username}</span>
          </button>
          {onLogout && (
            <button className="topbar-logout-btn" onClick={onLogout}>
              Logout
            </button>
          )}
        </>
      )}
    </header>
  );
}
