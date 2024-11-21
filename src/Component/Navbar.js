// components/Navbar.js
'use client';

import React, { useEffect, useState } from 'react';
import { isAuthenticated, handleLogout } from '../lib/auth';
import { useRouter } from 'next/navigation';
import { useUser } from '../context/UserContext'; // Import useUser


export default function Navbar({ setActiveView, setIsLoggedIn }) {
  const router = useRouter();
  const [hasOrders, setHasOrders] = useState(false); 
  const { userId } = useUser(); // Access userId from context
  const [userRole, setUserRole] = useState(""); // Store user role

  const useridLocalStorge = localStorage.getItem("userid")
  const token = localStorage.getItem("token");
  const base64Payload = token?.split('.')[1];
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (useridLocalStorge) {
      const checkUserOrders = async () => {
        try {
          const response = await fetch(`/api/orders?userId=${useridLocalStorge}`);
          const orders = await response.json();
          setHasOrders(response.ok && orders.length > 0);

          if (base64Payload) {
            const decodedPayload = JSON.parse(atob(base64Payload));
            setUserRole(decodedPayload.role); 
          }
    
        } catch (error) {
          console.error('Error fetching user orders:', error);
          setHasOrders(false);
        }
      };

      checkUserOrders();
    }
  }, [userId, userRole , token]);

  const handlelogout = () => {
    handleLogout();
    setIsLoggedIn(false);
    setActiveView("Login");
    setUserRole("")
  
  };
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
function fetchnavbar({ userRole, hasOrders, useridLocalStorge, setActiveView, handlelogout }) {
  useEffect(() => {
    if (userId) {
      checkUserOrders(); // Fetch user orders on mount or when userId changes
    }
  }, [userId]);
}

  return (
    <>
      <nav className="bg-gray-800 p-4 max-sm:hidden ">
        <div className="container mx-auto flex ">
          {userRole == "admin" &&(
            <button
            onClick={() => setActiveView("dashboard")}
            className="text-white font-semibold px-4 py-2 rounded hover:bg-gray-700 text-sm "
            >
            Dashboard
          </button>
          )}
          <button
            onClick={() => setActiveView("products")}
            className="text-white font-semibold px-4 py-2 rounded hover:bg-gray-700"
          >
            Products
            
          </button>
          <button
            onClick={() => setActiveView("Register")}
            className="text-white font-semibold px-4 py-2 rounded hover:bg-gray-700"
          >
            Register / Login
          </button>
          {userRole == "admin" &&(

            <button
            onClick={() => setActiveView("Users")}
            className="text-white font-semibold px-4 py-2 rounded hover:bg-gray-700"
            >
            Users
          </button>
          )}


            {hasOrders &&(
            userRole == "admin" || userRole == "user" ? 
            <button
            onClick={() => setActiveView("Payment")}
            className="text-white font-semibold px-4 py-2 rounded hover:bg-gray-700"
            >
              Payment
              </button>
              : ''
            
            )}
          
          {useridLocalStorge && (

            <div className="grow flex justify-end">
            <button
              onClick={() => handlelogout()}
              className="text-white font-semibold px-4 py-2 rounded hover:bg-gray-700 bg-red-600"
              >
              Logout
            </button>
          </div>
            )}
        </div>
      </nav>

        {/* start mobile menu */}
    <nav className="bg-gray-800 p-4 relative hidden max-sm:block">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo or Branding */}
        <div className="text-white font-bold text-lg">LaptopStore</div>

        {/* Dropdown Button */}
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="text-white font-semibold px-4 py-2 rounded hover:bg-gray-700 bg-red-600 transition duration-200"
          >
            Menu
          </button>

          {/* Dropdown Items */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
              <ul className="py-2">
                {userRole === "admin" && (
                  <li>
                    <button
                      onClick={() => setActiveView("dashboard")}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Dashboard
                    </button>
                  </li>
                )}
                <li>
                  <button
                    onClick={() => setActiveView("products")}
                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Products
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveView("Register")}
                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Register / Login
                  </button>
                </li>
                {userRole === "admin" && (
                  <li>
                    <button
                      onClick={() => setActiveView("Users")}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Users
                    </button>
                  </li>
                )}
                {hasOrders && (userRole === "admin" || userRole === "user") && (
                  <li>
                    <button
                      onClick={() => setActiveView("Payment")}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Payment
                    </button>
                  </li>
                )}
                {useridLocalStorge && (
                  <li>
                    <button
                      onClick={handlelogout}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100"
                    >
                      Logout
                    </button>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
        {/* end  mobile menu */}
            
    </>
  );
}
