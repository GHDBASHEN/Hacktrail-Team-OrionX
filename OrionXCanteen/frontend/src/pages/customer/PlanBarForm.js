import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { createPlanBar, getPlanBar, updatePlanBar, deletePlanBar } from '../../services/EventService';
import { decryptBookingId } from '../../utills/encryptionUtils';
import { ClockIcon, UserGroupIcon, TrashIcon, PlusCircleIcon, PencilSquareIcon } from '@heroicons/react/24/outline';

const PlanBarForm = () => {
    const { bookingId: encryptedBookingId } = useParams();
    const [formData, setFormData] = useState({
        LiquorTimeFrom: '',
        LiquorTimeTo: '',
        BarPax: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [existingPlan, setExistingPlan] = useState(null);
    const decryptedBookingId = decryptBookingId(encryptedBookingId);

    useEffect(() => {
        const fetchExistingPlan = async () => {
            try {
                const plan = await getPlanBar(decryptedBookingId);
                if (plan) {
                    setExistingPlan(plan);
                    setFormData({
                        LiquorTimeFrom: plan.LiquorTimeFrom?.slice(0,5) || '',
                        LiquorTimeTo: plan.LiquorTimeTo?.slice(0,5) || '',
                        BarPax: plan.BarPax
                    });
                }
            } catch (error) {
                console.error('Error fetching bar plan:', error);
            }
        };
        fetchExistingPlan();
    }, [decryptedBookingId]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.LiquorTimeFrom || !formData.LiquorTimeTo || !formData.BarPax) {
            setError('All fields are required');
            return;
        }

        try {
            let result;
            if (existingPlan) {
                result = await updatePlanBar(decryptedBookingId, formData);
                setSuccess('Bar plan updated successfully!');
            } else {
                result = await createPlanBar(decryptedBookingId, formData);
                setSuccess('Bar plan created successfully!');
            }
            setExistingPlan(result);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this bar plan?')) {
            try {
                await deletePlanBar(decryptedBookingId);
                setSuccess('Bar plan deleted successfully!');
                setExistingPlan(null);
                setFormData({
                    LiquorTimeFrom: '',
                    LiquorTimeTo: '',
                    BarPax: ''
                });
            } catch (error) {
                setError(error.message);
            }
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-8 bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl mt-8 border border-blue-100">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-blue-100 rounded-lg">
                    <ClockIcon className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800">
                    {existingPlan ? 'Manage Bar Service' : 'Plan Your Bar Service'}
                </h2>
            </div>

            {/* Status Messages */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span>{error}</span>
                </div>
            )}
            
            {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{success}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                            Service Timing
                        </label>
                        <div className="flex flex-col gap-4">
                            <div className="relative">
                                <input
                                    type="time"
                                    name="LiquorTimeFrom"
                                    value={formData.LiquorTimeFrom}
                                    onChange={handleChange}
                                    className="w-full p-3 pl-12 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
                                    required
                                />
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <ClockIcon className="w-5 h-5" />
                                </span>
                            </div>
                            <div className="relative">
                                <input
                                    type="time"
                                    name="LiquorTimeTo"
                                    value={formData.LiquorTimeTo}
                                    onChange={handleChange}
                                    className="w-full p-3 pl-12 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
                                    required
                                />
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <ClockIcon className="w-5 h-5" />
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                            Guest Information
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                name="BarPax"
                                value={formData.BarPax}
                                onChange={handleChange}
                                min="1"
                                className="w-full p-3 pl-12 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
                                placeholder="Number of guests"
                                required
                            />
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <UserGroupIcon className="w-5 h-5" />
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-xl transition-all transform hover:scale-[1.02]"
                    >
                        {existingPlan ? (
                            <>
                                <PencilSquareIcon className="w-5 h-5" />
                                Update Plan
                            </>
                        ) : (
                            <>
                                <PlusCircleIcon className="w-5 h-5" />
                                Create Plan
                            </>
                        )}
                    </button>
                    
                    {existingPlan && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="flex-1 flex items-center justify-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 font-semibold py-4 px-8 rounded-xl transition-all transform hover:scale-[1.02]"
                        >
                            <TrashIcon className="w-5 h-5" />
                            Delete Plan
                        </button>
                    )}
                </div>
            </form>

            {existingPlan && (
                <div className="mt-10 p-6 bg-white rounded-xl border border-blue-100 shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <ClockIcon className="w-6 h-6 text-blue-500" />
                        Current Bar Plan
                    </h3>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="p-4 bg-blue-50 rounded-lg">
                            <p className="text-sm font-medium text-blue-600 mb-1">Service Start</p>
                            <p className="text-2xl font-bold text-gray-800">
                                {existingPlan.LiquorTimeFrom?.slice(0,5) || '--:--'}
                            </p>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-lg">
                            <p className="text-sm font-medium text-blue-600 mb-1">Service End</p>
                            <p className="text-2xl font-bold text-gray-800">
                                {existingPlan.LiquorTimeTo?.slice(0,5) || '--:--'}
                            </p>
                        </div>
                        <div className="col-span-2 p-4 bg-blue-100 rounded-lg">
                            <p className="text-sm font-medium text-blue-700 mb-1">Total Guests Expected</p>
                            <p className="text-3xl font-black text-blue-800">
                                {existingPlan.BarPax}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlanBarForm;