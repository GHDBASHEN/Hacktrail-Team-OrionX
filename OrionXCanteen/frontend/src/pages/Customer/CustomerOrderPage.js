
import React, { useState, useEffect } from 'react';
import { getTodaysMenu, createOrder } from '../../services/CustomerOrderService';

const CustomerOrderPage = ({ customerId }) => {
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

    if (loading) return <p>Loading menu...</p>;

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '40px', maxWidth: '1400px', margin: 'auto' }}>
            <div>
                <h1>Today's Menu</h1>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {menu.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                        {menu.map(item => (
                            <div key={item.food_id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '15px' }}>
                                <img src={item.image_url || 'https://placehold.co/600x400'} alt={item.food_name} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                                <h3>{item.food_name}</h3>
                                <p style={{ fontSize: '0.9rem', color: '#555' }}>{item.components}</p>
                                <p style={{ fontWeight: 'bold' }}>LKR {item.price}</p>
                                <button onClick={() => addToCart(item)}>Add to Cart</button>
                            </div>
                        ))}
                    </div>
                ) : !error && <p>{message || "No menu items available for today."}</p>}
            </div>

            <div style={{ borderLeft: '1px solid #ccc', paddingLeft: '40px' }}>
                <h2>Your Order</h2>
                {cart.length === 0 ? (
                    <p>Your cart is empty.</p>
                ) : (
                    <>
                        {cart.map(item => (
                            <div key={item.food_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '10px 0' }}>
                                <div>
                                    <p style={{ margin: 0 }}>{item.food_name}</p>
                                    <small>x {item.quantity}</small>
                                </div>
                                <div>
                                    <button onClick={() => updateQuantity(item.food_id, -1)}>-</button>
                                    <button onClick={() => updateQuantity(item.food_id, 1)}>+</button>
                                </div>
                            </div>
                        ))}
                        <hr />
                        <h3 style={{ textAlign: 'right' }}>Total: LKR {getTotalPrice()}</h3>
                        <textarea
                            value={specialNotes}
                            onChange={(e) => setSpecialNotes(e.target.value)}
                            placeholder="Special notes..."
                            style={{ width: '100%', height: '60px', marginTop: '10px' }}
                        />
                        <button onClick={handlePlaceOrder} style={{ width: '100%', padding: '10px', marginTop: '10px', background: 'green', color: 'white' }}>
                            Place Order
                        </button>
                        {message && cart.length === 0 && <p style={{ color: 'green' }}>{message}</p>}
                    </>
                )}
            </div>
        </div>
    );
};

export default CustomerOrderPage;