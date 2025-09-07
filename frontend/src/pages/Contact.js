import React, { useState } from 'react';
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const Contact = () => {
  const formRef = useRef(null);
  const viewContactsRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (location.hash === '#form' && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    }

    if (location.hash === '#view-contacts' && viewContactsRef.current) {
      viewContactsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    date: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.eventType) newErrors.eventType = 'Event type is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Compose the WhatsApp message
      const message =
        `Name: ${formData.name}\n` +
        `Email: ${formData.email}\n` +
        `Phone: ${formData.phone}\n` +
        `Event Type: ${formData.eventType}\n` +
        `Date: ${formData.date}\n` +
        `Message: ${formData.message}`;
      const phoneNumber = "+94743074463"; //change this number with client number
      const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');

      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        eventType: '',
        date: '',
        message: ''
      });

      setTimeout(() => setIsSubmitted(false), 5000);
    }
  };

  return (
    <div className="font-sans bg-white" id="contact-page">
      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-r from-indigo-900 to-purple-800 text-white overflow-hidden" id='sec1'>
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="grid grid-cols-4 gap-8 transform rotate-12 scale-150">
            {[...Array(16)].map((_, i) => (
              <div key={i} className="h-32 border-2 border-white/20 rounded-xl"></div>
            ))}
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-10">
            We're here to help you plan your perfect event. Reach out to us for inquiries, bookings, or any questions.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-gray-50" id='view-contacts' ref={viewContactsRef}>
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Visit Us",
                content: "Deandra Bolgoda, Piliyandala, Sri Lanka",
                icon: (
                  <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                )
              },
              {
                title: "Call Us",
                content: "+94 77 974 0722",
                icon: (
                  <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                )
              },
              {
                title: "Email Us",
                content: "Deandrabolgoda@gmail.com",
                icon: (
                  <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                )
              },
              {
                title: "Hours",
                content: "Mon-Sat: 9am - 8pm\nSun: 10am - 6pm",
                icon: (
                  <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                )
              }
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition duration-300"
              >
                <div className="mb-6">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 whitespace-pre-line">{item.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-gray-50 p-8 rounded-xl shadow-md">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Send Us a Message</h2>

              {isSubmitted && (
                <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
                  Thank you for your message! We'll get back to you within 24 hours.
                </div>
              )}

              <form onSubmit={handleSubmit} ref={formRef}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Your name"
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="your.email@example.com"
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="+94 77 123 4567"
                    />
                    {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                  </div>

                  <div>
                    <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 mb-1">
                      Event Type
                    </label>
                    <select
                      id="eventType"
                      name="eventType"
                      value={formData.eventType}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent ${errors.eventType ? 'border-red-500' : 'border-gray-300'}`}
                    >
                      <option value="">Select an event type</option>
                      <option value="wedding">Wedding</option>
                      <option value="corporate">Corporate Event</option>
                      <option value="birthday">Birthday Party</option>
                      <option value="anniversary">Anniversary</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.eventType && <p className="mt-1 text-sm text-red-600">{errors.eventType}</p>}
                  </div>

                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                      Event Date (Optional)
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent ${errors.message ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Tell us about your event..."
                  ></textarea>
                  {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
                </div>

                <div className="mt-8">
                  <button
                    type="submit"
                    className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-semibold rounded-lg shadow-md hover:from-purple-700 hover:to-indigo-800 transition duration-300 transform hover:-translate-y-0.5"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>

            {/* Map & Additional Info */}
            <div>
              <div className="rounded-xl overflow-hidden shadow-md mb-8">
                <div className="h-80">
                  <iframe
                    className="w-full h-full"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15880.898598993082!2d79.9022937!3d6.8080444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae245c6487cd84d%3A0xee20166f2d2f91c2!2sDeandra%20Bolgoda!5e0!3m2!1sen!2slk!4v1715500000000!5m2!1sen!2slk"
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Deandra Bolgoda Location"
                  ></iframe>
                </div>
                <div className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Deandra Bolgoda</h3>
                  <p className="text-gray-600 mb-2">123 Celebration Road, Colombo, Sri Lanka</p>
                  <p className="text-gray-600">Located near the Bolgoda Lake, with ample parking space</p>
                </div>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h3>

                <div className="space-y-4">
                  {[
                    {
                      question: "How far in advance should I book my event?",
                      answer: "We recommend booking at least 3-6 months in advance for weddings and large events, and 1-2 months for smaller gatherings."
                    },
                    {
                      question: "Do you offer catering services?",
                      answer: "Yes, we provide comprehensive catering services with customizable menus to suit your preferences and dietary requirements."
                    },
                    {
                      question: "Can I schedule a venue tour?",
                      answer: "Absolutely! Contact us to schedule a personalized tour of our facilities at your convenience."
                    }
                  ].map((faq, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4">
                      <h4 className="font-semibold text-gray-900">{faq.question}</h4>
                      <p className="text-gray-600 mt-1">{faq.answer}</p>
                    </div>
                  ))}

                  <div className="mt-6">
                    <a
                      href="#"
                      className="inline-flex items-center text-purple-600 font-medium hover:text-purple-800"
                    >
                      View all FAQs
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Clients Say
            </h2>
            <div className="w-24 h-1 bg-purple-600 mx-auto mb-8"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "Thank you for providing us with a very good service...You have a patient and efficient staff.. the hall is even more beautiful.Especially Ms. Ishini took care of our work...",
                author: "Thavisha Kariyawasam",
                event: "Wedding Reception"
              },
              {
                quote: "Wonderful Service from the very beginning.! ❤️ Great Follow up.. Delicious food and great menus! 🤗👌 Everyone appreciated.. Highly recommended for anyone looking for quality service ❤️👌",
                author: "Nilupuli Liyanage",
                event: "Wedding Event"
              },
              {
                quote: "Thank You Deandra Bolgoda for the service.I want to thank you so much for all of your help coordinating the wedding.Everything went amazingly well that day and I cannot express how appreciative we are for everything that you guys did for us.",
                author: "Kaushalya Perera",
                event: "Anniversary Celebration"
              }
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-md border border-gray-100"
              >
                <div className="text-yellow-400 mb-4 text-xl">
                  {'★'.repeat(5)}
                </div>
                <p className="italic text-gray-600 mb-6">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center">
                  <div className="bg-gradient-to-br from-purple-400 to-indigo-600 rounded-xl w-12 h-12 flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.author}</h4>
                    <p className="text-sm text-gray-500">{testimonial.event}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


    </div>
  );
};

export default Contact;