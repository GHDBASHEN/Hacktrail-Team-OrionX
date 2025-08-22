import React, { useState } from "react";
import { sendOtp, validateEmail, validateOtp } from "../services/AuthService";
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [buttonText, setButtonText] = useState("Check your email");
  const [errorMessage, setErrorMessage] = useState({msg:'', color:''});
  const [response, setResponse] = useState();

  const handleCheckEmail = async () => {
    if (!email.trim()) {
      setErrorMessage({msg:"Please enter an email", color:"text-red-500"});
      return;
    }

    if (buttonText === "Check your email") {
      setButtonText("Validating...");
      setErrorMessage(null);
      try {
        const value = await validateEmail(email);
        setResponse(value);
        if (value.message === "Email not found") {
          setErrorMessage({msg:"Email not found. Please try again.", color:"text-red-500"});
          setButtonText("Check your email");
        } else {
          setErrorMessage({msg:`Email is verified.`, color:"text-green-500"});
          setButtonText("Send OTP");
        }
      } catch (error) {
        setErrorMessage({msg:"Error validating email. Try again later.", color:"text-red-500"});
        setButtonText("Check your email");
      }
    }

    if (buttonText === "Send OTP") {
      setButtonText("Sending..")
      try {
        const sendOtpResponse = await sendOtp({ email });
        sessionStorage.setItem('otp-token', sendOtpResponse.token);

        let countdown = 180; // 3 minutes in seconds
        const formatTime = (seconds) => {
          const minutes = Math.floor(seconds / 60);
          const remainingSeconds = seconds % 60;
          return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
        };

        setButtonText(`Wait, ${formatTime(countdown)}`);
        const interval = setInterval(() => {
          countdown -= 1;
          if (countdown <= 0) {
            clearInterval(interval);
            setButtonText("Send OTP");
          } else {
            setButtonText(`Wait, ${formatTime(countdown)}`);
          }
        }, 1000);
        setButtonText("Send OTP");
      } catch (error) {
        setErrorMessage({msg:"Error sending OTP. Try again later.", color:"text-red-500"});
        setButtonText("Send OTP")
      }
    }
  };

  const handleValidateOtp = async () => {
    //const mm = sessionStorage.getItem('otp-token');
    const data = { token: sessionStorage.getItem('otp-token'), otp: otp }

    try {
      const otpResponse = await validateOtp(data);
      setErrorMessage({msg:otpResponse.message, color:"text-green-500"});
      sessionStorage.removeItem('otp-token');

      setButtonText("Check your email");

      setTimeout(() => {
        navigate('/forgot-password/update', { state: { email, sourceTable: response.source_table } });
      }, 3000); // Wait for 5 seconds before navigating
    } catch (error) {
      setErrorMessage({msg:"OTP is not valid!!", color:"text-red-500"});
    }

  }

  return (
    <div  className=" my-20">

      {/* <section className="bg-gray-50 dark:bg-gray-900"> */}
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto  lg:py-0">
          <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
            <img className="w-8 h-8 mr-2" src="15.svg" alt="logo" />
          </a>
          <div className="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
            <h2 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Verify your email
            </h2>
            {errorMessage && <p className={errorMessage.color}>{errorMessage.msg}</p>}
            <div className="mt-4 space-y-4 lg:mt-5 md:space-y-5">
              <div>
                <label for="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required="" />
              </div>
              <button onClick={handleCheckEmail} className="w-full text-white bg-green-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">{buttonText}</button>

              <div className=" mb-5"> </div>
              <div>
                <label for="confirm-password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"> Recived OTP</label>
                <input type="confirm-password"  placeholder="••••••••" value={otp} onChange={(e) => setOtp(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
              </div>
              <button  onClick={handleValidateOtp} className="w-full text-white bg-indigo-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Verfy otp</button>
            </div>
          </div>
        </div>
      {/* </section> */}
    </div>
  );
};

export default ResetPassword;
