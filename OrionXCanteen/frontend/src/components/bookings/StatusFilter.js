import React, { useEffect, useState, useRef } from 'react';

export const StatusFilter = ({ currentStatus, onChange, serchBy, onSearch }) => {
    const statuses = ['all', 'pending', 'confirmed', 'done', 'cancelled'];
    const [viewAction, setViewAction] = useState(true);
    const dropdownRef = useRef(null);

    const toggleAction = () => {
        setViewAction((prev) => !prev);
    };
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                event.target.id !== "dropdownActionButton"
            ) {
                setViewAction(true); // Hide dropdown
            }
        };
        if (!viewAction) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [viewAction]);

    const handleSearch = (e) => {
        const searchTerm = e.target.value;
        onSearch(searchTerm);
    };

    return (
        <div className="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-white dark:bg-gray-900 p-5">
            <div>
                {/* button for dropdown */}
                <button
                    onClick={toggleAction}
                    className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" type="button">
                    Action
                    <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                    </svg>
                </button>

                {/* Dropdown positioned absolutely below the button */}
                <div
                    ref={dropdownRef}
                    id="dropdownAction"
                    className={`z-10 ${!viewAction ? 'block absolute mt-2' : 'hidden'} bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700 dark:divide-gray-600`}
                    style={{ minWidth: '11rem' }}
                >
                    <ul className="py-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownActionButton">
                        {statuses.map((status) => (
                            <li key={status}>
                                <a
                                    href="#"
                                    onClick={() => {onChange(status); setViewAction(true);}}
                                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                >
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <label for="table-search" className="sr-only">Search</label>
            <div className="relative">
                <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                    </svg>
                </div>
                <input type="text" onChange={handleSearch} value={serchBy} id="table-search-users" className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search by Ids" />
            </div>
        </div>
    );
};

