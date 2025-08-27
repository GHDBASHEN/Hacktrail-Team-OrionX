import React, { useState, useEffect } from 'react';
import { 
    createDailyFood, 
    getAllDailyFoods, 
    updateDailyFood, 
    deleteDailyFood, 
    getAllCategories, 
    getAllDailyFoodComponents 
} from '../../services/AdminServices';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const DailyFoodManagement = () => {
    const [dailyFoods, setDailyFoods] = useState([]);
    const [categories, setCategories] = useState([]);
    const [allComponents, setAllComponents] = useState([]);
    const [expandedRowId, setExpandedRowId] = useState(null);
    
    const initialFormState = { d_name: '', meal_type: 'breakfast', meal_date: '', meal_price: '', c_id: '', components: [] };
    const [formData, setFormData] = useState(initialFormState);
    const [isEditing, setIsEditing] = useState(false);

    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setIsLoading(true);
        try {
            const [foodsData, categoriesData, componentsData] = await Promise.all([
                getAllDailyFoods(),
                getAllCategories(),
                getAllDailyFoodComponents()
            ]);
            setDailyFoods(foodsData.map(food => ({
                ...food,
                // Ensure component_ids is always an array for easier processing
                component_ids: food.component_ids ? food.component_ids.split(',') : []
            })));
            setCategories(categoriesData);
            setAllComponents(componentsData);
            if (categoriesData.length > 0 && !isEditing) {
                setFormData(prev => ({ ...prev, c_id: categoriesData[0].c_id }));
            }
            setError('');
        } catch (err) {
            setError('Failed to fetch necessary data. Please refresh the page.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        setFormData(prev => {
            const newComponents = checked
                ? [...prev.components, value]
                : prev.components.filter(id => id !== value);
            return { ...prev, components: newComponents };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.d_name || !formData.meal_date || !formData.meal_price || !formData.c_id) {
            setError('Please fill out all required fields.');
            return;
        }
        
        setIsLoading(true);
        try {
            if (isEditing) {
                await updateDailyFood(formData.d_id, formData);
                setMessage('Daily food updated successfully!');
            } else {
                await createDailyFood(formData);
                setMessage('Daily food created successfully!');
            }
            setError('');
            cancelEditing(); // Reset form
            fetchInitialData(); // Refresh all data
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred while saving.');
            setMessage('');
            setIsLoading(false);
        }
    };

    const handleDelete = async (foodId) => {
        if (window.confirm('Are you sure you want to delete this daily food item?')) {
            setIsLoading(true);
            try {
                await deleteDailyFood(foodId);
                setMessage('Daily food deleted successfully!');
                setError('');
                fetchInitialData();
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to delete daily food.');
                setMessage('');
                setIsLoading(false);
            }
        }
    };

    const startEditing = (food) => {
        setIsEditing(true);
        setFormData({
            ...food,
            meal_date: food.meal_date.split('T')[0], // Format date for input
            components: food.component_ids || []
        });
        setMessage('');
        setError('');
        window.scrollTo(0, 0); // Scroll to top to see the form
    };

    const cancelEditing = () => {
        setIsEditing(false);
        setFormData(initialFormState);
        if (categories.length > 0) {
            setFormData(prev => ({ ...prev, c_id: categories[0].c_id }));
        }
    };

    const toggleRowExpansion = (d_id) => {
        setExpandedRowId(prevId => (prevId === d_id ? null : d_id));
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Daily Food Management</h1>
                    <p className="text-gray-600">Create and manage daily meal packages</p>
                </div>

                {error && <div className="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-sm">{error}</div>}
                {message && <div className="mb-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md shadow-sm">{message}</div>}

                <div className="bg-white rounded-lg shadow-md p-6 mb-10">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">{isEditing ? 'Edit Daily Food' : 'Add New Daily Food'}</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Basic Info */}
                            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Meal Name</label>
                                    <input type="text" name="d_name" value={formData.d_name} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Date</label>
                                    <input type="date" name="meal_date" value={formData.meal_date} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Meal Type</label>
                                    <select name="meal_type" value={formData.meal_type} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                                        <option value="breakfast">Breakfast</option>
                                        <option value="lunch">Lunch</option>
                                        <option value="dinner">Dinner</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Category</label>
                                    <select name="c_id" value={formData.c_id} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required>
                                        {categories.map(cat => <option key={cat.c_id} value={cat.c_id}>{cat.c_name}</option>)}
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Total Price (Rs.)</label>
                                    <input type="number" step="0.01" name="meal_price" value={formData.meal_price} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                                </div>
                            </div>
                            {/* Component Selection */}
                            <div className="lg:col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Select Components</label>
                                <div className="bg-gray-50 border border-gray-300 rounded-md p-3 h-48 overflow-y-auto space-y-2">
                                    {allComponents.map(comp => (
                                        <label key={comp.dfc_id} className="flex items-center space-x-3 cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                value={comp.dfc_id}
                                                checked={formData.components.includes(comp.dfc_id)}
                                                onChange={handleCheckboxChange}
                                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="text-sm text-gray-800">{comp.dfc_name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-end space-x-3 pt-4">
                            {isEditing && <button type="button" onClick={cancelEditing} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>}
                            <button type="submit" disabled={isLoading} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:opacity-75">{isLoading ? 'Saving...' : (isEditing ? 'Update Meal' : 'Create Meal')}</button>
                        </div>
                    </form>
                </div>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                     <div className="px-6 py-5 border-b border-gray-200"><h2 className="text-lg font-medium text-gray-900">Existing Daily Foods</h2></div>
                    {isLoading && dailyFoods.length === 0 ? <p className="text-center py-8 text-gray-500">Loading...</p> : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="w-12"></th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {dailyFoods.map(food => (
                                        <React.Fragment key={food.d_id}>
                                            <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => toggleRowExpansion(food.d_id)}>
                                                <td className="pl-4">
                                                    {expandedRowId === food.d_id ? <FaChevronUp className="text-gray-500"/> : <FaChevronDown className="text-gray-400"/>}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">{new Date(food.meal_date).toLocaleDateString()}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{food.d_name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm capitalize">{food.meal_type}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">Rs. {parseFloat(food.meal_price).toFixed(2)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                                                    <button onClick={(e) => { e.stopPropagation(); startEditing(food); }} className="text-blue-600 hover:text-blue-900">Edit</button>
                                                    <button onClick={(e) => { e.stopPropagation(); handleDelete(food.d_id); }} className="text-red-600 hover:text-red-900">Delete</button>
                                                </td>
                                            </tr>
                                            {expandedRowId === food.d_id && (
                                                <tr>
                                                    <td colSpan="6" className="p-0">
                                                        <div className="bg-blue-50 px-8 py-4">
                                                            <h4 className="font-semibold text-sm text-gray-800 mb-2">Included Components:</h4>
                                                            <p className="text-sm text-gray-600">
                                                                {food.component_names || 'No components assigned.'}
                                                            </p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
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

export default DailyFoodManagement;
