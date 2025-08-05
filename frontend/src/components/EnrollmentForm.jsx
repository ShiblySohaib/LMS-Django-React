import React, { useEffect, useState } from 'react';

import api from '../api';
import './EnrollmentForm.css';

const EnrollmentForm = ({ onSuccess }) => {
  const [instructors, setInstructors] = useState([]);
  const [courses, setCourses] = useState([]);
  const [instructorId, setInstructorId] = useState('');
  const [courseId, setCourseId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Get JWT token from localStorage
  const token = localStorage.getItem('access');

  // Axios config with Authorization header if token exists
  const axiosConfig = token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : {};

  useEffect(() => {
    // Fetch instructors
    api.get('/instructors/')
      .then(res => setInstructors(Array.isArray(res.data) ? res.data : []))
      .catch(() => setInstructors([]));
    // Fetch courses
    api.get('/courses/')
      .then(res => setCourses(Array.isArray(res.data) ? res.data : []))
      .catch(() => setCourses([]));
    // eslint-disable-next-line
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await api.post(
        '/enrollments/',
        {
          instructor_id: instructorId,
          course_id: courseId,
        }
      );
      setSuccess('Enrollment created successfully!');
      setInstructorId('');
      setCourseId('');
      if (onSuccess) onSuccess();
    } catch (err) {
      setError('Failed to create enrollment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="dashboard-form" onSubmit={handleSubmit}>
      <h2 className="dashboard-form-title">Create Enrollment</h2>
      {error && <div className="dashboard-form-error">{error}</div>}
      {success && <div className="dashboard-form-success">{success}</div>}
      <div className="dashboard-form-group">
        <label className="dashboard-form-label">Instructor:</label>
        <select
          className="dashboard-form-input"
          value={instructorId}
          onChange={e => setInstructorId(e.target.value)}
          required
        >
          <option value="">Select Instructor</option>
          {(Array.isArray(instructors) ? instructors : []).map(inst => (
            <option key={inst.id} value={inst.id}>
              {inst.username} ({inst.email})
            </option>
          ))}
        </select>
      </div>
      <div className="dashboard-form-group">
        <label className="dashboard-form-label">Course:</label>
        <select
          className="dashboard-form-input"
          value={courseId}
          onChange={e => setCourseId(e.target.value)}
          required
        >
          <option value="">Select Course</option>
          {(Array.isArray(courses) ? courses : []).map(course => (
            <option key={course.id} value={course.id}>
              {course.title}
            </option>
          ))}
        </select>
      </div>
      <button className="dashboard-form-button" type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Create Enrollment'}
      </button>
    </form>
  );
};

export default EnrollmentForm;
