import React, { useState, useEffect, useMemo, useContext } from 'react';
import { getTodaysMenu, placeOrder } from '../../services/CustomerOrderService';
import { AuthContext } from '../../context/Authcontext';
import { FaShoppingCart, FaTrash, FaUtensils } from 'react-icons/fa';

const CustomerOrderPage = () => {
    const { user } = useContext(AuthContext);
    const [menu, setMenu] = useState({ dailyFoods: [], standardFoods: [] });
    const [cart, setCart] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [orderSuccess, setOrderSuccess] = useState(null);

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
            <div className="container mx-auto max-w-2xl text-center p-8 bg-white shadow-lg rounded-lg my-10">
                <h1 className="text-3xl font-bold text-green-600 mb-4">Order Placed Successfully!</h1>
                <p className="text-gray-700 mb-6">Please use the token below to collect your meal.</p>
                <div className="bg-gray-100 p-4 rounded-lg inline-block">
                    <p className="text-lg font-semibold text-gray-800">Your Order Token:</p>
                    <p className="text-4xl font-bold text-blue-600 tracking-wider">{orderSuccess.orderId}</p>
                </div>
                <p className="text-gray-600 mt-6 font-semibold">Total Amount: Rs. {orderSuccess.totalAmount.toFixed(2)}</p>
                <button onClick={() => setOrderSuccess(null)} className="mt-8 bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600">
                    Place Another Order
                </button>
            </div>
        );
    }

    const isMenuEmpty = !menu.dailyFoods.length && !menu.standardFoods.length;

    return (
        <div className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <h1 className="text-3xl font-bold mb-6">Today's Menu</h1>
                {error && <p className="text-red-500 bg-red-100 p-3 rounded-md">{error}</p>}
                
                {isLoading ? (
                    <p className="text-center text-gray-500">Loading Menu...</p>
                ) : isMenuEmpty ? (
                    <div className="text-center py-16 bg-white rounded-lg shadow-md">
                        <FaUtensils className="mx-auto text-5xl text-gray-300" />
                        <h2 className="mt-4 text-2xl font-semibold text-gray-700">No Items Available Today</h2>
                        <p className="mt-2 text-gray-500">Please check back again later.</p>
                    </div>
                ) : (
                    <>
                        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Daily Meal Packages</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {menu.dailyFoods.length > 0 ? menu.dailyFoods.map(item => (
                                <div key={item.d_id} className="bg-white p-4 rounded-lg shadow-md flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-bold text-lg">{item.d_name}</h3>
                                        <p className="text-sm text-gray-500 capitalize">{item.meal_type}</p>
                                        {/* This is the new part to display components */}
                                        <p className="text-xs text-gray-600 mt-2 italic">
                                            Includes: {item.component_names || 'N/A'}
                                        </p>
                                        <p className="font-semibold text-gray-800 mt-2">Rs. {parseFloat(item.meal_price).toFixed(2)}</p>
                                    </div>
                                    <button onClick={() => addToCart(item)} className="mt-4 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 w-full">Add to Cart</button>
                                </div>
                            )) : <p className="text-gray-500 md:col-span-2 italic">No daily meal packages scheduled.</p>}
                        </div>

                        <h2 className="text-2xl font-semibold my-4 border-b pb-2 mt-8">Individual Items</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {menu.standardFoods.length > 0 ? menu.standardFoods.map(item => (
                                <div key={item.f_id} className="bg-white p-4 rounded-lg shadow-md flex flex-col justify-between">
                                   <div>
                                        <h3 className="font-bold text-lg">{item.f_name}</h3>
                                        <p className="font-semibold text-gray-800 mt-2">Rs. {parseFloat(item.price).toFixed(2)}</p>
                                    </div>
                                   <button onClick={() => addToCart(item)} className="mt-4 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 w-full">Add to Cart</button>
                                </div>
                            )) : <p className="text-gray-500 md:col-span-2 italic">No individual items available.</p>}
                        </div>
                    </>
                )}
            </div>

            <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-lg shadow-lg sticky top-8">
                    <h2 className="text-2xl font-bold mb-4 flex items-center"><FaShoppingCart className="mr-3"/> Your Cart</h2>
                    {cart.length === 0 ? (
                        <p className="text-gray-500">Your cart is empty.</p>
                    ) : (
                        <>
                            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                                {cart.map(item => (
                                    <div key={item.d_id || item.f_id} className="flex justify-between items-center">
                                        <div>
                                            <p className="font-semibold">{item.d_name || item.f_name}</p>
                                            <p className="text-sm text-gray-600">Rs. {parseFloat(item.meal_price || item.price).toFixed(2)}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input type="number" value={item.quantity} onChange={(e) => updateQuantity(item.d_id || item.f_id, item.d_id ? 'd_id' : 'f_id', parseInt(e.target.value))} className="w-16 text-center border rounded-md"/>
                                            <button onClick={() => removeFromCart(item.d_id || item.f_id, item.d_id ? 'd_id' : 'f_id')} className="text-red-500 hover:text-red-700"><FaTrash /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t mt-6 pt-4">
                                <div className="flex justify-between font-bold text-xl">
                                    <span>Total:</span>
                                    <span>Rs. {cartTotal.toFixed(2)}</span>
                                </div>
                                <button onClick={handlePlaceOrder} disabled={isLoading || !user} className="mt-6 w-full bg-green-500 text-white py-3 rounded-lg font-bold text-lg hover:bg-green-600 disabled:bg-gray-400">
                                    {isLoading ? 'Placing Order...' : (user ? 'Place Order' : 'Login to Order')}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CustomerOrderPage;
