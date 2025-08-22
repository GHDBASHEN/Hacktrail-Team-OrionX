import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/Authcontext";
import { getEventServices, saveSelectedServices } from "../../services/EventService";
import { CheckCircle, XCircle, PartyPopper, Check, Loader2 } from "lucide-react";
import { decryptCustId, decryptBookingId } from "../../utills/encryptionUtils";


const EventServiceSelector = ({ customerID, bookingId }) => {
    const { user } = useContext(AuthContext);
    const [services, setServices] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [decryptedIds, setDecryptedIds] = useState({
        customerId: null,
        bookingId: null
    });

    useEffect(() => {
        const decryptIds = async () => {
            try {
                const decryptedCustomerId = decryptCustId(customerID);
                const decryptedBookingId = decryptBookingId(bookingId);

                if (!decryptedCustomerId || !decryptedBookingId) {
                    throw new Error("Invalid customers or booking ID");
                }

                setDecryptedIds({
                    customerId: decryptedCustomerId,
                    bookingId: decryptedBookingId
                });

            } catch (error) {
                console.error("Decryption error:", error);
                setError("Invalid session parameters");
                setLoading(false);
            }
        };

        decryptIds();
    }, [customerID, bookingId]);

    useEffect(() => {
        if (!decryptedIds.customerId) return;

        const fetchServices = async () => {
            try {
                const data = await getEventServices();
                
                if (!data || !Array.isArray(data)) {
                    throw new Error("Invalid services data format");
                }
                
                const validatedServices = data.map(service => ({
                    id: service.Event_Service_ID,
                    name: service.Event_Service_Name,
                    image: service.Event_Service_Image
                }));

                setServices(validatedServices);
                setLoading(false);
            } catch (err) {
                console.error("Service fetch error:", err);
                setError(err.message || "Failed to load services");
                setLoading(false);
            }
        };

        fetchServices();
    }, [decryptedIds.customerId, user]);

    const toggleService = (serviceId) => {
        setSelectedServices(prev => 
            prev.includes(serviceId)
                ? prev.filter(id => id !== serviceId)
                : [...prev, serviceId]
        );
    };

    const handleSubmit = async () => {
        if (!decryptedIds.customerId || !decryptedIds.bookingId) {
            setError("Invalid session parameters");
            return;
        }

        setSubmitting(true);
        try {
            await saveSelectedServices(
                decryptedIds.customerId,
                decryptedIds.bookingId,
                selectedServices
            );
            
            setSuccessMessage("Services saved successfully!");
            setTimeout(() => setSuccessMessage(""), 3000);
            setSelectedServices([]);
        } catch (err) {
            console.error("Save error:", err);
            setError(err.message || "Failed to save selections");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen py-12">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
            <p className="text-xl text-gray-600">Loading services...</p>
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center min-h-screen py-12">
            <XCircle className="w-16 h-16 text-red-500 mb-4" />
            <p className="text-xl text-red-600 max-w-md text-center">{error}</p>
            <p className="text-gray-500 mt-2">Please try refreshing the page</p>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Select Event Services
            </h2>

            {successMessage && (
                <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg animate-fade-in z-50">
                    <Check className="inline mr-2" />{successMessage}
                </div>
            )}

            {services.length === 0 ? (
                <div className="flex flex-col items-center justify-center flex-grow py-12">
                    <PartyPopper className="w-16 h-16 text-yellow-400 mb-4" />
                    <p className="text-xl text-gray-600">No services available at the moment.</p>
                    <p className="text-gray-500 mt-2">Please check back later</p>
                </div>
            ) : (
                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="overflow-y-auto flex-grow pb-4 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pr-4">
                            {services.map((service) => (
                                <div 
                                    key={service.id}
                                    onClick={() => toggleService(service.id)}
                                    className={`relative cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-2 ${
                                        selectedServices.includes(service.id)
                                            ? "border-blue-500 bg-blue-50"
                                            : "border-transparent hover:border-blue-200"
                                    }`}
                                >
                                    <div className="p-6 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-semibold text-gray-800">
                                                {service.name}
                                            </h3>
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                                selectedServices.includes(service.id)
                                                    ? "bg-blue-500 text-white"
                                                    : "bg-gray-200"
                                            }`}>
                                                {selectedServices.includes(service.id) && <Check className="w-4 h-4" />}
                                            </div>
                                        </div>
                                        
                                        <div className="h-48 bg-gray-100 rounded-lg overflow-hidden">
                                            {service.image ? (
                                                <div className="w-full h-full relative">
                                                    <img 
                                                        src={service.image}
                                                        alt={service.name}
                                                        className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
                                                        loading="lazy"
                                                        onError={(e) => {
                                                            e.target.onerror = null; 
                                                            e.target.parentNode.innerHTML = `
                                                                <div className="w-full h-full bg-gray-200 flex flex-col items-center justify-center">
                                                                    <span className="text-gray-500 text-sm">Image not available</span>
                                                                </div>
                                                            `;
                                                        }}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                    <span className="text-gray-500">No Image Available</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2 text-sm">
                                            {selectedServices.includes(service.id) ? (
                                                <>
                                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                                    <span className="text-green-600">Selected</span>
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle className="w-4 h-4 text-red-500" />
                                                    <span className="text-red-600">Not Selected</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 pb-8 bg-white border-t border-gray-200 mt-auto">
                        <div className="text-center">
                            <button
                                onClick={handleSubmit}
                                disabled={!decryptedIds.bookingId || submitting || selectedServices.length === 0}
                                className={`px-8 py-3 rounded-lg text-white font-medium transition-all ${
                                    (!decryptedIds.bookingId || submitting || selectedServices.length === 0)
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-blue-600 hover:bg-blue-700"
                                }`}
                            >
                                {submitting ? (
                                    <span className="flex items-center justify-center">
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Saving...
                                    </span>
                                ) : (
                                    `Save Selected Services (${selectedServices.length})`
                                )}
                            </button>
                            {selectedServices.length === 0 && (
                                <p className="text-gray-500 text-sm mt-2">
                                    Please select at least one service
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventServiceSelector;