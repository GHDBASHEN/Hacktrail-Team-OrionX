import React, { useEffect, useState } from 'react';
import { getPaymentHistory } from '../../services/UserService';
import moment from 'moment';
import { FaSearch, FaFilePdf } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import autoTable from "jspdf-autotable";

// Helper function for month dot colors
const getMonthDotColor = (monthName) => {
  const colorMap = {
    'January': '#3b82f6',   // blue-500
    'February': '#8b5cf6',  // purple-500
    'March': '#ec4899',     // pink-500
    'April': '#10b981',     // green-500
    'May': '#eab308',       // yellow-500
    'June': '#6366f1',      // indigo-500
    'July': '#ef4444',      // red-500
    'August': '#f97316',    // orange-500
    'September': '#14b8a6',   // teal-500
    'October': '#06b6d4',    // cyan-500
    'November': '#f59e0b',   // amber-500
    'December': '#84cc16'    // lime-500
  };
  return colorMap[monthName] || '#94a3b8';
};

const PaymentHistory = () => {
  const [history, setHistory] = useState([]);
  const [latestRecords, setLatestRecords] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    employees: '',
    month: '',
    year: ''
  });

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const { success, data, message } = await getPaymentHistory();
        if (success) {
          setHistory(data);
          
          // Process to get latest records per employees per month
          const latestMap = new Map();
          data.forEach(item => {
            const monthYear = moment(item.calculation_date).format('YYYY-MM');
            const key = `${item.employee_id}-${monthYear}`;
            
            // If no record exists or current record is newer
            if (!latestMap.has(key) || 
                moment(item.calculation_date).isAfter(moment(latestMap.get(key).calculation_date))) {
              latestMap.set(key, item);
            }
          });
          
          const latestRecordsArray = Array.from(latestMap.values());
          setLatestRecords(latestRecordsArray);
          setFilteredHistory(latestRecordsArray);
        } else {
          setError(message || 'Failed to load payment history');
        }
      } catch (err) {
        setError('Network error. Please try again later.');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  useEffect(() => {
    let results = latestRecords;
    
    // Apply search filter
    if (searchTerm) {
      results = results.filter(item => 
        item.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.employee_id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply filters
    if (filters.employees) {
      results = results.filter(item => 
        item.employee_id === filters.employees
      );
    }
    
    if (filters.month) {
      results = results.filter(item => 
        moment(item.calculation_date).format('M') === filters.month
      );
    }
    
    if (filters.year) {
      results = results.filter(item => 
        moment(item.calculation_date).format('YYYY') === filters.year
      );
    }
    
    setFilteredHistory(results);
  }, [searchTerm, filters, latestRecords]);

  const formatCurrency = (value) => {
    return `LKR ${parseFloat(value).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  const handleExport = async () => {
    try {
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'pt',
        format: 'a4'
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      
      // Add watermark function
      const addWatermark = () => {
        doc.saveGraphicsState();
        doc.setGState(new doc.GState({ opacity: 0.1 }));
        
        try {
          const watermarkLogoPath = '/logo2.png'; 
          const watermarkWidth = pageWidth * 0.7;
          // Maintain aspect ratio
          const watermarkHeight = watermarkWidth * (5 / 6);
          
          const x = (pageWidth - watermarkWidth) / 2;
          const y = (pageHeight - watermarkHeight) / 2;
          
          doc.addImage(
            watermarkLogoPath,
            'PNG',
            x,
            y,
            watermarkWidth,
            watermarkHeight
          );
        } catch (e) {
          console.error('Error adding watermark logo:', e);
        }
        
        doc.restoreGraphicsState();
      };

      const addFooter = (pageNumber, pageCount) => {
        const footerHeight = 40;
        const footerY = pageHeight - footerHeight;

        doc.setFillColor(41, 128, 185);
        doc.rect(0, footerY, pageWidth, footerHeight, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);

        doc.text(
          'Prepared by: Deandra Bolgoda\nContact: Deandrabolgoda@gmail.com | +94 77 974 0722',
          40,
          footerY + 18,
          { align: 'left' }
        );

        doc.text(
          `Page ${pageNumber} of ${pageCount}`,
          pageWidth - 40,
          footerY + 25,
          { align: 'right' }
        );

        // Draw border line around the page
        doc.setDrawColor(41, 128, 185); // Border color
        doc.setLineWidth(2); // Border thickness
        doc.rect(10, 10, pageWidth - 20, pageHeight - 20, 'S'); // 'S' for stroke only
      };

      // Add title
      doc.setFontSize(20);
      doc.setFont(undefined, 'bold');
      doc.text('Payment Report', pageWidth / 2, 50, { align: 'center' });
      
      // Add report date
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.text(`Generated on: ${moment().format('DD MMM YYYY hh:mm A')}`, pageWidth / 2, 70, { align: 'center' });
      
      // Add filter information
      let filterInfo = 'Filters: ';
      let hasFilters = false;
      
      if (filters.employees) {
        const employees = latestRecords.find(e => e.employee_id === filters.employees);
        filterInfo += `Employee: ${employees?.employee_name || filters.employees} `;
        hasFilters = true;
      }
      if (filters.month) {
        filterInfo += `| Month: ${moment().month(filters.month - 1).format('MMMM')} `;
        hasFilters = true;
      }
      if (filters.year) {
        filterInfo += `| Year: ${filters.year} `;
        hasFilters = true;
      }
      if (searchTerm) {
        filterInfo += `| Search: "${searchTerm}"`;
        hasFilters = true;
      }
      
      if (hasFilters) {
        doc.setFontSize(9);
        doc.text(filterInfo, pageWidth / 2, 90, { align: 'center', maxWidth: pageWidth - 80 });
      }

      const tableStartY = hasFilters ? 110 : 90;

      const headers = [
        'Employee ID', 'Name', 'Period', 'Base Salary', 'Service Charge',
        'Deductions', 'Net Salary', 'Payment Date', 'Payment Status'
      ];
      
      const data = filteredHistory.map(item => [
        item.employee_id,
        item.employee_name,
        moment(item.calculation_date).format('MMM YYYY'),
        formatCurrency(item.basic_salary),
        formatCurrency(item.total_service_charge),
        formatCurrency(item.total_deduction),
        formatCurrency(item.net_salary),
        moment(item.calculation_date).format('DD MMM YYYY'),
        item.status === 'Paid' ? 'Paid' : 'Not Paid' // Updated to show Not Paid by default
      ]);

      // Add watermark only (logo removed)
      addWatermark();

      // Calculate column widths for centering
      const columnWidths = [70, 90, 60, 70, 70, 70, 70, 70, 70];
      const totalTableWidth = columnWidths.reduce((sum, width) => sum + width, 0);
      const startX = (pageWidth - totalTableWidth) / 2;

      autoTable(doc, {
        head: [headers],
        body: data,
        startY: tableStartY,
        margin: { left: startX }, // Center the table
        theme: 'grid',
        headStyles: {
          fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold', fontSize: 10
        },
        bodyStyles: { fontSize: 9 },
        styles: {
          cellPadding: 3, valign: 'middle', halign: 'center'
        },
        columnStyles: {
          0: { cellWidth: 70, halign: 'left' },
          1: { cellWidth: 90, halign: 'left' },
          2: { cellWidth: 60 },
          3: { cellWidth: 70 },
          4: { cellWidth: 70 },
          5: { cellWidth: 70 },
          6: { cellWidth: 70 },
          7: { cellWidth: 70 },
          8: { cellWidth: 70 }
        },
        didDrawPage: function(data) {
          // Add watermark to subsequent pages
          if (data.pageNumber > 1) {
            addWatermark();
          }
          addFooter(data.pageNumber, doc.internal.getNumberOfPages());
        }
      });

      doc.save(`payment_history_${moment().format('YYYYMMDD_HHmmss')}.pdf`);
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const uniqueYears = [...new Set(latestRecords.map(item => 
    moment(item.calculation_date).format('YYYY'))
  )].sort((a, b) => b - a);

  const employeeMap = new Map();
  latestRecords.forEach(item => {
    if (!employeeMap.has(item.employee_id)) {
      employeeMap.set(item.employee_id, item.employee_name);
    }
  });
  
  const uniqueEmployees = Array.from(employeeMap, ([id, name]) => ({
    id,
    name: `${id} - ${name}`
  })).sort((a, b) => a.name.localeCompare(b.name));

  const groupByMonthYear = (data) => {
    return data.reduce((groups, item) => {
      const key = moment(item.calculation_date).format('MMMM YYYY');
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
      return groups;
    }, {});
  };

  const getSortedGroups = (groupedData) => {
    return Object.entries(groupedData)
      .sort(([aKey], [bKey]) => 
        moment(bKey, 'MMMM YYYY').diff(moment(aKey, 'MMMM YYYY'))
      );
  };

  const monthColors = [
    'bg-blue-50', 'bg-purple-50', 'bg-pink-50', 'bg-green-50', 'bg-yellow-50',
    'bg-indigo-50', 'bg-red-50', 'bg-orange-50', 'bg-teal-50', 'bg-cyan-50',
    'bg-amber-50', 'bg-lime-50'
  ];

  const getMonthColor = (monthName) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const monthIndex = months.findIndex(m => m === monthName.split(' ')[0]);
    return monthColors[monthIndex] || 'bg-gray-50';
  };

  const groupedData = groupByMonthYear(filteredHistory);
  const sortedGroups = getSortedGroups(groupedData);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-3xl mx-auto" role="alert">
        <strong className="font-bold">Error! </strong>
        <span className="block sm:inline">{error}</span>
        <button 
          onClick={() => window.location.reload()} 
          className="ml-4 mt-2 sm:mt-0 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Payment History</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div className="relative flex-grow max-w-lg">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search by employees name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button
            onClick={handleExport}
            disabled={filteredHistory.length === 0}
            className={`flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium ${
              filteredHistory.length === 0
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            }`}
          >
            <FaFilePdf className="mr-2" />
            Export to PDF
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
            <select
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={filters.employees}
              onChange={(e) => setFilters({...filters, employees: e.target.value})}
            >
              <option value="">All Employees</option>
              {uniqueEmployees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
            <select
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={filters.month}
              onChange={(e) => setFilters({...filters, month: e.target.value})}
            >
              <option value="">All Months</option>
              {[...Array(12)].map((_, i) => (
                <option key={i+1} value={String(i+1)}>
                  {moment().month(i).format('MMMM')}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <select
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={filters.year}
              onChange={(e) => setFilters({...filters, year: e.target.value})}
            >
              <option value="">All Years</option>
              {uniqueYears.map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr className="border-b-2 border-gray-300">
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Base Salary</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Charge</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deductions</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Salary</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment status</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                      <p className="text-lg">No payment records found</p>
                      <p className="mt-1 text-sm">Try adjusting your search or filter criteria</p>
                    </div>
                  </td>
                </tr>
              ) : (
                sortedGroups.map(([monthYear, items]) => {
                  const monthName = monthYear.split(' ')[0];
                  const monthColor = getMonthColor(monthName);
                  
                  return (
                    <React.Fragment key={`group-${monthYear}`}>
                      <tr className={`${monthColor} border-t-2 border-b border-gray-300`}>
                        <td colSpan="8" className="px-6 py-3 font-bold text-gray-800">
                          <div className="flex items-center">
                            <div 
                              className="w-3 h-3 rounded-full mr-3" 
                              style={{ backgroundColor: getMonthDotColor(monthName) }}
                            ></div>
                            {monthYear}
                            <span className="ml-2 text-sm font-normal text-gray-600">
                              ({items.length} payment{items.length > 1 ? 's' : ''})
                            </span>
                          </div>
                        </td>
                      </tr>
                      
                      {items.map((item, index) => (
                        <tr 
                          key={`${item.employee_id}-${item.calculation_date}`}
                          className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 ${
                            index === items.length - 1 ? 'border-b-2 border-gray-300' : 'border-b border-gray-200'
                          }`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{item.employee_name}</div>
                                <div className="text-sm text-gray-500">{item.employee_id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {moment(item.calculation_date).format('MMM YYYY')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatCurrency(item.basic_salary)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatCurrency(item.total_service_charge)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500">
                            {formatCurrency(item.total_deduction)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                            {formatCurrency(item.net_salary)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {moment(item.calculation_date).format('DD MMM YYYY')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              item.status === 'Paid' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {item.status === 'Paid' ? 'Paid' : 'Not Paid'} {/* Updated to show Not Paid by default */}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {filteredHistory.length > 0 && (
          <div className="mt-4 text-sm text-gray-500">
            Showing {filteredHistory.length} of {latestRecords.length} records
            {(filters.employees || filters.month || filters.year || searchTerm) && (
              <button 
                className="ml-4 text-blue-600 hover:text-blue-800"
                onClick={() => {
                  setFilters({ employees: '', month: '', year: '' });
                  setSearchTerm('');
                }}
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;