import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Card } from "~/components/ui/card";
import { useUser } from "~/context/user-context";

const SignIn: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useUser();

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (email === "admin@starlabs.dev" && password === "password") {
      const mockUser = {
        id: "admin-123",
        email: "admin@starlabs.dev",
        role: "ADMIN" as "ADMIN",
      };
      login(mockUser);
      navigate("/dashboard");
    } else if (email === "customer@example.com" && password === "password") {
      const mockUser = {
        id: "customer-456",
        email: "customer@example.com",
        role: "CUSTOMER" as "CUSTOMER",
      };
      login(mockUser);
      navigate("/dashboard");
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary">
      <Card className="w-full max-w-sm p-8 flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-6" /* text color from body */>
          Sign In to Star-Labs
        </h2>
        {error && (
          <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 p-3 rounded-md mb-4 w-full text-center">
            {error}
          </div>
        )}
        <form onSubmit={handleSignIn} className="w-full">
          <div className="mb-4">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@starlabs.dev or customer@example.com"
              required
            />
          </div>
          <div className="mb-6">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
              required
            />
          </div>
          <Button type="submit" className="w-full accent text-white">
            Sign In
          </Button>
        </form>
        <p className="mt-4 text-sm text-secondary">
          Try with: admin@starlabs.dev / password OR customer@example.com /
          password
        </p>
      </Card>
    </div>
  );
};

export default SignIn;
