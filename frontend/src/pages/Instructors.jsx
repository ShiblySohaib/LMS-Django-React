import React, { useEffect, useState } from 'react';
import AddInstructorForm from '../components/AddInstructorForm';
import UpdateInstructorForm from '../components/UpdateInstructorForm';
import api from '../api';
import './Instructors.css';

export default function Instructors() {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editInstructor, setEditInstructor] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchInstructors = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/instructors/');
      setInstructors(res.data);
    } catch (err) {
      setError('Failed to fetch instructors.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructors();
  }, []);

  const handleDelete = async (instructor) => {
    if (!window.confirm(`Delete instructor "${instructor.username}"? This cannot be undone.`)) return;
    setDeleteLoading(instructor.id);
    try {
      await api.delete(`/instructors/${instructor.id}/`);
      fetchInstructors();
    } catch {
      alert('Failed to delete instructor.');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="instructors-container">
      <AddInstructorForm onSuccess={fetchInstructors} />
      <h2>Instructors</h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : instructors.length === 0 ? (
        <div>No instructors found.</div>
      ) : (
        <table className="instructors-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th style={{ width: 120 }}></th>
            </tr>
          </thead>
          <tbody>
            {instructors.map(inst => (
              <tr key={inst.id}>
                <td>{inst.username}</td>
                <td>{inst.email}</td>
                <td style={{ display: 'flex', gap: 8 }}>
                  <button
                    style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px', fontWeight: 500, cursor: 'pointer' }}
                    onClick={() => setEditInstructor(inst)}
                  >Edit</button>
                  <button
                    style={{ background: '#d32f2f', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px', fontWeight: 500, cursor: deleteLoading === inst.id ? 'wait' : 'pointer', opacity: deleteLoading === inst.id ? 0.7 : 1 }}
                    onClick={() => handleDelete(inst)}
                    disabled={deleteLoading === inst.id}
                  >{deleteLoading === inst.id ? 'Deleting...' : 'Delete'}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {editInstructor && (
        <UpdateInstructorForm
          instructor={editInstructor}
          onClose={() => setEditInstructor(null)}
          onSuccess={() => {
            setEditInstructor(null);
            fetchInstructors();
          }}
        />
      )}
    </div>
  );
}
