// frontend/src/pages/admin/CategoryManagement.js

import React, { useState, useEffect } from 'react';
import { createCategory, getAllCategories, updateCategory, deleteCategory } from '../../services/AdminServices';

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editingCategory, setEditingCategory] = useState(null); // To hold the category being edited
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    // Fetch all categories when the component mounts
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await getAllCategories();
            setCategories(data);
        } catch (err) {
            setError('Failed to fetch categories.');
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newCategoryName.trim()) {
            setError('Category name cannot be empty.');
            return;
        }
        try {
            await createCategory(newCategoryName);
            setNewCategoryName('');
            setMessage('Category created successfully!');
            setError('');
            fetchCategories(); // Refresh the list
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create category.');
            setMessage('');
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!editingCategory || !editingCategory.category_name.trim()) {
            setError('Category name cannot be empty.');
            return;
        }
        try {
            await updateCategory(editingCategory.category_id, editingCategory.category_name);
            setEditingCategory(null);
            setMessage('Category updated successfully!');
            setError('');
            fetchCategories(); // Refresh the list
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update category.');
            setMessage('');
        }
    };

    const handleDelete = async (categoryId) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await deleteCategory(categoryId);
                setMessage('Category deleted successfully!');
                setError('');
                fetchCategories(); // Refresh the list
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to delete category.');
                setMessage('');
            }
        }
    };

    const startEditing = (category) => {
        setEditingCategory({ ...category });
        setMessage('');
        setError('');
    };

    return (
        <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1 style={{ textAlign: 'center' }}>Category Management</h1>

            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
            {message && <p style={{ color: 'green', textAlign: 'center' }}>{message}</p>}

            {/* Form for creating a new category */}
            <form onSubmit={handleCreate} style={{ marginBottom: '40px', display: 'flex', gap: '10px' }}>
                <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Enter new category name"
                    style={{ flexGrow: 1, padding: '10px', fontSize: '1rem' }}
                />
                <button type="submit" style={{ padding: '10px 20px', fontSize: '1rem' }}>Add Category</button>
            </form>

            {/* Display list of categories */}
            <h2>Existing Categories</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>ID</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Name</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((cat) => (
                        <tr key={cat.category_id}>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{cat.category_id}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                {editingCategory && editingCategory.category_id === cat.category_id ? (
                                    <input
                                        type="text"
                                        value={editingCategory.category_name}
                                        onChange={(e) => setEditingCategory({ ...editingCategory, category_name: e.target.value })}
                                        style={{ padding: '5px', width: '90%' }}
                                    />
                                ) : (
                                    cat.category_name
                                )}
                            </td>
                            <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                                {editingCategory && editingCategory.category_id === cat.category_id ? (
                                    <>
                                        <button onClick={handleUpdate} style={{ marginRight: '5px' }}>Save</button>
                                        <button onClick={() => setEditingCategory(null)}>Cancel</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => startEditing(cat)} style={{ marginRight: '5px' }}>Edit</button>
                                        <button onClick={() => handleDelete(cat.category_id)}>Delete</button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CategoryManagement;
