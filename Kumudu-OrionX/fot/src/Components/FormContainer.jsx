import React from 'react';
import LoginForm from '../Components/LoginForm';
import SignUpForm from '../Components/SignUpForm';

function FormContainer({ isSignUp }) {
  return (
    <div className="form-container">
      {isSignUp ? <SignUpForm /> : <LoginForm />}
    </div>
  );
}

export default FormContainer;
