import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Card } from "~/components/ui/card";
import { useUser } from "~/context/user-context";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useUser();

  async function loginApi(email: string, password: string) {
    const backendApiUrl =
      import.meta.env.VITE_BACKEND_API_URL || "http://localhost:5001/api/v1";
    const response = await fetch(`${backendApiUrl}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      throw new Error("Invalid email or password");
    }
    return response.json();
  }

  /**
   * Handles the login process when the form is submitted.
   *
   * @param e - The form submission event.
   *
   * Steps:
   * 1. Prevents the default form submission behavior to avoid page reload.
   * 2. Clears any previous error messages.
   * 3. Attempts to log in the user using the provided email and password:
   *    - Calls the `loginApi` function to authenticate the user and retrieve the token and user data.
   *    - Updates the user context with the authenticated user using the `login` function from `useUser`.
   *    - Optionally stores the authentication token in `localStorage` for persistence.
   *    - Navigates the user to the `/dashboard` route upon successful login.
   * 4. Catches any errors during the login process:
   *    - Sets the error message to display to the user, defaulting to 'Login failed' if no specific error message is provided.
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const { token, user } = await loginApi(email, password);
      login(user); // from useUser()
      localStorage.setItem("token", token); // store token if needed
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary">
      <Card className="w-full max-w-sm p-8 flex flex-col items-center">
        <h2 className="text-4xl font-bold mb-6 text-blue-800">LOG IN</h2>
        <p className="text-sm text-secondary mb-6">
          Please enter your email and password to login.
        </p>
        {error && (
          <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 p-3 rounded-md mb-4 w-full text-center">
            {error}
          </div>
        )}
        <form onSubmit={handleLogin} className="w-full">
          <div className="mb-4">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@starlabs.dev or customer@example.com"
                required
                className="pl-10"
              />
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 48 48"
                >
                  <rect width="48" height="48" fill="none" />
                  <path
                    fill="currentColor"
                    d="M24 4c-5.523 0-10 4.477-10 10s4.477 10 10 10s10-4.477 10-10S29.523 4 24 4M12.25 28A4.25 4.25 0 0 0 8 32.249V33c0 3.755 1.942 6.567 4.92 8.38C15.85 43.163 19.786 44 24 44c3.716 0 7.216-.65 10-2.027v-7.489A9 9 0 0 1 30.055 28zm19.82 0A7 7 0 1 1 41 33.71V34l2.293 2.293a1 1 0 0 1 0 1.414L41 40l2.322 2.322a1 1 0 0 1 .03 1.384l-3.646 3.968a1 1 0 0 1-1.444.03l-1.97-1.969a1 1 0 0 1-.292-.707V33.326A7.01 7.01 0 0 1 32.07 28M41 26a2 2 0 1 0-4 0a2 2 0 0 0 4 0"
                    stroke-width="0.5"
                    stroke="currentColor"
                  />
                </svg>
              </span>
            </div>
          </div>
          <div className="mb-6">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
                required
                className="pl-10"
              />
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <rect width="24" height="24" fill="none" />
                  <path
                    fill="#717171"
                    d="M9 7a3 3 0 1 1 6 0v2h2V7A5 5 0 0 0 7 7v2h2zm3 11a1 1 0 0 1-1-1v-3a1 1 0 1 1 2 0v3a1 1 0 0 1-1 1"
                    opacity="0.5"
                    stroke-width="1.5"
                    stroke="#717171"
                  />
                  <path
                    fill="#717171"
                    d="M17 9H7a3 3 0 0 0-3 3v7a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-7a3 3 0 0 0-3-3m-4 8a1 1 0 0 1-2 0v-3a1 1 0 1 1 2 0z"
                    stroke-width="1.5"
                    stroke="#717171"
                  />
                </svg>
              </span>
            </div>
          </div>
          <Button type="submit" className="w-full accent text-white">
            Sign In
          </Button>
        </form>
        <p className="mt-4 text-sm text-secondary">
          Try with: admin@starlabs.dev / password OR customer@example.com /
          password
        </p>
        <p className="mt-4 text-sm text-secondary text-center">
          Forgot your password?{" "}
          <Link className="text-blue-600 hover:underline" to="/forgot-password">
            Click here
          </Link>
        </p>
        <p className="mt-2 text-sm text-secondary text-center">
          Don't have an account?{" "}
          <Link className="text-blue-600 hover:underline" to="/signup">
            Sign Up
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default Login;
