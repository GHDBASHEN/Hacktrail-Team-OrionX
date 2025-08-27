import React, { useState, useEffect } from 'react';
import { 
    createDailyFoodComponent, 
    getAllDailyFoodComponents, 
    updateDailyFoodComponent, 
    deleteDailyFoodComponent 
} from '../../services/AdminServices';

const DailyFoodComponentManagement = () => {
    const [components, setComponents] = useState([]);
    const [newComponent, setNewComponent] = useState({ dfc_name: '', dfc_price: '' });
    const [editingComponent, setEditingComponent] = useState(null);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchComponents();
    }, []);

    const fetchComponents = async () => {
        setIsLoading(true);
        try {
            const data = await getAllDailyFoodComponents();
            setComponents(data);
            setError('');
        } catch (err) {
            setError('Failed to fetch components. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e, formType) => {
        const { name, value } = e.target;
        if (formType === 'new') {
            setNewComponent(prevState => ({ ...prevState, [name]: value }));
        } else {
            setEditingComponent(prevState => ({ ...prevState, [name]: value }));
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newComponent.dfc_name.trim() || !newComponent.dfc_price) {
            setError('Component name and price cannot be empty.');
            return;
        }
        setIsLoading(true);
        try {
            await createDailyFoodComponent(newComponent);
            setNewComponent({ dfc_name: '', dfc_price: '' });
            setMessage('Component created successfully!');
            setError('');
            fetchComponents(); // Refresh the list
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create component.');
            setMessage('');
            setIsLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!editingComponent || !editingComponent.dfc_name.trim() || !editingComponent.dfc_price) {
            setError('Component name and price cannot be empty.');
            return;
        }
        setIsLoading(true);
        try {
            await updateDailyFoodComponent(editingComponent.dfc_id, {
                dfc_name: editingComponent.dfc_name,
                dfc_price: editingComponent.dfc_price
            });
            setEditingComponent(null);
            setMessage('Component updated successfully!');
            setError('');
            fetchComponents(); // Refresh the list
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update component.');
            setMessage('');
            setIsLoading(false);
        }
    };

    const handleDelete = async (componentId) => {
        if (window.confirm('Are you sure you want to delete this component?')) {
            setIsLoading(true);
            try {
                await deleteDailyFoodComponent(componentId);
                setMessage('Component deleted successfully!');
                setError('');
                fetchComponents(); // Refresh the list
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to delete component.');
                setMessage('');
                setIsLoading(false);
            }
        }
    };

    const startEditing = (component) => {
        setEditingComponent({ ...component });
        setMessage('');
        setError('');
    };

    const cancelEditing = () => {
        setEditingComponent(null);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Daily Food Component Management</h1>
                    <p className="text-gray-600">Add, edit, or remove individual meal components</p>
                </div>

                {/* Status Messages */}
                {error && <div className="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-sm">{error}</div>}
                {message && <div className="mb-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md shadow-sm">{message}</div>}

                {/* Create Component Form */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-10">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Add New Component</h2>
                    <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div className="md:col-span-1">
                            <label htmlFor="dfc_name" className="block text-sm font-medium text-gray-700">Component Name</label>
                            <input
                                type="text"
                                name="dfc_name"
                                id="dfc_name"
                                value={newComponent.dfc_name}
                                onChange={(e) => handleInputChange(e, 'new')}
                                placeholder="e.g., White Rice"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                disabled={isLoading}
                            />
                        </div>
                        <div className="md:col-span-1">
                             <label htmlFor="dfc_price" className="block text-sm font-medium text-gray-700">Price</label>
                            <input
                                type="number"
                                name="dfc_price"
                                id="dfc_price"
                                value={newComponent.dfc_price}
                                onChange={(e) => handleInputChange(e, 'new')}
                                placeholder="e.g., 50.00"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                disabled={isLoading}
                            />
                        </div>
                        <button type="submit" disabled={isLoading} className="w-full md:w-auto justify-center inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-75">
                            {isLoading ? 'Adding...' : 'Add Component'}
                        </button>
                    </form>
                </div>

                {/* Components List */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-200">
                        <h2 className="text-lg font-medium text-gray-900">Existing Components</h2>
                    </div>
                    {isLoading && components.length === 0 ? (
                        <p className="text-center py-8 text-gray-500">Loading components...</p>
                    ) : !isLoading && components.length === 0 ? (
                        <p className="text-center py-8 text-gray-500">No components found. Get started by adding one above.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {components.map((comp) => (
                                        <tr key={comp.dfc_id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{comp.dfc_id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {editingComponent && editingComponent.dfc_id === comp.dfc_id ? (
                                                    <input type="text" name="dfc_name" value={editingComponent.dfc_name} onChange={(e) => handleInputChange(e, 'edit')} className="block w-full border-gray-300 rounded-md shadow-sm sm:text-sm" autoFocus />
                                                ) : (
                                                    comp.dfc_name
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {editingComponent && editingComponent.dfc_id === comp.dfc_id ? (
                                                    <input type="number" name="dfc_price" value={editingComponent.dfc_price} onChange={(e) => handleInputChange(e, 'edit')} className="block w-full border-gray-300 rounded-md shadow-sm sm:text-sm" />
                                                ) : (
                                                    `Rs. ${parseFloat(comp.dfc_price).toFixed(2)}`
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                {editingComponent && editingComponent.dfc_id === comp.dfc_id ? (
                                                    <div className="flex justify-end space-x-2">
                                                        <button onClick={handleUpdate} disabled={isLoading} className="text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded-md text-sm">Save</button>
                                                        <button onClick={cancelEditing} disabled={isLoading} className="text-gray-700 bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-md text-sm">Cancel</button>
                                                    </div>
                                                ) : (
                                                    <div className="flex justify-end space-x-2">
                                                        <button onClick={() => startEditing(comp)} disabled={isLoading} className="text-blue-600 hover:text-blue-900 font-medium">Edit</button>
                                                        <button onClick={() => handleDelete(comp.dfc_id)} disabled={isLoading} className="text-red-600 hover:text-red-900 font-medium">Delete</button>
                                                    </div>
                                                )}
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

export default DailyFoodComponentManagement;
