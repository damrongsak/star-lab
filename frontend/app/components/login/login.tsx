import React, { useState } from "react";
import dotenv from "dotenv";
import { zip } from "../../utils/compression";

dotenv.config();

const REACT_APP_API_URL = process.env.REACT_APP_API_URL as string;
const ZIP_PASSWORD = process.env.ZIP_PASSWORD as string;

interface LoginProps {
  // Add any props you expect from the parent component
}

interface UserData {
  id: number;
  username: string;
  name: string;
  email: string;
  role: string;
}

export function Login({}: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [stayLoggedIn, setStayLoggedIn] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError(""); // Clear any previous errors

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      // Compress payload
      const compressedPayload = zip(
        JSON.stringify({ email, password, stayLoggedIn }),
        ZIP_PASSWORD
      );
      const response = await fetch(`${REACT_APP_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-payload-compressed": "true",
        },
        body: JSON.stringify({ compressedPayload }),
      });

      if (response.ok) {
        const userData: UserData = await response.json();
        // Assuming you have a global state management (e.g., Redux, Context API)
        // Set user data in global state here
        console.log("User data:", userData);
        // Redirect or perform further actions
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Login failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-semibold text-blue-600 mb-4">LOG IN</h2>
        <p className="text-gray-600 mb-6">
          Enter your email and password to login
        </p>

        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <div className="relative">
            <input
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="      Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {!email && (
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <div className="relative">
            <input
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="      Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {!password && (
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center mb-6">
          <input
            id="stay-logged-in"
            type="checkbox"
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            checked={stayLoggedIn}
            onChange={(e) => setStayLoggedIn(e.target.checked)}
          />
          <label
            htmlFor="stay-logged-in"
            className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Stay logged in
          </label>
        </div>

        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full mb-4 focus:outline-none focus:shadow-outline"
          onClick={handleLogin}
        >
          Log in
        </button>

        <div className="text-center mb-4">
          <a href="#" className="text-sm text-blue-600 hover:underline">
            I forgot my password? Click Here
          </a>
        </div>

        <div className="text-center text-gray-500 mb-4">OR</div>

        <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded w-full focus:outline-none focus:shadow-outline">
          Register
        </button>
      </div>
    </div>
  );
}
