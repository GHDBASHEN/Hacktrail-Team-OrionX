import React from 'react';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="font-sans">
      {/* Hero Section */}
      <section className="relative h-[70vh] bg-gradient-to-r from-indigo-900 to-purple-800 text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-30">
          <div className="grid grid-cols-4 gap-8 transform rotate-12 scale-150">
            {[...Array(16)].map((_, i) => (
              <div key={i} className="h-32 border-2 border-white/20 rounded-xl"></div>
            ))}
          </div>
        </div>

        <div className="container mx-auto px-4 h-full flex flex-col justify-center relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Our Story</h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Creating unforgettable celebrations since 2010
            </p>
            <div className="flex flex-wrap gap-4">
              <button onClick={() => navigate('/contact#form')} className="bg-white text-indigo-900 hover:bg-gray-100 font-semibold py-3 px-8 rounded-full transition duration-300">
                Book a Tour
              </button>
              <a href='https://web.facebook.com/Deandrabolgoda/photos' target='_blank' className="border-2 border-white text-white hover:bg-white/10 font-semibold py-3 px-8 rounded-full transition duration-300">
                View Galleries
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Transforming Visions into Reality
            </h2>
            <div className="w-24 h-1 bg-purple-600 mx-auto mb-8"></div>
            <p className="text-lg text-gray-600 mb-8">
              At Grand Venues, we've been crafting exceptional event experiences for over a decade.
              Our passion is helping you create celebrations that reflect your unique style and vision.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="text-5xl font-bold text-purple-600 mb-4">13+</div>
              <h3 className="text-xl font-semibold mb-2">Years of Excellence</h3>
              <p className="text-gray-600">Creating memorable events since 2010</p>
            </div>

            <div className="text-center">
              <div className="text-5xl font-bold text-purple-600 mb-4">450+</div>
              <h3 className="text-xl font-semibold mb-2">Events Hosted</h3>
              <p className="text-gray-600">Weddings, corporate events, and special occasions</p>
            </div>

            <div className="text-center">
              <div className="text-5xl font-bold text-purple-600 mb-4">99%</div>
              <h3 className="text-xl font-semibold mb-2">Client Satisfaction</h3>
              <p className="text-gray-600">Rated excellent by our clients</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <div className="bg-gradient-to-br from-purple-500 to-indigo-700 aspect-video flex items-center justify-center">
                  <img src='/background/couple.jpg' alt="couple image" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-purple-500 rounded-lg transform rotate-12 z-[-1]"></div>
              </div>
            </div>

            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                We believe every celebration deserves a perfect setting. Our mission is to provide elegant,
                versatile spaces complemented by exceptional service that makes planning your event effortless.
              </p>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="mt-1 mr-4 flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-purple-100 text-purple-600">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-gray-600">Premium venues with state-of-the-art facilities</p>
                </div>

                <div className="flex items-start">
                  <div className="mt-1 mr-4 flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-purple-100 text-purple-600">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-gray-600">Dedicated event planning support</p>
                </div>

                <div className="flex items-start">
                  <div className="mt-1 mr-4 flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-purple-100 text-purple-600">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-gray-600">Customizable packages for every budget</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <div className="w-24 h-1 bg-purple-600 mx-auto mb-8"></div>
            <p className="text-lg text-gray-600">
              Our dedicated team of event specialists brings creativity, expertise, and passion to every celebration.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
            {[
              { name: "Shan Edirisuriya", role: "Managing Director", description: "Expert in strategic planning and execution.", image: "/team/team1.png" },
              { name: "Monty Fernando", role: "General Manager", description: "Skilled in operations management and team leadership.", image: "/team/team2.png" },
              { name: "Isithi Uduwaka ", role: "Senior Marketing Executive", description: "Creative marketer with a passion for events.", image: "/team/team5.png" },
              { name: "Palitha Gunachnadra", role: "Executive Chef", description: "Culinary expert specializing in event catering.", image: "/team/team3.png" },
              { name: "Upul Priyadarshana", role: "Supervisor", description: "Detail-oriented supervisor ensuring smooth operations.", image: "/team/team4.png" },
            ].map((item) => (
              <div key={item} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition duration-300">
                <div className="bg-gradient-to-br from-purple-400 to-indigo-600 aspect-square flex items-center justify-center">
                  <img src={item.image} alt="couple image" className="w-1/2 h-1/2 object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{item.name}</h3>
                  <p className="text-purple-600 mb-4">{item.role}</p>
                  <p className="text-gray-600">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-r from-indigo-900 to-purple-800 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
            <div className="w-24 h-1 bg-white mx-auto mb-8"></div>
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
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-2xl p-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Create Your Perfect Event?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Contact our team today to schedule a tour or discuss your event requirements.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button onClick={() => navigate('/contact#form')} className="bg-white text-purple-700 hover:bg-gray-100 font-bold py-4 px-8 rounded-full text-lg transition duration-300">
                Book a Consultation
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

export default About;