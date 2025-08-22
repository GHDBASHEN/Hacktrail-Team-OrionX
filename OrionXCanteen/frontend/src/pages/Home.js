import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

export const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showIntro, setShowIntro] = useState(true);
  const videoRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    const timer = setTimeout(() => {
      setIsLoading(false);
      setShowIntro(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPaused(false);
    } else {
      videoRef.current.pause();
      setIsPaused(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  return (
    <main className="font-sans bg-white">
      {/* Hero Section with enhanced styling */}
      <section className="relative flex items-center justify-center h-screen overflow-hidden">
        {/* Video Element */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          src="/background/deandra.mp4"
          autoPlay
          loop
          muted={isMuted}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/80 to-purple-800/30 z-10"></div>

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
              Deandra Bolgoda
            </h1>
            <p className="mt-4 text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
              Experience luxury and elegance at every celebration.
            </p>
          </div>
        )}

        {/* Content after intro */}
        {!showIntro && (
          <div className="relative z-20 text-center px-4 max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white uppercase tracking-wide drop-shadow-lg mb-6">
              Deandra Bolgoda
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Where dreams become unforgettable celebrations
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button onClick={() => navigate('/contact#form')} className="bg-white text-indigo-900 hover:bg-gray-100 font-semibold py-3 px-8 rounded-full transition duration-300 transform hover:-translate-y-1">
                Book a Tour
              </button>
              <button
                onClick={() => {
                  const section = document.getElementById('fe-sec');
                  if (section) {
                    section.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="border-2 border-white text-white hover:bg-white/10 font-semibold py-3 px-8 rounded-full transition duration-300"
              >
                View Offers
              </button>
            </div>
          </div>
        )}

        {/* Controls: Mute/Unmute and Play/Pause */}
        <div className="absolute bottom-8 right-8 z-30 flex space-x-4">
          <button
            onClick={toggleMute}
            className="w-12 h-12 bg-black bg-opacity-50 rounded-full flex items-center justify-center hover:bg-opacity-75 transition"
            aria-label={isMuted ? 'Unmute video' : 'Mute video'}
          >
            {isMuted ? (
              <svg className="w-6 h-6 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M15.5 8.43A4.985 4.985 0 0 1 17 12c0 1.126-.5 2.5-1.5 3.5m2.864-9.864A8.972 8.972 0 0 1 21 12c0 2.023-.5 4.5-2.5 6M7.8 7.5l2.56-2.133a1 1 0 0 1 1.64.768V12m0 4.5v1.365a1 1 0 0 1-1.64.768L6 15H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1m1-4 14 14" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M11.25 5.25L6.75 9H3.75A.75.75 0 003 9.75v4.5c0 .414.336.75.75.75h3l4.5 3.75V5.25zM16.5 8.25a3 3 0 010 7.5M19.5 6a6 6 0 010 12"
                />
              </svg>
            )}
          </button>

          <button
            onClick={togglePlay}
            className="w-12 h-12 bg-black bg-opacity-50 rounded-full flex items-center justify-center hover:bg-opacity-75 transition"
            aria-label={isPaused ? 'Play video' : 'Pause video'}
          >
            {isPaused ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5 3l14 9-14 9V3z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
              </svg>
            )}
          </button>
        </div>

        {/* Keyframes for Intro Animation */}
        <style>{`@keyframes intro { 0% { transform: scale(2); opacity: 0; } 50% { transform: scale(1); opacity: 1; } 100% { opacity: 0; visibility: hidden; } }`}</style>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50" data-aos="fade-up" id='fe-sec'>
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What We Offer</h2>
            <div className="w-24 h-1 bg-purple-600 mx-auto mb-8"></div>
            <p className="text-lg text-gray-600">
              Premium services for your most memorable occasions
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Luxury Banquet',
                description: 'Elegantly designed halls that can be tailored for weddings, corporate events, or celebrations.',
                image: '/features/banquet.jpg'
              },
              {
                title: 'Fine Dining',
                description: 'Customized gourmet menus by experienced chefs offering local and international cuisine.',
                image: '/features/dining.jpg'
              },
              {
                title: 'Exclusive Bar Services',
                description: 'Signature cocktails, curated wine lists, and an atmosphere perfect for toasting life’s moments.',
                image: '/features/bar.jpeg'
              }
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
                <div className="aspect-video bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />

                </div>
                <div className="p-6">
                  <span className="text-black font-bold text-xl">{item.title}</span>
                  <p className="text-gray-600 mb-4 mt-5">{item.description}</p>
                  <a href="#" className="inline-flex items-center text-purple-600 font-medium hover:text-purple-800">
                    Learn more
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wedding Packages Section */}
      <section className="py-20 bg-white" data-aos="fade-up">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Garden Wedding Packages</h2>
            <div className="w-24 h-1 bg-purple-600 mx-auto mb-8"></div>
            <p className="text-lg text-gray-600">
              Tailored packages for your perfect day
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Package One',
                detail: '75 Packs | Inclusive Buffet & Decor',
                price: 'LKR 575,000',
                features: ['Floral arrangements', 'Professional photography', 'Buffet dinner']
              },
              {
                name: 'Package Two',
                detail: '100 Packs | Full Service + Bar',
                price: 'LKR 560,000',
                features: ['Premium bar service', 'Live music', 'Custom cake']
              },
              {
                name: 'Package Three',
                detail: '150-200 Guests | Custom Per Head',
                price: 'LKR 6,500 per head',
                features: ['Personal wedding planner', 'Luxury transportation', 'Videography']
              }
            ].map((pkg, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300">
                <div className="p-8 bg-gradient-to-r from-purple-50 to-indigo-50">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{pkg.detail}</p>
                  <div className="text-2xl font-bold text-purple-600 mb-6">{pkg.price}</div>

                  <ul className="space-y-2 mb-6">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button onClick={() => navigate('/contact#form')} className="inline-flex items-center justify-center w-full py-3 px-4 text-center bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition duration-300">
                    Book Package
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-white text-center bg-gradient-to-r from-purple-600 to-indigo-700" data-aos="fade-up">
        <div className="container mx-auto px-6 md:px-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Let's Make Your Event Unforgettable</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Our team is ready to help you plan and deliver a luxurious and memorable experience at Deandra Bolgoda. Reserve your date today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => navigate('/contact#view-contacts')} className="px-8 py-4 border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition duration-300">
              Contact Us
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50" data-aos="fade-up">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Clients Say
            </h2>
            <div className="w-24 h-1 bg-purple-600 mx-auto mb-8"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover why our clients love celebrating their special moments at Deandra Bolgoda
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Facebook Embed 1 */}
            <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
              <div className="h-96 overflow-y-auto">
                <iframe
                  src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Feshin.kariyawasam%2Fposts%2Fpfbid02DG12YwyUukk8x47FLmY1jEDfQsHohyZvhXq4d4PEWeue4VQT7USSauagDh5rwLusl&show_text=true&width=500"
                  width="100%"
                  height="373"
                  style={{ border: 'none', overflow: 'hidden' }}
                  scrolling="no"
                  frameBorder="0"
                  allowFullScreen={true}
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  title="Facebook testimonial 1"
                ></iframe>
              </div>
              <div className="flex items-start">
                <div className="bg-gradient-to-br from-purple-400 to-indigo-600 rounded-xl w-12 h-12 flex items-center justify-center text-white font-bold mr-4">
                  {"Thavisha Kariyawasam".split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Thavisha Kariyawasam</h4>
                  <p className="text-xs text-gray-500">Wedding Reception</p>
                  <div className="text-yellow-400 mb-4 text-xs">
                    {'★'.repeat(5)}
                  </div>
                </div>
              </div>
            </div>

            {/* Facebook Embed 2 */}
            <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
              <div className="h-96 overflow-y-auto">
                <iframe
                  src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fshyama.desilva.104%2Fposts%2Fpfbid0pvfF774dX5tbmbpmFbJVi4XV87SQWbRUmJuDLJrDf3HiBtLdoNgWoxTSq1xogwtMl&show_text=true&width=500"
                  width="100%"
                  height="350"
                  style={{ border: 'none', overflow: 'hidden' }}
                  scrolling="no"
                  frameBorder="0"
                  allowFullScreen={true}
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  title="Facebook testimonial 2"
                ></iframe>
              </div>
              <div className="flex items-start">
                <div className="bg-gradient-to-br from-purple-400 to-indigo-600 rounded-xl w-12 h-12 flex items-center justify-center text-white font-bold mr-4">
                  {"Shyama De Silva".split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Shyama De Silva</h4>
                  <p className="text-xs text-gray-500">Corporate Event</p>
                  <div className="text-yellow-400 mb-4 text-xs">
                    {'★'.repeat(3)}
                  </div>
                </div>
              </div>
            </div>

            {/* Facebook Embed 3 */}
            <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
              <div className="h-96 overflow-y-auto">
                <iframe
                  src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fchamindika.mendis%2Fposts%2Fpfbid0kUVE9zsQrUf2cdsNesPMrd1Z6eVFGN4UJGS3oE6z7Uu48RVnNxv4hASWhzZDXHocl&show_text=true&width=500"
                  width="100%"
                  height="350"
                  style={{ border: 'none', overflow: 'hidden' }}
                  scrolling="no"
                  frameBorder="0"
                  allowFullScreen={true}
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  title="Facebook testimonial 3"
                ></iframe>
              </div>
              <div className="flex items-start">
                <div className="bg-gradient-to-br from-purple-400 to-indigo-600 rounded-xl w-12 h-12 flex items-center justify-center text-white font-bold mr-4">
                  {"Samudaya Pallewatta".split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Chamindika Mendis</h4>
                  <p className="text-xs text-gray-500">Wedding Event</p>
                  <div className="text-yellow-400 mb-4 text-xs">
                    {'★'.repeat(3)}
                  </div>
                </div>
              </div>
            </div>

            {/* Facebook Embed 4 */}
            <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
              <div className="h-52 overflow-y-auto">
                <iframe
                  src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fkaushi.perera.9484%2Fposts%2Fpfbid02svics28EsY2d1JnnCVUYXudG7wvgrtpuLxwMeDHYWGaV93RR2SpAPuGakndCBxvl&show_text=true&width=500"
                  width="100%"
                  height="187"
                  style={{ border: 'none', overflow: 'hidden' }}
                  scrolling="no"
                  frameBorder="0"
                  allowFullScreen={true}
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  title="Facebook testimonial 3"
                ></iframe>
              </div>
              <div className="flex items-start">
                <div className="bg-gradient-to-br from-purple-400 to-indigo-600 rounded-xl w-12 h-12 flex items-center justify-center text-white font-bold mr-4">
                  {"Kaushalya Perera".split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Kaushalya Perera</h4>
                  <p className="text-xs text-gray-500">Anniversary Celebration</p>
                  <div className="text-yellow-400 mb-4 text-xs">
                    {'★'.repeat(3)}
                  </div>
                </div>
              </div>
            </div>

            {/* Facebook Embed 5 */}
            <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
              <div className="h-52 overflow-y-auto">
                <iframe
                  src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2FNilupuli.Liyanage%2Fposts%2Fpfbid02CxxtqLEe5oLsyrXCWEpXqoJmVMMGEpEZZMRZ9uRwkt2jiHtRTaFGLKjbRWrjWHHJl&show_text=true&width=500"
                  width="100%"
                  height="187"
                  style={{ border: 'none', overflow: 'hidden' }}
                  scrolling="no"
                  frameBorder="0"
                  allowFullScreen={true}
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  title="Facebook testimonial 3"
                ></iframe>
              </div>
              <div className="flex items-start">
                <div className="bg-gradient-to-br from-purple-400 to-indigo-600 rounded-xl w-12 h-12 flex items-center justify-center text-white font-bold mr-4">
                  {"Nilupuli Liyanage".split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Nilupuli Liyanage</h4>
                  <p className="text-xs text-gray-500">Wedding Event</p>
                  <div className="text-yellow-400 mb-4 text-xs">
                    {'★'.repeat(4)}
                  </div>
                </div>
              </div>
            </div>

            {/* Facebook Embed 5 */}
            <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
              <div className="h-52 overflow-y-auto">
                <iframe
                  src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fmadushan.jayalath.52%2Fposts%2Fpfbid02aEAXTrhjEaRPG9R6ggwDhq6J9HspmoHzcqA8JXaLpzXufqPwYFK6jr6GWy4PTpHml&show_text=true&width=500"
                  width="100%"
                  height="187"
                  style={{ border: 'none', overflow: 'hidden' }}
                  scrolling="no"
                  frameBorder="0"
                  allowFullScreen={true}
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  title="Facebook testimonial 3"
                ></iframe>
              </div>
              <div className="flex items-start">
                <div className="bg-gradient-to-br from-purple-400 to-indigo-600 rounded-xl w-12 h-12 flex items-center justify-center text-white font-bold mr-4">
                  {"Madushan Madhava Jayalath".split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Madushan Madhava Jayalath</h4>
                  <p className="text-xs text-gray-500">Wedding Event</p>
                  <div className="text-yellow-400 mb-4 text-xs">
                    {'★'.repeat(5)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <a href="https://www.facebook.com/Deandrabolgoda/reviews" className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-semibold rounded-lg shadow-md hover:from-purple-700 hover:to-indigo-800 transition duration-300">View More Reviews</a>
        </div>
      </section>

      {/* Google Maps Section */}
      <section className="py-16 bg-white" data-aos="fade-up">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Location</h2>
            <div className="w-24 h-1 bg-purple-600 mx-auto mb-8"></div>
            <p className="text-lg text-gray-600">
              Visit us at our beautiful venue
            </p>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200">
            <div className="relative h-96">
              <iframe
                className="absolute inset-0 w-full h-full"
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
              <p className="text-gray-600">+94 112 345 678 | info@deandrabolgoda.com</p>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
};