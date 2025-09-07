import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addEmployees } from '../../services/UserService';

const AddEmployee = () => {
  const [user, setUser] = useState({ name: '', phone: '', email: '', bod: '', serviceCharge: '', salary: '' });
  const [errmsg, setErrmsg] = useState({ msg: '', color: '' });
  const [btnText, setBtnText] = useState("Add Employee");
  const navigate = useNavigate();

  const validateInput = (name, value) => {
    const currentDate = new Date();
    let error = { msg: '', color: '' };

    switch (name) {
      case 'name':
        if (/\d/.test(value)) {
          error = { msg: 'Name must not contain numbers.', color: 'text-red-600' };
        }
        break;

      case 'phone':
        if (!/^\d{10}$/.test(value)) {
          error = { msg: 'Phone number must contain exactly 10 digits.', color: 'text-red-600' };
        }
        break;

      case 'email':
        if (!value.includes('@')) {
          error = { msg: 'Email must contain "@" symbol.', color: 'text-red-600' };
        }
        break;

      case 'bod':
        const selectedDate = new Date(value);
        let age = currentDate.getFullYear() - selectedDate.getFullYear(); // Use let instead of const
        const monthDiff = currentDate.getMonth() - selectedDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < selectedDate.getDate())) {
          age--; // Now this reassignment is valid
        }
        if (age < 18) {
          error = { msg: 'Employee must be at least 18 years old.', color: 'text-red-600' };
        }
        break;

      case 'serviceCharge':
        if (isNaN(value) || value < 0 || value > 100) {
          error = { msg: 'Service charge must be a number between 0 and 100.', color: 'text-red-600' };
        }
        break;

      case 'salary':
        if (!/^\d+$/.test(value) || parseInt(value, 10) <= 0) {
          error = { msg: 'Salary must be a positive whole number.', color: 'text-red-600' };
        }
        break;

      default:
        break;
    }

    setErrmsg(error);
    return error.msg === ''; // Return true if no error
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
    validateInput(name, value); // Validate input dynamically
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrmsg({ msg: '', color: '' });

    // Validate all fields before submission
    const isValid = Object.keys(user).every((key) => validateInput(key, user[key]));
    if (!isValid) return;
    setBtnText("Adding...");
    try {
      const { message } = await addEmployees(user);
      setErrmsg({ msg: message, color: 'text-green-600' });
      setUser({ name: '', phone: '', email: '', bod: '', serviceCharge: '', salary: '' }); // Clear input fields
      setBtnText("Add Employee");
    } catch (error) {
      console.error('Adding Error:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setErrmsg({ msg: error.response.data.message, color: 'text-red-600' });
      } else {
        setErrmsg({ msg: 'An unexpected error occurred.', color: 'text-red-600' });
      }
    }
    setBtnText("Add Employee");
  };

  return (
    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm mt-5">
      <h1 className="text-xl mb-7">Add New Employee to the System</h1>
      <p className={`text-center mt-5 ${errmsg.color}`}>{errmsg.msg}</p>
      <form onSubmit={handleSubmit} className="mt-2">
        <div>
          <label className="block text-sm/6 font-medium text-gray-900">Employee name</label>
          <div className="space-y-6 mt-2">
            <input
              type="text"
              name="name"
              required
              placeholder="name"
              className="block w-full rounded-md bg-white px-3 py-1 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              value={user.name}
              onChange={handleChange}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm/6 font-medium text-gray-900">Phone number</label>
          <div className="space-y-6 mt-2">
            <input
              type="text"
              name="phone"
              required
              placeholder="+94 xxxxxxxxx"
              className="block w-full rounded-md bg-white px-3 py-1 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              value={user.phone}
              onChange={handleChange}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm/6 font-medium text-gray-900">Email address</label>
          <div className="space-y-6 mt-2">
            <input
              type="email"
              name="email"
              required
              placeholder="example@gmail.com"
              className="block w-full rounded-md bg-white px-3 py-1 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              value={user.email}
              onChange={handleChange}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm/6 font-medium text-gray-900">Birth Date</label>
          <div className="space-y-6 mt-2">
            <input
              type="date"
              name="bod"
              required
              className="block w-full rounded-md bg-white px-3 py-1 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              value={user.bod}
              onChange={handleChange}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm/6 font-medium text-gray-900">Service Charge</label>
          <div className="space-y-6 mt-2">
            <input
              type="text"
              name="serviceCharge"
              placeholder="Eg: 5%"
              className="block w-full rounded-md bg-white px-3 py-1 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              value={user.serviceCharge}
              onChange={handleChange}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm/6 font-medium text-gray-900">Basic salary</label>
          <div className="space-y-6 mt-2">
            <input
              type="text"
              name="salary"
              required
              placeholder="35,000"
              className="block w-full rounded-md bg-white px-3 py-1 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              value={user.salary}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="mt-5">
          <button
            type="submit"
            className="text-white bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30 me-2 mb-2"
          >
            {btnText}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEmployee;