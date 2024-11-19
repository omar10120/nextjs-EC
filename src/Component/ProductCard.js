'use client';
import { useState, useEffect, useRef } from "react";
import { useCart } from '../context/CartContext';

function ProductCard({ product, onMoreDetails, onAddToCart }) {

  const { addToCart } = useCart(); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {

        const base64Payload = token?.split('.')[1];
        if (base64Payload) {
          const decodedPayload = JSON.parse(atob(base64Payload));
          // setUserRole(decodedPayload.role); 
          setIsLoggedIn(true); 

        }

      } catch (error) {
        console.error("Error decoding token:", error);
        // Handle token decoding 

      }
    }
  }, [isLoggedIn]);


  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105">
      <img
        src={product.image || 'https://i.ibb.co/4YvyDsZ/2.png'}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">Product: {product.name}</h3>
        <p className="text-gray-600 mt-2">Price: ${product.price}</p>
        <p className="text-gray-700 mt-2 text-sm font-bold">
          {product.description || 'No category'}
        </p>
        {isLoggedIn && (
        <div className="mt-4 flex justify-between">
          {/* More Details Button */}
          <button
            onClick={() => onMoreDetails(product)}
            className={`bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 ${isLoggedIn?'' : 'w-full'} transition-colors duration-200`}
          >
            More Details 
          </button>
          {/* Add to Cart Button */}
          
     
              <button
              onClick={() => addToCart(product)}
              className={`bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600  transition-colors duration-200`}
            >
              Add to Cart 
            </button>
        </div>
          )}
      </div>
    </div>
  );
}

export default ProductCard;
