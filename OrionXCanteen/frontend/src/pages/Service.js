import React from 'react';
import { useNavigate } from 'react-router-dom';

const Service = () => {
  const navigate = useNavigate();

  const services = [
    {
      title: "Wedding Celebrations",
      description: "Transform your special day into an unforgettable experience with our elegant wedding packages. From intimate ceremonies to grand receptions, we handle every detail.",
      features: ["Custom decor & floral arrangements", "Professional photography/videography", "Gourmet catering", "Bridal suite preparations"],
      icon: (
        <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
        </svg>
      )
    },
    {
      title: "Corporate Events",
      description: "Impress clients and motivate your team with our professional corporate event services. Perfect for conferences, product launches, and corporate celebrations.",
      features: ["State-of-the-art AV equipment", "Custom branding options", "Professional event coordination", "Networking lounge setups"],
      icon: (
        <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
        </svg>
      )
    },
    {
      title: "Private Parties",
      description: "Celebrate life's milestones in style. Our venues provide the perfect backdrop for birthdays, anniversaries, reunions, and other special occasions.",
      features: ["Themed party planning", "Custom menu creations", "Entertainment coordination", "VIP lounge areas"],
      icon: (
        <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
      )
    },
    {
      title: "Catering Services",
      description: "Delight your guests with our exquisite culinary offerings. From traditional buffets to modern plated dinners, our chefs create memorable dining experiences.",
      features: ["Custom menu development", "International cuisine specialists", "Dietary accommodations", "Interactive food stations"],
      icon: (
        <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"></path>
        </svg>
      )
    },
    {
      title: "Event Planning",
      description: "Our expert planners take the stress out of your event. From concept to execution, we handle every detail to ensure your celebration is flawless.",
      features: ["Full-service event coordination", "Vendor management", "Timeline development", "Day-of coordination"],
      icon: (
        <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
        </svg>
      )
    },
    {
      title: "Venue Decoration",
      description: "Transform our spaces to match your vision. Our design team creates stunning environments that reflect your personal style and event theme.",
      features: ["Floral design & installations", "Lighting design", "Custom stage setups", "Theme development"],
      icon: (
        <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
        </svg>
      )
    }
  ];

  return (
    <div className="font-sans bg-white">
      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-r from-indigo-900 to-purple-800 text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="grid grid-cols-4 gap-8 transform rotate-12 scale-150">
            {[...Array(16)].map((_, i) => (
              <div key={i} className="h-32 border-2 border-white/20 rounded-xl"></div>
            ))}
          </div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Our Premium Services</h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-10">
            Discover our comprehensive range of event services designed to create unforgettable experiences
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {/* <button onClick={() => navigate('/contact#form')} className="bg-white text-indigo-900 hover:bg-gray-100 font-semibold py-3 px-8 rounded-full transition duration-300 transform hover:-translate-y-1">
              Book a Consultation
            </button> */}
            {/* <button className="border-2 border-white text-white hover:bg-white/10 font-semibold py-3 px-8 rounded-full transition duration-300">
              View Packages
            </button> */}
          </div>
        </div>
      </section>

      {/* Services Introduction */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Creating Exceptional Events
            </h2>
            <div className="w-24 h-1 bg-purple-600 mx-auto mb-8"></div>
            <p className="text-lg text-gray-600">
              At Deandra Bolgoda, we offer a comprehensive suite of services to bring your vision to life. 
              From intimate gatherings to grand celebrations, our expert team ensures every detail is perfect.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {services.map((service, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition duration-300 transform hover:-translate-y-1"
              >
                <div className="p-8">
                  <div className="mb-6">
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
                  <p className="text-gray-600 mb-6">{service.description}</p>
                  
                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {/* <a 
                    href="#" 
                    className="inline-flex items-center text-purple-600 font-medium hover:text-purple-800 transition duration-300"
                  >
                    Learn more
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </a> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Process */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Seamless Process
            </h2>
            <div className="w-24 h-1 bg-purple-600 mx-auto mb-8"></div>
            <p className="text-lg text-gray-600">
              We make event planning effortless with our streamlined approach
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center relative">
            {/* Vertical line for mobile */}
            <div className="hidden md:block absolute top-16 bottom-16 left-1/2 transform -translate-x-1/2 w-1 bg-purple-200 z-0"></div>
            
            {/* Process Steps */}
            {[
              {
                step: "1",
                title: "Consultation",
                description: "We discuss your vision, requirements, and preferences to understand your event needs.",
                icon: (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                  </svg>
                )
              },
              {
                step: "2",
                title: "Planning",
                description: "Our team creates a customized plan with timelines, vendors, and all event details.",
                icon: (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                )
              },
              {
                step: "3",
                title: "Execution",
                description: "We bring your event to life with flawless execution and attention to every detail.",
                icon: (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                )
              }
            ].map((step, index) => (
              <div 
                key={index} 
                className="relative z-10 bg-white rounded-xl shadow-md p-8 mb-12 md:mb-0 w-full md:w-1/3 mx-0 md:mx-4 flex flex-col items-center text-center"
              >
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                  {step.icon}
                </div>
                <div className="mt-6 mb-4 w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-2xl font-bold">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-r from-indigo-900 to-purple-800 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Client Experiences</h2>
            <div className="w-24 h-1 bg-white mx-auto mb-8"></div>
            <p className="text-xl text-white/90">
              Hear what our clients say about our services
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl">
              <div className="text-yellow-400 mb-4">
                {'★'.repeat(5)}
              </div>
              <p className="italic mb-6">
                "Thank you for providing us with a very good service...You have a patient and efficient staff.. the hall is even more beautiful.Especially Ms. Ishini took care of our work..."
              </p>
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl w-12 h-12 mr-4 flex items-center justify-center">
                  <span className="text-white text-sm">SM</span>
                </div>
                <div>
                  <h4 className="font-bold">Thavisha Kariyawasam</h4>
                  <p className="text-sm text-white/80">Wedding Reception</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl">
              <div className="text-yellow-400 mb-4">
                {'★'.repeat(5)}
              </div>
              <p className="italic mb-6">
                "Thank You Deandra Bolgoda for the service.I want to thank you so much for all of your help coordinating the wedding.Everything went amazingly well that day and I cannot express how appreciative we are for everything that you guys did for us."
              </p>
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl w-12 h-12 mr-4 flex items-center justify-center">
                  <span className="text-white text-sm">JE</span>
                </div>
                <div>
                  <h4 className="font-bold">Wedding Reception</h4>
                  <p className="text-sm text-white/80">Anniversary Party, January 2023</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl">
              <div className="text-yellow-400 mb-4">
                {'★'.repeat(5)}
              </div>
              <p className="italic mb-6">
                "Wonderful Service from the very beginning.! ❤️ Great Follow up.. Delicious food and great menus! 🤗👌 Everyone appreciated.. Highly recommended for anyone looking for quality service ❤️👌"
              </p>
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl w-12 h-12 mr-4 flex items-center justify-center">
                  <span className="text-white text-sm">TG</span>
                </div>
                <div>
                  <h4 className="font-bold">Nilupuli Liyanage</h4>
                  <p className="text-sm text-white/80">Wedding Event</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-2xl p-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Plan Your Event?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Our team is ready to help you create an unforgettable experience. Contact us today to get started.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button onClick={() => navigate('/contact#form')}  className="bg-white text-purple-700 hover:bg-gray-100 font-bold py-4 px-8 rounded-full text-lg transition duration-300">
                Contact Us
              </button>
              {/* <button className="border-2 border-white text-white hover:bg-white/10 font-bold py-4 px-8 rounded-full text-lg transition duration-300">
                View Venues
              </button> */}
            </div>
          </div>
        </div>
      </section>

      
    </div>
  );
};

export default Service;