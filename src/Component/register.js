"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../context/UserContext";

export default function AuthForm({
  mode = "login",
  onAuthSuccess,
  setIsLoggedIn,
  setActiveView,
  onClearMessage,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // Default role is "user"
  const [message, setMessage] = useState("");
  const [passwordError, setPasswordError] = useState(""); // For password validation error messages
  const { setUserId } = useUser(); // Get setUserId from context
  const [userslist, setUsersList] = useState([]);

  const router = useRouter();

  // Password validation regex
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const getUserIdByEmail = (email) => {
    const user = userslist.find((user) => user.Email === email);
    return user ? user.id : null;
  };

  // Fetch list of users on mount to keep userslist up to date
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/auth/register");
      const result = await response.json();
      
      setUsersList(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Validate password
  const validatePassword = (password) => {
    const url = mode === "login" ? "/api/auth/login/" : "/api/auth/register";

    if (!passwordRegex.test(password) && url === "/api/auth/register") {
      setPasswordError(
        "Password must be at least 8 characters, include uppercase, lowercase, number, and special character."
      );
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the password before submission
    if (!validatePassword(password)) {
      return;
    }
    const url = mode === "login" ? "/api/auth/login/" : "/api/auth/register";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }), // Include role in the body
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(
          `Success! ${mode === "login" ? "Logged in" : "Registered"} successfully.`
        );

        if (mode === "login") {
          localStorage.setItem("token", data.token);
          const userId = getUserIdByEmail(email);
          setUserId(userId);
          localStorage.setItem("userid", userId);
          setIsLoggedIn(true);
          setActiveView("Products");
        } else {
          
          fetchUsers();
        }
      } else if (response.status === 401) {
        setMessage(data.message || "Email or Password is incorrect");
      } else {
        setMessage(data.message || "Email already exists");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again." + error);
    }
  };


  
  return (
    <div className="flex items-center justify-center min-h-[400px] bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          {mode === "login" ? "Login to Your Account" : "Create an Account"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-start">
            <label className="block text-gray-600 mb-1">Email:</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black "
              placeholder="Enter your Email"
            />
          </div>
          <div className="text-start">
            <label className="block text-gray-600 mb-1">Password:</label>
            <input
            
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                validatePassword(e.target.value);
              }}
              required
              className={`w-full px-4 py-2 border text-black ${
                passwordError ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 ${
                passwordError ? "focus:ring-red-500" : "focus:ring-blue-500"
              }`}
              placeholder="Enter your password"
            />
            {passwordError && (
              <p className="text-red-500 text-sm mt-2">{passwordError}</p>
            )}
          </div>
          {mode === "register" && (
            <div className="text-start">
              <label className="block text-gray-600 mb-1 text-black">Role:</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-300"
            disabled={!!passwordError} // Disable button if there's an error
          >
            {mode === "login" ? "Login" : "Sign Up"}
          </button>
        </form>
        {message && (
          <p
            className={`mt-4 text-center ${
              message.includes("Success") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
