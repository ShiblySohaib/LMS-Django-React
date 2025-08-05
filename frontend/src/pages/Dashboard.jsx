





import React, { useEffect, useState } from 'react';
import api from '../api';
import './Dashboard.css';

import EnrollmentForm from '../components/EnrollmentForm';
import UpdateEnrollmentForm from '../components/UpdateEnrollmentForm';

export default function Dashboard() {
  const [enrollments, setEnrollments] = useState([]);
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [editEnrollment, setEditEnrollment] = useState(null);

  // Fetch user info
  useEffect(() => {
    async function fetchUserInfo() {
      setLoadingUser(true);
      try {
        const res = await api.get('/accounts/userinfo/');
        setUserInfo(res.data);
      } catch (err) {
        setUserInfo(null);
      } finally {
        setLoadingUser(false);
      }
    }
    fetchUserInfo();
  }, []);

  // Fetch enrollments
  const fetchEnrollments = async () => {
    try {
      const res = await api.get('/enrollments/?expand=course,instructor');
      setEnrollments(res.data);
      setFiltered(res.data);
    } catch (err) {
      setEnrollments([]);
      setFiltered([]);
    }
  };

  useEffect(() => {
    fetchEnrollments();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      enrollments.filter(e => {
        const course = e.course?.title?.toLowerCase() || '';
        const instructor = e.instructor?.username?.toLowerCase() || '';
        const category = e.course?.category?.name?.toLowerCase() || '';
        return (
          course.includes(q) ||
          instructor.includes(q) ||
          category.includes(q)
        );
      })
    );
  }, [search, enrollments]);

  // Delete enrollment handler
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this enrollment?')) return;
    try {
      await api.delete(`/enrollments/${id}/`);
      fetchEnrollments();
    } catch (err) {
      alert('Failed to delete enrollment.');
    }
  };

  return (
    <div className="dashboard-container">
      {loadingUser ? (
        <div style={{ color: 'gray', fontWeight: 'bold', margin: '2rem 0' }}>Loading user info...</div>
      ) : userInfo && userInfo.role === 'admin' ? (
        <div style={{ marginBottom: '2rem' }}>
          <EnrollmentForm onSuccess={fetchEnrollments} />
        </div>
      ) : null}
      <h2>All Enrollments</h2>
      <input
        type="text"
        placeholder="Search by course, instructor, or category"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="dashboard-search"
      />
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Sl No</th>
            <th>Course Name</th>
            <th>Category</th>
            <th>Instructor Name</th>
            {userInfo && userInfo.role === 'admin' && <th></th>}
            {userInfo && userInfo.role === 'admin' && <th></th>}
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr><td colSpan={userInfo && userInfo.role === 'admin' ? 6 : 4}>No enrollments found.</td></tr>
          ) : (
            filtered.map((e, idx) => (
              <tr key={e.id || idx}>
                <td>{idx + 1}</td>
                <td>{e.course?.title || '-'}</td>
                <td>{e.course?.category?.name || '-'}</td>
                <td>{e.instructor?.username || '-'}</td>
                {userInfo && userInfo.role === 'admin' && (
                  <>
                    <td>
                      <button
                        style={{
                          background: '#1976d2',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '0.3rem',
                          padding: '0.3rem 0.8rem',
                          cursor: 'pointer',
                          fontWeight: 500,
                          marginRight: '0.3rem'
                        }}
                        onClick={() => setEditEnrollment(e)}
                      >
                        Edit
                      </button>
                    </td>
                    <td>
                      <button
                        style={{
                          background: '#d32f2f',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '0.3rem',
                          padding: '0.3rem 0.8rem',
                          cursor: 'pointer',
                          fontWeight: 500
                        }}
                        onClick={() => handleDelete(e.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
      {editEnrollment && (
        <UpdateEnrollmentForm
          enrollment={editEnrollment}
          onClose={() => setEditEnrollment(null)}
          onSuccess={() => {
            setEditEnrollment(null);
            fetchEnrollments();
          }}
        />
      )}
    </div>
  );
}
