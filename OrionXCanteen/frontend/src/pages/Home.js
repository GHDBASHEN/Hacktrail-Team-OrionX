import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

export const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showIntro, setShowIntro] = useState(true);
  const [mealStatus, setMealStatus] = useState({
    breakfast: false,
    lunch: false,
    dinner: false
  });
  const [menuItems, setMenuItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    const timer = setTimeout(() => {
      setIsLoading(false);
      setShowIntro(false);
    }, 2000);
    
    // Simulate fetching meal status data (in a real app, this would be an API call)
    const fetchMealStatus = () => {
      // This would typically come from a backend API
      const currentHour = new Date().getHours();
      const status = {
        breakfast: currentHour >= 7 && currentHour < 10,
        lunch: currentHour >= 12 && currentHour < 14,
        dinner: currentHour >= 18 && currentHour < 20
      };
      setMealStatus(status);
    };
    
    // Simulate fetching menu items (in a real app, this would be an API call)
    const fetchMenuItems = () => {
      // This would typically come from a backend API
      const items = [
        { id: 1, name: 'Rice & Curry', price: 'LKR 120', category: 'lunch', available: true, image: '/menu/rice-curry.jpg' },
        { id: 2, name: 'String Hoppers', price: 'LKR 80', category: 'breakfast', available: true, image: '/menu/hoppers.jpg' },
        { id: 3, name: 'Parippu', price: 'LKR 60', category: 'lunch', available: true, image: '/menu/parippu.jpg' },
        { id: 4, name: 'Soya Meat', price: 'LKR 90', category: 'lunch', available: true, image: '/menu/soya.jpg' },
        { id: 5, name: 'Kottu', price: 'LKR 150', category: 'dinner', available: false, image: '/menu/kottu.jpg' },
        { id: 6, name: 'Fried Rice', price: 'LKR 130', category: 'dinner', available: true, image: '/menu/fried-rice.jpg' }
      ];
      setMenuItems(items);
    };
    
    fetchMealStatus();
    fetchMenuItems();
    
    return () => clearTimeout(timer);
  }, []);

  const getStatusColor = (status) => {
    return status ? 'bg-green-500' : 'bg-red-500';
  };

  const getStatusText = (status) => {
    return status ? 'OPEN' : 'CLOSED';
  };

  return (
    <main className="font-sans bg-white">
      {/* Hero Section */}
      <section className="relative flex items-center justify-center h-screen overflow-hidden bg-gradient-to-r from-blue-600 to-blue-800">
        {/* Pattern Overlay */}
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="grid grid-cols-4 gap-8 transform rotate-12 scale-150">
            {[...Array(16)].map((_, i) => (
              <div key={i} className="h-32 border-2 border-white/20 rounded-xl"></div>
            ))}
          </div>
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
          <div className="relative z-20 text-center px-4 max-w-4xl">
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
                className="bg-white text-blue-800 hover:bg-gray-100 font-semibold py-3 px-8 rounded-full transition duration-300 transform hover:-translate-y-1"
              >
                View Menu
              </button>
              <button
                onClick={() => {
                  const section = document.getElementById('status-sec');
                  if (section) {
                    section.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="border-2 border-white text-white hover:bg-white/10 font-semibold py-3 px-8 rounded-full transition duration-300"
              >
                Check Availability
              </button>
            </div>
          </div>
        )}

        {/* Keyframes for Intro Animation */}
        <style>{`@keyframes intro { 0% { transform: scale(2); opacity: 0; } 50% { transform: scale(1); opacity: 1; } 100% { opacity: 0; visibility: hidden; } }`}</style>
      </section>

      {/* Meal Status Section */}
      <section className="py-16 bg-gray-50" data-aos="fade-up" id='status-sec'>
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Meal Availability</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
            <p className="text-lg text-gray-600">
              Check current serving status of our canteen
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Breakfast', time: '7:00 AM - 9:30 AM', status: mealStatus.breakfast },
              { name: 'Lunch', time: '12:00 PM - 2:00 PM', status: mealStatus.lunch },
              { name: 'Dinner', time: '6:00 PM - 8:00 PM', status: mealStatus.dinner }
            ].map((meal, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition duration-300">
                <div className="p-6 text-center">
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

          <div className="mt-12 bg-white rounded-xl shadow-lg p-6 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Notice Board</h3>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
              <p className="text-yellow-700">Special offer this week: 10% discount on all rice meals!</p>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
              <p className="text-blue-700">New menu items available: Chicken Kottu and Vegetable Fried Rice</p>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section className="py-16 bg-white" data-aos="fade-up" id='menu-sec'>
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Today's Menu</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
            <p className="text-lg text-gray-600">
              Delicious and nutritious meals prepared daily
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {menuItems.map((item) => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300">
                <div className="aspect-video bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                  <div className="text-white text-center p-4">
                    <img src={item.image} alt={item.name} className="w-full h-40 object-cover rounded-t-xl" />
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {item.available ? 'Available' : 'Sold Out'}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-2">Category: {item.category}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-2xl font-bold text-blue-600">{item.price}</span>
                    <button 
                      className={`px-4 py-2 rounded-lg font-medium ${item.available ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                      disabled={!item.available}
                    >
                      {item.available ? 'Order Now' : 'Not Available'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 text-white text-center bg-gradient-to-r from-blue-600 to-blue-800" data-aos="fade-up">
        <div className="container mx-auto px-6 md:px-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">We're Here to Serve You</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Our canteen provides nutritious and affordable meals for all students and staff of the Faculty of Technology.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-8 py-4 bg-white text-blue-600 font-bold rounded-full hover:bg-gray-100 transition duration-300">
              View Weekly Menu
            </button>
            <button className="px-8 py-4 border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition duration-300">
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
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
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
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
            <p className="text-lg text-gray-600">
              Find us at the Faculty of Technology, University of Ruhuna
            </p>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200">
            <div className="relative h-96">
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.207374256383!2d80.56920231476922!3d6.321286295402285!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae3a3dff0d2110d%3A0x9b356ad5f87e0c84!2sUniversity%20of%20Ruhuna%20-%20Faculty%20of%20Technology!5e0!3m2!1sen!2slk!4v1652345678901!5m2!1sen!2slk"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="FOT Canteen Location"
              ></iframe>
            </div>
            <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100">
              <h3 className="text-xl font-bold text-gray-900 mb-2">FOT Canteen</h3>
              <p className="text-gray-600 mb-2">Faculty of Technology, University of Ruhuna</p>
              <p className="text-gray-600">Hapugala, Galle, Sri Lanka</p>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
};