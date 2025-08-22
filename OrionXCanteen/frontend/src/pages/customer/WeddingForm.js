import React, { useState } from "react";
import { createWedding } from "../../services/EventService";
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
  Scissors,
  Heart,
  Home,
  ScrollText
} from "lucide-react";

const WeddingForm = ({ bookingId }) => {
    const [formData, setFormData] = useState({
        groomName: "",
        brideName: "",
        groomContact: "",
        brideContact: "",
        fountain: "",
        buffetTimeFrom: "",
        buffetTimeTo: "",
        functionDurationFrom: "",
        functionDurationTo: "",
        teaTableTime: "",
        dressTime: "",
        bookingID: bookingId || "",
        prosperityTable: "",
        groomAddress: "",
        brideAddress: "",
        ceremonyFrom: "",
        ceremonyTo: "",
        registrationTime: "",
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [step, setStep] = useState(1);
    const [fieldErrors, setFieldErrors] = useState({});

    const phoneRegex = /^\d{10}$/;

    const validateStep = (step) => {
        const errors = {};
        
        switch(step) {
            case 1:
                if (!formData.groomName.trim()) errors.groomName = "Groom name is required";
                if (!phoneRegex.test(formData.groomContact)) errors.groomContact = "Valid 10-digit phone number required";
                if (!formData.groomAddress.trim()) errors.groomAddress = "Address is required";
                break;
            case 2:
                if (!formData.brideName.trim()) errors.brideName = "Bride name is required";
                if (!phoneRegex.test(formData.brideContact)) errors.brideContact = "Valid 10-digit phone number required";
                if (!formData.brideAddress.trim()) errors.brideAddress = "Address is required";
                break;
            case 3:
                if (!formData.fountain) errors.fountain = "Please select fountain option";
                if (!formData.prosperityTable) errors.prosperityTable = "Please select prosperity table option";
                if (!formData.ceremonyFrom) errors.ceremonyFrom = "Ceremony start time is required";
                if (!formData.ceremonyTo) errors.ceremonyTo = "Ceremony end time is required";
                if (!formData.registrationTime) errors.registrationTime = "Registration time is required";
                if (formData.ceremonyFrom && formData.ceremonyTo) {
                // Convert times to minutes since midnight for comparison
                const [fromHours, fromMinutes] = formData.ceremonyFrom.split(':').map(Number);
                const [toHours, toMinutes] = formData.ceremonyTo.split(':').map(Number);
                
                const totalFromMinutes = fromHours * 60 + fromMinutes;
                const totalToMinutes = toHours * 60 + toMinutes;
                
                // Validate that end time is after start time
                if (totalToMinutes <= totalFromMinutes) {
                    errors.ceremonyTo = "Ceremony end time must be after start time";
                }
            }
                break;
            case 4:
                if (!formData.functionDurationFrom) errors.functionDurationFrom = "Start time is required";
                if (!formData.functionDurationTo) errors.functionDurationTo = "End time is required";
                break;
            case 5:
                if (!formData.buffetTimeFrom) errors.buffetTimeFrom = "Start time is required";
                if (!formData.buffetTimeTo) errors.buffetTimeTo = "End time is required";
                break;
            case 6:
                if (!formData.teaTableTime) errors.teaTableTime = "Tea time is required";
                if (!formData.dressTime) errors.dressTime = "Dress time is required";
                break;
            default:
                break;
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "radio" ? value : value
        }));
        
        // Clear error when input changes
        if (fieldErrors[name]) {
            setFieldErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const handleNext = () => {
        if (!validateStep(step)) return;
        setStep(prev => Math.min(prev + 1, 6));
    };

    const handleBack = () => {
        setFieldErrors({});
        setStep(prev => Math.max(prev - 1, 1));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(step !== 6 || !validateStep(6)) return;
        
        setMessage("");
        setError("");

        try {
            const response = await createWedding(formData);
            setMessage(response.message);
            // Reset form
            setFormData({
                groomName: "",
                brideName: "",
                groomContact: "",
                brideContact: "",
                fountain: "",
                buffetTimeFrom: "",
                buffetTimeTo: "",
                functionDurationFrom: "",
                functionDurationTo: "",
                teaTableTime: "",
                dressTime: "",
                bookingID: "",
                prosperityTable: "",
                groomAddress: "",
                brideAddress: "",
                ceremonyFrom: "",
                ceremonyTo: "",
                registrationTime: "",
            });
            setStep(1);
        } catch (err) {
            setError(err.response?.data?.error || "Wedding is Already Created!");
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-xl">
            <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent mb-2">
                    Wedding Event Planning
                </h2>
                <div className="flex justify-center items-center space-x-4 mb-6">
                    {[1, 2, 3, 4, 5, 6].map((stepNum) => (
                        <div
                            key={stepNum}
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                step === stepNum
                                    ? "bg-pink-500 text-white"
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
                if (step === 6) {
                    handleSubmit(e);
                }else{
                    console.log("Form Submitted");
                }
            }}
            className="space-y-6">
                {/* Step 1 - Groom Details */}
                {step === 1 && (
                    <div className="space-y-4">
                        <div className="border-b pb-4 mb-4">
                            <h3 className="text-xl font-semibold flex items-center gap-2 text-pink-600">
                                <User className="w-6 h-6" />
                                Groom Details
                            </h3>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Groom Name</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="groomName"
                                        value={formData.groomName}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 ${
                                            fieldErrors.groomName 
                                                ? "border-red-500 focus:ring-red-500" 
                                                : "border-gray-300 focus:ring-pink-500"
                                        }`}
                                    />
                                    <User className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                </div>
                                {fieldErrors.groomName && (
                                    <p className="text-red-500 text-sm mt-1">{fieldErrors.groomName}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                                    <div className="relative">
                                        <input
                                            type="tel"
                                            name="groomContact"
                                            value={formData.groomContact}
                                            onChange={handleChange}
                                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 ${
                                                fieldErrors.groomContact 
                                                    ? "border-red-500 focus:ring-red-500" 
                                                    : "border-gray-300 focus:ring-pink-500"
                                            }`}
                                        />
                                        <Phone className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    </div>
                                    {fieldErrors.groomContact && (
                                        <p className="text-red-500 text-sm mt-1">{fieldErrors.groomContact}</p>
                                    )}
                                </div>

                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="groomAddress"
                                            value={formData.groomAddress}
                                            onChange={handleChange}
                                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 ${
                                                fieldErrors.groomAddress 
                                                    ? "border-red-500 focus:ring-red-500" 
                                                    : "border-gray-300 focus:ring-pink-500"
                                            }`}
                                        />
                                        <Home className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    </div>
                                    {fieldErrors.groomAddress && (
                                        <p className="text-red-500 text-sm mt-1">{fieldErrors.groomAddress}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2 - Bride Details */}
                {step === 2 && (
                    <div className="space-y-4">
                        <div className="border-b pb-4 mb-4">
                            <h3 className="text-xl font-semibold flex items-center gap-2 text-pink-600">
                                <User className="w-6 h-6" />
                                Bride Details
                            </h3>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Bride Name</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="brideName"
                                        value={formData.brideName}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 ${
                                            fieldErrors.brideName 
                                                ? "border-red-500 focus:ring-red-500" 
                                                : "border-gray-300 focus:ring-pink-500"
                                        }`}
                                    />
                                    <User className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                </div>
                                {fieldErrors.brideName && (
                                    <p className="text-red-500 text-sm mt-1">{fieldErrors.brideName}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                                    <div className="relative">
                                        <input
                                            type="tel"
                                            name="brideContact"
                                            value={formData.brideContact}
                                            onChange={handleChange}
                                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 ${
                                                fieldErrors.brideContact 
                                                    ? "border-red-500 focus:ring-red-500" 
                                                    : "border-gray-300 focus:ring-pink-500"
                                            }`}
                                        />
                                        <Phone className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    </div>
                                    {fieldErrors.brideContact && (
                                        <p className="text-red-500 text-sm mt-1">{fieldErrors.brideContact}</p>
                                    )}
                                </div>

                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="brideAddress"
                                            value={formData.brideAddress}
                                            onChange={handleChange}
                                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 ${
                                                fieldErrors.brideAddress 
                                                    ? "border-red-500 focus:ring-red-500" 
                                                    : "border-gray-300 focus:ring-pink-500"
                                            }`}
                                        />
                                        <Home className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    </div>
                                    {fieldErrors.brideAddress && (
                                        <p className="text-red-500 text-sm mt-1">{fieldErrors.brideAddress}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3 - Event Details */}
                {step === 3 && (
                    <div className="space-y-4">
                        <div className="border-b pb-4 mb-4">
                            <h3 className="text-xl font-semibold flex items-center gap-2 text-pink-600">
                                <Heart className="w-6 h-6" />
                                Ceremony Details
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Fountain</label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name="fountain"
                                                value="yes"
                                                checked={formData.fountain === "yes"}
                                                onChange={handleChange}
                                                className="text-pink-500 focus:ring-pink-500"
                                            />
                                            Yes
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name="fountain"
                                                value="no"
                                                checked={formData.fountain === "no"}
                                                onChange={handleChange}
                                                className="text-pink-500 focus:ring-pink-500"
                                            />
                                            No
                                        </label>
                                    </div>
                                    {fieldErrors.fountain && (
                                        <p className="text-red-500 text-sm mt-1">{fieldErrors.fountain}</p>
                                    )}
                                </div>

                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Prosperity Table</label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name="prosperityTable"
                                                value="yes"
                                                checked={formData.prosperityTable === "yes"}
                                                onChange={handleChange}
                                                className="text-pink-500 focus:ring-pink-500"
                                            />
                                            Yes
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name="prosperityTable"
                                                value="no"
                                                checked={formData.prosperityTable === "no"}
                                                onChange={handleChange}
                                                className="text-pink-500 focus:ring-pink-500"
                                            />
                                            No
                                        </label>
                                    </div>
                                    {fieldErrors.prosperityTable && (
                                        <p className="text-red-500 text-sm mt-1">{fieldErrors.prosperityTable}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Poruwa Ceremony From</label>
                                    <div className="relative">
                                        <input
                                            type="time"
                                            name="ceremonyFrom"
                                            value={formData.ceremonyFrom}
                                            onChange={handleChange}
                                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 ${
                                                fieldErrors.ceremonyFrom 
                                                    ? "border-red-500 focus:ring-red-500" 
                                                    : "border-gray-300 focus:ring-pink-500"
                                            }`}
                                        />
                                        <Clock className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    </div>
                                    {fieldErrors.ceremonyFrom && (
                                        <p className="text-red-500 text-sm mt-1">{fieldErrors.ceremonyFrom}</p>
                                    )}
                                </div>

                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Poruwa Ceremony To</label>
                                    <div className="relative">
                                        <input
                                            type="time"
                                            name="ceremonyTo"
                                            value={formData.ceremonyTo}
                                            onChange={handleChange}
                                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 ${
                                                fieldErrors.ceremonyTo 
                                                    ? "border-red-500 focus:ring-red-500" 
                                                    : "border-gray-300 focus:ring-pink-500"
                                            }`}
                                        />
                                        <Clock className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    </div>
                                    {fieldErrors.ceremonyTo && (
                                        <p className="text-red-500 text-sm mt-1">{fieldErrors.ceremonyTo}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Registration Time</label>
                            <div className="relative">
                                <input
                                    type="time"
                                    name="registrationTime"
                                    value={formData.registrationTime}
                                    onChange={handleChange}
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 ${
                                        fieldErrors.registrationTime 
                                            ? "border-red-500 focus:ring-red-500" 
                                            : "border-gray-300 focus:ring-pink-500"
                                    }`}
                                />
                                <ScrollText className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            </div>
                            {fieldErrors.registrationTime && (
                                <p className="text-red-500 text-sm mt-1">{fieldErrors.registrationTime}</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Step 4 - Function Durations */}
                {step === 4 && (
                    <div className="space-y-4">
                        <div className="border-b pb-4 mb-4">
                            <h3 className="text-xl font-semibold flex items-center gap-2 text-pink-600">
                                <Clock className="w-6 h-6" />
                                Function Durations
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
                                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 ${
                                            fieldErrors.functionDurationFrom 
                                                ? "border-red-500 focus:ring-red-500" 
                                                : "border-gray-300 focus:ring-pink-500"
                                        }`}
                                    />
                                    <Clock className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                </div>
                                {fieldErrors.functionDurationFrom && (
                                    <p className="text-red-500 text-sm mt-1">{fieldErrors.functionDurationFrom}</p>
                                )}
                            </div>

                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                                <div className="relative">
                                    <input
                                        type="time"
                                        name="functionDurationTo"
                                        value={formData.functionDurationTo}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 ${
                                            fieldErrors.functionDurationTo 
                                                ? "border-red-500 focus:ring-red-500" 
                                                : "border-gray-300 focus:ring-pink-500"
                                        }`}
                                    />
                                    <Clock className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                </div>
                                {fieldErrors.functionDurationTo && (
                                    <p className="text-red-500 text-sm mt-1">{fieldErrors.functionDurationTo}</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 5 - Buffet Timings */}
                {step === 5 && (
                    <div className="space-y-4">
                        <div className="border-b pb-4 mb-4">
                            <h3 className="text-xl font-semibold flex items-center gap-2 text-pink-600">
                                <Utensils className="w-6 h-6" />
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
                                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 ${
                                            fieldErrors.buffetTimeFrom 
                                                ? "border-red-500 focus:ring-red-500" 
                                                : "border-gray-300 focus:ring-pink-500"
                                        }`}
                                    />
                                    <Clock className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                </div>
                                {fieldErrors.buffetTimeFrom && (
                                    <p className="text-red-500 text-sm mt-1">{fieldErrors.buffetTimeFrom}</p>
                                )}
                            </div>

                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                                <div className="relative">
                                    <input
                                        type="time"
                                        name="buffetTimeTo"
                                        value={formData.buffetTimeTo}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 ${
                                            fieldErrors.buffetTimeTo 
                                                ? "border-red-500 focus:ring-red-500" 
                                                : "border-gray-300 focus:ring-pink-500"
                                        }`}
                                    />
                                    <Clock className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                </div>
                                {fieldErrors.buffetTimeTo && (
                                    <p className="text-red-500 text-sm mt-1">{fieldErrors.buffetTimeTo}</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 6 - Tea & Dress Timings */}
                {step === 6 && (
                    <div className="space-y-4">
                        <div className="border-b pb-4 mb-4">
                            <h3 className="text-xl font-semibold flex items-center gap-2 text-pink-600">
                                <Clock className="w-6 h-6" />
                                Tea & Dress Timings
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
                                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 ${
                                            fieldErrors.teaTableTime 
                                                ? "border-red-500 focus:ring-red-500" 
                                                : "border-gray-300 focus:ring-pink-500"
                                        }`}
                                    />
                                    <Utensils className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                </div>
                                {fieldErrors.teaTableTime && (
                                    <p className="text-red-500 text-sm mt-1">{fieldErrors.teaTableTime}</p>
                                )}
                            </div>

                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Dress Time</label>
                                <div className="relative">
                                    <input
                                        type="time"
                                        name="dressTime"
                                        value={formData.dressTime}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 ${
                                            fieldErrors.dressTime 
                                                ? "border-red-500 focus:ring-red-500" 
                                                : "border-gray-300 focus:ring-pink-500"
                                        }`}
                                    />
                                    <Scissors className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                </div>
                                {fieldErrors.dressTime && (
                                    <p className="text-red-500 text-sm mt-1">{fieldErrors.dressTime}</p>
                                )}
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

                    {step < 6 ? (
                        <button
                            type="button"
                            onClick={handleNext}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-red-600 text-white rounded-lg hover:from-pink-600 hover:to-red-700 transition-colors"
                        >
                            Next
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg hover:from-green-600 hover:to-blue-700 transition-colors disabled:opacity-50"
                            disabled={Object.keys(fieldErrors).length > 0}
                        >
                            Submit
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default WeddingForm;