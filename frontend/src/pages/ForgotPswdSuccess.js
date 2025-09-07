import React from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const ForgotPswdSuccess = () => {
  const location = useLocation();
  const { email } = location.state || {};

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100" style={{ height: '85vh' }}>
      <h2 className="text-2xl font-bold text-green-600 mb-4">Password Updated Successfully</h2>
      <p className="text-center text-gray-700 max-w-md">
        Your password for <strong>{email || "your account"}</strong> has been successfully updated. You can now log in with your new password.
      </p>
      <Link to="/login" className="mt-4 text-indigo-600 hover:underline">
        Go to Login
      </Link>
    </div>
  );
};

export default ForgotPswdSuccess;