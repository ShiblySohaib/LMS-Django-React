import React, { useState } from 'react';
import api from '../api';
import './AddCategoryForm.css';

export default function AddCategoryForm({ onSuccess }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/categories/', { name, description });
      setName('');
      setDescription('');
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.name?.[0] || 'Failed to add category.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="add-category-form" onSubmit={handleSubmit}>
      <div className="add-category-form-title">Add New Category</div>
      <div className="add-category-form-group">
        <label className="add-category-form-label" htmlFor="category-name">Category Name</label>
        <input
          id="category-name"
          className="add-category-form-input"
          type="text"
          placeholder="Category Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
      </div>
      <div className="add-category-form-group">
        <label className="add-category-form-label" htmlFor="category-desc">Description (optional)</label>
        <textarea
          id="category-desc"
          className="add-category-form-input"
          placeholder="Description (optional)"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </div>
      {error && <div className="add-category-form-error">{error}</div>}
      <button className="add-category-form-button" type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add Category'}</button>
    </form>
  );
}
