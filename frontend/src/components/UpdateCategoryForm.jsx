
import React, { useState } from 'react';
import api from '../api';
import './UpdateCategoryForm.css';

const UpdateCategoryForm = ({ category, onClose, onSuccess }) => {
  const [name, setName] = useState(category?.name || '');
  const [description, setDescription] = useState(category?.description || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await api.put(`/categories/${category.id}/`, { name, description });
      setSuccess('Category updated successfully!');
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err) {
      setError('Failed to update category.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="update-category-modal-overlay">
      <div className="update-category-modal">
        <form className="update-category-form" onSubmit={handleSubmit}>
          <div className="update-category-form-title">Edit Category</div>
          {error && <div className="update-category-form-error">{error}</div>}
          {success && <div className="update-category-form-success">{success}</div>}
          <div className="update-category-form-group">
            <label className="update-category-form-label" htmlFor="edit-category-name">Category Name</label>
            <input
              id="edit-category-name"
              className="update-category-form-input"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          <div className="update-category-form-group">
            <label className="update-category-form-label" htmlFor="edit-category-desc">Description (optional)</label>
            <textarea
              id="edit-category-desc"
              className="update-category-form-input"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button className="update-category-form-button" type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
            <button type="button" className="update-category-form-cancel" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateCategoryForm;
