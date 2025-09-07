// import { useState, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { registerCustomer } from '../services/AuthService';

// const CustomerRegistration = () => {
//     const [user, setUser] = useState({ password: '', customer_id: '' });
//     const [confirmPswd, setConfirmPswd] = useState('');
//     const navigate = useNavigate();
//     const [errmsg, setErrmsg] = useState({ msg: '', color: '' });
//     const [btnText, setBtnText] = useState("Sign up");

//     const validateField = (name, value) => {
//         let error = { msg: '', color: '' };

//         switch (name) {
//             case 'customer_id':
//                 if (!value.startsWith('CU') || value.trim() === '') {
//                     error = { msg: 'Not Valid Customer Id Type.', color: 'text-red-600' };
//                 }
//                 break;

//             case 'password':
//                 // Updated regex: At least 6 characters, one digit, and one symbol
//                 if (!/^(?=.*[!@#$%^&*])(?=.*\d).{6,}$/.test(value)) {
//                     error = { 
//                         msg: 'Password must be at least 6 characters long, include one digit, and one symbol (e.g., 12345!).', 
//                         color: 'text-red-600' 
//                     };
//                 }
//                 break;

//             default:
//                 break;
//         }

//         setErrmsg(error);
//         return error.msg === ''; // Return true if no error
//     };

//     const handleConfirmChange = (e) => {
//         setConfirmPswd(e.target.value);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setErrmsg({ msg: '', color: '' });
//         setBtnText("Sign up")

//         // Validate all fields before submission
//         if (!validateField('customer_id', user.customer_id) || !validateField('password', user.password)) {
//             return; // Stop submission if validation fails
//         }

//         if (user.password !== confirmPswd) {
//             setErrmsg({ msg: 'Passwords do not match.', color: 'text-red-600' });
//             return;
//         }

//         setBtnText("Waiting..")
//         try {
//             const { message } = await registerCustomer(user);
//             navigate('/login');
//         } catch (error) {
//             console.error('Registration error:', error);
//             setErrmsg({ msg: 'Customer registration failed.', color: 'text-red-600' });
//             setBtnText("Sign up")
//         }
//         setBtnText("Sign up")
//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setUser((prevUser) => ({
//             ...prevUser,
//             [name]: value,
//         }));
//         validateField(name, value); // Validate the field dynamically
//     };

//     return (
//         <div className="flex flex-col justify-center px-6 py-12 lg:px-8 bg-gradient-to-r from-[rgba(27,231,149,0.07)] to-[#ffffff09]" style={{minHeight:'85vh'}}>
//             <div className="sm:mx-auto sm:w-full sm:max-w-sm">
//                 {/* <img className="mx-auto h-10 w-auto" src="15.svg" alt="Your Company" /> */}
//                     <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-black">Sign up to Your Customer Account</h2>
//             </div>
//             <p className={`text-center mt-5 ${errmsg.color}`}>{errmsg.msg}</p>
//             <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
//                 <form className="space-y-6" action="#" method="POST" onSubmit={handleSubmit} >
//                     <div>
//                         <label for="text" className="block text-sm/6 font-medium text-black">Registartion Id</label>
//                         <div className="mt-2">
//                             <input type="text" name="customer_id" id="email" placeholder="customers id" value={user.customer_id}  onChange={handleChange}  required className="border block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
//                         </div>
//                     </div>

//                     <div>
//                         <div className="flex items-center justify-between">
//                             <label for="password" className="block text-sm/6 font-medium text-black">Password</label>
//                         </div>
//                         <div className="mt-2">
//                             <input type="password" name="password" id="password" placeholder="Password" value={user.password} onChange={handleChange} required className="border block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
//                         </div>
//                     </div>

//                     <div>
//                         <div className="flex items-center justify-between">
//                             <label for="confirm-password" className="block text-sm/6 font-medium text-black">Confirm Password</label>
//                         </div>
//                         <div className="mt-2">
//                             <input type="password" name="confirmPswd" id="confirm-password" placeholder="Confirm Password" value={confirmPswd} onChange={handleConfirmChange} required className="border block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
//                         </div>
//                     </div>

