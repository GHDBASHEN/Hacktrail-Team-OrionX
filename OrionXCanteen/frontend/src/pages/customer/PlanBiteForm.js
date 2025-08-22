import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PlanBiteMenu, getBiteMenu, UpdateBiteMenu, deleteBiteMenu, getBiteMenuItems } from '../../services/EventService';
import { decryptBookingId } from '../../utills/encryptionUtils';
import { ShoppingCartIcon, TrashIcon, PlusCircleIcon, PencilSquareIcon } from '@heroicons/react/24/outline';

const PlanBiteForm = () => {
    const { bookingId: encryptedBookingId } = useParams();
    const [menuItems, setMenuItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState({});
    const [existingPlan, setExistingPlan] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const decryptedBookingId = decryptBookingId(encryptedBookingId);

   useEffect(() => {
    const initializeData = async () => {
        try {
            setLoading(true);
            setError('');
            setSuccess('');

            // Load menu items
            const menuResponse = await getBiteMenuItems();
            setMenuItems(menuResponse || []);

            // Load existing plan with retry logic
            const loadPlan = async (attempt = 1) => {
                try {
                    const planResponse = await getBiteMenu(decryptedBookingId);
                    if (planResponse.biteItems?.length > 0) {
                        setExistingPlan(planResponse);
                        const initialSelected = {};
                        planResponse.biteItems.forEach(item => {
                            initialSelected[item.menu_type_id] = item.Quantity;
                        });
                        setSelectedItems(initialSelected);
                    }
                } catch (error) {
                    if (attempt < 3) {
                        await new Promise(resolve => setTimeout(resolve, 500));
                        return loadPlan(attempt + 1);
                    }
                    throw error;
                }
            };
            
            await loadPlan();

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };
    initializeData();
}, [decryptedBookingId]);

    const handleQuantityChange = (menuTypeId, quantity) => {
        setSelectedItems(prev => ({
            ...prev,
            [menuTypeId]: Math.max(0, Number(quantity))
        }));
    };

    const calculateTotal = () => {
        return menuItems.reduce((total, item) => {
            const price = Number(item.price) || 0;
            const qty = selectedItems[item.menu_type_id] || 0;
            return total + (qty * price);
        }, 0);
    };

    const formatCurrency = (value) => {
        return `LKR ${value.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const biteItems = Object.entries(selectedItems)
                .filter(([_, qty]) => qty > 0)
                .map(([menu_type_id, quantity]) => ({
                    menu_type_id,
                    Quantity: Number(quantity)
                }));

            if (biteItems.length === 0) {
                throw new Error('Please select at least one menu item');
            }

            // Save or update plan
            if (existingPlan) {
                await UpdateBiteMenu(decryptedBookingId, biteItems);
            } else {
                await PlanBiteMenu(decryptedBookingId, biteItems);
            }

            // Refresh data
            const updatedPlan = await getBiteMenu(decryptedBookingId);
            setExistingPlan(updatedPlan);
            setSuccess('Plan saved successfully!');
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this bite plan?')) {
            try {
                setLoading(true);
                await deleteBiteMenu(decryptedBookingId);
                setSuccess('Bite plan deleted successfully!');
                setExistingPlan(null);
                setSelectedItems({});
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-white to-orange-50 rounded-2xl shadow-xl mt-8 border border-orange-100">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-orange-100 rounded-lg">
                    <ShoppingCartIcon className="w-8 h-8 text-orange-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800">
                    {existingPlan ? 'Manage Bite Menu' : 'Plan Your Bite Menu'}
                </h2>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {menuItems.map(item => (
                        <div key={item.menu_type_id} className="p-4 bg-white rounded-xl border border-orange-100 shadow-sm">
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    {item.menu_type_name}
                                </h3>
                                <div className="text-orange-600 font-medium">
                                    {formatCurrency(item.price || 0)}
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <button
                                    type="button"
                                    onClick={() => handleQuantityChange(item.menu_type_id, (selectedItems[item.menu_type_id] || 0) - 1)}
                                    className="px-3 py-1 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200"
                                    disabled={loading}
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    value={selectedItems[item.menu_type_id] || 0}
                                    onChange={(e) => handleQuantityChange(item.menu_type_id, parseInt(e.target.value) || 0)}
                                    className="w-20 text-center border-2 border-orange-100 rounded-lg py-1"
                                    min="0"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => handleQuantityChange(item.menu_type_id, (selectedItems[item.menu_type_id] || 0) + 1)}
                                    className="px-3 py-1 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200"
                                    disabled={loading}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 p-6 bg-white rounded-xl border border-orange-100 shadow-sm">
                    <div className="flex justify-between items-center">
                        <div className="text-2xl font-bold text-gray-800">
                            Total: {formatCurrency(calculateTotal())}
                        </div>
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-xl ${
                                    loading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                {loading ? (
                                    <span>Processing...</span>
                                ) : existingPlan ? (
                                    <>
                                        <PencilSquareIcon className="w-5 h-5" />
                                        Update
                                    </>
                                ) : (
                                    <>
                                        <PlusCircleIcon className="w-5 h-5" />
                                        Create
                                    </>
                                )}
                            </button>
                            
                            {existingPlan && (
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    disabled={loading}
                                    className={`flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 font-semibold py-3 px-6 rounded-xl ${
                                        loading ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                >
                                    <TrashIcon className="w-5 h-5" />
                                    Delete
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </form>

            {existingPlan?.biteItems?.length > 0 && (
    <div className="mt-10 p-6 bg-white rounded-xl border border-orange-100 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <ShoppingCartIcon className="w-6 h-6 text-orange-500" />
            Bite Menu Details
        </h3>
        <div className="grid grid-cols-1 gap-4">
            {existingPlan.biteItems.map(item => (
                <div key={item.Bite_ID} className="p-4 bg-orange-50 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Bite ID:</p>
                            <p className="text-gray-800">{item.Bite_ID}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Menu Type:</p>
                            <p className="text-gray-800">{item.menu_type_name} ({item.menu_type_id})</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Quantity:</p>
                            <p className="text-gray-800">{item.Quantity}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Unit Price:</p>
                            <p className="text-orange-600 font-medium">
                                {formatCurrency(item.price || 0)}
                            </p>
                        </div>
                        {item.Type && (
                            <div>
                                <p className="text-sm font-medium text-gray-600">Type:</p>
                                <p className="text-gray-800">{item.Type}</p>
                            </div>
                        )}
                        {/* <div>
                            <p className="text-sm font-medium text-gray-600">Bar Requirement ID:</p>
                            <p className="text-gray-800">{item.BarRequirementID}</p>
                        </div> */}
                        {item.custom_description && (
                            <div>
                                <p className="text-sm font-medium text-gray-600">Custom Description:</p>
                                <p className="text-gray-800">{item.custom_description}</p>
                            </div>
                        )}
                    </div>
                    <div className="pt-3 border-t border-orange-100">
                        <p className="text-sm font-medium text-gray-600">Item Total:</p>
                        <p className="text-orange-600 font-medium text-lg">
                            {formatCurrency((item.Quantity || 0) * (item.price || 0))}
                        </p>
                    </div>
                </div>
            ))}
            <div className="mt-6 pt-4 border-t border-orange-100">
                <div className="flex justify-between items-center text-xl font-bold text-orange-800">
                    <span>Grand Total:</span>
                    <span>{formatCurrency(existingPlan.totalPrice || 0)}</span>
                </div>
            </div>
        </div>
    </div>
)}
        </div>
    );
}

export default PlanBiteForm;