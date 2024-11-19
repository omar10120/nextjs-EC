// src/pages/confirmation.js
import React from 'react';

const Confirmation = () => {
  return (
    <div className="max-w-lg mx-auto text-center mt-10 bg-white p-6 shadow-md rounded-lg">
      <h2 className="text-3xl font-bold text-green-600 mb-4">Thank you for your order!</h2>
      <p className="text-gray-700 mb-6">Your payment has been processed successfully. A confirmation email has been sent to your email address.</p>
      <p className="text-gray-600">Order Number: #{Math.floor(Math.random() * 1000000)}</p>
    </div>
  );
};

export default Confirmation;
