// --- app/components/user-menu.tsx ---
// User profile dropdown menu.
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Avatar } from "~/components/ui/avatar"; // Using Avatar component
import { DropdownMenu } from "~/components/ui/dropdown-menu"; // Using DropdownMenu component
import { useUser } from "~/context/user-context"; // Import useUser context

const UserMenu: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { logout } = useUser(); // Get logout function from context
  const { user } = useUser(); // Get user data from context

  const handleLogout = () => {
    logout(); // Call logout from context
    console.log("User logged out");
    setIsOpen(false);
    navigate("/"); // Redirect to sign-in page after logout
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 focus:outline-none"
      >
        <Avatar
          src={`https://placehold.co/100x100/007BFF/FFFFFF?text=${user?.email?.substring(0, 2).toUpperCase() || "GU"}`}
          alt="User avatar"
        />
        <div className="hidden md:block text-sm text-left">
          <div className="font-semibold text-light-text-main dark:text-dark-text-main">
        {user?.role?.toUpperCase() || "GUEST USER"}
          </div>
          <div className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
        {user?.email || "NOT LOGGED IN"}
          </div>
        </div>
      </button>
      <DropdownMenu isOpen={isOpen} ref={menuRef} position="right">
        <Link
          to="/profile"
          className="block px-4 py-2 text-sm text-light-text-secondary dark:text-dark-text-secondary hover:bg-slate-100 dark:hover:bg-dark-bg-main dark:hover:text-dark-text-main"
          onClick={() => setIsOpen(false)}
        >
          Profile
        </Link>
        <Link
          to="/settings"
          className="block px-4 py-2 text-sm text-light-text-secondary dark:text-dark-text-secondary hover:bg-slate-100 dark:hover:bg-dark-bg-main dark:hover:text-dark-text-main"
          onClick={() => setIsOpen(false)}
        >
          Settings
        </Link>
        <div className="border-t border-light-border dark:border-dark-border my-1"></div>
        <button
          onClick={handleLogout}
          className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-slate-100 dark:hover:bg-dark-bg-main"
        >
          Logout
        </button>
      </DropdownMenu>
    </div>
  );
};

export { UserMenu };
