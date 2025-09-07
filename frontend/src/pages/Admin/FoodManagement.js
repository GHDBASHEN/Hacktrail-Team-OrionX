import React, { useState, useEffect } from 'react';
import { createFood, getAllFoods, updateFood, deleteFood, getAllCategories } from '../../services/AdminServices.js';

const API_URL = 'http://localhost:8000'; // Define the base URL for images

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
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    
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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const resetForm = () => {
        setFormData(initialFormState);
        setIsEditing(false);
        setCurrentFoodId(null);
        setImageFile(null);
        setImagePreview('');
        if (document.getElementById('image-upload')) {
            document.getElementById('image-upload').value = null;
        }
        if (categories.length > 0) {
            setFormData(prev => ({ ...prev, c_id: categories[0].c_id }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        const formDataToSend = new FormData();
        formDataToSend.append('f_name', formData.f_name);
        formDataToSend.append('price', formData.price);
        formDataToSend.append('stock', formData.stock);
        formDataToSend.append('expire_date', formData.expire_date);
        formDataToSend.append('c_id', formData.c_id);
        if (imageFile) {
            formDataToSend.append('image', imageFile);
        }

        try {
            if (isEditing) {
                await updateFood(currentFoodId, formDataToSend);
                setMessage('Food item updated successfully!');
            } else {
                await createFood(formDataToSend);
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
            expire_date: new Date(food.expire_date).toISOString().split('T')[0]
        });
        setImageFile(null);
        setImagePreview(food.image_path ? `${API_URL}/${food.image_path}` : '');
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
            <div className="max-w-7xl mx-auto">
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
                        <div className="lg:col-span-1 md:col-span-2">
                             <label className="block text-sm font-medium text-gray-700">Food Image</label>
                            <div className="mt-1 flex items-center space-x-4">
                                <span className="h-20 w-20 rounded-md overflow-hidden bg-gray-100">
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" className="h-full w-full object-cover"/>
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center text-gray-400">
                                            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        </div>
                                    )}
                                </span>
                                <input id="image-upload" type="file" name="image" onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
                            </div>
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
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
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
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="h-12 w-12 flex-shrink-0">
                                                    {food.image_path ? (
                                                        <img className="h-12 w-12 rounded-md object-cover" src={`${API_URL}/${food.image_path}`} alt={food.f_name} />
                                                    ) : (
                                                        <div className="h-12 w-12 rounded-md bg-gray-100 flex items-center justify-center text-gray-400">
                                                          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
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

