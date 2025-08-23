import React, { useState } from 'react';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    tgNumber: '',
    year: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Registration successful!');
    setFormData({
      fullName: '',
      tgNumber: '',
      year: '',
      email: '',
      password: '',
    });
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md font-sans">
      <h2 className="text-2xl font-bold text-center mb-6">Canteen Registration Form</h2>
      <form onSubmit={handleSubmit}>
        <label className="block font-semibold mb-1">Full Name:</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />

        <label className="block font-semibold mb-1">TG Number (TG/XXXX/XXXX):</label>
        <input
          type="text"
          name="tgNumber"
          value={formData.tgNumber}
          onChange={handleChange}
          pattern="TG/\d{4}/\d{4}"
          required
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />

        <label className="block font-semibold mb-1">Academic Year:</label>
        <select
          name="year"
          value={formData.year}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded mb-4"
        >
          <option value="">Select Year</option>
          <option value="Preshes">Preshes</option>
          <option value="1year">1st Year</option>
          <option value="2year">2nd Year</option>
          <option value="3year">3rd Year</option>
          <option value="4year">4th Year</option>
        </select>

        <label className="block font-semibold mb-1">Campus Gmail:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          pattern=".+@gmail\.com"
          required
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />

        <label className="block font-semibold mb-1">Password:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;