//                     <div>
//                         <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">{btnText}</button>
//                     </div>
//                 </form>

//                 <p className="mt-10 text-center text-sm/6 text-gray-500">
//                     Could not register?
//                     <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500"> Contact us</a>
//                 </p>
//             </div>
//         </div>
//     )
// }

// export default CustomerRegistration

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerCustomer } from '../services/AuthService';

const CustomerRegistration = () => {
    const [user, setUser] = useState({ 
        name: '', 
        contact: '', 
        email: '', 
        password: '' 
    });
    const [confirmPswd, setConfirmPswd] = useState('');
    const navigate = useNavigate();
    const [errmsg, setErrmsg] = useState({ msg: '', color: '' });
    const [btnText, setBtnText] = useState("Create Account");

    const validateField = (name, value) => {
        let error = { msg: '', color: '' };

        switch (name) {
            case 'name':
                if (value.trim() === '' || value.length < 3) {
                    error = { msg: 'Name must be at least 3 characters long.', color: 'text-red-600' };
                }
                break;

            case 'contact':
                if (!/^[0-9]{10}$/.test(value)) {
                    error = { msg: 'Please enter a valid 10-digit phone number.', color: 'text-red-600' };
                }
                break;

            case 'email':
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    error = { msg: 'Please enter a valid email address.', color: 'text-red-600' };
                }
                break;

            case 'password':
                // At least 6 characters, one digit, and one symbol
                if (!/^(?=.*[!@#$%^&*])(?=.*\d).{6,}$/.test(value)) {
                    error = { 
                        msg: 'Password must be at least 6 characters long, include one digit, and one symbol.', 
                        color: 'text-red-600' 
                    };
                }
                break;

            default:
                break;
        }

        setErrmsg(error);
        return error.msg === ''; // Return true if no error
    };

    const handleConfirmChange = (e) => {
        setConfirmPswd(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrmsg({ msg: '', color: '' });
        setBtnText("Creating Account...");

        // Validate all fields before submission
        if (!validateField('name', user.name) || 
            !validateField('contact', user.contact) || 
            !validateField('email', user.email) || 
            !validateField('password', user.password)) {
            setBtnText("Create Account");
            return; // Stop submission if validation fails
        }

        if (user.password !== confirmPswd) {
            setErrmsg({ msg: 'Passwords do not match.', color: 'text-red-600' });
            setBtnText("Create Account");
            return;
        }

        try {
            const { message } = await registerCustomer(user);
            setErrmsg({ msg: 'Registration successful! Redirecting to login...', color: 'text-green-600' });
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            console.error('Registration error:', error);
            setErrmsg({ 
                msg: error.response?.data?.message || 'Registration failed. Please try again.', 
                color: 'text-red-600' 
            });
            setBtnText("Create Account");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
        validateField(name, value); // Validate the field dynamically
    };

    return (
        <div className="flex flex-col justify-center px-6 py-12 lg:px-8 bg-gradient-to-r from-blue-50 to-white" style={{minHeight:'85vh'}}>
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        FOT
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                    Create Your Canteen Account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Sign up to order food and manage your account
                </p>
            </div>
            
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-200">
                    <p className={`text-center mb-4 text-sm ${errmsg.color}`}>{errmsg.msg}</p>
                    
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Full Name
                            </label>
                            <div className="mt-1">
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={user.name}
                                    onChange={handleChange}
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="contact" className="block text-sm font-medium text-gray-700">
                                Phone Number
                            </label>
                            <div className="mt-1">
                                <input
                                    id="contact"
                                    name="contact"
                                    type="tel"
                                    placeholder="07X XXX XXXX"
                                    value={user.contact}
                                    onChange={handleChange}
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email Address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={user.email}
                                    onChange={handleChange}
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="At least 6 characters with a number and symbol"
                                    value={user.password}
                                    onChange={handleChange}
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                                Confirm Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="confirm-password"
                                    name="confirmPswd"
                                    type="password"
                                    placeholder="Confirm your password"
                                    value={confirmPswd}
                                    onChange={handleConfirmChange}
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                {btnText}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Already have an account?</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                onClick={() => navigate('/login')}
                                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Sign in instead
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CustomerRegistration;