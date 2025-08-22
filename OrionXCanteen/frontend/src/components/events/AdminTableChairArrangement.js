import React, { useState, useEffect } from 'react';
import {
    getAllArrangements,
    getArrangementById,
    updateArrangement,
    deleteArrangement
} from '../../services/EventService';
import {
    getAllTableDesigns,
    createTableDesign,
    updateTableDesign,
    deleteTableDesign
} from '../../services/EventService';

// A simple component to display messages that fade out
const Message = ({ text, type, onClear }) => {
    useEffect(() => {
        if (text) {
            const timer = setTimeout(() => {
                onClear();
            }, 3000); // Message disappears after 3 seconds
            return () => clearTimeout(timer);
        }
    }, [text, onClear]);

    if (!text) return null;

    const baseStyle = "p-4 mb-6 rounded border-l-4";
    const styles = {
        success: "bg-green-100 border-green-500 text-green-700",
        error: "bg-red-100 border-red-500 text-red-700",
    };

    return (
        <div className={`${baseStyle} ${styles[type]}`}>
            <p>{text}</p>
        </div>
    );
};


function AdminTableChairArrangement() {
    const [arrangements, setArrangements] = useState([]);
    const [tableDesigns, setTableDesigns] = useState([]);
    const [formData, setFormData] = useState({
        Arrangement_ID: '',
        Head_Table_Pax: 10,
        Top_Cloth_Color: '',
        Table_Cloth_Color: '',
        Bow_Color: '',
        Chair_Cover_Color: '',
        reservedTables: [{ tableNumber: '', reserveName: '' }]
    });
    const [designFormData, setDesignFormData] = useState({
        Top_Cloth_Color: '',
        Table_Cloth_Color: '',
        Bow_Color: '',
        Chair_Cover_Color: ''
    });
    const [editingId, setEditingId] = useState(null);
    const [editingDesignId, setEditingDesignId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [activeTab, setActiveTab] = useState('arrangements');
    const [selectedArrangement, setSelectedArrangement] = useState(null);
    const [filters, setFilters] = useState({
        customer_name: '',
        event_name: '',
        venue_name: '',
        location: '',
        booking_date: ''
    });

    useEffect(() => {
        fetchArrangements();
        fetchTableDesigns();
    }, []);

    const fetchArrangements = async () => {
        setIsLoading(true);
        setError('');
        try {
            const data = await getAllArrangements();
            setArrangements(data);
        } catch (err) {
            setError(err.message || 'Failed to load arrangements');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchTableDesigns = async () => {
        try {
            const data = await getAllTableDesigns();
            setTableDesigns(data);
        } catch (err) {
            setError(err.message || 'Failed to load table designs');
            console.error(err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDesignChange = (e) => {
        const { name, value } = e.target;
        setDesignFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleTableChange = (index, e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newTables = [...prev.reservedTables];
            newTables[index] = { ...newTables[index], [name]: value };
            return { ...prev, reservedTables: newTables };
        });
    };

    const addTable = () => {
        setFormData(prev => ({
            ...prev,
            reservedTables: [...prev.reservedTables, { tableNumber: '', reserveName: '' }]
        }));
    };

    const removeTable = (index) => {
        if (formData.reservedTables.length <= 1) return;

        setFormData(prev => ({
            ...prev,
            reservedTables: prev.reservedTables.filter((_, i) => i !== index)
        }));
    };

    const handleEdit = async (id) => {
        setIsLoading(true);
        setError('');
        setSuccessMessage('');
        try {
            const arrangement = await getArrangementById(id);

            let updatedReservedTables = arrangement.reservedTables.map(table => ({
                tableNumber: table.tableNumber || '',
                reserveName: table.reserveName || ''
            }));

            if (updatedReservedTables.length === 0) {
                updatedReservedTables.push({ tableNumber: '', reserveName: '' });
            }

            setFormData({
                Arrangement_ID: arrangement.Arrangement_ID,
                Head_Table_Pax: arrangement.Head_Table_Pax,
                Top_Cloth_Color: arrangement.Top_Cloth_Color,
                Table_Cloth_Color: arrangement.Table_Cloth_Color,
                Bow_Color: arrangement.Bow_Color,
                Chair_Cover_Color: arrangement.Chair_Cover_Color,
                reservedTables: updatedReservedTables
            });

            setEditingId(id);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            setError(err.message || 'Failed to load arrangement details');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDesignEdit = (design) => {
        setDesignFormData({
            Top_Cloth_Color: design.Top_Cloth_Color,
            Table_Cloth_Color: design.Table_Cloth_Color,
            Bow_Color: design.Bow_Color,
            Chair_Cover_Color: design.Chair_Cover_Color
        });
        setEditingDesignId(design.my_row_id);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({
            Arrangement_ID: '',
            Head_Table_Pax: 10,
            Top_Cloth_Color: '',
            Table_Cloth_Color: '',
            Bow_Color: '',
            Chair_Cover_Color: '',
            reservedTables: [{ tableNumber: '', reserveName: '' }]
        });
    };

    const handleDesignCancelEdit = () => {
        setEditingDesignId(null);
        setDesignFormData({
            Top_Cloth_Color: '',
            Table_Cloth_Color: '',
            Bow_Color: '',
            Chair_Cover_Color: ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!editingId) return; // Only allow updates, no creation

        setIsLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            const submissionData = { ...formData };
            await updateArrangement(editingId, submissionData);
            setSuccessMessage('Arrangement updated successfully!');
            handleCancelEdit();
            fetchArrangements();
        } catch (err) {
            setError(err.message || 'Update failed');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDesignSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            let successMsg = '';
            if (editingDesignId) {
                await updateTableDesign(editingDesignId, designFormData);
                successMsg = 'Table design updated successfully!';
            } else {
                await createTableDesign(designFormData);
                successMsg = 'Table design created successfully!';
            }

            setSuccessMessage(successMsg);
            handleDesignCancelEdit();
            fetchTableDesigns();
        } catch (err) {
            setError(err.message || 'Design operation failed');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this arrangement?')) return;

        setIsLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            await deleteArrangement(id);
            setSuccessMessage('Arrangement deleted successfully!');
            if (editingId === id) handleCancelEdit();
            if (selectedArrangement?.Arrangement_ID === id) setSelectedArrangement(null);
            fetchArrangements();
        } catch (err) {
            setError(err.message || 'Delete failed');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDesignDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this design?')) return;

        setIsLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            await deleteTableDesign(id);
            setSuccessMessage('Table design deleted successfully!');
            if (editingDesignId === id) handleDesignCancelEdit();
            fetchTableDesigns();
        } catch (err) {
            setError(err.message || 'Design delete failed');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };


    const applyDesign = (design) => {
        setFormData(prev => ({
            ...prev,
            Top_Cloth_Color: design.Top_Cloth_Color,
            Table_Cloth_Color: design.Table_Cloth_Color,
            Bow_Color: design.Bow_Color,
            Chair_Cover_Color: design.Chair_Cover_Color
        }));
    };

    const handleRowClick = (arr) => {
        setSelectedArrangement(arr);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const resetFilters = () => {
        setFilters({
            customer_name: '',
            event_name: '',
            venue_name: '',
            location: '',
            booking_date: ''
        });
    };

    const filteredArrangements = arrangements.filter(arr => {
        return (
            (arr.customer_name || '').toLowerCase().includes(filters.customer_name.toLowerCase()) &&
            (arr.event_name || '').toLowerCase().includes(filters.event_name.toLowerCase()) &&
            (arr.venue_name || '').toLowerCase().includes(filters.venue_name.toLowerCase()) &&
            (arr.Location || '').toLowerCase().includes(filters.location.toLowerCase()) &&
            (filters.booking_date ? (arr.booking_date || '').includes(filters.booking_date) : true)
        );
    });

    return (
        <div className="container mx-auto p-4 max-w-6xl">
            <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Table & Chair Management</h1>

            <div className="flex border-b border-gray-200 mb-6">
                <button
                    className={`py-2 px-4 font-medium ${activeTab === 'arrangements' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('arrangements')}
                >
                    Arrangements
                </button>
                <button
                    className={`py-2 px-4 font-medium ${activeTab === 'designs' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('designs')}
                >
                    Table Designs
                </button>
            </div>
            
            {/* Display Success and Error Messages */}
            <Message text={successMessage} type="success" onClear={() => setSuccessMessage('')} />
            <Message text={error} type="error" onClear={() => setError('')} />

            {isLoading && <div className="flex justify-center my-8"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>}

            {activeTab === 'arrangements' && (
                <>
                    {/* The form will only be displayed when an arrangement is being edited */}
                    {editingId && (
                        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                            <h2 className="text-xl font-semibold mb-4 text-gray-700">
                                Edit Arrangement
                            </h2>
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Arrangement ID</label>
                                        <input type="text" value={formData.Arrangement_ID} className="w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed" disabled />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Head Table Pax *</label>
                                        <input type="number" name="Head_Table_Pax" value={formData.Head_Table_Pax} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" min="1" max="50" required />
                                    </div>
                                </div>
                                <div className="mb-6">
                                    <h3 className="text-lg font-medium text-gray-700 mb-4">Select Table Design</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {tableDesigns.map(design => (
                                            <div key={design.my_row_id} className="border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => applyDesign(design)}>
                                                <div className="grid grid-cols-2 gap-2 mb-3">
                                                    <div>
                                                        <div className="text-sm text-gray-600">Top Cloth</div>
                                                        <div className="flex items-center">
                                                            <div className="w-5 h-5 rounded-full mr-1 border border-gray-300" style={{ backgroundColor: design.Top_Cloth_Color }}></div>
                                                            <span className="text-sm truncate">{design.Top_Cloth_Color}</span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm text-gray-600">Table Cloth</div>
                                                        <div className="flex items-center">
                                                            <div className="w-5 h-5 rounded-full mr-1 border border-gray-300" style={{ backgroundColor: design.Table_Cloth_Color }}></div>
                                                            <span className="text-sm truncate">{design.Table_Cloth_Color}</span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm text-gray-600">Bow Color</div>
                                                        <div className="flex items-center">
                                                            <div className="w-5 h-5 rounded-full mr-1 border border-gray-300" style={{ backgroundColor: design.Bow_Color }}></div>
                                                            <span className="text-sm truncate">{design.Bow_Color}</span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm text-gray-600">Chair Cover</div>
                                                        <div className="flex items-center">
                                                            <div className="w-5 h-5 rounded-full mr-1 border border-gray-300" style={{ backgroundColor: design.Chair_Cover_Color }}></div>
                                                            <span className="text-sm truncate">{design.Chair_Cover_Color}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button type="button" className="text-blue-600 text-sm hover:text-blue-800" onClick={(e) => { e.stopPropagation(); applyDesign(design); }}>Apply Design</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Top Cloth Color *</label>
                                        <input type="text" name="Top_Cloth_Color" value={formData.Top_Cloth_Color} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 cursor-not-allowed" required disabled />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Table Cloth Color *</label>
                                        <input type="text" name="Table_Cloth_Color" value={formData.Table_Cloth_Color} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 cursor-not-allowed" required disabled />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Bow Color *</label>
                                        <input type="text" name="Bow_Color" value={formData.Bow_Color} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 cursor-not-allowed" required disabled />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Chair Cover Color *</label>
                                        <input type="text" name="Chair_Cover_Color" value={formData.Chair_Cover_Color} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 cursor-not-allowed" required disabled />
                                    </div>
                                </div>
                                <div className="mb-6">
                                    <h3 className="text-lg font-medium text-gray-700 mb-4">Table Reservations</h3>
                                    {formData.reservedTables.map((table, index) => (
                                        <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 items-end">
                                            <div>
                                                <label className="block text-gray-700 font-medium mb-2">Table Number</label>
                                                <input type="number" name="tableNumber" value={table.tableNumber} onChange={(e) => handleTableChange(index, e)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" min="1" placeholder="e.g., 12" />
                                            </div>
                                            <div>
                                                <label className="block text-gray-700 font-medium mb-2">Reserve Name</label>
                                                <input type="text" name="reserveName" value={table.reserveName} onChange={(e) => handleTableChange(index, e)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., John Smith" />
                                            </div>
                                            <div>
                                                <button type="button" onClick={() => removeTable(index)} className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200" disabled={formData.reservedTables.length <= 1}>Remove Table</button>
                                            </div>
                                        </div>
                                    ))}
                                    <button type="button" onClick={addTable} className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200">+ Add Another Table</button>
                                </div>
                                <div className="flex flex-wrap gap-4">
                                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200" disabled={isLoading}>{isLoading ? 'Processing...' : 'Update Arrangement'}</button>
                                    <button type="button" onClick={handleCancelEdit} className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-lg transition duration-200" disabled={isLoading}>Cancel Edit</button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">Filter Arrangements</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Customer Name</label>
                                <input type="text" name="customer_name" value={filters.customer_name} onChange={handleFilterChange} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Filter by customers" />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Event Name</label>
                                <input type="text" name="event_name" value={filters.event_name} onChange={handleFilterChange} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Filter by event" />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Venue Name</label>
                                <input type="text" name="venue_name" value={filters.venue_name} onChange={handleFilterChange} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Filter by venue" />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Location</label>
                                <input type="text" name="location" value={filters.location} onChange={handleFilterChange} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Filter by location" />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Booking Date</label>
                                <input type="date" name="booking_date" value={filters.booking_date} onChange={handleFilterChange} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <button onClick={resetFilters} className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded transition duration-200">Reset Filters</button>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">Event Arrangements</h2>
                        {filteredArrangements.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">No arrangements found matching your filters</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Venue</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredArrangements.map(arr => (
                                            <tr key={arr.Arrangement_ID} className={`cursor-pointer hover:bg-blue-50 ${selectedArrangement?.Arrangement_ID === arr.Arrangement_ID ? 'bg-blue-100' : ''}`} onClick={() => handleRowClick(arr)}>
                                                <td className="px-6 py-4 whitespace-nowrap">{arr.customer_name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{formatDate(arr.booking_date)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{arr.event_name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{arr.venue_name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{arr.Location}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button onClick={(e) => { e.stopPropagation(); handleEdit(arr.Arrangement_ID); }} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                                                    <button onClick={(e) => { e.stopPropagation(); handleDelete(arr.Arrangement_ID); }} className="text-red-600 hover:text-red-900">Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {selectedArrangement && (
                        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">Arrangement Details</h2>
                                <button onClick={() => setSelectedArrangement(null)} className="text-gray-500 hover:text-gray-700">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h3 className="text-xl font-semibold text-blue-600 border-b pb-2">Basic Information</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div><p className="text-sm text-gray-500">Arrangement ID</p><p className="font-medium">{selectedArrangement.Arrangement_ID}</p></div>
                                        <div><p className="text-sm text-gray-500">Head Table Pax</p><p className="font-medium">{selectedArrangement.Head_Table_Pax}</p></div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-xl font-semibold text-blue-600 border-b pb-2">Color Scheme</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div><p className="text-sm text-gray-500">Top Cloth Color</p><div className="flex items-center"><div className="w-6 h-6 rounded-full mr-2 border border-gray-300" style={{ backgroundColor: selectedArrangement.Top_Cloth_Color }}></div><span className="font-medium">{selectedArrangement.Top_Cloth_Color}</span></div></div>
                                        <div><p className="text-sm text-gray-500">Table Cloth Color</p><div className="flex items-center"><div className="w-6 h-6 rounded-full mr-2 border border-gray-300" style={{ backgroundColor: selectedArrangement.Table_Cloth_Color }}></div><span className="font-medium">{selectedArrangement.Table_Cloth_Color}</span></div></div>
                                        <div><p className="text-sm text-gray-500">Bow Color</p><div className="flex items-center"><div className="w-6 h-6 rounded-full mr-2 border border-gray-300" style={{ backgroundColor: selectedArrangement.Bow_Color }}></div><span className="font-medium">{selectedArrangement.Bow_Color}</span></div></div>
                                        <div><p className="text-sm text-gray-500">Chair Cover Color</p><div className="flex items-center"><div className="w-6 h-6 rounded-full mr-2 border border-gray-300" style={{ backgroundColor: selectedArrangement.Chair_Cover_Color }}></div><span className="font-medium">{selectedArrangement.Chair_Cover_Color}</span></div></div>
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <h3 className="text-xl font-semibold text-blue-600 border-b pb-2 mb-4">Table Reservations</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {selectedArrangement.reserved_tables?.split(',').map((table, index) => (
                                            table && <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                                <div className="flex justify-between items-start">
                                                    <div><p className="text-sm text-gray-500">Table Number</p><p className="font-bold text-lg">{table}</p></div>
                                                    <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">Reserved</div>
                                                </div>
                                                <div className="mt-2"><p className="text-sm text-gray-500">Reserved For</p>
                                                    <p className="font-medium">
                                                        {selectedArrangement.reserve_names?.split(',')[index]}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}

            {activeTab === 'designs' && (
                <>
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">{editingDesignId ? 'Edit Table Design' : 'Create New Table Design'}</h2>
                        <form onSubmit={handleDesignSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div><label className="block text-gray-700 font-medium mb-2">Top Cloth Color *</label><input type="text" name="Top_Cloth_Color" value={designFormData.Top_Cloth_Color} onChange={handleDesignChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required placeholder="e.g., Gold" /></div>
                                <div><label className="block text-gray-700 font-medium mb-2">Table Cloth Color *</label><input type="text" name="Table_Cloth_Color" value={designFormData.Table_Cloth_Color} onChange={handleDesignChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required placeholder="e.g., White" /></div>
                                <div><label className="block text-gray-700 font-medium mb-2">Bow Color *</label><input type="text" name="Bow_Color" value={designFormData.Bow_Color} onChange={handleDesignChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required placeholder="e.g., Red" /></div>
                                <div><label className="block text-gray-700 font-medium mb-2">Chair Cover Color *</label><input type="text" name="Chair_Cover_Color" value={designFormData.Chair_Cover_Color} onChange={handleDesignChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required placeholder="e.g., Black" /></div>
                            </div>
                            <div className="flex flex-wrap gap-4">
                                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200" disabled={isLoading}>{isLoading ? 'Processing...' : (editingDesignId ? 'Update Design' : 'Create Design')}</button>
                                {editingDesignId && (<button type="button" onClick={handleDesignCancelEdit} className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-lg transition duration-200" disabled={isLoading}>Cancel Edit</button>)}
                            </div>
                        </form>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">Existing Table Designs</h2>
                        {tableDesigns.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">No designs found. Create your first design above.</div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {tableDesigns.map(design => (
                                    <div key={design.my_row_id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                        <div className="grid grid-cols-2 gap-2 mb-3">
                                            <div><div className="text-sm text-gray-600">Top Cloth</div><div className="flex items-center"><div className="w-6 h-6 rounded-full mr-2 border border-gray-300" style={{ backgroundColor: design.Top_Cloth_Color }}></div><span className="truncate">{design.Top_Cloth_Color}</span></div></div>
                                            <div><div className="text-sm text-gray-600">Table Cloth</div><div className="flex items-center"><div className="w-6 h-6 rounded-full mr-2 border border-gray-300" style={{ backgroundColor: design.Table_Cloth_Color }}></div><span className="truncate">{design.Table_Cloth_Color}</span></div></div>
                                            <div><div className="text-sm text-gray-600">Bow Color</div><div className="flex items-center"><div className="w-6 h-6 rounded-full mr-2 border border-gray-300" style={{ backgroundColor: design.Bow_Color }}></div><span className="truncate">{design.Bow_Color}</span></div></div>
                                            <div><div className="text-sm text-gray-600">Chair Cover</div><div className="flex items-center"><div className="w-6 h-6 rounded-full mr-2 border border-gray-300" style={{ backgroundColor: design.Chair_Cover_Color }}></div><span className="truncate">{design.Chair_Cover_Color}</span></div></div>
                                        </div>
                                        <div className="flex justify-between pt-3 border-t border-gray-100">
                                            <button onClick={() => handleDesignEdit(design)} className="text-blue-600 hover:text-blue-800">Edit</button>
                                            <button onClick={() => handleDesignDelete(design.my_row_id)} className="text-red-600 hover:text-red-800">Delete</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export default AdminTableChairArrangement;
