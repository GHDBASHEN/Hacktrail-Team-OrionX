import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerCustomer } from '../services/AuthService';

const CustomerRegistration = () => {
    const [user, setUser] = useState({ password: '', customer_id: '' });
    const [confirmPswd, setConfirmPswd] = useState('');
    const navigate = useNavigate();
    const [errmsg, setErrmsg] = useState({ msg: '', color: '' });
    const [btnText, setBtnText] = useState("Sign up");

    const validateField = (name, value) => {
        let error = { msg: '', color: '' };

        switch (name) {
            case 'customer_id':
                if (!value.startsWith('CU') || value.trim() === '') {
                    error = { msg: 'Not Valid Customer Id Type.', color: 'text-red-600' };
                }
                break;

            case 'password':
                // Updated regex: At least 6 characters, one digit, and one symbol
                if (!/^(?=.*[!@#$%^&*])(?=.*\d).{6,}$/.test(value)) {
                    error = { 
                        msg: 'Password must be at least 6 characters long, include one digit, and one symbol (e.g., 12345!).', 
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
        setBtnText("Sign up")

        // Validate all fields before submission
        if (!validateField('customer_id', user.customer_id) || !validateField('password', user.password)) {
            return; // Stop submission if validation fails
        }

        if (user.password !== confirmPswd) {
            setErrmsg({ msg: 'Passwords do not match.', color: 'text-red-600' });
            return;
        }

        setBtnText("Waiting..")
        try {
            const { message } = await registerCustomer(user);
            navigate('/login');
        } catch (error) {
            console.error('Registration error:', error);
            setErrmsg({ msg: 'Customer registration failed.', color: 'text-red-600' });
            setBtnText("Sign up")
        }
        setBtnText("Sign up")
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
        <div className="flex flex-col justify-center px-6 py-12 lg:px-8 bg-gradient-to-r from-[rgba(27,231,149,0.07)] to-[#ffffff09]" style={{minHeight:'85vh'}}>
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                {/* <img className="mx-auto h-10 w-auto" src="15.svg" alt="Your Company" /> */}
                    <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-black">Sign up to Your Customer Account</h2>
            </div>
            <p className={`text-center mt-5 ${errmsg.color}`}>{errmsg.msg}</p>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" action="#" method="POST" onSubmit={handleSubmit} >
                    <div>
                        <label for="text" className="block text-sm/6 font-medium text-black">Registartion Id</label>
                        <div className="mt-2">
                            <input type="text" name="customer_id" id="email" placeholder="customers id" value={user.customer_id}  onChange={handleChange}  required className="border block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label for="password" className="block text-sm/6 font-medium text-black">Password</label>
                        </div>
                        <div className="mt-2">
                            <input type="password" name="password" id="password" placeholder="Password" value={user.password} onChange={handleChange} required className="border block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label for="confirm-password" className="block text-sm/6 font-medium text-black">Confirm Password</label>
                        </div>
                        <div className="mt-2">
                            <input type="password" name="confirmPswd" id="confirm-password" placeholder="Confirm Password" value={confirmPswd} onChange={handleConfirmChange} required className="border block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                        </div>
                    </div>

                    <div>
                        <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">{btnText}</button>
                    </div>
                </form>

                <p className="mt-10 text-center text-sm/6 text-gray-500">
                    Could not register?
                    <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500"> Contact us</a>
                </p>
            </div>
        </div>
    )
}

export default CustomerRegistration