import React from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router";
import ThemeToggle from "~/components/theme-toggle";
import { UserMenu } from "~/components/user-menu";
import { Button } from "~/components/ui/button";
import { useUser } from "~/context/user-context";

interface HeaderProps {
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ setIsSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();

  const handleSignIn = () => {
    navigate("/signin");
  };

  const isSignInPage = location.pathname === "/signin";

  if (isSignInPage) {
    return (
      <header className="border-b border-custom w-full">
        <div className="px-4 py-3 flex items-center justify-between">
          <Link
            to="/"
            className="w-64 text-2xl font-bold text-blue-800 hover:text-blue-900 dark:text-blue-800 dark:hover:text-blue-900"
          >
            Star-Labs
          </Link>
          <ThemeToggle />
        </div>
      </header>
    );
  }

  return (
      <header className="border-b border-custom border-gray-200 w-full">
          <div className="flex items-center justify-between px-4 py-3">
              {/* Left: Logo and sidebar toggle */}
              <div className="flex items-center space-x-4">
                  {user && user.role !== 'GUEST' && (
                      <button
                          className="block sm:hidden text-gray-500 focus:outline-none"
                          onClick={() => setIsSidebarOpen(true)}
                      >
                          <span className="text-2xl">☰</span>
                      </button>
                  )}
                  <NavLink
                      to="/"
                      className="text-2xl font-bold text-blue-800 hover:text-blue-900 dark:text-blue-800 dark:hover:text-blue-900 text-ellipsis whitespace-nowrap"
                  >
                      Star-Labs
                  </NavLink>
              </div>
              {/* Right: Nav links, theme toggle, user menu/sign-in */}
              <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
                  <Link
                      to="/about"
                      className="public-nav-link text-light-text-secondary dark:text-dark-text-secondary hover:text-brand-blue dark:hover:text-brand-link"
                  >
                      About
                  </Link>
                  <Link
                      to="/products"
                      className="public-nav-link text-light-text-secondary dark:text-dark-text-secondary hover:text-brand-blue dark:hover:text-brand-link"
                  >
                      Projects
                  </Link>
                  <Link
                      to="/contact"
                      className="public-nav-link text-light-text-secondary dark:text-dark-text-secondary hover:text-brand-blue dark:hover:text-brand-link"
                  >
                      Contact
                  </Link>
                  <Link
                      to="/blog"
                      className="public-nav-link text-light-text-secondary dark:text-dark-text-secondary hover:text-brand-blue dark:hover:text-brand-link"
                  >
                      Blog
                  </Link>
                  <ThemeToggle />
                  {user && user.role !== 'GUEST' ? (
                      <UserMenu />
                  ) : (
                      <Link
                          to="/login"
                          className="flex items-center space-x-2 px-4 py-2 rounded-md bg-transparent text-blue-800 font-medium transition-colors hover:text-blue-900 dark:hover:text-blue-700"
                      >
                          <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                          >
                              <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M15 12H3m12 0l-4-4m4 4l-4 4m6-12v16"
                              />
                          </svg>
                          <span>Login</span>
                      </Link>
                  )}
              </div>
          </div>
      </header>
  );
};

export { Header };
