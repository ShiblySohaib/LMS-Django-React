import React, { useState } from 'react';
import api from '../api';
import './UpdateCourseForm.css';

export default function UpdateCourseForm({ course, onClose, onSuccess, categories }) {
  const [title, setTitle] = useState(course.title || '');
  const [description, setDescription] = useState(course.description || '');
  const [category, setCategory] = useState(course.category?.id || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await api.patch(`/courses/${course.id}/`, { title, description, category_id: category });
      setSuccess('Course updated successfully!');
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err) {
      setError(err.response?.data?.title?.[0] || 'Failed to update course.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="update-course-modal-overlay">
      <div className="update-course-modal">
        <form className="update-course-form" onSubmit={handleSubmit}>
          <div className="update-course-form-title">Edit Course</div>
          {error && <div className="update-course-form-error">{error}</div>}
          {success && <div className="update-course-form-success">{success}</div>}
          <div className="update-course-form-group">
            <label className="update-course-form-label" htmlFor="edit-course-title">Course Title</label>
            <input
              id="edit-course-title"
              className="update-course-form-input"
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="update-course-form-group">
            <label className="update-course-form-label" htmlFor="edit-course-desc">Description (optional)</label>
            <textarea
              id="edit-course-desc"
              className="update-course-form-input"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>
          <div className="update-course-form-group">
            <label className="update-course-form-label" htmlFor="edit-course-category">Category</label>
            <select
              id="edit-course-category"
              className="update-course-form-input"
              value={category}
              onChange={e => setCategory(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button className="update-course-form-button" type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
            <button type="button" className="update-course-form-cancel" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
