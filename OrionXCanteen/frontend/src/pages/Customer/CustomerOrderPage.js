// CustomerOrderPage.js
import React, { useState, useEffect, useMemo, useContext } from 'react';
import { getTodaysMenu, placeOrder } from '../../services/CustomerOrderService';
import { AuthContext } from '../../context/Authcontext';
import { FaShoppingCart, FaTrash, FaUtensils, FaPlus, FaMinus, FaStar } from 'react-icons/fa';

const CustomerOrderPage = () => {
    const { user } = useContext(AuthContext);
    const [menu, setMenu] = useState({ dailyFoods: [], standardFoods: [] });
    const [cart, setCart] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [orderSuccess, setOrderSuccess] = useState(null);
    const [activeTab, setActiveTab] = useState('daily');

    useEffect(() => {
        fetchMenu();
    }, []);

    const fetchMenu = async () => {
        setIsLoading(true);
        try {
            const data = await getTodaysMenu();
            setMenu({
                dailyFoods: data.dailyFoods || [],
                standardFoods: data.standardFoods || []
            });
        } catch (err) {
            setError('Could not load the menu. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const addToCart = (item) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(cartItem => (cartItem.d_id && cartItem.d_id === item.d_id) || (cartItem.f_id && cartItem.f_id === item.f_id));
            if (existingItem) {
                return prevCart.map(cartItem =>
                    ((cartItem.d_id && cartItem.d_id === item.d_id) || (cartItem.f_id && cartItem.f_id === item.f_id))
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                );
            }
            return [...prevCart, { ...item, quantity: 1 }];
        });
    };

    const removeFromCart = (itemId, itemType) => {
        setCart(prevCart => prevCart.filter(item => !(item[itemType] === itemId)));
    };

    const updateQuantity = (itemId, itemType, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(itemId, itemType);
            return;
        }
        setCart(prevCart => prevCart.map(item =>
            item[itemType] === itemId ? { ...item, quantity: newQuantity } : item
        ));
    };

    const handlePlaceOrder = async () => {
        setIsLoading(true);
        setError('');
        try {
            const customerId = sessionStorage.getItem('id'); 
            if (!customerId) {
                setError("You must be logged in to place an order.");
                setIsLoading(false);
                return;
            }
            const orderData = { customerId, cartItems: cart };
            const result = await placeOrder(orderData);
            setOrderSuccess({ orderId: result.orderId, totalAmount: result.totalAmount });
            setCart([]);
        } catch (err) {
            setError(err.response?.data?.message || 'There was an issue placing your order.');
        } finally {
            setIsLoading(false);
        }
    };

    const cartTotal = useMemo(() => {
        return cart.reduce((total, item) => {
            const price = item.meal_price || item.price;
            return total + (price * item.quantity);
        }, 0);
    }, [cart]);

    if (orderSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
                <div className="container mx-auto max-w-2xl text-center p-8 bg-white shadow-xl rounded-2xl my-10 border border-green-200">
                    <div className="mb-6">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-green-600 mb-4">Order Placed Successfully!</h1>
                    <p className="text-gray-700 mb-6">Please use the token below to collect your meal.</p>
                    <div className="bg-gradient-to-r from-green-100 to-blue-100 p-6 rounded-2xl shadow-inner mb-6">
                        <p className="text-lg font-semibold text-gray-800 mb-2">Your Order Token:</p>
                        <p className="text-5xl font-bold text-blue-600 tracking-wider">{orderSuccess.orderId}</p>
                    </div>
                    <p className="text-gray-600 mt-6 font-semibold text-xl">Total Amount: Rs. {orderSuccess.totalAmount.toFixed(2)}</p>
                    <button 
                        onClick={() => setOrderSuccess(null)} 
                        className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-8 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-md"
                    >
                        Place Another Order
                    </button>
                </div>
            </div>
        );
    }

    const isMenuEmpty = !menu.dailyFoods.length && !menu.standardFoods.length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
            <div className="container mx-auto max-w-6xl bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-6">
                    <h1 className="text-4xl font-bold mb-2">Today's Menu</h1>
                    <p className="text-blue-100">Delicious meals prepared fresh daily</p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6">
                    <div className="lg:col-span-2">
                        {error && (
                            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6" role="alert">
                                <p>{error}</p>
                            </div>
                        )}
                        
                        {isLoading ? (
                            <div className="flex justify-center items-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        ) : isMenuEmpty ? (
                            <div className="text-center py-16 bg-white rounded-lg shadow-md">
                                <FaUtensils className="mx-auto text-5xl text-gray-300 mb-4" />
                                <h2 className="text-2xl font-semibold text-gray-700">No Items Available Today</h2>
                                <p className="mt-2 text-gray-500">Please check back again later.</p>
                            </div>
                        ) : (
                            <>
                                <div className="flex border-b border-gray-200 mb-6">
                                    <button
                                        className={`py-3 px-6 font-medium text-sm rounded-t-lg ${activeTab === 'daily' ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
                                        onClick={() => setActiveTab('daily')}
                                    >
                                        Daily Meal Packages
                                    </button>
                                    <button
                                        className={`py-3 px-6 font-medium text-sm rounded-t-lg ${activeTab === 'individual' ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
                                        onClick={() => setActiveTab('individual')}
                                    >
                                        Individual Items
                                    </button>
                                </div>

                                {activeTab === 'daily' && (
                                    <div>
                                        <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center">
                                            <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                                            </svg>
                                            Daily Meal Packages
                                        </h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {menu.dailyFoods.length > 0 ? menu.dailyFoods.map(item => (
                                                <div key={item.d_id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                                                    <div className="p-6">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <h3 className="font-bold text-xl text-gray-900">{item.d_name}</h3>
                                                                <p className="text-sm text-gray-500 capitalize mt-1">{item.meal_type}</p>
                                                            </div>
                                                            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                                                {item.meal_type}
                                                            </span>
                                                        </div>
                                                        
                                                        <p className="text-gray-600 mt-4 text-sm">
                                                            <span className="font-medium">Includes:</span> {item.component_names || 'N/A'}
                                                        </p>
                                                        
                                                        <div className="flex justify-between items-center mt-6">
                                                            <p className="font-bold text-2xl text-blue-700">Rs. {parseFloat(item.meal_price).toFixed(2)}</p>
                                                            <button 
                                                                onClick={() => addToCart(item)} 
                                                                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-2 px-4 rounded-lg flex items-center transition-all duration-300 shadow-md"
                                                            >
                                                                <FaPlus className="mr-1" /> Add to Cart
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )) : (
                                                <div className="md:col-span-2 text-center py-8">
                                                    <div className="inline-flex items-center justify-center rounded-full bg-gray-100 p-4 mb-4">
                                                        <FaUtensils className="text-gray-400 text-xl" />
                                                    </div>
                                                    <p className="text-gray-500 italic">No daily meal packages scheduled.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'individual' && (
                                    <div>
                                        <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center">
                                            <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"></path>
                                            </svg>
                                            Individual Items
                                        </h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {menu.standardFoods.length > 0 ? menu.standardFoods.map(item => (
                                                <div key={item.f_id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                                                    <div className="p-6">
                                                        <div className="flex justify-between items-start">
                                                            <h3 className="font-bold text-xl text-gray-900">{item.f_name}</h3>
                                                            <div className="flex items-center">
                                                                <FaStar className="text-yellow-400 mr-1" />
                                                                <span className="text-sm text-gray-500">4.5</span>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="flex justify-between items-center mt-6">
                                                            <p className="font-bold text-2xl text-blue-700">Rs. {parseFloat(item.price).toFixed(2)}</p>
                                                            <button 
                                                                onClick={() => addToCart(item)} 
                                                                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-2 px-4 rounded-lg flex items-center transition-all duration-300 shadow-md"
                                                            >
                                                                <FaPlus className="mr-1" /> Add to Cart
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )) : (
                                                <div className="md:col-span-2 text-center py-8">
                                                    <div className="inline-flex items-center justify-center rounded-full bg-gray-100 p-4 mb-4">
                                                        <FaUtensils className="text-gray-400 text-xl" />
                                                    </div>
                                                    <p className="text-gray-500 italic">No individual items available.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-lg sticky top-8 border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-4 text-white">
                                <h2 className="text-xl font-bold flex items-center">
                                    <FaShoppingCart className="mr-2" /> Your Cart
                                    {cart.length > 0 && (
                                        <span className="ml-2 bg-white text-blue-700 rounded-full text-xs font-bold px-2 py-1">
                                            {cart.length}
                                        </span>
                                    )}
                                </h2>
                            </div>
                            
                            <div className="p-4">
                                {cart.length === 0 ? (
                                    <div className="text-center py-8">
                                        <FaShoppingCart className="text-gray-300 text-4xl mx-auto mb-4" />
                                        <p className="text-gray-500">Your cart is empty.</p>
                                        <p className="text-sm text-gray-400 mt-2">Add items from the menu to get started</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                                            {cart.map(item => (
                                                <div key={item.d_id || item.f_id} className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
                                                    <div className="flex-1">
                                                        <p className="font-semibold text-gray-800">{item.d_name || item.f_name}</p>
                                                        <p className="text-sm text-gray-600">Rs. {parseFloat(item.meal_price || item.price).toFixed(2)}</p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button 
                                                            onClick={() => updateQuantity(item.d_id || item.f_id, item.d_id ? 'd_id' : 'f_id', item.quantity - 1)}
                                                            className="text-gray-500 hover:text-blue-600 p-1 rounded-full hover:bg-blue-100"
                                                        >
                                                            <FaMinus size={12} />
                                                        </button>
                                                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                                                        <button 
                                                            onClick={() => updateQuantity(item.d_id || item.f_id, item.d_id ? 'd_id' : 'f_id', item.quantity + 1)}
                                                            className="text-gray-500 hover:text-blue-600 p-1 rounded-full hover:bg-blue-100"
                                                        >
                                                            <FaPlus size={12} />
                                                        </button>
                                                        <button 
                                                            onClick={() => removeFromCart(item.d_id || item.f_id, item.d_id ? 'd_id' : 'f_id')} 
                                                            className="text-gray-400 hover:text-red-500 ml-2 p-1 rounded-full hover:bg-red-100"
                                                        >
                                                            <FaTrash size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="border-t mt-6 pt-4">
                                            <div className="flex justify-between items-center font-bold text-xl mb-4">
                                                <span className="text-gray-700">Total:</span>
                                                <span className="text-blue-700">Rs. {cartTotal.toFixed(2)}</span>
                                            </div>
                                            <button 
                                                onClick={handlePlaceOrder} 
                                                disabled={isLoading || !user}
                                                className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-3 rounded-lg font-bold text-lg hover:from-green-600 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 transition-all duration-300 shadow-md flex items-center justify-center"
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Processing...
                                                    </>
                                                ) : (user ? 'Place Order' : 'Login to Order')}
                                            </button>
                                            {!user && (
                                                <p className="text-sm text-red-500 mt-2 text-center">Please log in to complete your order</p>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerOrderPage;