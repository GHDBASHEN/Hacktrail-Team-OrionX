import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSummaryByBookingId } from "../../services/MenuService";
import { Loader2, AlertCircle } from "lucide-react";

const CustomerMenuSummaryReport = () => {
  const { bookingId } = useParams();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await getSummaryByBookingId(bookingId);
        setSummary(data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch summary data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 flex items-center gap-2 px-4 py-4">
        <AlertCircle /> {error}
      </div>
    );
  }

  if (!summary) {
    return (
      <p className="text-center text-gray-600 py-10">No summary available for this booking.</p>
    );
  }

  return (
    <div className="min-h-screen bg-white bg-opacity-40 backdrop-blur-sm px-4 py-8">
      <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-900">
          Your Menu Summary
        </h2>
        
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-xl font-semibold text-blue-800 mb-2">Booking Details</h3>
          <p className="text-gray-700">
            <span className="font-medium">Booking ID:</span> {bookingId}
          </p>
          {summary.date && (
            <p className="text-gray-700">
              <span className="font-medium">Date:</span> {new Date(summary.date).toLocaleDateString()}
            </p>
          )}
        </div>

        <div className="space-y-6">
          {summary.menuItems?.length > 0 ? (
            <>
              <h3 className="text-xl font-semibold text-blue-800">Selected Menu Items</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {summary.menuItems.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                          {item.specialInstructions && (
                            <div className="text-xs text-gray-500 mt-1">
                              Notes: {item.specialInstructions}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${item.price?.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ${(item.quantity * item.price)?.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end mt-6">
                <div className="bg-blue-50 p-4 rounded-lg w-64">
                  <h4 className="text-lg font-semibold text-blue-800 mb-2">Order Summary</h4>
                  <div className="flex justify-between mb-1">
                    <span>Subtotal:</span>
                    <span>${summary.subtotal?.toFixed(2)}</span>
                  </div>
                  {summary.tax && (
                    <div className="flex justify-between mb-1">
                      <span>Tax:</span>
                      <span>${summary.tax?.toFixed(2)}</span>
                    </div>
                  )}
                  {summary.discount && (
                    <div className="flex justify-between mb-1 text-green-600">
                      <span>Discount:</span>
                      <span>-${summary.discount?.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t border-gray-200">
                    <span>Total:</span>
                    <span>${summary.total?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-600 py-10">No menu items selected for this booking.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerMenuSummaryReport;