import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/Authcontext';
import { loginUser } from '../services/AuthService';

export const Login = () => {
    const [user, setUser] = useState({ credential: '', password: '' });
    const [loading, setLoading] = useState(false); // Add loading state
    const [error, setError] = useState("")
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        setError()
        e.preventDefault();
        setLoading(true); // Set loading to true
        try {
            const { userEmail, id, role, token, refreshToken } = await loginUser(user);
            login(userEmail, id, role, token, refreshToken);

            if (role === 'admin') {
                navigate('/superAdmin');
            } else if (role === 'customer') {
                navigate('/');
            }

        } catch (error) {
            console.error('Login error:', error);
            const errorMessage = error?.response?.data?.message || 'Login failed';
            //alert(errorMessage);
            setError(errorMessage);
        } finally {
            setLoading(false); // Set loading to false
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    return (
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img className="mx-auto h-10 w-auto" src="/logo.png" alt="Your Company" />
                <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Sign in to your account</h2>
                <p className='text-center mt-5 text-red-500'>{error}</p>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                {loading && ( // Conditionally render the spinner
                    <div className="relative items-center block max-w-sm p-6 bg-white border border-gray-100 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-800 dark:hover:bg-gray-700">
                        <form className="space-y-6" action="#" method="POST" onSubmit={handleSubmit}>
                            <div>
                                <label for="email" className="block text-sm/6 font-medium text-gray-900 dark:text-gray-400 opacity-20">Email address</label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="credential"
                                        value={user.credential}
                                        onChange={handleChange}
                                        id="email"
                                        autoComplete="email"
                                        required
                                        className="block w-full rounded-md border bg-white px-3 py-1.5 text-base text-gray-900 dark:text-gray-400 opacity-20 outline-1 -outline-offset-1 outline-black placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-black sm:text-sm/6"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <label for="password" className="block text-sm/6 font-medium text-gray-900 dark:text-gray-400 opacity-20">Password</label>
                                    <div className="text-sm">
                                        <Link to="/forgot-password" className="font-semibold text-indigo-600 dark:text-gray-400 opacity-20 hover:text-indigo-500"  >Forgot password</Link>
                                        {/* <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500" >Forgot password?</a> */}
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <input
                                        type="password"
                                        name="password"
                                        value={user.password}
                                        onChange={handleChange}
                                        id="password"
                                        autoComplete="current-password"
                                        required
                                        className="block w-full rounded-md border bg-white px-3 py-1.5 text-base text-gray-900 dark:text-gray-400 opacity-20 outline-1 -outline-offset-1 outline-black placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-black sm:text-sm/6"
                                    />
                                </div>
                            </div>

                            <div>
                                <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white dark:text-gray-400 opacity-20 shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign in</button>
                            </div>

                        </form>

                        <div role="status" className="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2">
                            <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                            </svg>
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                )}

                {!loading && (
                    <form className="space-y-6" action="#" method="POST" onSubmit={handleSubmit}>
                        <div>
                            <label for="email" className="block text-sm/6 font-medium text-gray-900">Email address</label>
                            <div className="mt-2">
                                <input type="text" name="credential" value={user.credential} onChange={handleChange} id="email" autoComplete="email" required className="block w-full rounded-md border bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label for="password" className="block text-sm/6 font-medium text-gray-900">Password</label>
                                <div className="text-sm">
                                    <Link to="/forgot-password" className="font-semibold text-indigo-600 hover:text-indigo-500"  >Forgot password</Link>
                                    {/* <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500" >Forgot password?</a> */}
                                </div>
                            </div>
                            <div className="mt-2">
                                <input type="password" name="password" value={user.password} onChange={handleChange} id="password" autoComplete="current-password" required className="block w-full rounded-md border bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                            </div>
                        </div>

                        <div>
                            <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign in</button>
                        </div>
                    </form>
                )}

                <p className="mt-10 text-center text-sm/6 text-gray-500">
                    Not a member? <Link to="/registration/register-customers" className="font-semibold text-indigo-600 hover:text-indigo-500"> Register New User</Link>
                </p>
            </div>
        </div>
    );
};
