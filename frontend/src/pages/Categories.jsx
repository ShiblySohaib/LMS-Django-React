import React, { useEffect, useState } from 'react';
import AddCategoryForm from '../components/AddCategoryForm';
import UpdateCategoryForm from '../components/UpdateCategoryForm';
import api from '../api';
import './Categories.css';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editCategory, setEditCategory] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/categories/');
      setCategories(res.data);
    } catch (err) {
      setError('Failed to fetch categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (cat) => {
    if (!window.confirm(`Delete category "${cat.name}"? This cannot be undone.`)) return;
    setDeleteLoading(cat.id);
    try {
      await api.delete(`/categories/${cat.id}/`);
      fetchCategories();
    } catch (e) {
      alert('Failed to delete category.');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="categories-container">
      <AddCategoryForm onSuccess={fetchCategories} />
      <h2>Categories</h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : categories.length === 0 ? (
        <div>No categories found.</div>
      ) : (
        <table className="categories-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th style={{ width: 120 }}></th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat.id || cat.name}>
                <td>{cat.name}</td>
                <td>{cat.description || '-'}</td>
                <td style={{ display: 'flex', gap: 8 }}>
                  <button
                    style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px', fontWeight: 500, cursor: 'pointer' }}
                    onClick={() => setEditCategory(cat)}
                  >Edit</button>
                  <button
                    style={{ background: '#d32f2f', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px', fontWeight: 500, cursor: deleteLoading === cat.id ? 'wait' : 'pointer', opacity: deleteLoading === cat.id ? 0.7 : 1 }}
                    onClick={() => handleDelete(cat)}
                    disabled={deleteLoading === cat.id}
                  >{deleteLoading === cat.id ? 'Deleting...' : 'Delete'}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {editCategory && (
        <UpdateCategoryForm
          category={editCategory}
          onClose={() => setEditCategory(null)}
          onSuccess={() => {
            setEditCategory(null);
            fetchCategories();
          }}
        />
      )}
    </div>
  );
}
