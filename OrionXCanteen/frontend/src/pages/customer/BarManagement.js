import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BarService } from '../../services/EventService';
import { TrashIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import { decryptBookingId } from '../../utills/encryptionUtils';
import Swal from 'sweetalert2';

const BarManagement = () => {
  const { bookingId: encryptedBookingId } = useParams();
  const [barDetails, setBarDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const decryptedBookingId = decryptBookingId(encryptedBookingId);
  const [formData, setFormData] = useState({
    itemType: 'liquor',
    itemName: '',
    quantity: 1,
    price: 0
  });
  const [submitting, setSubmitting] = useState(false);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await BarService.getBarDetails(decryptedBookingId);
        setBarDetails(response.data);
        setError('');
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [decryptedBookingId]);

  // Handle item deletion
  const handleDelete = async (category, itemId) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
        if (category === 'liquor') {
          await BarService.deleteLiquorByName(decryptedBookingId, itemId);
        } else {
          await BarService.deleteSoftDrinkByName(decryptedBookingId, itemId);
        }
        
        // Refresh data
        const response = await BarService.getBarDetails(decryptedBookingId);
        setBarDetails(response.data);
        Swal.fire('Deleted!', 'Item deleted successfully', 'success');
      }
    } catch (error) {
      Swal.fire('Error!', error.message, 'error');
    }
  };

  // Handle form submission
  const handleAddItem = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (formData.itemType === 'liquor') {
        await BarService.addLiquorItem(decryptedBookingId, formData);
      } else {
        await BarService.addSoftDrinkItem(decryptedBookingId, formData);
      }
      
      // Refresh data and reset form
      const response = await BarService.getBarDetails(decryptedBookingId);
      setBarDetails(response.data);
      setFormData({ itemType: 'liquor', itemName: '', quantity: 1, price: 0 });
    } catch (error) {
      Swal.fire('Error!', error.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading) return (
    <div className="min-h-screen bg-gray-50 p-8 flex justify-center items-center">
      <div className="animate-pulse text-gray-600">Loading bar details...</div>
    </div>
  );

  // Error state
  if (error) return (
    <div className="min-h-screen bg-gray-50 p-8 flex justify-center items-center">
      <div className="text-red-600">Error: {error}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 bg-white p-6 rounded-xl shadow-sm">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Bar Management - Booking {decryptedBookingId}
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Bite Price</p>
              <p className="text-xl font-semibold">
                LKR {barDetails.TotalBitePrice?.toLocaleString() || '0.00'}
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Liquor Price</p>
              <p className="text-xl font-semibold text-green-600">
                LKR {barDetails.TotalLiquorPrice?.toLocaleString() || '0.00'}
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Soft Drink Price</p>
              <p className="text-xl font-semibold text-blue-600">
                LKR {barDetails.TotalSoftDrinkPrice?.toLocaleString() || '0.00'}
              </p>
            </div>
          </div>
        </div>

        {/* Add Item Form */}
        <form onSubmit={handleAddItem} className="mb-8 bg-white p-6 rounded-xl shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Item Type
              </label>
              <select
                value={formData.itemType}
                onChange={(e) => setFormData({ ...formData, itemType: e.target.value })}
                className="w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="liquor">Liquor</option>
                <option value="soft-drink">Soft Drink</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Item Name
              </label>
              <input
                type="text"
                required
                value={formData.itemName}
                onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                className="w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                required
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit Price
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="h-10 bg-blue-600 text-white px-4 rounded-md hover:bg-blue-700 
                flex items-center justify-center gap-2 transition-colors"
            >
              {submitting ? (
                <span className="animate-pulse">Adding...</span>
              ) : (
                <>
                  <PlusCircleIcon className="h-5 w-5" />
                  Add Item
                </>
              )}
            </button>
          </div>
        </form>

        {/* Items List */}
        <div className="space-y-8">
          {/* Liquor Items */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Liquor Items</h2>
            <div className="grid gap-4">
              {barDetails.liquorItems.map(item => (
                <div key={item.id} className="p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{item.name}</h3>
                      <div className="grid grid-cols-3 gap-4 mt-2 text-sm">
                        <div>
                          <span className="text-gray-600">Quantity:</span>
                          <span className="ml-2 font-medium">{item.quantity}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Unit Price:</span>
                          <span className="ml-2 font-medium text-green-600">
                            LKR {item.price?.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Total:</span>
                          <span className="ml-2 font-medium text-blue-600">
                            LKR {(item.quantity * item.price)?.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete('liquor', item.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      aria-label="Delete item"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Soft Drink Items */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Soft Drink Items</h2>
            <div className="grid gap-4">
              {barDetails.softDrinkItems.map(item => (
                <div key={item.id} className="p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{item.name}</h3>
                      <div className="grid grid-cols-3 gap-4 mt-2 text-sm">
                        <div>
                          <span className="text-gray-600">Quantity:</span>
                          <span className="ml-2 font-medium">{item.quantity}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Unit Price:</span>
                          <span className="ml-2 font-medium text-green-600">
                            LKR {item.price?.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Total:</span>
                          <span className="ml-2 font-medium text-blue-600">
                            LKR {(item.quantity * item.price)?.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete('soft-drink', item.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      aria-label="Delete item"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarManagement;