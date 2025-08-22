import React, { useState } from 'react';

export const BookingDetailModal = ({ details, onClose, onSave }) => {
    const [contract, setContract] = useState(details.contract || {});
    const [pricing, setPricing] = useState(details.pricing || {});

    const handleSave = () => {
        onSave({ contract, pricing });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-lg p-6 w-3/4">
                <h2 className="text-2xl mb-4">Booking Details - {details.booking_id}</h2>
                <div>
                    <h3 className="font-bold mb-2">Contract Information</h3>
                    <input
                        type="number"
                        value={contract.deposit_amount || ''}
                        onChange={(e) =>
                            setContract({ ...contract, deposit_amount: parseFloat(e.target.value) })
                        }
                        className="border px-2 py-1 mb-2 w-full"
                        placeholder="Deposit Amount"
                    />
                </div>
                <div>
                    <h3 className="font-bold mb-2">Pricing Information</h3>
                    <input
                        type="number"
                        value={pricing.menu_price_total || ''}
                        onChange={(e) =>
                            setPricing({ ...pricing, menu_price_total: parseFloat(e.target.value) })
                        }
                        className="border px-2 py-1 mb-2 w-full"
                        placeholder="Menu Price Total"
                    />
                </div>
                <div className="flex justify-end mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 rounded-lg mr-2"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};
