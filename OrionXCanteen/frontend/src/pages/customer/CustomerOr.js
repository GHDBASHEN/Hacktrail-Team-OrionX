// import React, { useState, useEffect } from 'react';
// import { getTodaysMenu, createOrder } from '../../services/CustomerOrderService';

// const CustomerOr = ({customerId}) => {
//     const [menu, setMenu] = useState([]);
//     const [cart, setCart] = useState([]);
//     const [specialNotes, setSpecialNotes] = useState('');
//     const [error, setError] = useState('');
//     const [message, setMessage] = useState('');
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         fetchMenu();
//     }, []);

//     const fetchMenu = async () => {
//         try {
//             const menuData = await getTodaysMenu();
//             if (menuData.length === 0) {
//                 setMessage("No menu items available for today.");
//             }
//             setMenu(menuData);
//         } catch (err) {
//             setError('Could not load today\'s menu. Please try again later.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const addToCart = (foodItem) => {
//         setCart(prevCart => {
//             const existingItem = prevCart.find(item => item.food_id === foodItem.food_id);
//             if (existingItem) {
//                 return prevCart.map(item =>
//                     item.food_id === foodItem.food_id
//                         ? { ...item, quantity: item.quantity + 1 }
//                         : item
//                 );
//             }
//             return [...prevCart, { ...foodItem, quantity: 1 }];
//         });
//     };

//     const updateQuantity = (foodId, amount) => {
//         setCart(prevCart => {
//             const updatedCart = prevCart.map(item => {
//                 if (item.food_id === foodId) {
//                     return { ...item, quantity: Math.max(0, item.quantity + amount) };
//                 }
//                 return item;
//             });
//             return updatedCart.filter(item => item.quantity > 0);
//         });
//     };

//     const getTotalPrice = () => {
//         return cart.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0).toFixed(2);
//     };

//     const handlePlaceOrder = async () => {
//         if (cart.length === 0) {
//             setError("Your cart is empty.");
//             return;
//         }
//         setError('');
//         setMessage('');

//         const orderData = {
//             items: cart.map(({ food_id, quantity }) => ({ food_id, quantity })),
//             specialNotes: specialNotes,
//         };

//         try {
//             // Pass the customerId prop to the createOrder service
//             const result = await createOrder(customerId, orderData);
//             setMessage(`Order placed successfully! Your Order ID is ${result.orderId}`);
//             setCart([]);
//             setSpecialNotes('');
//         } catch (err) {
//             setError(err.response?.data?.message || 'Failed to place order.');
//         }
//     };

//     if (loading) return <p>Loading menu...</p>;

//     return (
//         <div style={{ fontFamily: 'Arial, sans-serif', display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '40px', maxWidth: '1400px', margin: 'auto' }}>
//             <div>
//                 <h1>Today's Menu</h1>
//                 {error && <p style={{ color: 'red' }}>{error}</p>}
//                 {menu.length > 0 ? (
//                     <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
//                         {menu.map(item => (
//                             <div key={item.food_id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '15px' }}>
//                                 <img src={item.image_url || 'https://placehold.co/600x400'} alt={item.food_name} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
//                                 <h3>{item.food_name}</h3>
//                                 <p style={{ fontSize: '0.9rem', color: '#555' }}>{item.components}</p>
//                                 <p style={{ fontWeight: 'bold' }}>LKR {item.price}</p>
//                                 <button onClick={() => addToCart(item)}>Add to Cart</button>
//                             </div>
//                         ))}
//                     </div>
//                 ) : !error && <p>{message || "No menu items available for today."}</p>}
//             </div>

//             <div style={{ borderLeft: '1px solid #ccc', paddingLeft: '40px' }}>
//                 <h2>Your Order</h2>
//                 {cart.length === 0 ? (
//                     <p>Your cart is empty.</p>
//                 ) : (
//                     <>
//                         {cart.map(item => (
//                             <div key={item.food_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '10px 0' }}>
//                                 <div>
//                                     <p style={{ margin: 0 }}>{item.food_name}</p>
//                                     <small>x {item.quantity}</small>
//                                 </div>
//                                 <div>
//                                     <button onClick={() => updateQuantity(item.food_id, -1)}>-</button>
//                                     <button onClick={() => updateQuantity(item.food_id, 1)}>+</button>
//                                 </div>
//                             </div>
//                         ))}
//                         <hr />
//                         <h3 style={{ textAlign: 'right' }}>Total: LKR {getTotalPrice()}</h3>
//                         <textarea
//                             value={specialNotes}
//                             onChange={(e) => setSpecialNotes(e.target.value)}
//                             placeholder="Special notes..."
//                             style={{ width: '100%', height: '60px', marginTop: '10px' }}
//                         />
//                         <button onClick={handlePlaceOrder} style={{ width: '100%', padding: '10px', marginTop: '10px', background: 'green', color: 'white' }}>
//                             Place Order
//                         </button>
//                         {message && cart.length === 0 && <p style={{ color: 'green' }}>{message}</p>}
//                     </>
//                 )}
//             </div>
//         </div>
//     );
// }

