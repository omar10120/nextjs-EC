// src/Component/Cart.js
"use client";
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext'; // Import useUser


const Cart = (refreshOrders ) => {
  const { cart, removeFromCart, clearCart } = useCart(); // Use clearCart to clear the cart
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State for dialog visibility
  const { setUserId } = useUser(); // Get setUserId

  const [useridvalue, Setuseridvalue] = useState('');

  const handleCheckout = async () => {
    const userId = parseInt(localStorage.getItem("userid"), 10); 
    const totalPrice = cart.reduce((total, product) => total + product.price * (product.quantity || 1), 0);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          cartItems: cart,
          totalPrice,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert('Order placed successfully! , u can navigate to payment section to continue purchase progress ');
        clearCart(); // Clear the cart 
        setIsDialogOpen(false); // Close the  dialog
      
      } else {
        const errorData = await response.json();
        console.error(errorData.error);
      }
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">Your Cart</h2>

      {cart.length === 0 ? (
        <p className="text-gray-500 text-center">Your cart is empty</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {cart.map((product) => (
            <li key={product.id} className="py-4 flex justify-between items-center">
              <div className="flex items-center">
                <img
                  src={product.image || 'https://i.ibb.co/4YvyDsZ/2.png'}
                  alt={product.name}
                  className="w-12 h-12 object-cover rounded-md mr-4"
                />
                <div>
                  <p className="font-semibold text-gray-800">{product.name}</p>
                  <p className="text-gray-600 text-sm">Price: ${product.price}</p>
                  <p className="text-gray-600 text-sm">Quantity: {product.quantity || 1}</p>
                </div>
              </div>
              <button
                onClick={() => removeFromCart(product.id)}
                className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-3 py-1 rounded-md transition-colors duration-200"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      {cart.length > 0 && (
        <div className="mt-6 border-t border-gray-200 pt-4">
          <p className="text-lg font-semibold text-gray-800">
            Total: $
            {cart.reduce((total, product) => total + product.price * (product.quantity || 1), 0).toFixed(2)}
          </p>
          <button
            onClick={() => setIsDialogOpen(true)} // Open confirmation dialog
            className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-colors duration-200"
          >
            Proceed to Checkout
          </button>
        </div>
      )}

      {/* Confirmation Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Confirm Checkout</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to place this order?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  setIsDialogOpen(false); // Close dialog without proceeding
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleCheckout} // Call handleCheckout when confirming
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
