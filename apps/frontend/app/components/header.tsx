// app/components/header.tsx
// This component represents the top navigation bar of the application.
// It includes the site logo, public navigation links, authentication status,
// user profile dropdown, and a theme toggle.

import React from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { useUser } from "../context/user-context";
import { ThemeToggle } from "./theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LogOut, Settings, UserCircle2 } from "lucide-react";
import { useToast } from "./ui/use-toast";

export default function Header() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Handle user sign out (mock implementation)
  const handleSignOut = () => {
    localStorage.removeItem("mockUser"); // Clear mock user from localStorage
    setUser(null); // Clear user from context
    navigate("/signin"); // Redirect to sign-in page
    toast({
      title: "Signed Out",
      description: "You have been successfully signed out.",
      variant: "default",
    });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background shadow-sm">
      <div className="container flex h-16 items-center justify-between py-4">
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-bold text-2xl tracking-tight text-primary">
            StarLab
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors hover:text-primary ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors hover:text-primary ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`
            }
          >
            About Us
          </NavLink>
          <NavLink
            to="/products"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors hover:text-primary ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`
            }
          >
            Products
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors hover:text-primary ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`
            }
          >
            Contact
          </NavLink>
          <NavLink
            to="/blog"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors hover:text-primary ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`
            }
          >
            Blog
          </NavLink>
        </nav>

        <div className="flex items-center space-x-4">
          {user && user.id ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full"
                  onClick={(e) => {
                    e.preventDefault();
                    const menu = document.querySelector(
                      ".dropdown-menu-content",
                    );
                    if (menu) {
                      menu.classList.toggle("hidden");
                    }
                  }}
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={`https://placehold.co/100x100/A0B9C9/000000?text=${user.email
                        .charAt(0)
                        .toUpperCase()}`}
                      alt="User Avatar"
                    />
                    <AvatarFallback>
                      <UserCircle2 className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 hidden dropdown-menu-content"
                align="end"
                forceMount
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.email}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      Role: {user.role?.toLowerCase().replace("_", " ")}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground break-all">
                      ID: {user.id}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/lab/profile")}>
                  <Settings className="mr-2 h-4 w-4" />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild>
              <Link to="/signin">Sign In</Link>
            </Button>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
