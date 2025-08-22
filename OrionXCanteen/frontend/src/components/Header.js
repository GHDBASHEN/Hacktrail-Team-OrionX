// import { useContext, React, useState, useEffect, useRef } from 'react';
// import { Link } from 'react-router-dom';
// import { AuthContext } from '../context/Authcontext';
// import { Logout } from './Logout';
// import { getCusName } from '../services/CustomerServise';

// export const Header = () => {
//   const { user } = useContext(AuthContext);
//   const [dashboard, setDashboard] = useState();
//   const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [customerName, setCustomerName] = useState('');
//   const dropdownRef = useRef(null);
//   const mobileMenuRef = useRef(null);

//   useEffect(() => {
//     if (sessionStorage.getItem('role') === 'admin') {
//       setDashboard('/superAdmin');
//     } else if (sessionStorage.getItem('role') === 'customer') {
//       setDashboard('/customers');
//     } else {
//       setDashboard(null);
//     }
//   }, [user]);

//   // Fetch customers name
//   useEffect(() => {
//     if (sessionStorage.getItem('role') === 'customers') {
//       fetchCustomerName();
//     }
//   }, [user]);

//   const fetchCustomerName = async () => {
//     const name = await getCusName(sessionStorage.getItem('id'));
//     setCustomerName(name);
//   };

//   const toggleUserDropdown = () => {
//     setIsUserDropdownOpen((prev) => !prev);
//   };

//   const toggleMobileMenu = () => {
//     setIsMobileMenuOpen((prev) => !prev);
//   };

//   const handleClickOutside = (event) => {
//     if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//       setIsUserDropdownOpen(false);
//     }
//     if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
//       setIsMobileMenuOpen(false);
//     }
//   };

//   useEffect(() => {
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   const firstCharacter = customerName.charAt(0);

//   return (
//     <header className="bg-white border-b border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700 sticky top-0 z-40">
//       <nav className="bg-white px-4 lg:px-6 py-2.5 dark:bg-gray-900 ">
//         <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
//           {/* Logo/Brand */}
//           <div className="flex items-center">
//             <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
//               <img src="/15.svg" className="h-8" alt="Flowbite Logo" />
//               <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Deandra</span>
//             </Link>
//           </div>

//           {/* Desktop Navigation and User Controls */}
//           <div className="flex items-center lg:order-2">
//             {/* Login Button (visible when not logged in) */}
//             <Link 
//               to="/login" 
//               className={`${sessionStorage.getItem('role') === 'customers' || sessionStorage.getItem('role') !== null ? 'hidden' : 'visible'} text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-2 lg:px-5 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800`}
//             >
//               Login
//             </Link>

//             {/* User Avatar/Dropdown */}
//             <div className="relative" ref={dropdownRef}>
//               <button
//                 type="button"
//                 className={`flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 ${sessionStorage.getItem('role') === 'customers' ? 'visible' : 'hidden'}`}
//                 id="user-menu-button"
//                 onClick={toggleUserDropdown}
//               >
//                 <div className="w-8 h-8 rounded-full bg-white flex justify-center items-center overflow-hidden text-gray-800 font-bold">
//                   {firstCharacter}
//                 </div>
//                 <span className="sr-only">Open user menu</span>
//               </button>

//               {/* User Dropdown Menu */}
//               <div
//                 className={`absolute right-0 mt-2 z-50 ${isUserDropdownOpen ? 'block' : 'hidden'} w-48 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600`}
//                 id="user-dropdown"
//               >
//                 <div className="px-4 py-3">
//                   <span className="block text-sm text-gray-900 dark:text-white">{customerName || 'Loading...'}</span>
//                   <span className="block text-sm text-gray-500 truncate dark:text-gray-400">{sessionStorage.getItem('credential')}</span>
//                 </div>
//                 <ul className="py-2" aria-labelledby="user-menu-button">
//                   <li>
//                     <Link 
//                       to="/profile" 
//                       className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
//                       onClick={() => setIsUserDropdownOpen(false)}
//                     >
//                       Dashboard
//                     </Link>
//                   </li>
//                   <li>
//                     <Link
//                       to="#"
//                       className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
//                       onClick={() => setIsUserDropdownOpen(false)}
//                     >
//                       <Logout />
//                     </Link>
//                   </li>
//                 </ul>
//               </div>
//             </div>

//             {/* Mobile Menu Button */}
//             <button
//               data-collapse-toggle="mobile-menu"
//               type="button"
//               className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
//               aria-controls="mobile-menu"
//               aria-expanded={isMobileMenuOpen}
//               onClick={toggleMobileMenu}
//             >
//               <span className="sr-only">Open main menu</span>
//               <svg
//                 className="w-6 h-6"
//                 fill="currentColor"
//                 viewBox="0 0 20 20"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
//                   clipRule="evenodd"
//                 ></path>
//               </svg>
//               <svg
//                 className="hidden w-6 h-6"
//                 fill="currentColor"
//                 viewBox="0 0 20 20"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
//                   clipRule="evenodd"
//                 ></path>
//               </svg>
//             </button>
//           </div>

