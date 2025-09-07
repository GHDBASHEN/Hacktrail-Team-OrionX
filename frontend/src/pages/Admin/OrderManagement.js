import React, { useState, useEffect } from 'react';
import { getAllAdminOrders, updateOrderStatus } from '../../services/AdminServices';
import { FaRegClock, FaConciergeBell, FaCheckCircle, FaTimesCircle, FaBan } from 'react-icons/fa';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');

    const statusOptions = ['pending', 'preparing', 'ready', 'completed', 'cancelled'];

    const statusConfig = {
        pending: { icon: FaRegClock, color: 'text-yellow-500', bgColor: 'bg-yellow-100' },
        preparing: { icon: FaConciergeBell, color: 'text-blue-500', bgColor: 'bg-blue-100' },
        ready: { icon: FaCheckCircle, color: 'text-green-500', bgColor: 'bg-green-100' },
        completed: { icon: FaCheckCircle, color: 'text-gray-500', bgColor: 'bg-gray-100' },
        cancelled: { icon: FaBan, color: 'text-red-500', bgColor: 'bg-red-100' },
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const data = await getAllAdminOrders();
            setOrders(data);
            setFilteredOrders(data);
            setError('');
        } catch (err) {
            setError('Failed to fetch orders. Please refresh the page.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFilterChange = (status) => {
        setActiveFilter(status);
        if (status === 'all') {
            setFilteredOrders(orders);
        } else {
            setFilteredOrders(orders.filter(order => order.status === status));
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await updateOrderStatus(orderId, newStatus);
            // Optimistically update the UI
            const updatedOrders = orders.map(o => o.order_id === orderId ? { ...o, status: newStatus } : o);
            setOrders(updatedOrders);
            // Re-apply the current filter to the updated data
            if (activeFilter === 'all') {
                setFilteredOrders(updatedOrders);
            } else {
                setFilteredOrders(updatedOrders.filter(o => o.status === activeFilter));
            }
        } catch (err) {
            setError('Failed to update status. Please try again.');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
                    <p className="text-gray-600 mt-1">View and manage all customer orders.</p>
                </div>

                {/* Filter Buttons */}
                <div className="flex flex-wrap gap-2 mb-6">
                    <button
                        onClick={() => handleFilterChange('all')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeFilter === 'all' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                    >
                        All Orders
                    </button>
                    {statusOptions.map(status => (
                        <button
                            key={status}
                            onClick={() => handleFilterChange(status)}
                            className={`px-4 py-2 text-sm font-medium rounded-md capitalize transition-colors ${activeFilter === status ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
                
                {error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-6">{error}</p>}

                {/* Orders Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {isLoading ? (
                        <div className="text-center p-12">Loading orders...</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Update Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredOrders.map(order => {
                                        const StatusIcon = statusConfig[order.status]?.icon || FaRegClock;
                                        const statusColor = statusConfig[order.status]?.color || 'text-gray-500';
                                        const statusBgColor = statusConfig[order.status]?.bgColor || 'bg-gray-100';

                                        return (
                                            <tr key={order.order_id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.order_id}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                                    <div>{order.customer_name}</div>
                                                    <div className="text-xs text-gray-500">{order.customer_email}</div>
                                                    <div className="text-xs text-gray-500">{order.customer_contact}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{order.item_name} (x{order.item_count})</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">Rs. {parseFloat(order.total_amount).toFixed(2)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(order.order_date)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBgColor} ${statusColor}`}>
                                                        <StatusIcon className="mr-1.5" />
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) => handleStatusChange(order.order_id, e.target.value)}
                                                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                                    >
                                                        {statusOptions.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                                                    </select>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderManagement;
