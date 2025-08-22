import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getStructuredSelectionsByBookingId } from '../../services/MenuService';
import { format } from 'date-fns';
import { decryptBookingId } from '../../utills/encryptionUtils';

const CustomerMenuSummaryPage = () => {
  const { bookingId: encryptedBookingId } = useParams();
  const [menuData, setMenuData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const decryptedBookingId = decryptBookingId(encryptedBookingId);

  useEffect(() => {
    const fetchMenuSelections = async () => {
      try {
        setLoading(true);
        const data = await getStructuredSelectionsByBookingId(decryptedBookingId);
        setMenuData(data);
      } catch (err) {
        console.error("Failed to load menu selections:", err);
        setError(err.message || "Failed to load menu data");
      } finally {
        setLoading(false);
      }
    };

    fetchMenuSelections();
  }, [decryptedBookingId]);

  const generatePDF = async () => {
    if (!menuData) return;

    setIsGeneratingPdf(true);
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();

      const primaryColor = [59, 130, 246];
      const textColor = [55, 65, 81];
      const lightGray = [156, 163, 175];

      // Add watermark to all pages
      const addWatermark = () => {
        try {
          // Save current state to restore later
          doc.saveGraphicsState();
          
          // Set watermark properties - increased opacity for better visibility
          doc.setGState(new doc.GState({ opacity: 0.2 })); // Increased from 0.1 to 0.2
          
          const watermarkLogoPath = '/menus/deandra logo.jpg'; 
          const pageWidth = doc.internal.pageSize.getWidth();
          const pageHeight = doc.internal.pageSize.getHeight();
          
          // Watermark size - 50% of page width (increased from 30%)
          const watermarkWidth = pageWidth * 0.5;
          // Maintain aspect ratio
          const watermarkHeight = watermarkWidth * (1); // Adjust ratio if needed
          
          // Center watermark
          const x = (pageWidth - watermarkWidth) / 2;
          const y = (pageHeight - watermarkHeight) / 2;
          
          doc.addImage(
            watermarkLogoPath,
            'JPEG',
            x,
            y,
            watermarkWidth,
            watermarkHeight
          );
          
          // Restore graphics state
          doc.restoreGraphicsState();
        } catch (e) {
          console.error('Error adding watermark:', e);
        }
      };

      let yPosition = 20;
      const pageWidth = doc.internal.pageSize.width;
      const margin = 20;
      const contentWidth = pageWidth - 2 * margin;

      // Add watermark to first page
      addWatermark();

      // doc.setFillColor(...primaryColor);
      doc.rect(0, 0, pageWidth, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      
      doc.text('Menu Summary', doc.internal.pageSize.getWidth() / 2, 25, { align: 'center' , setFontSize: '40'});
      doc.text('Deandra Bolgoda', doc.internal.pageSize.getWidth() / 2, 35, { align: 'center' });
    
      
      yPosition = 50;

      doc.setTextColor(...textColor);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Customer Information', margin, yPosition);
      yPosition += 10;

      doc.setFont('helvetica', 'normal');
      doc.text(`Name: ${menuData.customer_name}`, margin, yPosition);
      yPosition += 7;
      doc.text(`Email: ${menuData.customer_email}`, margin, yPosition);
      yPosition += 7;
      doc.text(`Booking ID: ${menuData.booking_id}`, margin, yPosition);
      yPosition += 15;

      doc.setFont('helvetica', 'bold');
      doc.text('Event Details', margin, yPosition);
      yPosition += 10;

      doc.setFont('helvetica', 'normal');
      doc.text(`Date: ${menuData.booking_date ? format(new Date(menuData.booking_date), 'MMMM do, yyyy') : 'Not specified'}`, margin, yPosition);
      yPosition += 7;
      doc.text(`Time: ${menuData.time_slot || 'Not specified'}`, margin, yPosition);
      yPosition += 7;
      doc.text(`Guests: ${menuData.number_of_guests}`, margin, yPosition);
      yPosition += 7;
      doc.text(`Status: ${menuData.status}`, margin, yPosition);
      yPosition += 7;
      doc.text(`Menu Price: Rs. ${parseFloat(menuData.menus[0].categories[0].items[0].price).toLocaleString()}`, margin, yPosition);
      yPosition += 20;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('Selected Menu Items', margin, yPosition);
      yPosition += 15;

      if (menuData.menus && menuData.menus.length > 0) {
        menuData.menus.forEach((menu, menuIndex) => {
          if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
            addWatermark(); // Add watermark to new pages
          }

        // doc.setDrawColor(...primaryColor);
        // doc.setLineWidth(0.5);
        // doc.line(margin, yPosition + 2, margin + contentWidth, yPosition + 2);
        // yPosition += 5;
          
          doc.setTextColor(...primaryColor);
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          doc.text(`${menu.menu_list_name} - ${menu.menu_type_name}`, margin + 5, yPosition + 3);
          yPosition += 15;

          menu.categories.forEach((category, catIndex) => {
            if (yPosition > 270) {
              doc.addPage();
              yPosition = 20;
              addWatermark(); // Add watermark to new pages
            }

            doc.setTextColor(...textColor);
            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.text(`${category.category_name} `, margin + 10, yPosition);
            yPosition += 8;

            if (category.items.length > 0) {
              category.items.forEach((item, itemIndex) => {
                if (yPosition > 275) {
                  doc.addPage();
                  yPosition = 20;
                  addWatermark(); // Add watermark to new pages
                }

                doc.setFont('helvetica', 'normal');
                doc.setFontSize(10);
                doc.text(`• ${item.item_name}`, margin + 20, yPosition);
                yPosition += 6;
              });
            } else {
              doc.setTextColor(...lightGray);
              doc.setFont('helvetica', 'italic');
              doc.text('No items selected', margin + 20, yPosition);
              yPosition += 6;
            }
            yPosition += 5;
          });
          yPosition += 10;
        });
      }

      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setTextColor(...lightGray);
        doc.setFontSize(8);
        doc.text(`Generated on ${format(new Date(), 'MMMM do, yyyy')} - Page ${i} of ${pageCount}`, margin, doc.internal.pageSize.height - 10);
      }

      const fileName = `Menu_Summary_${menuData.booking_id}_${format(new Date(), 'yyyy-MM-dd')}.pdf`;
      doc.save(fileName);

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6 m-5">
        <h2 className="text-xl font-bold text-red-600 mb-2">Error Loading Data</h2>
        <p className="text-gray-700">{error}</p>
      </div>
    );
  }

  if (!menuData) {
    return (
      <div className="bg-white rounded-lg shadow p-6 m-5">
        <h2 className="text-xl font-bold text-gray-800 mb-2">No Data Found</h2>
        <p className="text-gray-700">No menu selections found for this booking.</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header remains fixed */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Menu Summary</h1>
            <div className="mt-2 text-blue-100">
              <p>Booking ID: {menuData.booking_id}</p>
              <p>Customer: {menuData.customer_name} ({menuData.customer_email})</p>
            </div>
          </div>
          <button
            onClick={generatePDF}
            disabled={isGeneratingPdf}
            className={`px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 ${
              isGeneratingPdf 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-white bg-opacity-20 hover:bg-opacity-30 hover:scale-105'
            }`}
          >
            {isGeneratingPdf ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Generating PDF...
              </div>
            ) : (
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download PDF
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-bold text-gray-800">Event Details</h3>
                  <p className="text-sm text-gray-600">
                    Date: {menuData.booking_date ? format(new Date(menuData.booking_date), 'MMMM do, yyyy') : 'Not specified'}
                  </p>
                  <p className="text-sm text-gray-600">
                    Time: {menuData.time_slot || 'Not specified'}
                  </p>
                  <p className="text-sm text-gray-600">
                    Guests: {menuData.number_of_guests}
                  </p>
                  <p className="text-sm text-gray-600">
                    Status: <span className="capitalize">{menuData.status}</span>
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-bold text-gray-800">Pricing Summary</h3>
                  <p className="text-sm text-gray-600">
                    Menu Price: Rs. {parseFloat(menuData.menus[0].categories[0].items[0].price).toLocaleString()}
                  </p>
                </div>
              </div>

              <h2 className="text-xl font-bold text-gray-800 mb-4">Selected Menu Items</h2>
              
              {menuData.menus.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No menu selections found</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {menuData.menus.map((menu) => (
                    <div key={menu.menu_type_id} className="bg-white rounded-lg shadow-sm border p-4">
                      <div className="flex justify-between items-center mb-4 pb-2 border-b">
                        <div>
                        <h3 className="font-bold text-lg text-gray-800 bg-gray-100 px-2 py-0.5">
                      {menu.menu_list_name}
                    </h3>
                    <p className="text-blue-600 bg-blue-50 px-2 py-0.5 inline-block">
                      {menu.menu_type_name}
                    </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Menu Package</p>
                        </div>
                      </div>
                      
                      <div className="space-y-6">
                        {menu.categories.map((category) => (
                          <div key={category.category_id} className="border-l-2 border-blue-200 pl-4">
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="font-medium text-gray-700">
                                {category.category_name}
                              </h4>
                              {/* <span className="text-sm text-gray-500">
                                Selected: {category.items.length}/{category.item_limit}
                              </span> */}
                            </div>
                            
                            {category.items.length > 0 ? (
                              <ul className="space-y-2 ml-2">
                                {category.items.map((item) => (
                                  <li key={item.ICMT_Id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                                    <span className="font-medium text-gray-800">{item.item_name}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-gray-500 italic ml-2">No items selected</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerMenuSummaryPage;