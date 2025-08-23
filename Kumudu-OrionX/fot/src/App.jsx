import { useState } from 'react';
import './App.css';

function App() {
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSignUp = () => {
    setIsSignUp(true);
  };

  const handleSignIn = () => {
    setIsSignUp(false);
  };

  return (
    <div className={`relative bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-4xl min-h-[480px] ${isSignUp ? 'right-panel-active' : ''}`}>
      <FormContainer isSignUp={isSignUp} />
      <Overlay onSignUp={handleSignUp} onSignIn={handleSignIn} />
    </div>
  );
}

function FormContainer({ isSignUp }) {
  return (
    <div className="absolute top-0 h-full w-full transition-all duration-600 ease-in-out">
      {isSignUp ? <SignUpForm /> : <LoginForm />}
    </div>
  );
}

function SignUpForm() {
  return (
    <div className={`absolute top-0 left-0 h-full w-[74%] opacity-0 z-10 transition-all duration-600 ease-in-out right-panel-active:translate-x-full right-panel-active:opacity-100 right-panel-active:z-50`}>
      <form className="bg-blue-300 flex flex-col p-0 px-[50px] items-center justify-center h-full text-center">
        <h1 className="font-bold m-0">Create Account</h1>
        <input type="text" placeholder="Name" className="bg-gray-200 border-none p-3 py-[12px] px-[15px] my-2 mx-0 w-full" />
        <input type="email" placeholder="Email" className="bg-gray-200 border-none p-3 py-[12px] px-[15px] my-2 mx-0 w-full" />
        <input type="password" placeholder="Password" className="bg-gray-200 border-none p-3 py-[12px] px-[15px] my-2 mx-0 w-full" />
        <button type="submit" className="rounded-2xl border border-solid border-teal-600 bg-teal-600 text-white text-xs font-bold py-3 px-9 tracking-widest uppercase active:scale-95 transition-transform duration-80 ease-in cursor-pointer">Sign Up</button>
      </form>
    </div>
  );
}

function LoginForm() {
  return (
    <div className={`absolute top-0 left-0 w-[140%] h-full z-20 transition-all duration-600 ease-in-out right-panel-active:translate-x-0 right-panel-active:opacity-0 right-panel-active:z-10`}>
      <form className="bg-blue-300 flex flex-col p-0 px-[50px] items-center justify-center h-full text-center">
        <h1 className="font-bold m-0">Sign in</h1>
        <input type="email" placeholder="Email" className="bg-gray-200 border-none p-3 py-[12px] px-[15px] my-2 mx-0 w-full" />
        <input type="password" placeholder="Password" className="bg-gray-200 border-none p-3 py-[12px] px-[15px] my-2 mx-0 w-full" />
        <button type="submit" className="rounded-2xl border border-solid border-teal-600 bg-teal-600 text-white text-xs font-bold py-3 px-9 tracking-widest uppercase active:scale-95 transition-transform duration-80 ease-in cursor-pointer">Sign In</button>
      </form>
    </div>
  );
}

function Overlay({ onSignUp, onSignIn }) {
  return (
    <div className="absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-600 ease-in-out z-100 right-panel-active:-translate-x-full">
      <div className="bg-gradient-to-r from-gray-600 to-blue-300 text-white relative -left-full h-full w-[200%] translate-x-0 transition-transform duration-600 ease-in-out right-panel-active:translate-x-1/2">
        {/* Left Overlay */}
        <div className="absolute flex flex-col justify-center items-center p-0 px-10 text-center top-0 h-full w-1/2 -translate-x-1/5 transition-transform duration-600 ease-in-out right-panel-active:translate-x-0">
          <h1 className="font-bold m-0">Welcome Back!</h1>
          <p className="text-sm leading-5 my-5">To keep connected, please login with your personal info</p>
          <button className="rounded-2xl border border-solid border-white bg-transparent text-white text-xs font-bold py-3 px-9 tracking-widest uppercase active:scale-95 transition-transform duration-80 ease-in cursor-pointer" onClick={onSignIn}>Sign In</button>
        </div>

        {/* Right Overlay */}
        <div className="absolute flex flex-col justify-center items-center p-0 px-10 text-center top-0 h-full w-1/2 right-0 translate-x-0 transition-transform duration-600 ease-in-out right-panel-active:translate-x-1/5">
          <h1 className="font-bold m-0">Welcome FOT Canteen</h1>
          <p className="text-sm leading-5 my-5">Enter your personal details and start your journey with us</p>
          <button className="rounded-2xl border border-solid border-white bg-transparent text-white text-xs font-bold py-3 px-9 tracking-widest uppercase active:scale-95 transition-transform duration-80 ease-in cursor-pointer" onClick={onSignUp}>Sign Up</button>
        </div>
      </div>
    </div>
  );
}

export default App;