import React, { useEffect, useState } from 'react';
import { getPrintBookingDetails } from '../../services/BookngService';
import { FiPrinter } from 'react-icons/fi';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const formatDate = (isoString) => {
  if (!isoString) return '-';
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const formatCurrency = (value) => {
  if (value === null || value === undefined) return '0.00';
  const num = parseFloat(value);
  return isNaN(num) ? value : num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

const formatInteger = (value) => {
  if (value === null || value === undefined) return '0';
  const num = parseFloat(value);
  return isNaN(num) ? value : num.toLocaleString('en-US', { maximumFractionDigits: 0 });
};

export default function BookingPrintView({ bookingId, onBack }) {
  const [printData, setPrintData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const printRef = React.useRef(null);

  useEffect(() => {
    async function fetchPrintData() {
      try {
        setLoading(true);
        const res = await getPrintBookingDetails(bookingId);
        setPrintData(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load print data');
        setLoading(false);
      }
    }
    fetchPrintData();
  }, [bookingId]);

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

  if (loading) return <div className="p-6 text-center">Loading print data...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!printData) return <div className="p-6">No data available</div>;

  const {
    booking_id, booking_date, b_time_slot, b_status,
    venue_name, venue_id, Location, min_capacity, max_capacity,
    name, email, address, phone, customer_id,
    deposit_amount, damage_fee, refund_amount, contract_status,
    b_total_price, b_number_of_guests, b_additional_hours,
    menu_price_total, hall_charge, extra_hour_fee,
    bites_payment, fountain_payment, other_payment,
    overall_total, forfeited_deposit
  } = printData;

  const refundMsg = () => {
    // Use 'status' instead of 'contract_status' to match database
    switch (contract_status) {
      case 'pending':
        return (
          <>
            <span>Deposit held pending event completion and inspection.</span>
          </>
        );
      case 'refunded':
        return (
          <>
            <span>Contract fulfilled. Security deposit refunded after final inspection.</span>
          </>
        );
      case 'forfeited':
        return <span>Contract terminated. Security deposit forfeited (Rs. {formatInteger(forfeited_deposit)}) retained as per agreement.</span>;
      case 'canceled':
        return <span>Contract canceled per customers request.</span>;
      default:
        return <span>Contract status pending resolution.</span>;
    }
  }

  return (
    <div className="p-6 bg-white">
      <div className="max-w-4xl mx-auto border border-gray-200 p-8 rounded-lg shadow-lg print:shadow-none print:border-0 print:max-w-full"
      >
        {/* Print Header */}
        <div className="print:hidden flex justify-between items-center mb-6">
          <button
            onClick={handleDownloadPdf}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            <FiPrinter className="text-lg" />
            Print Invoice
          </button>
        </div>

        {/* Invoice Content */}
        <div className="pt-5 pl-8 pr-8 pb-5" ref={printRef}>
          <div className='flex  mb-5'>
            <div className='mr-5'>
              <img src='/15.svg' className='w-16 h-w-16 mb-5' />
            </div>
            <div className=''>
              <h1 className="text-2xl font-bold ">INVOICE</h1>
              <h3>Deandra Bolgoda</h3>
            </div>
            <hr />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Customer Details */}
            <div>
              <h2 className="text-lg font-semibold border-b pb-2 mb-2">Customer Details</h2>
              <div className="space-y-1">
                <p><span className="font-medium">Name:</span> {name}</p>
                <p><span className="font-medium">Email:</span> {email}</p>
                <p><span className="font-medium">Phone:</span> {phone}</p>
                <p><span className="font-medium">Address:</span> {address}</p>
                <p><span className="font-medium">Customer ID:</span> {customer_id}</p>
              </div>
            </div>

            {/* Booking Details */}
            <div className='ml-20'>
              <h2 className="text-lg font-semibold border-b pb-2 mb-2">Booking Details</h2>
              <div className="space-y-1">
                <p><span className="font-medium">Booking ID:</span> {booking_id}</p>
                <p className="underline"><span className="font-medium">Status:</span> {b_status}</p>
                <p><span className="font-medium">Date:</span> {formatDate(booking_date)}</p>
                <p><span className="font-medium">Time Slot:</span> {b_time_slot}</p>
                <p><span className="font-medium">Guests:</span> {b_number_of_guests}</p>
                <p><span className="font-medium">Additional Hours:</span> {b_additional_hours}</p>
              </div>
            </div>
          </div>

          {/* Venue Details */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold border-b pb-2 mb-2">Venue Details</h2>
            <div className="space-y-1">
              <p><span className="font-medium">Venue:</span> {venue_name} ({venue_id})</p>
              <p><span className="font-medium">Location:</span> {Location}</p>
              <p><span className="font-medium">Capacity:</span> {min_capacity} - {max_capacity} guests</p>
            </div>
          </div>

          {/* Charges Table */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold border-b pb-2 mb-2">Charges</h2>
            <table className="w-full">
              <tbody>
                {[
                  ['Hall Charge', hall_charge],
                  ['Menu Price Total', menu_price_total],
                  ['Extra Hour Fee', extra_hour_fee],
                  ['Bites Payment', bites_payment],
                  // ['Fountain Payment', fountain_payment],
                  ['Other Payment', other_payment],
                  // ['Deposit Amount', deposit_amount],
                  ['Damage Fee', damage_fee],
                  // ['Refund Amount', refund_amount],
                  // ['Forfeited Deposit', forfeited_deposit],
                ].map(([label, value], index) => (
                  <tr key={index} className={`border-b ${label === 'Refund Amount' ? 'line-through' : ''}`}>
                    <td className={`py-2 `}>{label}</td>
                    <td className="py-2 text-right">Rs. {formatInteger(value)}</td>
                  </tr>
                ))}
                <tr className="border-t-2 border-black font-bold">
                  <td className="py-2">Overall Total</td>
                  <td className="py-2 text-right underline">Rs. {formatInteger(overall_total)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Contract Status */}
          <div>
            <h2 className="text-lg font-semibold border-b pb-2 mb-2">Contract Status</h2>

            <div className="mb-2">
              <span className="font-medium">Deposit Amount:</span> {formatCurrency(deposit_amount)}
            </div>
            <div className="mb-2">
              <span className="font-medium">Damage Fee:</span> {formatCurrency(damage_fee)}
            </div>
            <div className="mb-2">
              <span className="font-medium">Refund Amount:</span> {formatCurrency(refund_amount)}
            </div>
            <hr />
            <p>{refundMsg()}</p>
          </div>

          {/* Print-only footer */}
          <div className="block print:block mt-16 pt-4 border-t text-sm text-center text-gray-500">
            Generated on {new Date().toLocaleDateString()} | Booking ID: {booking_id}
          </div>

        </div>
      </div>
    </div>
  );

}