// Home.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const API_URL = 'http://localhost:8000';

export const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showIntro, setShowIntro] = useState(true);
  const [mealStatus, setMealStatus] = useState({
    breakfast: false,
    lunch: false,
    dinner: false
  });
  const [menuItems, setMenuItems] = useState([]);
  const [loadingStatus, setLoadingStatus] = useState({
    availability: true,
    menu: true
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    const timer = setTimeout(() => {
      setIsLoading(false);
      setShowIntro(false);
    }, 2000);
    
    // Fetch meal availability data
    const fetchMealAvailability = async () => {
      try {
        setLoadingStatus(prev => ({ ...prev, availability: true }));
        const response = await fetch('http://localhost:8000/api/foods/availability');
        const data = await response.json();
        
        if (data.success) {
          setMealStatus(data.data.availability);
        } else {
          console.error('Failed to fetch meal availability:', data.message);
          // Fallback to time-based calculation if API fails
          const currentHour = new Date().getHours();
          setMealStatus({
            breakfast: currentHour >= 7 && currentHour < 11,
            lunch: currentHour >= 11 && currentHour < 17,
            dinner: currentHour >= 18 && currentHour < 21
          });
        }
      } catch (error) {
        console.error('Error fetching meal availability:', error);
        // Fallback to time-based calculation if API fails
        const currentHour = new Date().getHours();
        setMealStatus({
          breakfast: currentHour >= 7 && currentHour < 11,
          lunch: currentHour >= 11 && currentHour < 17,
          dinner: currentHour >= 18 && currentHour < 21
        });
      } finally {
        setLoadingStatus(prev => ({ ...prev, availability: false }));
      }
    };
    
    // Fetch today's menu
    const fetchTodaysMenu = async () => {
      try {
        setLoadingStatus(prev => ({ ...prev, menu: true }));
        const response = await fetch('http://localhost:8000/api/foods/today/menu');
        const data = await response.json();
        
        if (data.success) {
          setMenuItems(data.data);
        } else {
          console.error('Failed to fetch menu:', data.message);
          setError('Failed to load menu. Please try again later.');
        }
      } catch (error) {
        console.error('Error fetching menu:', error);
        setError('Unable to connect to the server. Please check your connection.');
      } finally {
        setLoadingStatus(prev => ({ ...prev, menu: false }));
      }
    };
    
    fetchMealAvailability();
    fetchTodaysMenu();
    
    return () => clearTimeout(timer);
  }, []);

  const getStatusColor = (status) => {
    return status ? 'bg-green-500' : 'bg-red-500';
  };

  const getStatusText = (status) => {
    return status ? 'OPEN' : 'CLOSED';
  };

  const formatPrice = (price) => {
    return `LKR ${parseFloat(price).toFixed(2)}`;
  };

  const getMealTypeDisplay = (mealType) => {
    const types = {
      breakfast: 'Breakfast',
      lunch: 'Lunch',
      dinner: 'Dinner'
    };
    return types[mealType] || mealType;
  };

  return (
    <main className="font-sans bg-white">
      {/* Hero Section */}
      <section className="relative flex items-center justify-center h-screen overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white/10 to-transparent"></div>
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/5 rounded-full animate-pulse-slow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-white/5 rounded-full animate-pulse-medium"></div>
        </div>

        {/* Intro Text Animation */}
        {showIntro && (
          <div
            className="absolute z-20 text-center px-4"
            style={{ animation: 'intro 1s ease-out forwards' }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white uppercase tracking-wide drop-shadow-lg">
              FOT Canteen
            </h1>
            <p className="mt-4 text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
              University of Ruhuna - Faculty of Technology
            </p>
          </div>
        )}

        {/* Content after intro */}
        {!showIntro && (
          <div className="relative z-20 text-center px-4 max-w-4xl" data-aos="fade-up">
            <h1 className="text-4xl md:text-6xl font-bold text-white uppercase tracking-wide drop-shadow-lg mb-6">
              FOT Canteen
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Delicious and affordable meals for students and staff
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button 
                onClick={() => {
                  const section = document.getElementById('menu-sec');
                  if (section) {
                    section.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="bg-white text-blue-800 hover:bg-gray-100 font-semibold py-3 px-8 rounded-full transition duration-300 transform hover:-translate-y-1 shadow-lg"
              >
                View Today's Menu
              </button>
              <button
                onClick={() => {
                  const section = document.getElementById('status-sec');
                  if (section) {
                    section.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="border-2 border-white text-white hover:bg-white/10 font-semibold py-3 px-8 rounded-full transition duration-300 shadow-lg"
              >
                Check Availability
              </button>
              <button
                onClick={() => navigate('/Menus')}
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 font-semibold py-3 px-8 rounded-full transition duration-300 transform hover:-translate-y-1 shadow-lg"
              >
                Order Now
              </button>
            </div>
          </div>
        )}

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
          </div>
        </div>

        {/* Keyframes for Intro Animation */}
        <style>{`
          @keyframes intro { 
            0% { transform: scale(2); opacity: 0; } 
            50% { transform: scale(1); opacity: 1; } 
            100% { opacity: 0; visibility: hidden; } 
          }
          @keyframes pulse-slow {
            0%, 100% { opacity: 0.1; transform: scale(1); }
            50% { opacity: 0.2; transform: scale(1.1); }
          }
          @keyframes pulse-medium {
            0%, 100% { opacity: 0.1; transform: scale(1); }
            50% { opacity: 0.15; transform: scale(1.05); }
          }
          .animate-pulse-slow {
            animation: pulse-slow 6s infinite;
          }
          .animate-pulse-medium {
            animation: pulse-medium 4s infinite;
          }
        `}</style>
      </section>

      {/* Meal Status Section */}
      <section className="py-16 bg-gray-50" data-aos="fade-up" id='status-sec'>
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Meal Availability</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-8"></div>
            <p className="text-lg text-gray-600">
              Check current serving status of our canteen
            </p>
          </div>

          {loadingStatus.availability ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { name: 'Breakfast', time: '7:00 AM - 11:00 AM', status: mealStatus.breakfast },
                  { name: 'Lunch', time: '11:00 PM - 5:00 PM', status: mealStatus.lunch },
                  { name: 'Dinner', time: '6:00 PM - 8:00 PM', status: mealStatus.dinner }
                ].map((meal, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
                    <div className="p-6 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{meal.name}</h3>
                      <p className="text-gray-600 mb-4">{meal.time}</p>
                      <div className={`inline-flex items-center px-4 py-2 rounded-full ${getStatusColor(meal.status)} text-white font-semibold`}>
                        <span className={`h-3 w-3 rounded-full mr-2 ${meal.status ? 'bg-green-300' : 'bg-red-300'}`}></span>
                        {getStatusText(meal.status)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Notice Board</h3>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 rounded">
                  <p className="text-yellow-700">Special offer this week: 10% discount on all rice meals for students!</p>
                </div>
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                  <p className="text-blue-700">New menu items available: Chicken Kottu and Vegetable Fried Rice</p>
                </div>
                <div className="bg-green-50 border-l-4 border-green-400 p-4 mt-4 rounded">
                  <p className="text-green-700">We now accept online payments through the university portal</p>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Menu Section */}
<section className="py-16 bg-white" id='menu-sec'>
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Today's Menu</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-8"></div>
          </div>
          {error && <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded"><p className="text-sm text-red-700">{error}</p></div>}
          
          {loadingStatus.menu ? (
            <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div></div>
          ) : menuItems.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="mt-2 text-sm font-medium text-gray-900">No menu available</h3>
              <p className="mt-1 text-sm text-gray-500">Check back later for today's menu items.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {menuItems.map((item) => (
                <div key={item.food_id} className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 transform hover:-translate-y-1 flex flex-col">
                  {/* Image Display Logic */}
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center relative overflow-hidden">
                    {item.image_path ? (
                        <img 
                          src={`${API_URL}/${item.image_path.replace(/\\/g, '/')}`} 
                          alt={item.food_name} 
                          className="w-full h-full object-cover" 
                        />
                    ) : (
                        <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    )}
                  </div>
                  {/* Card Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-bold text-gray-900">{item.food_name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{item.is_available ? 'Available' : 'Sold Out'}</span>
                    </div>
                    {/* Display Meal Type (Breakfast, etc.) or Category Name (Snacks, etc.) */}
                    <p className="text-gray-600 mt-2">Type: {getMealTypeDisplay(item.meal_type)}</p>
                    {item.components && (<p className="text-gray-600 mt-1 text-sm">Includes: {item.components}</p>)}
                    <div className="mt-auto pt-4 flex justify-between items-center">
                      <span className="text-2xl font-bold text-blue-600">{formatPrice(item.price)}</span>
                      <button 
                        className={`px-4 py-2 rounded-lg font-medium ${item.is_available ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'} transition duration-300`} 
                        disabled={!item.is_available} 
                        onClick={() => navigate('/Menus', { state: { food: item } })}>
                        {item.is_available ? 'Order Now' : 'Not Available'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 text-white text-center bg-gradient-to-r from-blue-600 to-purple-700" data-aos="fade-up">
        <div className="container mx-auto px-6 md:px-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">We're Here to Serve You</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Our canteen provides nutritious and affordable meals for all students and staff of the Faculty of Technology.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => navigate('/menu')}
              className="px-8 py-4 bg-white text-blue-600 font-bold rounded-full hover:bg-gray-100 transition duration-300 shadow-lg"
            >
              View Weekly Menu
            </button>
            <button 
              onClick={() => navigate('/Menus')}
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-full hover:from-orange-600 hover:to-orange-700 transition duration-300 shadow-lg"
            >
              Order Now
            </button>
            <button 
              onClick={() => navigate('/feedback')}
              className="px-8 py-4 border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition duration-300 shadow-lg"
            >
              Provide Feedback
            </button>
          </div>
        </div>
      </section>

      {/* Operating Hours Section */}
      <section className="py-16 bg-gray-50" data-aos="fade-up">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Operating Hours</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-8"></div>
            <p className="text-lg text-gray-600">
              Our canteen is open during the following hours
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
            <div className="space-y-6">
              {[
                { day: 'Monday - Friday', hours: '7:00 AM - 8:00 PM' },
                { day: 'Saturday', hours: '8:00 AM - 6:00 PM' },
                { day: 'Sunday', hours: 'Closed' }
              ].map((schedule, index) => (
                <div key={index} className="flex justify-between items-center py-4 border-b border-gray-100 last:border-b-0">
                  <span className="text-lg font-medium text-gray-900">{schedule.day}</span>
                  <span className="text-lg text-gray-600">{schedule.hours}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-800 text-center">
                <span className="font-bold">Note:</span> Special hours during examination periods and university holidays
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Google Maps Section */}
      <section className="py-16 bg-white" data-aos="fade-up">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Location</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-8"></div>
            <p className="text-lg text-gray-600">
              Find us at the Faculty of Technology, University of Ruhuna
            </p>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200">
            <div className="relative h-96">
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126959.91025193706!2d80.45960705081454!3d6.063477775930582!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae141585ad5987d%3A0x717cf948bd5444ff!2sFaculty%20of%20Technology%20-%20University%20of%20Ruhuna!5e0!3m2!1sen!2slk!4v1756584186533!5m2!1sen!2slk"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="FOT Canteen Location"
              ></iframe>
            </div>
            <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100">
              <h3 className="text-xl font-bold text-gray-900 mb-2">FOT Canteen</h3>
              <p className="text-gray-600 mb-2">Faculty of Technology, University of Ruhuna</p>
              <p className="text-gray-600">Kamburupitriya, Matara, Sri Lanka</p>
              <p className="text-gray-600 mt-2">Phone: +94413 006 134  </p>
              <p className="text-gray-600 mt-2">Web: <a href ="https://www.tec.ruh.ac.lk" target="_blank" className="text-blue-600 hover:underline">https://www.tec.ruh.ac.lk</a></p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};