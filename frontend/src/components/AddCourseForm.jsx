import React, { useState } from 'react';
import api from '../api';
import './AddCourseForm.css';

export default function AddCourseForm({ onSuccess, categories }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/courses/', { title, description, category_id: category });
      setTitle('');
      setDescription('');
      setCategory('');
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.title?.[0] || 'Failed to add course.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="add-course-form" onSubmit={handleSubmit}>
      <div className="add-course-form-title">Add New Course</div>
      <div className="add-course-form-group">
        <label className="add-course-form-label" htmlFor="course-title">Course Title</label>
        <input
          id="course-title"
          className="add-course-form-input"
          type="text"
          placeholder="Course Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="add-course-form-group">
        <label className="add-course-form-label" htmlFor="course-desc">Description (optional)</label>
        <textarea
          id="course-desc"
          className="add-course-form-input"
          placeholder="Description (optional)"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </div>
      <div className="add-course-form-group">
        <label className="add-course-form-label" htmlFor="course-category">Category</label>
        <select
          id="course-category"
          className="add-course-form-input"
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
      {error && <div className="add-course-form-error">{error}</div>}
      <button className="add-course-form-button" type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add Course'}</button>
    </form>
  );
}
