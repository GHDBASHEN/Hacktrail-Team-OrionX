import React from 'react';

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


export default SignUpForm;
