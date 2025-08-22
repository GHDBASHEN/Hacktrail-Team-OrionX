import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { FaCheckCircle, FaRegCircle, FaArrowRight, FaFilePdf, FaSpinner } from 'react-icons/fa';
import { Loader2, AlertCircle } from 'lucide-react';

// Import your services
import { getEventProgress } from '../../services/EventService';
import { downloadReportAPI } from '../../services/EventService'; // Service for PDF download
import { decryptBookingId } from "../../utills/encryptionUtils.js";

// Reusable component for each task in the checklist
const TaskItem = ({ title, status, page, setActivePage }) => {
    const isComplete = status === 'Complete';
    
    return (
        <div className={`flex items-center justify-between p-4 rounded-lg transition-all duration-300 ${isComplete ? 'bg-green-50' : 'bg-gray-50 hover:bg-white'}`}>
            <div className="flex items-center">
                {isComplete ? (
                    <FaCheckCircle className="text-green-500 text-2xl mr-4" />
                ) : (
                    <FaRegCircle className="text-gray-400 text-2xl mr-4" />
                )}
                <div>
                    <h3 className={`font-semibold ${isComplete ? 'text-gray-700' : 'text-gray-800'}`}>{title}</h3>
                    <p className={`text-sm ${isComplete ? 'text-green-600' : 'text-yellow-600'}`}>{status}</p>
                </div>
            </div>
            {!isComplete && page && (
                <button 
                    onClick={() => setActivePage(page)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
                >
                    Start <FaArrowRight className="w-3 h-3" />
                </button>
            )}
        </div>
    );
};

// A dedicated component for the download button and its logic
const ReportDownloadItem = ({ bookingId }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleDownload = async () => {
    if (!bookingId) {
        setError('Booking ID is missing.');
        return;
    }
    setIsLoading(true);
    setError(null);

    try {
        const response = await downloadReportAPI(bookingId);
        
        // Check if response is valid
        if (!(response instanceof Blob)) {
            throw new Error('Invalid response from server');
        }
        
        const url = window.URL.createObjectURL(response);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Event-Report-${bookingId}.pdf`);
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
        setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        }, 100);
        
    } catch (err) {
        console.error('Download error:', err);
        setError(err.message || 'Failed to download report. Please try again.');
    } finally {
        setIsLoading(false);
    }
};
    

    return (
        <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-white transition-all duration-300">
            <div className="flex items-center">
                <FaFilePdf className="text-red-500 text-2xl mr-4" />
                <div>
                    <h3 className="font-semibold text-gray-800">Event Summary Report</h3>
                    <p className="text-sm text-gray-500">A complete overview of your event details.</p>
                    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                </div>
            </div>
            <button
                onClick={handleDownload}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:bg-gray-400 transition-colors"
            >
                {isLoading ? <FaSpinner className="animate-spin" /> : 'Download'}
            </button>
        </div>
    );
};

const CustomerEventDashboard = ({ setActivePage }) => {
    const { bookingId: encryptedBookingId } = useParams();
    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const decryptedBookingId = useMemo(() => {
        if (!encryptedBookingId) return null;
        try {
            return decryptBookingId(encryptedBookingId);
        } catch (err) {
            console.error("Failed to decrypt booking ID:", err);
            return null;
        }
    }, [encryptedBookingId]);

    useEffect(() => {
        if (!decryptedBookingId) {
            setError("Invalid or missing Booking ID. Cannot load progress.");
            setLoading(false);
            return;
        }

        getEventProgress(decryptedBookingId)
            .then(data => setProgress(data))
            .catch(err => setError('Failed to load your event progress. Please try again later.'))
            .finally(() => setLoading(false));
    }, [decryptedBookingId]);

    if (!decryptedBookingId && !loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-red-500">
                <AlertCircle className="w-12 h-12 mb-4" />
                <p className="text-xl font-medium">{error || "Invalid Booking ID."}</p>
            </div>
        );
    }

    if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="w-12 h-12 text-blue-500 animate-spin" /></div>;
    if (error) return <div className="flex flex-col items-center justify-center h-64 text-red-500"><AlertCircle className="w-12 h-12 mb-4" /><p>{error}</p></div>;
    if (!progress) return <div className="text-center p-8">No progress data available.</div>;

    const pageMapping = {
        eventDetails: 'plan-event',
        menuSelection: 'plan-menulist',
        servicesSelection: 'Select-Services',
        tableArrangement: 'Select-Tables',
        barSelection: 'select-bar-arrangements'
    };

    return (
        <div className="p-2 space-y-12">
            {/* --- Progress Section --- */}
            <div>
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Your Event Planning Progress</h1>
                    <p className="text-gray-500 mt-1">Let's get everything ready for your big day!</p>
                </div>
                <div className="mb-10">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-lg font-semibold text-gray-700">Overall Progress</h2>
                        <span className="text-xl font-bold text-blue-600">{progress.overallProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                        <div 
                            className="bg-blue-500 h-4 rounded-full transition-all duration-500"
                            style={{ width: `${progress.overallProgress}%` }}
                        ></div>
                    </div>
                    <p className="text-right text-sm text-gray-500 mt-1">
                        {progress.completedCount} of {progress.totalTasks} tasks completed
                    </p>
                </div>
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">Your Checklist</h2>
                    {Object.entries(progress.tasks).map(([key, task]) => (
                        <TaskItem
                            key={key}
                            title={task.title}
                            status={task.status}
                            page={pageMapping[key]}
                            setActivePage={setActivePage}
                        />
                    ))}
                </div>
            </div>

            {/* --- NEW REPORTS SECTION --- */}
            <div>
                <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Reports</h2>
                <div className="space-y-4">
                    <ReportDownloadItem bookingId={decryptedBookingId} />
                    {/* You can add more report download items here in the future */}
                </div>
            </div>
        </div>
    );
};

export default CustomerEventDashboard;
