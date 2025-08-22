import React, { useState, useEffect, useMemo } from 'react';
import {
    getAllBarTimes, updateBarTime, deleteBarTime
} from '../../services/EventService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// --- Helper Functions ---
const formatCurrency = (amount) => {
    if (amount === null || isNaN(amount)) return 'N/A';
    return new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(amount);
};

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-CA'); // YYYY-MM-DD
};

// --- Component ---
const AdminBarManagementPage = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [expandedRow, setExpandedRow] = useState(null);

    // State for Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentRecord, setCurrentRecord] = useState(null);
    
    // State for Filters
    const [eventNameFilter, setEventNameFilter] = useState('');
    const [customerNameFilter, setCustomerNameFilter] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // --- Data Fetching ---
    const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await getAllBarTimes();
            setRecords(data);
        } catch (err) {
            const message = `Failed to fetch bar services: ${err.message}`;
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // --- Filtering ---
    const filteredRecords = useMemo(() => {
        const lowerEventFilter = eventNameFilter.toLowerCase();
        const lowerCustomerFilter = customerNameFilter.toLowerCase();
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        if (end) end.setHours(23, 59, 59, 999);

        return records.filter(record => {
            const eventMatch = !lowerEventFilter || record.eventName?.toLowerCase().includes(lowerEventFilter);
            const customerMatch = !lowerCustomerFilter || record.customerName?.toLowerCase().includes(lowerCustomerFilter);
            
            const recordDate = record.eventDate ? new Date(record.eventDate) : null;
            if (!recordDate) return false;
            const dateMatch = (!start || recordDate >= start) && (!end || recordDate <= end);

            return eventMatch && customerMatch && dateMatch;
        });
    }, [records, eventNameFilter, customerNameFilter, startDate, endDate]);

    // --- Handlers ---
    const handleUpdateClick = (record) => {
        setCurrentRecord(record);
        setIsModalOpen(true);
    };

    const handleDeleteClick = async (record) => {
        if (!await showConfirmationModal(`Are you sure you want to delete the entire bar service for ${record.eventName}? This will remove all associated items.`)) return;
        try {
            await deleteBarTime(record.BarRequirementID);
            toast.success('Bar service deleted successfully!');
            fetchData();
        } catch (err) {
            toast.error(`Failed to delete record: ${err.message}`);
        }
    };
    
    const handleModalClose = () => {
        setIsModalOpen(false);
        setCurrentRecord(null);
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const updatedData = Object.fromEntries(formData.entries());
        try {
            await updateBarTime(currentRecord.BarRequirementID, updatedData);
            toast.success('Bar service updated successfully!');
            handleModalClose();
            fetchData();
        } catch (err) {
            toast.error(`Failed to update record: ${err.message}`);
        }
    };

    const headers = ["Event", "Customer", "Date", "Time", "PAX", "Total Price"];

    return (
        <div className="bg-gray-100 p-4 sm:p-6 md:p-8 min-h-screen">
            <header className="mb-4 sm:mb-6">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">Bar Service Management</h1>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4 sm:mb-6 p-4 bg-gray-50 rounded-lg">
                <input 
                    type="text" 
                    placeholder="Filter by Event..." 
                    value={eventNameFilter} 
                    onChange={e => setEventNameFilter(e.target.value)} 
                    className="p-2 border rounded-md shadow-sm w-full"
                />
                <input 
                    type="text" 
                    placeholder="Filter by Customer..." 
                    value={customerNameFilter} 
                    onChange={e => setCustomerNameFilter(e.target.value)} 
                    className="p-2 border rounded-md shadow-sm w-full"
                />
                <div className="flex items-center">
                    <label htmlFor="startDate" className="mr-2 text-sm font-medium text-gray-700">From:</label>
                    <input 
                        id="startDate"
                        type="date" 
                        value={startDate} 
                        onChange={e => setStartDate(e.target.value)} 
                        className="p-2 border rounded-md shadow-sm w-full"
                    />
                </div>
                <div className="flex items-center">
                    <label htmlFor="endDate" className="mr-2 text-sm font-medium text-gray-700">To:</label>
                    <input 
                        id="endDate"
                        type="date" 
                        value={endDate} 
                        onChange={e => setEndDate(e.target.value)} 
                        className="p-2 border rounded-md shadow-sm w-full"
                    />
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {loading && <div className="p-6 text-center">Loading...</div>}
                {error && <div className="p-6 text-center text-red-500">{error}</div>}
                
                {!loading && !error && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    {headers.map(header => (
                                        <th key={header} className="p-3 text-left font-semibold text-gray-600">{header}</th>
                                    ))}
                                    <th className="p-3 text-right font-semibold text-gray-600">ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredRecords.map((record, index) => (
                                    <React.Fragment key={record.BarRequirementID}>
                                        <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => setExpandedRow(expandedRow === index ? null : index)}>
                                            <td className="p-3">{record.eventName}</td>
                                            <td className="p-3">{record.customerName}</td>
                                            <td className="p-3">{formatDate(record.eventDate)}</td>
                                            <td className="p-3">{`${record.LiquorTimeFrom} - ${record.LiquorTimeTo}`}</td>
                                            <td className="p-3">{record.BarPax}</td>
                                            <td className="p-3 font-semibold">
                                                {/* CORRECTED CALCULATION:
                                                  Use parseFloat() to ensure values are treated as numbers
                                                  before performing the addition.
                                                */}
                                                {formatCurrency(
                                                    (parseFloat(record.TotalBitePrice) || 0) + 
                                                    (parseFloat(record.TotalLiquorPrice) || 0) + 
                                                    (parseFloat(record.TotalSoftDrinkPrice) || 0)
                                                )}
                                            </td>
                                            <td className="p-3 text-right space-x-2">
                                                <button onClick={(e) => { e.stopPropagation(); handleUpdateClick(record); }} className="font-medium text-blue-600 hover:text-blue-800">Update</button>
                                                <button onClick={(e) => { e.stopPropagation(); handleDeleteClick(record); }} className="font-medium text-red-600 hover:text-red-800">Delete</button>
                                            </td>
                                        </tr>
                                        {expandedRow === index && (
                                            <tr className="bg-blue-50">
                                                <td colSpan={headers.length + 1} className="p-4">
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                        <div>
                                                            <h4 className="font-bold text-lg mb-2 text-gray-700">Bites</h4>
                                                            {record.bites?.length > 0 ? (
                                                                <ul className="list-disc list-inside space-y-1">
                                                                    {record.bites.map(item => (
                                                                        <li key={item.id}>
                                                                            {item.menu_type_name} ({item.Quantity}) - <strong>{formatCurrency(item.price)}</strong>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            ) : <p className="text-gray-500">No bites assigned.</p>}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-lg mb-2 text-gray-700">Liquor</h4>
                                                            {record.liquorItems?.length > 0 ? (
                                                                <ul className="list-disc list-inside space-y-1">
                                                                    {record.liquorItems.map(item => <li key={item.Liquor_ID}>{item.item_name} ({item.quantity}) - {formatCurrency(item.LiquorPrice)}</li>)}
                                                                </ul>
                                                            ) : <p className="text-gray-500">No liquor assigned.</p>}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-lg mb-2 text-gray-700">Soft Drinks</h4>
                                                             {record.softDrinkItems?.length > 0 ? (
                                                                <ul className="list-disc list-inside space-y-1">
                                                                    {record.softDrinkItems.map(item => <li key={item.Soft_Drink_id}>{item.Soft_Drink_name} ({item.quantity}) - {formatCurrency(item.DrinkPrice)}</li>)}
                                                                </ul>
                                                            ) : <p className="text-gray-500">No soft drinks assigned.</p>}
                                                        </div>
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
            
            {isModalOpen && currentRecord && (
                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold mb-4">Update Bar Service</h2>
                            <form onSubmit={handleUpdateSubmit}>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="LiquorTimeFrom" className="block text-sm font-medium">From Time</label>
                                        <input id="LiquorTimeFrom" name="LiquorTimeFrom" type="time" defaultValue={currentRecord.LiquorTimeFrom} className="mt-1 block w-full p-2 border rounded-md"/>
                                    </div>
                                    <div>
                                        <label htmlFor="LiquorTimeTo" className="block text-sm font-medium">To Time</label>
                                        <input id="LiquorTimeTo" name="LiquorTimeTo" type="time" defaultValue={currentRecord.LiquorTimeTo} className="mt-1 block w-full p-2 border rounded-md"/>
                                    </div>
                                    <div>
                                        <label htmlFor="BarPax" className="block text-sm font-medium">PAX</label>
                                        <input id="BarPax" name="BarPax" type="number" defaultValue={currentRecord.BarPax} className="mt-1 block w-full p-2 border rounded-md"/>
                                    </div>
                                </div>
                                <div className="mt-6 flex space-x-3">
                                    <button type="button" onClick={handleModalClose} className="flex-1 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
                                    <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Save Changes</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const showConfirmationModal = (message) => {
    return new Promise(resolve => resolve(window.confirm(message)));
};

export default AdminBarManagementPage;