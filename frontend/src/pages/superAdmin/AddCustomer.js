import React from 'react'
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { addCustomer } from '../../services/CustomerServise';

const AddCustomer = () => {
    const [user, setUser] = useState({ name: '', phone: '', email: '', address: '' });
    const [errmsg, setErrmsg] = useState({ msg: '', color: '' });
    const [btnText, setBtnText] = useState("Add Customer");
    const navigate = useNavigate();

    const validateField = (name, value) => {
        let error = { msg: '', color: '' };

        switch (name) {
            case 'name':
                if (/[^a-zA-Z\s]/.test(value)) {
                    error = { msg: 'Name must not contain numbers or symbols.', color: 'text-red-600' };
                }
                break;

            case 'phone':
                if (!/^\d{10}$/.test(value)) {
                    error = { msg: 'Phone number must contain exactly 10 digits.', color: 'text-red-600' };
                }
                break;

            case 'email':
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    error = { msg: 'Invalid email address.', color: 'text-red-600' };
                }
                break;

            case 'address':
                if (value.trim() === '') {
                    error = { msg: 'Address cannot be empty.', color: 'text-red-600' };
                }
                break;

            default:
                break;
        }

        setErrmsg(error);
        return error.msg === ''; // Return true if no error
    };

    const validateInput = () => {
        if (/[^a-zA-Z\s]/.test(user.name)) {
            setErrmsg({ msg: 'Name must not contain numbers or symbols.', color: 'text-red-600' });
            return false;
        }
        if (!/^\d{10}$/.test(user.phone)) {
            setErrmsg({ msg: 'Phone number must contain exactly 10 digits.', color: 'text-red-600' });
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
            setErrmsg({ msg: 'Invalid email address.', color: 'text-red-600' });
            return false;
        }
        if (user.address.trim() === '') {
            setErrmsg({ msg: 'Address cannot be empty.', color: 'text-red-600' });
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrmsg({ msg: '', color: '' });

        // Validate all fields before submission
        const isValid = Object.keys(user).every((key) => validateField(key, user[key]));
        if (!isValid) return; // Stop submission if validation fails

        setBtnText("Adding...");
        try {
            const { message } = await addCustomer(user);
            setErrmsg({ msg: message, color: 'text-green-600' });
            setUser({ name: '', phone: '', email: '', address: '' }); // Clear input fields
        } catch (error) {
            console.error('Adding Error:', error);
            if (error.response && error.response.data && error.response.data.message) {
                setErrmsg({ msg: error.response.data.message, color: 'text-red-600' });
            } else {
                setErrmsg({ msg: 'An unexpected error occurred.', color: 'text-red-600' });
            }
        } finally {
            setBtnText("Add Customer");
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
        <div className="sm:mx-auto sm:w-full sm:max-w-sm  mt-20">
            <h1 className=' text-xl mb-7 font-bold'>Add New Customer</h1>
            <p className={`text-center mt-5 ${errmsg.color}`}>{errmsg.msg}</p>
            <form onSubmit={handleSubmit} className='mt-2'>
                <div>
                    <label for="email" className="block text-sm/6 font-medium text-gray-900">Customer full name</label>
                    <div className="space-y-6 mt-2">
                        <input type="text"
                            name="name"
                            required
                            placeholder="e.g. Shahan Aththalage"
                            className="block w-full rounded-md bg-white px-3 py-1 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            value={user.name}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div>
                    <label for="email" className="block text-sm/6 font-medium text-gray-900">Phone number</label>
                    <div className="space-y-6 mt-2">
                        <input type="text"
                            name="phone"
                            required
                            placeholder="e.g. +94 xxxxxxxxx"
                            className="block w-full rounded-md bg-white px-3 py-1 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            value={user.phone}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div>
                    <label for="email" className="block text-sm/6 font-medium text-gray-900">Email address</label>
                    <div className="space-y-6 mt-2">
                        <input type="email"
                            name="email"
                            autoComplete="email"
                            required
                            placeholder="e.g. example@gmail.com"
                            className="block w-full rounded-md bg-white px-3 py-1 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            value={user.email}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div>
                    <label for="email" className="block text-sm/6 font-medium text-gray-900">Address</label>
                    <div className="space-y-6 mt-2">
                        <input type="text"
                            name="address"
                            required
                            placeholder="e.g. No:xx, Saddathissa Road, Galle"
                            className="block w-full rounded-md bg-white px-3 py-1 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            value={user.address}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className='mt-5'>
                    <button type="submit" className="text-white bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30 me-2 mb-2">
                        {btnText}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AddCustomer