// export default CustomerOr

import React, { useState, useEffect } from 'react';
import { getTodaysMenu, createOrder } from '../../services/CustomerOrderService';

const CustomerOrder = ({ customerId }) => {
    const [menu, setMenu] = useState([]);
    const [cart, setCart] = useState([]);
    const [specialNotes, setSpecialNotes] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMenu();
    }, []);

    const fetchMenu = async () => {
        try {
            const menuData = await getTodaysMenu();
            if (menuData.length === 0) {
                setMessage("No menu items available for today.");
            }
            setMenu(menuData);
        } catch (err) {
            setError('Could not load today\'s menu. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const addToCart = (foodItem) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.food_id === foodItem.food_id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.food_id === foodItem.food_id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prevCart, { ...foodItem, quantity: 1 }];
        });
    };

    const updateQuantity = (foodId, amount) => {
        setCart(prevCart => {
            const updatedCart = prevCart.map(item => {
                if (item.food_id === foodId) {
                    return { ...item, quantity: Math.max(0, item.quantity + amount) };
                }
                return item;
            });
            return updatedCart.filter(item => item.quantity > 0);
        });
    };

    const getTotalPrice = () => {
        return cart.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0).toFixed(2);
    };

    const handlePlaceOrder = async () => {
        if (cart.length === 0) {
            setError("Your cart is empty.");
            return;
        }
        setError('');
        setMessage('');

        const orderData = {
            items: cart.map(({ food_id, quantity }) => ({ food_id, quantity })),
            specialNotes: specialNotes,
        };

        try {
            // Pass the customerId prop to the createOrder service
            const result = await createOrder(customerId, orderData);
            setMessage(`Order placed successfully! Your Order ID is ${result.orderId}`);
            setCart([]);
            setSpecialNotes('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to place order.');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8 text-blue-800">Today's Menu</h1>
            
            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
                    <p>{error}</p>
                </div>
            )}
            
            {message && (
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded">
                    <p>{message}</p>
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Menu Items */}
                <div className="w-full lg:w-2/3">
                    {menu.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {menu.map(item => (
                                <div key={item.food_id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                    <div className="h-48 overflow-hidden">
                                        <img 
                                            src={item.image_url || 'https://placehold.co/600x400?text=Food+Image'} 
                                            alt={item.food_name} 
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.src = 'https://placehold.co/600x400?text=Image+Not+Found';
                                            }}
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-xl font-semibold text-gray-800">{item.food_name}</h3>
                                        <p className="text-sm text-gray-600 mt-1">{item.components}</p>
                                        <div className="flex justify-between items-center mt-4">
                                            <span className="text-lg font-bold text-blue-600">LKR {item.price}</span>
                                            <button 
                                                onClick={() => addToCart(item)}
                                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300"
                                            >
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-gray-100 rounded-lg p-8 text-center">
                            <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                            </svg>
                            <p className="text-gray-600 mt-4 text-lg">No menu items available for today.</p>
                        </div>
                    )}
                </div>

                {/* Cart Section */}
                <div className="w-full lg:w-1/3 bg-white rounded-lg shadow-md p-6 h-fit sticky top-4">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b">Your Order</h2>
                    
                    {cart.length === 0 ? (
                        <div className="text-center py-8">
                            <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                            </svg>
                            <p className="text-gray-600 mt-4">Your cart is empty</p>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-4 mb-6">
                                {cart.map(item => (
                                    <div key={item.food_id} className="flex justify-between items-center border-b pb-3">
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-800">{item.food_name}</h4>
                                            <p className="text-sm text-gray-600">LKR {item.price} each</p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button 
                                                onClick={() => updateQuantity(item.food_id, -1)}
                                                className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                                            >
                                                -
                                            </button>
                                            <span className="font-medium w-6 text-center">{item.quantity}</span>
                                            <button 
                                                onClick={() => updateQuantity(item.food_id, 1)}
                                                className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="border-t pt-4 mb-6">
                                <div className="flex justify-between items-center text-lg font-bold">
                                    <span>Total:</span>
                                    <span>LKR {getTotalPrice()}</span>
                                </div>
                            </div>
                            
                            <div className="mb-6">
                                <label className="block text-gray-700 font-medium mb-2">Special Notes:</label>
                                <textarea
                                    value={specialNotes}
                                    onChange={(e) => setSpecialNotes(e.target.value)}
                                    placeholder="Any allergies, preferences, or special requests..."
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows="3"
                                />
                            </div>
                            
                            <button 
                                onClick={handlePlaceOrder} 
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300"
                            >
                                Place Order
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CustomerOrder;