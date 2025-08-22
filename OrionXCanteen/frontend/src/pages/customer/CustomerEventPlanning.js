import React, { useState } from "react";
import WeddingForm from "./WeddingForm.js";
import EventForm from "../../pages/customers/CustomEventForm.js";
import { useParams } from "react-router-dom";
import { decryptBookingId } from "../../utills/encryptionUtils.js";


const CustomerEventPlanning = () => {
   
    const { bookingId } = useParams();
    let decryptedBookingId = null;

    try {
        decryptedBookingId = decryptBookingId(bookingId); // Attempt to decrypt the bookingId
    } catch (error) {
        console.error("Failed to decrypt booking ID:", error);
    }
    // Move useState above the conditional return
    const [eventType, setEventType] = useState("");

    if (!decryptedBookingId) {
        return (
            <div className="p-4 bg-white rounded shadow-md mt-4">
                <h3 className="text-xl font-semibold mb-2 text-red-600">Invalid Booking ID</h3>
                <p>Please check the URL or contact support for assistance.</p>
            </div>
        );
    }

    const handleEventChange = (e) => {
        setEventType(e.target.value);
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-gray-100 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-bold mb-4">Plan Your Event</h2>
            
            <label className="block text-left font-semibold">Select Event Type:</label>
            <select value={eventType} onChange={handleEventChange} className="w-full p-2 border rounded mt-2">
                <option value="">-- Choose an Event --</option>
                <option value="wedding">Wedding</option>
                <option value="custom">Custom Event</option>
            </select>

            {/* Render the corresponding form based on selection */}
            <div className="mt-4">
                {eventType === "wedding" && <WeddingForm bookingId={decryptedBookingId} />}
                {eventType === "custom" && <CustomEventForm />}
            </div>
        </div>
    );
};

const CustomEventForm = () => {
    const { bookingId } = useParams();
    let decryptedBookingId = null;

    try {
        decryptedBookingId = decryptBookingId(bookingId); // Attempt to decrypt the bookingId
    } catch (error) {
        console.error("Failed to decrypt booking ID:", error);
    }

    if (!decryptedBookingId) {
        return (
            <div className="p-4 bg-white rounded shadow-md mt-4">
                <h3 className="text-xl font-semibold mb-2 text-red-600">Invalid Booking ID</h3>
                <p>Please check the URL or contact support for assistance.</p>
            </div>
        );
    }


    return (
        <div className="p-4 bg-white rounded shadow-md mt-4">
            <h3 className="text-xl font-semibold mb-2">Custom Event Planning</h3>
            <EventForm bookingId={decryptedBookingId} />
        </div>
    );
};

export default CustomerEventPlanning;
