// user roles and their access permissions with this menu
/**
 * Role customer can access:
 * - Document Request list
 * - Document Request test
 * - Profile
 * - Settings
 */

/**
 * Role technician/lab_admin can access:
 * - Prepare(list) Document Request
 * - Entry lab results
 * - Approve Document Request
 * - Profile
 * - Settings
 */

/**
 * Role doctor/aproval can access:
 * - Prepare(list) Document Request
 * - Entry lab results
 * - Approve Document Request
 * - Profile
 * - Settings
 */

/**
 * Role lab admin can access:
 * - Prepare(list) Document Request
 * - Entry lab results
 * - Approve Document Request
 * - Manage lab users
 * - Manage lab settings
 * - Manage lab documents
 * - Manage lab notifications
 * - Manage lab reports
 * - Profile
 * - Settings
 */

import React from "react";
import { Link, useLocation } from "react-router";
import { useUser } from "@/context/user-context";
import { useTheme } from "@/context/theme-provider";
import { rolesPermissions } from "@/libs/rolesPermissions";
import { menuRoutes } from "@/libs/menuRoutes";
import classNames from "classnames";

const Sidebar: React.FC = () => {
  const { user } = useUser();
  const { theme, setTheme } = useTheme();
  const location = useLocation();

  const userRole = user?.role || "CUSTOMER";
  const permissions = rolesPermissions[userRole] || [];

  const isActive = (path: string) => location.pathname === path;

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <aside
      className={classNames(
        "h-full w-64 flex flex-col transition-colors",
        theme === "dark"
          ? "bg-gray-900 text-white border-r border-gray-800"
          : "bg-gray-100 text-black border-r border-gray-200",
      )}
    >
      <div
        className={classNames(
          "p-4 border-b",
          theme === "dark" ? "border-gray-800" : "border-gray-200",
        )}
      >
        <h2 className="text-lg font-bold">Sidebar</h2>
        <button
          onClick={toggleTheme}
          className={classNames(
            "mt-2 px-4 py-2 rounded transition-colors",
            theme === "dark"
              ? "bg-blue-600 text-white hover:bg-blue-500"
              : "bg-blue-500 text-white hover:bg-blue-600",
          )}
        >
          Switch to {theme === "dark" ? "Light" : "Dark"} Mode
        </button>
      </div>
      <nav className="flex-1 p-4">
        <ul>
          {permissions.map((permission: string) => (
            <li key={permission}>
              <Link
                to={menuRoutes[permission] || "/"}
                className={classNames(
                  "block px-4 py-2 rounded hover:bg-blue-500 hover:text-white transition-colors",
                  isActive(menuRoutes[permission] || "/")
                    ? "bg-blue-500 text-white"
                    : "",
                )}
              >
                {permission}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div
        className={classNames(
          "p-4 border-t",
          theme === "dark" ? "border-gray-800" : "border-gray-200",
        )}
      >
        <button
          onClick={() => {
            // Handle logout functionality
            console.log("Logging out...");
          }}
          className={classNames(
            "px-4 py-2 rounded transition-colors",
            theme === "dark"
              ? "bg-red-600 text-white hover:bg-red-500"
              : "bg-red-500 text-white hover:bg-red-600",
          )}
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
