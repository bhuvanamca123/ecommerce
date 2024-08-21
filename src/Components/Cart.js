import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3001/cart')
            .then(response => setCartItems(response.data))
            .catch(error => console.error('Error fetching cart items:', error));
    }, []);

    const handleRemove = (id) => {
        axios.delete(`http://localhost:3001/cart/${id}`)
            .then(() => setCartItems(cartItems.filter(item => item.id !== id)))
            .catch(error => console.error('Error removing item:', error));
    };

    return (
        <div>
            <h2>Your Cart</h2>
            {cartItems.map(item => (
                <div key={item.id}>
                    <h4>{item.name}</h4>
                    <p>Price: ${item.price}</p>
                    <p>Quantity: {item.quantity}</p>
                    <button onClick={() => handleRemove(item.id)}>Remove</button>
                </div>
            ))}
        </div>
    );
};

export default Cart;
