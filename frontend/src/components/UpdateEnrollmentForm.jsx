import React, { useState } from 'react';
import api from '../api';
import './EnrollmentForm.css';

const UpdateEnrollmentForm = ({ enrollment, onClose, onSuccess }) => {
  const [instructorId, setInstructorId] = useState(enrollment.instructor?.id || '');
  const [courseId, setCourseId] = useState(enrollment.course?.id || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [instructors, setInstructors] = useState([]);
  const [courses, setCourses] = useState([]);

  React.useEffect(() => {
    api.get('/instructors/')
      .then(res => setInstructors(Array.isArray(res.data) ? res.data : []))
      .catch(() => setInstructors([]));
    api.get('/courses/')
      .then(res => setCourses(Array.isArray(res.data) ? res.data : []))
      .catch(() => setCourses([]));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await api.patch(`/enrollments/${enrollment.id}/`, {
        instructor_id: instructorId,
        course_id: courseId,
      });
      setSuccess('Enrollment updated successfully!');
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err) {
      setError('Failed to update enrollment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-modal-overlay">
      <div className="dashboard-modal">
        <form className="dashboard-form" onSubmit={handleSubmit}>
          <h2 className="dashboard-form-title">Edit Enrollment</h2>
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
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button className="dashboard-form-button" type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              className="dashboard-form-button"
              style={{ background: '#888', color: '#fff' }}
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateEnrollmentForm;
