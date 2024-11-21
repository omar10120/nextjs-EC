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

export default function Home() {
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
        const base64Payload = token.split(".")[1];
        if (base64Payload) {
          const decodedPayload = JSON.parse(atob(base64Payload));
          setUserRole(decodedPayload.role);
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem("token"); // Clear token if it's invalid
      }
    }
  }, []);

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
              userRole === "admin" ? (
                <FetchData />
              ) : (
                <p className="text-center text-red-500">Access Denied</p>
              )
            ) : activeView === "Register" ? (
              <Register mode="register" />
            ) : activeView === "Users" ? (
              userRole === "admin" ? (
                <Users />
              ) : (
                <p className="text-center text-red-500">Access Denied</p>
              )
            ) : activeView === "Payment" ? (
              <Payment />
            ) : (
              <>
                <Products key="products" />
                <Cart key="cart" />
              </>
            )
          ) : (
            <div className="text-center py-10">
              <h2 className="text-2xl mb-4 text-black">
                Welcome My Friend! Please log-in or register to access buying,
                showing more details, and much more...
              </h2>
              {activeView === "register" ? (
                [
                  <Register
                    key="register-component"
                    mode="register"
                    onAuthSuccess={handleAuthSuccess}
                    onClearMessage={handleSetClearMessage}
                  />,
                  <button
                    key="register-button"
                    onClick={() => {
                      if (clearMessageRef.current) clearMessageRef.current();
                      setActiveView("Register");
                    }}
                    className="mt-4 text-blue-500 underline"
                  >
                    Already have an account? Log in
                  </button>,
                ]
              ) : activeView === "Register" ? (
                [
                  <Register
                    key="login-component"
                    mode="login"
                    onAuthSuccess={handleAuthSuccess}
                    setIsLoggedIn={setIsLoggedIn}
                    setActiveView={setActiveView}
                    onClearMessage={handleSetClearMessage}
                  />,
                  <button
                    key="login-button"
                    onClick={() => {
                      if (clearMessageRef.current) clearMessageRef.current();
                      setActiveView("register");
                    }}
                    className="mt-4 text-blue-500 underline"
                  >
                    Don't have an account? Register
                  </button>,
                ]
              ) : (
                <>
                  {/* Add key prop to components */}
                  <Products key="products" />
                  {isLoggedIn && <Cart key="cart" />}
                </>
              )}
            </div>
          )}
        </div>
      </UserProvider>
    </CartProvider>
  );
}
