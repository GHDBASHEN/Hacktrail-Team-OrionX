import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { decryptBookingId } from '../../utills/encryptionUtils';
import { createReservation } from '../../services/EventService';

const reservationSchema = Yup.object().shape({
    tableNumber: Yup.number()
        .required('Table number is required')
        .min(1, 'Minimum table number is 1'),
    reserveName: Yup.string()
        .required('Reservation name is required')
        .max(50, 'Maximum 50 characters')
});

const TableReservation = () => {
    const { bookingId: encryptedBookingId } = useParams();
    const [reservations, setReservations] = useState([]);
    const [error,setError] = useState('');
    const decryptedBookingId = decryptBookingId(encryptedBookingId);

    const handleSubmit = async (values, { resetForm }) => {
        try {
            await createReservation(decryptedBookingId, values);
            setReservations(prev => [...prev, {
                tableNumber: values.tableNumber,
                reserveName: values.reserveName
            }]);
            resetForm();
            setError('');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">📌 Table Reservations</h2>
                <p className="text-gray-500">Manage your table assignments and guest names</p>
            </div>

            <Formik
                initialValues={{ tableNumber: '', reserveName: '' }}
                validationSchema={reservationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form className="flex flex-col md:flex-row gap-4 mb-8">
                        <div className="flex-1">
                            <Field
                                type="number"
                                name="tableNumber"
                                placeholder="Table Number"
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
                            />
                            <ErrorMessage name="tableNumber" component="div" className="text-red-500 text-sm mt-1" />
                        </div>
                        
                        <div className="flex-1">
                            <Field
                                type="text"
                                name="reserveName"
                                placeholder="Guest or Group Name"
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
                            />
                            <ErrorMessage name="reserveName" component="div" className="text-red-500 text-sm mt-1" />
                        </div>
                        
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold py-3 px-8 rounded-lg transition-all transform hover:scale-[1.02] disabled:opacity-50"
                        >
                            {isSubmitting ? 'Adding...' : 'Add Reservation'}
                        </button>
                    </Form>
                )}
            </Formik>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reservations.map((reservation, index) => (
                    <div
                        key={index}
                        className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group"
                    >
                        <div className="flex items-center space-x-3">
                            <div className="bg-indigo-100 text-indigo-600 p-2 rounded-lg">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                                    Table {reservation.tableNumber}
                                </h3>
                                <p className="text-gray-600">{reservation.reserveName}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TableReservation;