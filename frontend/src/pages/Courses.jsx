import React, { useEffect, useState } from 'react';
import AddCourseForm from '../components/AddCourseForm';
import UpdateCourseForm from '../components/UpdateCourseForm';
import api from '../api';
import './Courses.css';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editCourse, setEditCourse] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchCourses = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/courses/?expand=category');
      setCourses(res.data);
    } catch (err) {
      setError('Failed to fetch courses.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories/');
      setCategories(res.data);
    } catch {}
  };

  useEffect(() => {
    fetchCourses();
    fetchCategories();
  }, []);

  const handleDelete = async (course) => {
    if (!window.confirm(`Delete course "${course.title}"? This cannot be undone.`)) return;
    setDeleteLoading(course.id);
    try {
      await api.delete(`/courses/${course.id}/`);
      fetchCourses();
    } catch {
      alert('Failed to delete course.');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="courses-container">
      <AddCourseForm onSuccess={fetchCourses} categories={categories} />
      <h2>Courses</h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : courses.length === 0 ? (
        <div>No courses found.</div>
      ) : (
        <table className="courses-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Category</th>
              <th style={{ width: 120 }}></th>
            </tr>
          </thead>
          <tbody>
            {courses.map(course => (
              <tr key={course.id}>
                <td>{course.title}</td>
                <td>{course.description || '-'}</td>
                <td>{course.category?.name || '-'}</td>
                <td style={{ display: 'flex', gap: 8 }}>
                  <button
                    style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px', fontWeight: 500, cursor: 'pointer' }}
                    onClick={() => setEditCourse(course)}
                  >Edit</button>
                  <button
                    style={{ background: '#d32f2f', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px', fontWeight: 500, cursor: deleteLoading === course.id ? 'wait' : 'pointer', opacity: deleteLoading === course.id ? 0.7 : 1 }}
                    onClick={() => handleDelete(course)}
                    disabled={deleteLoading === course.id}
                  >{deleteLoading === course.id ? 'Deleting...' : 'Delete'}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {editCourse && (
        <UpdateCourseForm
          course={editCourse}
          categories={categories}
          onClose={() => setEditCourse(null)}
          onSuccess={() => {
            setEditCourse(null);
            fetchCourses();
          }}
        />
      )}
    </div>
  );
}
