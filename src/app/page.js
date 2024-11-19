// src/pages/index.js
"use client";
import { useState, useEffect, useRef } from "react";
import FetchData from "../Component/FetchData";
import Products from "../Component/Products";
import Navbar from "../Component/Navbar";
import Register from "../Component/register";
import Users from "../Component/Users";
import Cart from "../Component/Cart";
import Payment from "@/Component/Payment";
import { isAuthenticated, handleLogout, getToken } from "../lib/auth"; 
import jwtDecode from "jwt-decode"; 
import { CartProvider } from "../context/CartContext"; // Import CartProvider
import Confirmation from "@/Component/confirmation";
import { UserProvider } from "../context/UserContext";

export default function Home(Component, pageProps) {
  const [activeView, setActiveView] = useState("products");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(""); // Store user role
  const clearMessageRef = useRef(null);

  const handleSetClearMessage = (clearFn) => {
    clearMessageRef.current = clearFn;
  };

  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {

        const base64Payload = token?.split('.')[1];
        if (base64Payload) {
          const decodedPayload = JSON.parse(atob(base64Payload));
          
          console.log("Manually Decoded Payload:", decodedPayload);
          console.log(decodedPayload.role);
          setUserRole(decodedPayload.role); 
          setIsLoggedIn(true); 

        }

      } catch (error) {
        console.error("Error decoding token:", error);
        // Handle token decoding 
        localStorage.removeItem("token");
      }
    }
  }, [isLoggedIn]);

  const handleAuthSuccess = () => {
    setIsLoggedIn(true);
    setActiveView("products"); // Default to products after login
  };

  return (
    <CartProvider>
      <UserProvider>

        <Navbar setActiveView={setActiveView} setIsLoggedIn={setIsLoggedIn} />
        <div className="container mx-auto px-4 w-10/12 bg-gray-200 my-10 h-full">
          {isLoggedIn ? (
            activeView === "dashboard" ? (
              userRole === "admin" ? ( // Only render FetchData for admins
                <FetchData />
              ) : (
                <p className="text-center text-red-500">Access Denied</p>
              )
            ) : activeView === "Register" ? (
              <Register mode="register" />
            ) : activeView === "Users" ? (
              userRole === "admin" ? ( // Only render FetchData for admins
              <Users />) : (
                <p className="text-center text-red-500">Access Denied</p>
              )
            ) : activeView === "Payment" ? (
              <Payment />
            ) : (
              [<Products />, <Cart />] // Products and Cart for all users
            )
          ) : (
            <div className="text-center py-10">
              <h2 className="text-2xl mb-4">
                Welcome My Friend ! Please log-in or register to access buying showing more details and much More...
              </h2>
              {activeView === "register" ? (
             [    <Register
                  mode="register"
                  onAuthSuccess={handleAuthSuccess}
                  onClearMessage={handleSetClearMessage}
                />,
              
                <button
                onClick={() => {
                  if (clearMessageRef.current) clearMessageRef.current();
                  setActiveView(
                    activeView === "register" ? "Register" : "Register"
                  );
                }}
                className="mt-4 text-blue-500 underline"
              >
                {activeView === "register"
                  ? "Already have an account? Log innn" 
                  : ""}
              </button>]
              ) :  activeView === "Register" ? (
                [<Register
                  mode="login"
                  onAuthSuccess={handleAuthSuccess}
                  setIsLoggedIn={setIsLoggedIn}
                  setActiveView={setActiveView}
                  onClearMessage={handleSetClearMessage}
                />
                ,

                <button
                onClick={() => {
                  if (clearMessageRef.current) clearMessageRef.current();
                  setActiveView(
                    activeView === "register" ? "login" : "register"
                  );
                }}
                className="mt-4 text-blue-500 underline"
              >
                {activeView === "register"
                  ? ""
                  : "Don't have an account? Register"}
              </button>
              ] 
              ) : (
                <>
   
                  <Products />
                  {/* Show Cart if logged in */}
                  {isLoggedIn && <Cart />}
                </>
              )
              }
       
            </div>
          )}
        </div>
      </UserProvider>
    </CartProvider>
  );
}
