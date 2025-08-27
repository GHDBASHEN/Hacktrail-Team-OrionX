import React, { useState, useEffect } from 'react';
import { createFood, getAllFoods, updateFood, deleteFood, getAllCategories } from '../../services/AdminServices';

const FoodManagement = () => {
    const [foods, setFoods] = useState([]);
    const [categories, setCategories] = useState([]);
    
    const initialFormState = {
        f_name: '',
        price: '',
        stock: '',
        expire_date: '',
        c_id: ''
    };
    const [formData, setFormData] = useState(initialFormState);
    
    const [isEditing, setIsEditing] = useState(false);
    const [currentFoodId, setCurrentFoodId] = useState(null);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFoodsAndCategories();
    }, []);

    const fetchFoodsAndCategories = async () => {
        setLoading(true);
        try {
            const [foodsData, categoriesData] = await Promise.all([
                getAllFoods(),
                getAllCategories()
            ]);
            setFoods(foodsData);
            setCategories(categoriesData);
            // Set default category in form if not editing
            if (!isEditing && categoriesData.length > 0) {
                setFormData(prev => ({ ...prev, c_id: categoriesData[0].c_id }));
            }
        } catch (err) {
            setError('Failed to fetch data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setFormData(initialFormState);
        setIsEditing(false);
        setCurrentFoodId(null);
        if (categories.length > 0) {
            setFormData(prev => ({ ...prev, c_id: categories[0].c_id }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

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
            setError(err.response?.data?.message || 'An error occurred while saving.');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (food) => {
        setIsEditing(true);
        setCurrentFoodId(food.f_id);
        setFormData({
            f_name: food.f_name,
            c_id: food.c_id || '',
            price: food.price,
            stock: food.stock,
            expire_date: new Date(food.expire_date).toISOString().split('T')[0] // Format for date input
        });
        document.getElementById('food-form').scrollIntoView({ behavior: 'smooth' });
    };

    const handleDelete = async (foodId) => {
        if (window.confirm('Are you sure you want to delete this food item?')) {
            setLoading(true);
            try {
                await deleteFood(foodId);
                setMessage('Food item deleted successfully!');
                fetchFoodsAndCategories();
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to delete food item.');
                setLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Standard Food Management</h1>
                    <p className="text-gray-600">Manage individual food items available for purchase.</p>
                </div>

                {error && <div className="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-sm">{error}</div>}
                {message && <div className="mb-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md shadow-sm">{message}</div>}

                <form id="food-form" onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-10">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">{isEditing ? 'Edit Food Item' : 'Add New Food Item'}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Food Name</label>
                            <input name="f_name" value={formData.f_name} onChange={handleInputChange} required className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Category</label>
                            <select name="c_id" value={formData.c_id} onChange={handleInputChange} required className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
                                <option value="">Select Category</option>
                                {categories.map(cat => <option key={cat.c_id} value={cat.c_id}>{cat.c_name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Price (Rs.)</label>
                            <input name="price" type="number" value={formData.price} onChange={handleInputChange} required min="0" step="0.01" className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Stock</label>
                            <input name="stock" type="number" value={formData.stock} onChange={handleInputChange} required min="0" className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                            <input name="expire_date" type="date" value={formData.expire_date} onChange={handleInputChange} required className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
                        </div>
                    </div>
                    <div className="flex space-x-3 mt-6 justify-end">
                        {isEditing && <button type="button" onClick={resetForm} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md">Cancel</button>}
                        <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md disabled:opacity-75">
                            {loading ? 'Saving...' : (isEditing ? 'Update Food' : 'Create Food')}
                        </button>
                    </div>
                </form>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="px-6 py-5 border-b"><h2 className="text-lg font-medium text-gray-900">Existing Food Items</h2></div>
                    {loading && foods.length === 0 ? <p className="text-center py-8">Loading...</p> : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expires</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {foods.map((food) => (
                                        <tr key={food.f_id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{food.f_name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{food.c_name || 'N/A'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Rs. {parseFloat(food.price).toFixed(2)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{food.stock}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(food.expire_date).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                                                <button onClick={() => handleEdit(food)} className="text-blue-600 hover:text-blue-900">Edit</button>
                                                <button onClick={() => handleDelete(food.f_id)} className="text-red-600 hover:text-red-900">Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FoodManagement;
