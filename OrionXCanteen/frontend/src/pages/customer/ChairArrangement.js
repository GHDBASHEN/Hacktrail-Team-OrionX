import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { decryptBookingId } from '../../utills/encryptionUtils';
import { 
  createOrUpdateArrangement,
  getArrangementsByBooking,
  getTableDesigns
} from '../../services/EventService';
import { 
  FiCheckCircle, 
  FiAlertCircle, 
  FiLoader, 
  FiUsers, 
  FiCoffee, 
  FiGrid 
} from 'react-icons/fi';

const arrangementSchema = Yup.object().shape({
  headPax: Yup.number().required('Required').min(1, 'Minimum 1 guest'),
  topClothColor: Yup.string().required('Required'),
  tableClothColor: Yup.string().required('Required'),
  bowColor: Yup.string().required('Required'),
  chairCoverColor: Yup.string().required('Required')
});

const ChairArrangement = () => {
  const { bookingId: encryptedBookingId } = useParams();
  const [error, setError] = useState('');
  const [existingData, setExistingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [designs, setDesigns] = useState([]);
  const [designLoading, setDesignLoading] = useState(true);
  const decryptedBookingId = decryptBookingId(encryptedBookingId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch arrangements data
        const arrangements = await getArrangementsByBooking(decryptedBookingId);
        if (arrangements?.length > 0) {
          const mainArrangement = arrangements[0];
          
          // Extract colors from Colors object if exists, otherwise use direct properties
          const colors = mainArrangement.Colors || {
            Top: mainArrangement.Top_Cloth_Color,
            Table: mainArrangement.Table_Cloth_Color,
            Bow: mainArrangement.Bow_Color,
            Chair: mainArrangement.Chair_Cover_Color
          };
          
          setExistingData({
            headPax: mainArrangement.Head_Table_Pax,
            topClothColor: colors.Top,
            tableClothColor: colors.Table,
            bowColor: colors.Bow,
            chairCoverColor: colors.Chair,
            reservations: mainArrangement.Reservations || []
          });
        }

        // Fetch table designs
        const designData = await getTableDesigns();
        setDesigns(designData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        setDesignLoading(false);
      }
    };

    if (decryptedBookingId) fetchData();
  }, [decryptedBookingId, success]);

  const handleSubmit = async (values) => {
    try {
      setError('');
      await createOrUpdateArrangement(decryptedBookingId, values);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      
      // Refresh existing data
      const updatedData = await getArrangementsByBooking(decryptedBookingId);
      if (updatedData?.length > 0) {
        const mainArrangement = updatedData[0];
        const colors = mainArrangement.Colors || {
          Top: mainArrangement.Top_Cloth_Color,
          Table: mainArrangement.Table_Cloth_Color,
          Bow: mainArrangement.Bow_Color,
          Chair: mainArrangement.Chair_Cover_Color
        };
        
        setExistingData({
          headPax: mainArrangement.Head_Table_Pax,
          topClothColor: colors.Top,
          tableClothColor: colors.Table,
          bowColor: colors.Bow,
          chairCoverColor: colors.Chair,
          reservations: mainArrangement.Reservations || []
        });
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const applyDesign = (design, setValues) => {
    setValues(prevValues => ({
      ...prevValues,
      topClothColor: design.Top_Cloth_Color,
      tableClothColor: design.Table_Cloth_Color,
      bowColor: design.Bow_Color,
      chairCoverColor: design.Chair_Cover_Color
    }));
  };

  const StatusIndicator = ({ type, message }) => (
    <div className={`p-4 rounded-xl mb-6 flex items-center space-x-3
        ${type === 'error' ? 'bg-red-50 border-red-200' : 
        type === 'success' ? 'bg-green-50 border-green-200' : ''}`}>
      {type === 'error' ? (
        <FiAlertCircle className="text-red-600 text-xl" />
      ) : (
        <FiCheckCircle className="text-green-600 text-xl" />
      )}
      <span className={`font-medium ${type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
        {message}
      </span>
    </div>
  );

  if (loading || designLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center animate-pulse">
          <FiLoader className="text-4xl text-indigo-600 animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">Loading arrangement details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
              <FiCoffee className="text-indigo-600" />
              Table Arrangement Designer
            </h1>
            <p className="text-gray-500">
              {existingData ? 'Edit existing' : 'Create new'} table configuration
            </p>
          </div>

          {error && <StatusIndicator type="error" message={error} />}
          {success && <StatusIndicator type="success" message="Arrangement saved successfully!" />}

          <Formik
            initialValues={existingData || {
              headPax: 10,
              topClothColor: 'white',
              tableClothColor: 'black',
              bowColor: 'red',
              chairCoverColor: 'black'
            }}
            enableReinitialize
            validationSchema={arrangementSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, values, setValues }) => (
              <Form className="space-y-8">
                {/* Design Gallery */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                      <FiGrid className="text-indigo-600" />
                      Select a Predefined Design
                    </h3>
                    <span className="text-sm text-gray-500">
                      {designs.length} designs available
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {designs.map(design => (
                      <div 
                        key={design.my_row_id}
                        className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                          values.topClothColor === design.Top_Cloth_Color &&
                          values.tableClothColor === design.Table_Cloth_Color &&
                          values.bowColor === design.Bow_Color &&
                          values.chairCoverColor === design.Chair_Cover_Color
                            ? 'ring-2 ring-indigo-500 border-indigo-300 bg-indigo-50'
                            : 'border-gray-200'
                        }`}
                        onClick={() => applyDesign(design, setValues)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-800">Design #{design.my_row_id}</h4>
                          <button 
                            type="button"
                            className="text-sm text-indigo-600 hover:text-indigo-800"
                            onClick={() => applyDesign(design, setValues)}
                          >
                            Apply
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-500">Top Cloth</span>
                            <div className="flex items-center">
                              <div 
                                className="w-4 h-4 rounded-full mr-1 border border-gray-300" 
                                style={{ backgroundColor: design.Top_Cloth_Color }}
                              ></div>
                              <span className="text-xs truncate">{design.Top_Cloth_Color}</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-500">Table Cloth</span>
                            <div className="flex items-center">
                              <div 
                                className="w-4 h-4 rounded-full mr-1 border border-gray-300" 
                                style={{ backgroundColor: design.Table_Cloth_Color }}
                              ></div>
                              <span className="text-xs truncate">{design.Table_Cloth_Color}</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-500">Bow</span>
                            <div className="flex items-center">
                              <div 
                                className="w-4 h-4 rounded-full mr-1 border border-gray-300" 
                                style={{ backgroundColor: design.Bow_Color }}
                              ></div>
                              <span className="text-xs truncate">{design.Bow_Color}</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-500">Chair Cover</span>
                            <div className="flex items-center">
                              <div 
                                className="w-4 h-4 rounded-full mr-1 border border-gray-300" 
                                style={{ backgroundColor: design.Chair_Cover_Color }}
                              ></div>
                              <span className="text-xs truncate">{design.Chair_Cover_Color}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Customization Section */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    Customize Your Arrangement
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Head Table Capacity
                      </label>
                      <Field
                        name="headPax"
                        type="number"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all"
                      />
                      <ErrorMessage name="headPax" component="div" className="text-red-500 text-sm" />
                    </div>

                    {/* Color Fields */}
                    {[
                      { label: 'Top Cloth', name: 'topClothColor' },
                      { label: 'Table Cloth', name: 'tableClothColor' },
                      { label: 'Bow', name: 'bowColor' },
                      { label: 'Chair Cover', name: 'chairCoverColor' },
                    ].map(({ label, name }) => (
                      <div key={name} className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          {label} Color
                        </label>
                        <div className="flex items-center">
                          <Field
                            name={name}
                            className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all"
                            placeholder={`Enter ${label.toLowerCase()} color`}
                          />
                          <div 
                            className="ml-3 w-10 h-10 rounded-lg border border-gray-300" 
                            style={{ backgroundColor: values[name] || '#fff' }}
                          ></div>
                        </div>
                        <ErrorMessage name={name} component="div" className="text-red-500 text-sm" />
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-xl transition-all transform hover:scale-[1.02] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <FiLoader className="animate-spin" />
                      <span>Saving Changes...</span>
                    </div>
                  ) : existingData ? 'Update Arrangement' : 'Save Arrangement'}
                </button>
              </Form>
            )}
          </Formik>

          {/* Reservations Section */}
          {existingData?.reservations?.length > 0 && (
            <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FiUsers className="text-indigo-600" />
                Your Table Reservations
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {existingData.reservations.map((reservation, index) => (
                  <div 
                    key={index}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-indigo-200 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-indigo-100 p-2 rounded-lg">
                        <FiCoffee className="text-indigo-600 text-xl" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          Table #{reservation.Table_Number}
                        </p>
                        <p className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                          {reservation.Reserve_Name}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChairArrangement;