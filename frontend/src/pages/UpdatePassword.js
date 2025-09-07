import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { updateUserPassword } from '../services/AuthService';

const UpdatePassword = () => {
    const [user, setUser] = useState({ password: ''});
    const [confirmPswd, setConfirmPswd] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { email, sourceTable } = location.state || {};
    const [btnText, setBtnTxt] = useState("Update password")

    const handleConfirmChange = (e) => {
        setConfirmPswd(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setBtnTxt("Update password")

        if (user.password !== confirmPswd) {
            alert('Passwords do not match');
            return;
        }
        
        setBtnTxt("Updating..")
        try {
            const { message } = await updateUserPassword({password:user.password, email:email, table:sourceTable});
            setBtnTxt("Update password")
            navigate('/forgot-password/success');
        } catch (error) {
            console.error('Login error:', error); // Log the error
            const errorMessage = 'customers registration failed';
            alert(errorMessage);
        }
        setBtnTxt("Update password")
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    return (
        <div  className=" my-20">

        {/* <section className="bg-gray-50 dark:bg-gray-900"> */}
          <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto  lg:py-0">
            
            <div className="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
              <h2 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Change Password
              </h2>
              <form className="mt-4 space-y-4 lg:mt-5 md:space-y-5" action="#" method="POST" onSubmit={handleSubmit} >
                <div className=" mb-5"> </div>
                <div>
                  <label for="confirm-password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
                  <input type="password"  placeholder="••••••••" name="password" id="password" value={user.password} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                </div>
                
                <div>
                  <label for="confirm-password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
                  <input type="password"  placeholder="••••••••" name="confirmPswd" id="confirm-password" value={confirmPswd} onChange={handleConfirmChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                </div>

                <button type="submit" className="w-full text-white bg-indigo-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">{btnText}</button>
              </form>
            </div>
          </div>
        {/* </section> */}
      </div>
    )
}

export default UpdatePassword