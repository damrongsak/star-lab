import React from "react";
import { NavLink } from "react-router";
import { FaUserCircle, FaFlask } from "react-icons/fa"; // Import user icon
import { UserDropdown } from "./user-dropdown";

interface UserData {
  id: number;
  username: string;
  name: string;
  email: string;
  role: string;
}

// Navbar props
interface NavbarProps {
  data?: UserData;
}

export default function Navbar({ data }: NavbarProps) {
  const handleLogout = () => {
    // Implement your logout logic here
    console.log("Logout clicked");
  };

  return (
    <header className="w-full px-8 text-gray-700 bg-white border-r border-gray-200 shadow-md">
      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between py-5">
        <div className="flex flex-col lg:flex-row items-center w-full lg:justify-start">
          <NavLink to="/" className="flex items-center mb-5 lg:mb-0">
            <FaFlask className="text-3xl text-indigo-600" />
            <div className="flex flex-col">
              <span className="text-xl font-black text-gray-900 select-none">
                Star
                <span className="text-indigo-600">Lab</span>
              </span>
              <span className="text-sm text-gray-500">Your goal our goal</span>
            </div>
          </NavLink>
          <nav className="flex flex-wrap items-center ml-0 lg:ml-8 lg:border-l lg:pl-8 flex-grow">
            <NavLink
              to="/"
              end
              className="mr-5 font-medium text-gray-600 hover:text-gray-900"
            >
              Home
            </NavLink>
            <NavLink
              to="/company"
              className="mr-5 font-medium text-gray-600 hover:text-gray-900"
            >
              Company
            </NavLink>
            <NavLink
              to="/about"
              className="mr-5 font-medium text-gray-600 hover:text-gray-900"
            >
              About
            </NavLink>
          </nav>
        </div>
        <div className="flex items-center">
          {data && <UserDropdown onLogout={handleLogout} data={data} />}
        </div>
      </div>
    </header>
  );
}
