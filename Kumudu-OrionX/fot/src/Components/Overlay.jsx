import React from 'react';

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
export default Overlay;