//           {/* Mobile Menu */}
//           <div
//             ref={mobileMenuRef}
//             className={`${isMobileMenuOpen ? 'block' : 'hidden'} justify-between items-center w-full lg:flex lg:w-auto lg:order-1`}
//             id="mobile-menu"
//           >
//             <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
//               <li>
//                 <Link
//                   to="/"
//                   className={`${dashboard == null || sessionStorage.getItem('role') == 'customer' ? 'block' : 'hidden'} py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-blue-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700`}
//                   onClick={() => setIsMobileMenuOpen(false)}
//                 >
//                   Home
//                 </Link>
//                 <Link
//                   to={dashboard}
//                   className={`${user != null && sessionStorage.getItem('role') != 'customer' ? 'block' : 'hidden'} py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-blue-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700`}
//                   onClick={() => setIsMobileMenuOpen(false)}
//                 >
//                   Dashboard
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   to="/about"
//                   className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-blue-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
//                   onClick={() => setIsMobileMenuOpen(false)}
//                 >
//                   About
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   to="/service"
//                   className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-blue-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
//                   onClick={() => setIsMobileMenuOpen(false)}
//                 >
//                   Services
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   to="/contact"
//                   className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-blue-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
//                   onClick={() => setIsMobileMenuOpen(false)}
//                 >
//                   Contact
//                 </Link>
//               </li>
//             </ul>
//           </div>
//         </div>
//       </nav>
//     </header>
//   );
// };
import { useContext, React, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/Authcontext';
import { Logout } from './Logout';
import { getCusName } from '../services/CustomerServise';

export const Header = () => {
  const { user } = useContext(AuthContext);
  const [dashboard, setDashboard] = useState();
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    if (sessionStorage.getItem('role') === 'admin') {
      setDashboard('/admin-dashboard');
    } else if (sessionStorage.getItem('role') === 'customer') {
      setDashboard('/customer-dashboard');
    } else {
      setDashboard(null);
    }
  }, [user]);

  // Fetch customer name
  useEffect(() => {
    if (sessionStorage.getItem('role') === 'customer') {
      fetchCustomerName();
    }
  }, [user]);

  const fetchCustomerName = async () => {
    const name = await getCusName(sessionStorage.getItem('id'));
    setCustomerName(name);
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen((prev) => !prev);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsUserDropdownOpen(false);
    }
    if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
      setIsMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const firstCharacter = customerName.charAt(0);

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
      <nav className="bg-white px-4 lg:px-6 py-2.5">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
              <img src="/canteen-logo.png" className="h-8" alt="FOT Canteen Logo" />
              <span className="self-center text-xl font-semibold whitespace-nowrap text-blue-800">FOT Canteen</span>
            </Link>
          </div>

          {/* Desktop Navigation and User Controls */}
          <div className="flex items-center lg:order-2">
            {/* Login Button (visible when not logged in) */}
            {!user && (
              <Link 
                to="/login" 
                className="text-blue-800 hover:bg-blue-50 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 lg:px-5 lg:py-2.5 mr-2 focus:outline-none"
              >
                Login
              </Link>
            )}

            {/* User Avatar/Dropdown */}
            {user && (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  className="flex text-sm bg-blue-100 rounded-full focus:ring-4 focus:ring-blue-300"
                  id="user-menu-button"
                  onClick={toggleUserDropdown}
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex justify-center items-center overflow-hidden text-white font-bold">
                    {firstCharacter || 'U'}
                  </div>
                  <span className="sr-only">Open user menu</span>
                </button>

                {/* User Dropdown Menu */}
                <div
                  className={`absolute right-0 mt-2 z-50 ${isUserDropdownOpen ? 'block' : 'hidden'} w-48 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow`}
                  id="user-dropdown"
                >
                  <div className="px-4 py-3">
                    <span className="block text-sm text-gray-900">{customerName || 'User'}</span>
                    <span className="block text-sm text-gray-500 truncate">{sessionStorage.getItem('email') || ''}</span>
                  </div>
                  <ul className="py-2" aria-labelledby="user-menu-button">
                    <li>
                      <Link 
                        to={dashboard} 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        <Logout />
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              data-collapse-toggle="mobile-menu"
              type="button"
              className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
              onClick={toggleMobileMenu}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          <div
            ref={mobileMenuRef}
            className={`${isMobileMenuOpen ? 'block' : 'hidden'} justify-between items-center w-full lg:flex lg:w-auto lg:order-1`}
            id="mobile-menu"
          >
            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
              <li>
                <Link
                  to="/"
                  className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-blue-700 lg:p-0"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/menu"
                  className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-blue-700 lg:p-0"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Menu
                </Link>
              </li>
              <li>
                <Link
                  to="/offers"
                  className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-blue-700 lg:p-0"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Special Offers
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-blue-700 lg:p-0"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-blue-700 lg:p-0"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </Link>
              </li>
              {user && (
                <li className="lg:hidden">
                  <Link
                    to={dashboard}
                    className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-blue-700 lg:p-0"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                </li>
              )}
              {user && (
                <li className="lg:hidden">
                  <Link
                    to="#"
                    className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-blue-700 lg:p-0"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Logout />
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};