import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
//import img from './images';

function App() {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchCartItems();
  }, []);

  const fetchProducts = () => {
    axios.get('http://localhost:3001/products')
      .then(response => setProducts(response.data))
      .catch(error => console.error('Error fetching products:', error));
  };

  const fetchCartItems = () => {
    axios.get('http://localhost:3001/cart')
      .then(response => setCartItems(response.data))
      .catch(error => console.error('Error fetching cart items:', error));
  };

  const addToCart = (productId) => {
    axios.post('http://localhost:3001/cart', { product_id: productId, quantity: 1 })
      .then(response => setCartItems([...cartItems, response.data]))
      .catch(error => console.error('Error adding to cart:', error));
  };

  const updateCartItem = (id, quantity) => {
    axios.put(`http://localhost:3001/cart/${id}`, { quantity })
      .then(response => {
        setCartItems(cartItems.map(item =>
          item.id === id ? { ...item, quantity: response.data.quantity } : item
        ));
      })
      .catch(error => console.error('Error updating cart item:', error));
  };

  const deleteCartItem = (id) => {
    axios.delete(`http://localhost:3001/cart/${id}`)
      .then(() => setCartItems(cartItems.filter(item => item.id !== id)))
      .catch(error => console.error('Error deleting cart item:', error));
  };

  return (
    <div className="App">
      <h1>Product List</h1>
      <div className="product-list">
        {products.map(product => (
          <div className="product-card" key={product.id}>
            <img src={product.image_url} alt={product.name} />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>${product.price}</p>
            <button onClick={() => addToCart(product.id)}>Add to Cart</button>
          </div>
        ))}
      </div>

      <h1>Your Cart</h1>
      <div className="cart">
        {cartItems.map(item => (
          <div className="cart-item" key={item.id}>
            <img src={item.image_url} alt={item.name} />
            <h4>{item.name}</h4>
            <p>${item.price}</p>
            <input
              type="number"
              value={item.quantity}
              onChange={(e) => updateCartItem(item.id, e.target.value)}
            />
            <button onClick={() => deleteCartItem(item.id)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
