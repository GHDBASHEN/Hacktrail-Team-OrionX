// frontend/src/pages/admin/FoodManagement.js

import React, { useState, useEffect } from 'react';
import { createFood, getAllFoods, updateFood, deleteFood } from '../../services/AdminServices';
import { getAllCategories } from '../../services/AdminServices'; // To populate the category dropdown

const FoodManagement = () => {
    const [foods, setFoods] = useState([]);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        food_name: '',
        category_id: '',
        price: '',
        meal_type: 'lunch',
        is_available: 1,
        image_url: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [currentFoodId, setCurrentFoodId] = useState(null);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchFoodsAndCategories();
    }, []);

    const fetchFoodsAndCategories = async () => {
        try {
            const foodsData = await getAllFoods();
            const categoriesData = await getAllCategories();
            setFoods(foodsData);
            setCategories(categoriesData);
        } catch (err) {
            setError('Failed to fetch data.');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setFormData({
            food_name: '',
            category_id: '',
            price: '',
            meal_type: 'lunch',
            is_available: 1,
            image_url: ''
        });
        setIsEditing(false);
        setCurrentFoodId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            if (isEditing) {
                await updateFood(currentFoodId, formData);
                setMessage('Food item updated successfully!');
            } else {
                await createFood(formData);
                setMessage('Food item created successfully!');
            }
            resetForm();
            fetchFoodsAndCategories();
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred.');
        }
    };

    const handleEdit = (food) => {
        setIsEditing(true);
        setCurrentFoodId(food.food_id);
        setFormData({
            food_name: food.food_name,
            category_id: food.category_id || '',
            price: food.price,
            meal_type: food.meal_type,
            is_available: food.is_available,
            image_url: food.image_url || ''
        });
    };

    const handleDelete = async (foodId) => {
        if (window.confirm('Are you sure you want to delete this food item?')) {
            try {
                await deleteFood(foodId);
                setMessage('Food item deleted successfully!');
                fetchFoodsAndCategories();
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to delete food item.');
            }
        }
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1 style={{ textAlign: 'center' }}>Food Management</h1>

            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
            {message && <p style={{ color: 'green', textAlign: 'center' }}>{message}</p>}

            {/* Form for adding/editing a food item */}
            <form onSubmit={handleSubmit} style={{ marginBottom: '40px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
                <h2>{isEditing ? 'Edit Food Item' : 'Add New Food Item'}</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <input name="food_name" value={formData.food_name} onChange={handleInputChange} placeholder="Food Name" required />
                    <input name="price" type="number" value={formData.price} onChange={handleInputChange} placeholder="Price" required />
                    <select name="category_id" value={formData.category_id} onChange={handleInputChange}>
                        <option value="">Select Category</option>
                        {categories.map(cat => <option key={cat.category_id} value={cat.category_id}>{cat.category_name}</option>)}
                    </select>
                    <select name="meal_type" value={formData.meal_type} onChange={handleInputChange}>
                        <option value="breakfast">Breakfast</option>
                        <option value="lunch">Lunch</option>
                        <option value="dinner">Dinner</option>
                    </select>
                    <input name="image_url" value={formData.image_url} onChange={handleInputChange} placeholder="Image URL" />
                     <select name="is_available" value={formData.is_available} onChange={handleInputChange}>
                        <option value={1}>Available</option>
                        <option value={0}>Not Available</option>
                    </select>
                </div>
                <div style={{ marginTop: '20px' }}>
                    <button type="submit">{isEditing ? 'Update Food' : 'Create Food'}</button>
                    {isEditing && <button type="button" onClick={resetForm} style={{ marginLeft: '10px' }}>Cancel Edit</button>}
                </div>
            </form>

            {/* Display list of food items */}
            <h2>Existing Food Items</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Meal Type</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {foods.map((food) => (
                        <tr key={food.food_id}>
                            <td>{food.food_name}</td>
                            <td>{food.category_name || 'N/A'}</td>
                            <td>{food.price}</td>
                            <td>{food.meal_type}</td>
                            <td>{food.is_available ? 'Available' : 'Unavailable'}</td>
                            <td>
                                <button onClick={() => handleEdit(food)} style={{ marginRight: '5px' }}>Edit</button>
                                <button onClick={() => handleDelete(food.food_id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default FoodManagement;
