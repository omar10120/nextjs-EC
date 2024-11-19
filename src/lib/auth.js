// src/lib/auth.js
export function isAuthenticated() {
    // Check if there's a token in localStorage
    return !!localStorage.getItem("token");
  }


  export function getToken() {
    // Check if there's a token in localStorage
    return localStorage.getItem("token");
  }

export function handleLogout() {
localStorage.removeItem("token");
localStorage.removeItem("userid");



}
  