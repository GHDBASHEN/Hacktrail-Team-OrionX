import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BookingService, { getBookingDetails, getPrintBookingDetails, updateAdditionalHours, updateBookingGuest, updateBookingStatus, updateBookingVenue, updateDamageFee, updateDate } from '../../services/BookngService';
import VenueDropdown from './VenueDropdown';
import BookingPrintView from './BookingPrintView';
import { getAllVenues, getVenueById } from '../../services/VenueService';
import { data, useNavigate } from 'react-router-dom';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { parseISO, format } from 'date-fns';

// Reusable detail row component
function DetailRow({ label, value, bookingId, bookingStatus, setRefresh, refresh, setCancelBtn, color, bDate }) {
    const [edit, setEdit] = useState(false);
    const [venues, setVenues] = useState([]);
    const [selectedVenue, setSelectedVenue] = useState(value);
    const [saving, setSaving] = useState(false);
    const [contract, setContract] = useState('');
    const [date, setDate] = useState();

    useEffect(() => {
        if (label === "Venue ID") {
            getAllVenues().then((data) => setVenues(data));
        }
        if (label === "Status") {
            setVenues([
                { 'venue_id': 1, 'venue_name': "pending" },
                { 'venue_id': 2, 'venue_name': "confirmed" },
                { 'venue_id': 3, 'venue_name': "cancelled" }
            ]);
        }
    }, [label]);

    console.log(bDate)

    if (label === "Venue ID" || label === "Status" || label === "Damage Fee (Rs)" || label === "Guests" || label === "Additional Hours" || (label === "Date" && bookingStatus !== "done")) {
        return (
            <div className="relative p-3 bg-white rounded-lg border border-gray-200 hover:border-indigo-300 transition-all duration-200 group">
                {/* Display label and value when not editing */}
                {!edit && (
                    <>
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>
                                <span className="block text-base font-medium text-gray-800 mt-1">{value}</span>
                            </div>
                            <button
                                className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors duration-200"
                                title="Edit"
                                onClick={() => {
                                    setEdit(true);
                                    setCancelBtn(true);

                                    setSelectedVenue({ additionalHours: value, number_of_guests: value, damageFee: value, date: format(parseISO(bDate), "yyyy-MM-dd") });
                                }}
                            >
                                <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z" />
                                </svg>
                            </button>
                        </div>
                    </>
                )}

                {/* Editing mode */}
                {edit && (
                    <div className="space-y-3">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>

                        {(label === "Venue ID" || label === "Status") && (
                            <select
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                value={selectedVenue}
                                onChange={e => setSelectedVenue(e.target.value)}
                            >
                                <option value="">Select {label}</option>
                                {venues.map(v => (
                                    <option key={v.venue_id} value={v.venue_id}>{v.venue_name + (v.time_slot ? " || " + v.time_slot : "")}</option>
                                ))}
                            </select>
                        )}
                        {selectedVenue &&
                            selectedVenue === '2' && (
                                <div className="mt-2">
                                    <input
                                        type="number"
                                        placeholder="Enter contract money"
                                        value={contract}
                                        onChange={(e) => setContract(e.target.value)}
                                        className="w-full p-2 border rounded mb-2"
                                        required
                                    />
                                    <p className="text-sm text-gray-500 mb-2">
                                        contract money is required to confirm this booking.
                                    </p>
                                </div>
                            )
                        }

                        {label === "Damage Fee (Rs)" && (
                            <input
                                type="number"
                                className="border rounded p-1"
                                value={selectedVenue.damageFee}
                                onChange={e => setSelectedVenue({ "damageFee": e.target.value, "refundAmount": "", "depositAmount": "", "status": "" })}
                            />
                        )}

                        {label === "Guests" && (
                            <input
                                type="number"
                                className="border rounded p-1"
                                value={selectedVenue.number_of_guests ?? ""}
                                onChange={e => setSelectedVenue({ "number_of_guests": e.target.value })}
                            />
                        )}

                        {label === "Additional Hours" && (
                            <input
                                type="number"
                                className="border rounded p-1"
                                value={selectedVenue.additionalHours}
                                onChange={e => setSelectedVenue({ "additionalHours": e.target.value })}
                            />
                        )}

                        {label === "Date" && (
                            <input
                                type="date"
                                className="border rounded p-1"
                                value={selectedVenue.date}
                                onChange={e => setSelectedVenue({ "date": e.target.value })}
                            />
                        )}

                        <div className="flex gap-2 mt-2">
                            <button
                                className={`flex-1 py-1.5 px-3 rounded-md font-medium transition-all duration-200 ${saving || !selectedVenue || selectedVenue === value
                                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                                    }`}
                                disabled={saving || !selectedVenue || selectedVenue === value}
                                onClick={async () => {
                                    setSaving(true);
                                    try {
                                        if (label === "Venue ID") {
                                            await updateBookingVenue(bookingId, selectedVenue);
                                        } else if (label === "Status") {
                                            await updateBookingStatus(bookingId, selectedVenue, contract);
                                        } else if (label === "Damage Fee (Rs)") {
                                            await updateDamageFee(bookingId, selectedVenue);
                                        } else if (label === "Guests") {
                                            await updateBookingGuest(bookingId, selectedVenue);
                                        } else if (label === "Additional Hours") {
                                            await updateAdditionalHours(bookingId, selectedVenue);
                                        } else if (label === "Date") {
                                            await updateDate(bookingId, selectedVenue);
                                        }
                                        setRefresh(!refresh);
                                        setEdit(false);
                                    } catch (err) {
                                        console.log(err);
                                        const msg =
                                            err?.response?.data?.message ||
                                            err?.response?.data?.msg ||
                                            err?.message ||
                                            'Failed to update';
                                        alert(`Error: ${msg}`);
                                    }
                                    setSaving(false);
                                    setCancelBtn(false);
                                }}
                            >
                                {saving ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Saving...
                                    </span>
                                ) : 'Confirm'}
                            </button>
                            <button
                                className="flex-1 py-1.5 px-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md font-medium transition-all duration-200"
                                onClick={() => { setEdit(false); setSelectedVenue(value); setCancelBtn(false); }}
                                disabled={saving}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className={`p-3 bg-slate-50 rounded-lg border border-gray-200`}>
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>
            <span className={`block text-base font-medium ${color} mt-1`}>{value || '-'}</span>
        </div>
    );
}

// Loading skeleton component
const LoadingSkeleton = () => (
    <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-64"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-40"></div>
                <div className="grid grid-cols-2 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="p-4 bg-gray-100 rounded-lg">
                            <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
                            <div className="h-6 bg-gray-300 rounded w-32"></div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-40"></div>
                <div className="grid grid-cols-2 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="p-4 bg-gray-100 rounded-lg">
                            <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
                            <div className="h-6 bg-gray-300 rounded w-32"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-40"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="p-4 bg-gray-100 rounded-lg">
                        <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
                        <div className="h-6 bg-gray-300 rounded w-32"></div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

// Main component to fetch and display booking details
export default function BookingDetailsView({ bookingId, onClose }) {
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refresh, setRefresh] = useState(false);
    const [cancelBtn, setCancelBtn] = useState(false);
    const [view, setView] = useState('details'); // 'details' or 'print'
    const [printData, setPrintData] = useState(null);
    const [printLoading, setPrintLoading] = useState(false);
    const [printError, setPrintError] = useState(null);
    const printRef = React.useRef(null);

    const navigate = useNavigate();
    useEffect(() => {
        async function fetchBooking() {
            try {
                setLoading(true);
                const res = await getBookingDetails(bookingId);
                setTimeout(() => {
                    setBooking(res.data);
                    setLoading(false);
                    setRefresh(false);
                }, 500);
            } catch (err) {
                setError('Failed to load booking details');
                setLoading(false);
            }
        }
        fetchBooking();
    }, [bookingId, refresh]);

    const handlePrintView = async () => {
        try {
            setPrintLoading(true);
            const res = await getPrintBookingDetails(bookingId);
            setPrintData(res.data);
            setView('print');
        } catch (err) {
            setPrintError('Failed to load print data');
            console.error(err);
        } finally {
            setPrintLoading(false);
        }
    };

    const handleDownloadPdf = async () => {
        const element = printRef.current;
        if (!element) {
            return;
        }

        const canvas = await html2canvas(element, {
            scale: 2,
        });
        const data = canvas.toDataURL("image/png");

        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "px",
            format: "a4",
        });

        const imgProperties = pdf.getImageProperties(data);
        const pdfWidth = pdf.internal.pageSize.getWidth();

        const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

        pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("examplepdf.pdf");
    };

    const handleFullPage = () => {
        navigate(`/bookingPrint/${bookingId}`);
    }

    if (error) return <div className="p-6 text-red-600">{error}</div>;

    const b = booking;
    const formatDate = (iso) => new Date(iso).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <h1 className="text-2xl font-bold text-gray-800">
                                {view === 'print' ? 'Booking Summary for Print' : 'Booking Details'}
                            </h1>
                            <span className="px-2.5 py-0.5 text-xs font-semibold bg-indigo-100 text-indigo-800 rounded-full">
                                ID: {bookingId}
                            </span>
                        </div>
                        <button
                            onClick={onClose}
                            className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${(view === 'details' && cancelBtn) || view === 'print' ? 'invisible' : 'visible'
                                }`}
                        >
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                </div>


                {/* Main Content */}
                <div className="p-6">
                    {view === 'print' ? (
                        printLoading ? (
                            <div className="p-6 text-center">Loading print data...</div>
                        ) : printError ? (
                            <div className="p-6 text-red-600">{printError}</div>
                        ) : (
                            <BookingPrintView
                                bookingId={bookingId}
                                onBack={() => setView('details')}
                                printRef={printRef}
                            />
                        )
                    ) : loading ? (
                        <LoadingSkeleton />
                    ) : (
                        <div className="space-y-8">
                            {/* Booking Information */}
                            <section className="bg-gray-50 p-5 rounded-xl">
                                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path>
                                    </svg>
                                    Booking Information
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <DetailRow label="Booking ID" value={b.booking_id} />
                                    <DetailRow
                                        label="Date"
                                        value={formatDate(b.booking_date)}
                                        bookingId={b.booking_id}
                                        setRefresh={setRefresh}
                                        setCancelBtn={setCancelBtn}
                                        bookingStatus={b.status}
                                        bDate={b.booking_date}
                                    />
                                    <DetailRow label="Time Slot" value={b.venu_time_slot} />
                                    <DetailRow
                                        label="Status"
                                        value={b.status}
                                        bookingId={b.booking_id}
                                        setRefresh={setRefresh}
                                        setCancelBtn={setCancelBtn}
                                        bDate={b.booking_date}
                                    />
                                    <DetailRow
                                        label="Venue ID"
                                        value={b.venue_id}
                                        bookingId={b.booking_id}
                                        setRefresh={setRefresh}
                                        setCancelBtn={setCancelBtn}
                                        bDate={b.booking_date}
                                    />
                                    <DetailRow label="Customer ID" value={b.customer_id} />
                                    <DetailRow
                                        label="Guests"
                                        value={b.number_of_guests}
                                        bookingId={b.booking_id}
                                        setRefresh={setRefresh}
                                        setCancelBtn={setCancelBtn}
                                        bDate={b.booking_date}
                                    />
                                    <DetailRow
                                        label="Additional Hours"
                                        value={b.additional_hours === null ? 0 : b.additional_hours}
                                        bookingId={b.booking_id}
                                        setRefresh={setRefresh}
                                        setCancelBtn={setCancelBtn}
                                        bDate={b.booking_date}
                                    />
                                </div>
                            </section>

                            {/* Contract Information */}
                            <section className="bg-gray-50 p-5 rounded-xl">
                                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd"></path>
                                    </svg>
                                    Contract Information
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <DetailRow label="Contract ID" value={b.contract_id} />
                                    <DetailRow label="Deposit Amount (Rs)" value={b.deposit_amount} />
                                    <DetailRow
                                        label="Damage Fee (Rs)"
                                        value={b.damage_fee}
                                        bookingId={b.booking_id}
                                        setRefresh={setRefresh}
                                        setCancelBtn={setCancelBtn}
                                        bDate={b.booking_date}
                                    />
                                    <DetailRow label="Refund Amount (Rs)" value={b.refund_amount} />
                                    <DetailRow label="Contract Status" value={b.contract_status} />
                                </div>
                            </section>

                            {/* Pricing Information */}
                            <section className="bg-gray-200 p-5 rounded-xl">
                                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"></path>
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"></path>
                                    </svg>
                                    Pricing Information
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <DetailRow label="Menu Price Total (Rs)" value={b.menu_price_total} />
                                    <DetailRow label="Hall Charge (Rs)" value={b.hall_charge} />
                                    <DetailRow label="Extra Hour Price (Rs)" value={b.extra_hour_fee} />
                                    <DetailRow label="Bites Price (Rs)" value={b.bites_payment} />
                                    {/* <DetailRow label="Liquor Price (Rs)" value={b.fountain_payment} /> */}
                                    <DetailRow label="Other Price (Rs)" value={b.other_payment} />
                                    <DetailRow label="Forfeited Deposit (Rs)" value={b.forfeited_deposit} />
                                    <DetailRow label="Overall Total (Rs)" value={b.overall_total} color={b.overall_total > 0 ? 'underline' : ''} />
                                </div>
                            </section>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 z-10">
                    <div className="flex justify-end space-x-3">
                        {view === 'print' ? (
                            <>
                                <button
                                    onClick={() => setView('details')}
                                    className="px-5 py-2.5 font-medium rounded-lg hover:bg-gray-300 text-gray-700 transition-all duration-200 "
                                >
                                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12l4-4m-4 4 4 4" />
                                    </svg>
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={handlePrintView}
                                    className="px-5 py-2.5 font-medium rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200"
                                >
                                    Invoice
                                </button>
                            </>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}