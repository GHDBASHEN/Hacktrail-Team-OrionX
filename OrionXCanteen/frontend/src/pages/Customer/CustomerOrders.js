import React, { useState, useEffect, useContext } from 'react';
import { getCustomerOrders } from '../../services/CustomerOrderService';
import { AuthContext } from '../../context/Authcontext';
import { FaClipboardList, FaSpinner, FaExclamationCircle } from 'react-icons/fa';

const CustomerOrders = () => {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            const customerId = sessionStorage.getItem('id');
            if (!customerId) {
                setError("Could not find customer ID. Please log in again.");
                setIsLoading(false);
                return;
            }

            try {
                const ordersData = await getCustomerOrders(customerId);
                setOrders(ordersData);
            } catch (err) {
                setError('Failed to load your order history. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, [user]);

    const getStatusBadge = (status) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'preparing':
                return 'bg-blue-100 text-blue-800';
            case 'ready':
                return 'bg-green-100 text-green-800';
            case 'completed':
                return 'bg-gray-100 text-gray-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <FaSpinner className="animate-spin text-4xl text-blue-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-4 max-w-4xl text-center">
                 <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md flex items-center justify-center">
                    <FaExclamationCircle className="mr-3 text-xl" />
                    <span>{error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="container mx-auto max-w-4xl">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center">
                        <FaClipboardList className="mr-3 text-blue-500" />
                        My Order History
                    </h1>
                    <p className="text-gray-600">Track the status of all your past and current orders.</p>
                </div>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                    {orders.length === 0 ? (
                        <div className="text-center p-16">
                            <FaClipboardList className="mx-auto text-6xl text-gray-300 mb-4" />
                            <h2 className="text-2xl font-semibold text-gray-700">No Orders Found</h2>
                            <p className="mt-2 text-gray-500">You haven't placed any orders yet.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {orders.map((order) => (
                                        <tr key={order.order_id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.order_id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(order.order_date).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{order.item_name} ({order.item_count}x)</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">
                                                Rs. {parseFloat(order.total_amount).toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${getStatusBadge(order.status)}`}>
                                                    {order.status}
                                                </span>
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

export default CustomerOrders;
