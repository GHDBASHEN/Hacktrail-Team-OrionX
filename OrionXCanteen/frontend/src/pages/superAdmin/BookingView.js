import React, { useState, useEffect } from 'react';
import { addCustomer, searchCustomer } from '../../services/CustomerServise';
import BookingService from '../../services/BookngService';
import { getAllVenues } from '../../services/VenueService';
import VenueDropdown from '../../components/bookings/VenueDropdown';

const BookingView = () => {
  // State declarations
  const [customers, setCustomer] = useState({ name: '', email: '', address: '', phone: '', nic: '' });
  const [customerSuccess, setCustomerSuccess] = useState(false);
  const [bookSuccess, setBookSuccess] = useState(false);
  const [searchresult, setSearchresult] = useState(false);
  const [errmsg, setErrmsg] = useState({ msg: '', color: '' });
  const [bErrmsg, setBErrmsg] = useState({ msg: '', color: '' });
  const [btnText, setBtnText] = useState('Add Customer');
  const [btnBookingText, setBtnBookingText] = useState('Add Booking');
  const [customerIdMsg, setCustomerIdMsg] = useState("");
  const [cusres, setCusres] = useState('');
  const [addedCustomer, setAddedCustomer] = useState(null);
  const [venues, setVenues] = useState([]);
  const [serachlist, setSerachlist] = useState([]);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('new'); // 'new' or 'existing'
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Fetch venues on mount
  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      const res = await getAllVenues();
      setVenues(res);
    } catch (err) {
      console.error('Error fetching venues:', err);
    }
  };

  // Validation logic
  const validateField = (name, value) => {
    let error = { msg: '', color: '' };
    switch (name) {
      case 'name':
        if (/[^a-zA-Z\s.]/.test(value)) {
          error = { msg: 'Name must not contain numbers or symbols.', color: 'text-red-600' };
        }
        break;
      case 'phone':
        if (!/^\d{10}$/.test(value)) {
          error = { msg: 'Phone number must contain exactly 10 digits.', color: 'text-red-600' };
        }
        break;
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = { msg: 'Invalid email address.', color: 'text-red-600' };
        }
        break;
      case 'address':
        if (value.trim() === '') {
          error = { msg: 'Address cannot be empty.', color: 'text-red-600' };
        }
        break;
      default:
        break;
    }
    setErrmsg(error);
    return error.msg === '';
  };

  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setCustomer(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const submitCustomer = async (e) => {
    e.preventDefault();
    setErrmsg({ msg: '', color: '' });
    const isValid = Object.keys(customers).every((key) =>
      validateField(key, customers[key])
    );
    if (!isValid) return;

    setBtnText('Adding...');
    try {
      const res = await addCustomer(customers);
      const newId = res.cus_id.customer_id;
      setCusres(newId);
      setCustomerSuccess(true);
      setAddedCustomer(customers);
      setCustomer({ name: '', email: '', address: '', phone: '', nic: '' });
      setErrmsg({ msg: res.message || 'Customer added!', color: 'text-green-600' });
      setCustomerIdMsg(res.message);
      // Set this customers as the selected one for booking
      setSelectedCustomer({ ...customers, customer_id: newId });
      //setActiveTab('existing');
    } catch (err) {
      console.error(err);
      if (err.response?.data?.message) {
        setErrmsg({ msg: err.response.data.message, color: 'text-red-600' });
      } else {
        setErrmsg({ msg: 'An unexpected error occurred.', color: 'text-red-600' });
      }
    } finally {
      setBtnText('Add Customer');
    }
  };

  const [booking, setBooking] = useState({
    date: '',
    slot: 'day',
    customerId: '',
    guests: 150,
    venueId: '',
    extraHours: 0,
    payDeposit: false,
  });

  const [search, setSearch] = useState({
    property: ''
  });

  // Sync booking.customerId when selectedCustomer changes
  useEffect(() => {
    if (selectedCustomer) {
      setBooking(b => ({ ...b, customerId: selectedCustomer.customer_id }));
    }
  }, [selectedCustomer]);

  const handleBookingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBooking(frm => ({
      ...frm,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearch({ property: value });

    if (value.length > 2) {
      try {
        const response = await searchCustomer(value.trim());
        setSerachlist(response);
        setSearchresult(true);
      } catch (error) {
        console.error("Error searching customers:", error);
        setSearchresult(false);
      }
    } else {
      setSearchresult(false);
    }
  };

  const selectCustomer = (customers) => {
    setSelectedCustomer(customers);
    setSearch({ property: customers.name });
    setSearchresult(false);
  };

  const submitBooking = async (e) => {
    e.preventDefault();

    if (!booking.customerId) {
      setBErrmsg({ msg: 'Please select a customers first', color: 'text-red-600' });
      return;
    }

    setBtnBookingText("Adding...");
    try {
      const res = await BookingService.createBooking(booking);
      setBookSuccess(true);
      setResult(`Successfully created booking: ${res.booking_id}`);
      setBErrmsg({ msg: '', color: 'text-red-600' });

      // Reset form after successful booking
      setBooking({
        date: '',
        slot: 'day',
        customerId: selectedCustomer.customer_id, // Keep same customers
        guests: 150,
        venueId: '',
        extraHours: 0,
        payDeposit: false,
      });
    } catch (err) {
      setResult('Error creating booking');
      console.error(err);
      if (err.response?.data?.message) {
        setBErrmsg({ msg: err.response.data.message, color: 'text-red-600' });
      } else {
        setBErrmsg({ msg: 'All fields must be filled.', color: 'text-red-600' });
      }
    } finally {
      setBtnBookingText("Add Booking");
    }
  };

  // CSS Classes
  const inputClass = 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5';
  const labelClass = 'block mb-2 text-sm font-medium text-gray-900';
  const cardClass = 'bg-white rounded-lg shadow p-6 mb-6';
  const tabClass = (isActive) =>
    `px-4 py-2 text-sm font-medium rounded-t-lg ${isActive
      ? 'bg-white text-blue-600 border-b-2 border-blue-600'
      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`;

  const SuccessIcon = () => (
    <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">

        {/* Customer Selection Tabs */}
        <div className="mb-6">
          <div className="flex border-b border-gray-200">
            <button
              className={tabClass(activeTab === 'new')}
              onClick={() => setActiveTab('new')}
            >
              New Customer
            </button>
            <button
              className={tabClass(activeTab === 'existing')}
              onClick={() => setActiveTab('existing')}
            >
              Existing Customer
            </button>
          </div>
        </div>

        {/* Customer Form */}
        <div className={cardClass}>
          {activeTab === 'new' ? (
            <>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">New Customer Information</h3>

              {errmsg.msg && (
                <div className={`mb-4 p-3 rounded-lg ${errmsg.color === 'text-red-600' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                  {errmsg.msg}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label htmlFor="name" className={labelClass}>Full Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={customers.name}
                    onChange={handleCustomerChange}
                    placeholder="e.g. John Smith"
                    className={inputClass}
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className={labelClass}>Email Address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={customers.email}
                    onChange={handleCustomerChange}
                    placeholder="e.g. john@example.com"
                    className={inputClass}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className={labelClass}>Phone Number</label>
                  <input
                    id="phone"
                    name="phone"
                    type="text"
                    value={customers.phone}
                    onChange={handleCustomerChange}
                    placeholder="e.g. 0712345678"
                    className={inputClass}
                  />
                </div>

                {/* NIC */}
                {/* <div>
                  <label htmlFor="nic" className={labelClass}>NIC Number</label>
                  <input
                    id="nic"
                    name="nic"
                    type="number"
                    value={customers.nic}
                    onChange={handleCustomerChange}
                    placeholder="e.g. 1234567891"
                    className={inputClass}
                  />
                </div> */}

                {/* Address */}
                <div className="md:col-span-2">
                  <label htmlFor="address" className={labelClass}>Address</label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    value={customers.address}
                    onChange={handleCustomerChange}
                    placeholder="e.g. No: 123, Main Street, Colombo"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="mt-6">
                {!customerSuccess ? (
                  <button
                    onClick={submitCustomer}
                    className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    {btnText}
                  </button>
                ) : (
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200 text-green-700">
                    <SuccessIcon /> {customerIdMsg}
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Existing Customer</h3>

              <div className="mb-4">
                <label htmlFor="customers-search" className={labelClass}>Search Customer</label>
                <div className="relative">
                  <input
                    id="customers-search"
                    name="property"
                    type="text"
                    value={search.property}
                    onChange={handleSearch}
                    placeholder="Search by name, email, phone or NIC"
                    className={inputClass}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                {searchresult && serachlist.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-auto">
                    <ul className="py-1">
                      {serachlist.map((item) => (
                        <li
                          key={item.customer_id}
                          className={`px-4 py-2 hover:bg-gray-50 cursor-pointer ${selectedCustomer?.customer_id === item.customer_id ? 'bg-blue-50' : ''}`}
                          onClick={() => selectCustomer(item)}
                        >
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-gray-600">{item.email} | {item.phone}</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {selectedCustomer && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mb-4">
                  <div className="font-medium text-blue-800">Selected Customer</div>
                  <div className="mt-1">
                    <div><span className="font-medium">Name:</span> {selectedCustomer.name}</div>
                    <div><span className="font-medium">Phone:</span> {selectedCustomer.phone}</div>
                    <div><span className="font-medium">Email:</span> {selectedCustomer.email}</div>
                  </div>
                </div>
              )}

              {!selectedCustomer && (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-gray-600 text-center">
                  Search and select a customers to create a booking
                </div>
              )}
            </>
          )}
        </div>

        {/* Booking Form */}
        <div className={cardClass}>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Booking Information</h3>

          {bErrmsg.msg && (
            <div className={`mb-4 p-3 rounded-lg ${bErrmsg.color === 'text-red-600' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
              {bErrmsg.msg}
            </div>
          )}

          <form onSubmit={submitBooking} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Date */}
              <div>
                <label htmlFor="booking_date" className={labelClass}>
                  Booking Date
                </label>
                <div className="relative">
                  <input
                    id="booking_date"
                    name="date"
                    type="date"
                    required
                    value={booking.date}
                    onChange={handleBookingChange}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Slot */}
              <div>
                <label htmlFor="slot" className={labelClass}>
                  Time Slot
                </label>
                <select
                  id="slot"
                  name="slot"
                  required
                  value={booking.slot}
                  onChange={handleBookingChange}
                  className={inputClass}
                >
                  <option value="day">Day</option>
                  <option value="night">Night</option>
                </select>
              </div>

              {/* Venue Dropdown */}
              <VenueDropdown venues={venues} booking={booking} setBooking={setBooking} />

              {/* Guests */}
              <div>
                <label htmlFor="number_of_guests" className={labelClass}>
                  Number of Guests
                </label>
                <input
                  id="number_of_guests"
                  name="guests"
                  type="number"
                  required
                  value={booking.guests}
                  onChange={handleBookingChange}
                  className={inputClass}
                />
              </div>

              {/* Extra Hours */}
              <div>
                <label htmlFor="additional_hours" className={labelClass}>
                  Additional Hours
                </label>
                <input
                  id="additional_hours"
                  name="extraHours"
                  type="number"
                  min={0}
                  value={booking.extraHours}
                  onChange={handleBookingChange}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Deposit */}
            <div className="flex items-end pt-2">
              <div>
                <label htmlFor="number_of_guests" className={labelClass}>
                  Contract Money
                </label>
                <input
                  id="pay_deposit"
                  name="payDeposit"
                  type="number"
                  required
                  checked={booking.payDeposit}
                  onChange={handleBookingChange}
                  className={inputClass}
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="pay_deposit" className="font-medium text-gray-700">
                  Pay Key Money Deposit (Rs. 50,000)
                </label>
                <p className="text-gray-500">Secures the booking with a deposit</p>
              </div>
            </div>



            <div className="mt-6">
              {!bookSuccess ? (
                <button
                  type="submit"
                  disabled={!selectedCustomer}
                  className={`w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-6 rounded-lg flex items-center justify-center ${!selectedCustomer ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {btnBookingText}
                </button>
              ) : (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center text-green-700">
                    <SuccessIcon />
                    <span className="font-medium">Successfully added booking!</span>
                  </div>
                  <div className="mt-2 text-green-700 pl-7">{result}</div>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Status Bar */}
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="flex flex-col sm:flex-row justify-around items-center">
            <div className="mb-4 sm:mb-0">
              <div className="text-sm text-gray-500">Selected Customer</div>
              <div className="font-medium">
                {selectedCustomer ? selectedCustomer.name : 'None selected'}
              </div>
            </div>
            <div className="mb-4 sm:mb-0">
              <div className="text-sm text-gray-500">Customer ID</div>
              <div className="font-medium">
                {selectedCustomer ? selectedCustomer.customer_id : 'N/A'}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Booking Status</div>
              <div className={`font-medium ${bookSuccess ? 'text-green-600' : 'text-gray-700'}`}>
                {bookSuccess ? 'Booking Created' : 'Ready to book'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingView;