
import React, { useState, useEffect } from 'react';
import { createFood, getAllFoods, updateFood, deleteFood } from '../../services/AdminServices';
import { getAllCategories } from '../../services/AdminServices';

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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFoodsAndCategories();
    }, []);

    const fetchFoodsAndCategories = async () => {
        try {
            setLoading(true);
            const foodsData = await getAllFoods();
            const categoriesData = await getAllCategories();
            setFoods(foodsData);
            setCategories(categoriesData);
        } catch (err) {
            setError('Failed to fetch data.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: type === 'checkbox' ? e.target.checked : value 
        }));
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
        setError('');
        setMessage('');
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
        // Scroll to form
        document.getElementById('food-form').scrollIntoView({ behavior: 'smooth' });
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
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <h1 className="text-3xl font-bold text-center mb-8 text-blue-800">Food Management</h1>

            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
                    <p>{error}</p>
                </div>
            )}
            
            {message && (
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded">
                    <p>{message}</p>
                </div>
            )}

            {/* Form for adding/editing a food item */}
            <form 
                id="food-form"
                onSubmit={handleSubmit} 
                className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-200"
            >
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                    {isEditing ? 'Edit Food Item' : 'Add New Food Item'}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Food Name</label>
                        <input 
                            name="food_name" 
                            value={formData.food_name} 
                            onChange={handleInputChange} 
                            placeholder="Food Name" 
                            required 
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price (LKR)</label>
                        <input 
                            name="price" 
                            type="number" 
                            value={formData.price} 
                            onChange={handleInputChange} 
                            placeholder="Price" 
                            required 
                            min="0"
                            step="0.01"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select 
                            name="category_id" 
                            value={formData.category_id} 
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Select Category</option>
                            {categories.map(cat => (
                                <option key={cat.category_id} value={cat.category_id}>
                                    {cat.category_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Meal Type</label>
                        <select 
                            name="meal_type" 
                            value={formData.meal_type} 
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="breakfast">Breakfast</option>
                            <option value="lunch">Lunch</option>
                            <option value="dinner">Dinner</option>
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                        <input 
                            name="image_url" 
                            value={formData.image_url} 
                            onChange={handleInputChange} 
                            placeholder="Image URL" 
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                        <select 
                            name="is_available" 
                            value={formData.is_available} 
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value={1}>Available</option>
                            <option value={0}>Not Available</option>
                        </select>
                    </div>
                </div>
                
                <div className="flex space-x-3">
                    <button 
                        type="submit" 
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-300"
                    >
                        {isEditing ? 'Update Food' : 'Create Food'}
                    </button>
                    
                    {isEditing && (
                        <button 
                            type="button" 
                            onClick={resetForm}
                            className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-md transition-colors duration-300"
                        >
                            Cancel Edit
                        </button>
                    )}
                </div>
            </form>

            {/* Display list of food items */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">Existing Food Items</h2>
                    <button 
                        onClick={fetchFoodsAndCategories}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md transition-colors duration-300 flex items-center"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Refresh
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : foods.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <p className="text-gray-600 mt-4">No food items found. Add your first food item above.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Meal Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {foods.map((food) => (
                                    <tr key={food.food_id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {food.image_url && (
                                                    <div className="flex-shrink-0 h-10 w-10 mr-3">
                                                        <img 
                                                            className="h-10 w-10 rounded-full object-cover" 
                                                            src={food.image_url} 
                                                            alt={food.food_name}
                                                            onError={(e) => {
                                                                e.target.src = 'https://placehold.co/40x40?text=No+Image';
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                                <div className="font-medium text-gray-900">{food.food_name}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {food.category_name || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            LKR {food.price}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                                            {food.meal_type}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${food.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {food.is_available ? 'Available' : 'Unavailable'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button 
                                                onClick={() => handleEdit(food)}
                                                className="text-blue-600 hover:text-blue-900 mr-3"
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(food.food_id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FoodManagement;