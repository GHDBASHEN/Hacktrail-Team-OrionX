import React, { useState } from "react";
import { createEvents } from "../../services/EventService";
import {
    Clock,
    User,
    Phone,
    Calendar,
    ChevronLeft,
    ChevronRight,
    CheckCircle,
    XCircle,
    Utensils,
    Scissors
} from "lucide-react";

const EventForm = ({ bookingId }) => {
    const [formData, setFormData] = useState({
        eventName: "",
        buffetTimeFrom: "",
        buffetTimeTo: "",
        functionDurationFrom: "",
        functionDurationTo: "",
        teaTableTime: "",
        dressTime: "",
        bookingID: bookingId || "",
        contactPersonName: "",
        contactPersonNumber: "",
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [step, setStep] = useState(1);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            const response = await createEvents(formData);
            setMessage(response.message);
            setFormData({
                eventName: "",
                buffetTimeFrom: "",
                buffetTimeTo: "",
                functionDurationFrom: "",
                functionDurationTo: "",
                teaTableTime: "",
                dressTime: "",
                bookingID: "",
                contactPersonName: "",
                contactPersonNumber: "",
            });
            setStep(1);
        } catch (err) {
            setError(err.response?.data?.error || "Your Event is already Created!");
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-xl">
            <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    Plan Your Event
                </h2>
                <div className="flex justify-center items-center space-x-4 mb-6">
                    {[1, 2, 3, 4].map((stepNum) => (
                        <div
                            key={stepNum}
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${step === stepNum
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-200 text-gray-600"
                                }`}
                        >
                            {stepNum}
                        </div>
                    ))}
                </div>
            </div>

            {message && (
                <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    {message}
                </div>
            )}
            {error && (
                <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg flex items-center gap-2">
                    <XCircle className="w-5 h-5" />
                    {error}
                </div>
            )}

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    // Only submit if we're on the final step
                    if (step === 4) {
                        handleSubmit(e);
                    }else{
                        console.log("Form Submitted");
                    }
                }}
                className="space-y-6">
                {step === 1 && (
                    <div className="space-y-4">
                        <div className="border-b pb-4 mb-4">
                            <h3 className="text-xl font-semibold flex items-center gap-2 text-blue-600">
                                <User className="w-6 h-6" />
                                Basic Information
                            </h3>
                        </div>

                        <div className="space-y-4">
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="eventName"
                                        value={formData.eventName}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <Calendar className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="contactPersonName"
                                            value={formData.contactPersonName}
                                            onChange={handleChange}
                                            required
                                            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        <User className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    </div>
                                </div>

                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                                    <div className="relative">
                                        <input
                                            type="tel"
                                            name="contactPersonNumber"
                                            value={formData.contactPersonNumber}
                                            onChange={handleChange}
                                            required
                                            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        <Phone className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {step === 2 && (
                    <div className="space-y-4">
                        <div className="border-b pb-4 mb-4">
                            <h3 className="text-xl font-semibold flex items-center gap-2 text-blue-600">
                                <Clock className="w-6 h-6" />
                                Function Duration
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                                <div className="relative">
                                    <input
                                        type="time"
                                        name="functionDurationFrom"
                                        value={formData.functionDurationFrom}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <Clock className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                </div>
                            </div>
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                                <div className="relative">
                                    <input
                                        type="time"
                                        name="functionDurationTo"
                                        value={formData.functionDurationTo}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <Clock className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-4">
                        <div className="border-b pb-4 mb-4">
                            <h3 className="text-xl font-semibold flex items-center gap-2 text-blue-600">
                                <Clock className="w-6 h-6" />
                                Buffet Timings
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                                <div className="relative">
                                    <input
                                        type="time"
                                        name="buffetTimeFrom"
                                        value={formData.buffetTimeFrom}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <Clock className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                </div>
                            </div>

                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                                <div className="relative">
                                    <input
                                        type="time"
                                        name="buffetTimeTo"
                                        value={formData.buffetTimeTo}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <Clock className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="space-y-4">
                        <div className="border-b pb-4 mb-4">
                            <h3 className="text-xl font-semibold flex items-center gap-2 text-blue-600">
                                <Utensils className="w-6 h-6" />
                                Additional Timings
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tea Time</label>
                                <div className="relative">
                                    <input
                                        type="time"
                                        name="teaTableTime"
                                        value={formData.teaTableTime}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <Utensils className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                </div>
                            </div>

                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Dress Time</label>
                                <div className="relative">
                                    <input
                                        type="time"
                                        name="dressTime"
                                        value={formData.dressTime}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <Scissors className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex justify-between mt-8">
                    {step > 1 && (
                        <button
                            type="button"
                            onClick={handleBack}
                            className="flex items-center gap-2 px-6 py-3 text-gray-600 bg-white border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                            Back
                        </button>
                    )}

                    <div className="flex-1"></div>

                    {step < 4 ? (
                        <button
                            type="button"
                            onClick={handleNext}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors"
                        >
                            Next
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="px-6 py-3 text-lg bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg hover:from-green-600 hover:to-blue-700 transition-colors"
                        >
                            Submit Event
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default EventForm;