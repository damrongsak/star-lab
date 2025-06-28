// --- app/components/sidebar.tsx ---
// Sidebar component, providing role-based navigation.
import React, { useEffect, useRef } from "react";
import { NavLink } from "react-router";

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isSidebarOpen,
  setIsSidebarOpen,
}) => {
  const sidebarRef = useRef<HTMLElement>(null); // Ref for sidebar element

  const navItems = [
    { to: "/dashboard", icon: "📊", label: "Dashboard" },
    { to: "/document-requests", icon: "📄", label: "Document Requests" },
    { to: "/test-requests", icon: "🧪", label: "Test Requests" },
    { to: "/invoices", icon: "🧾", label: "Invoices" },
    { to: "/customers", icon: "👥", label: "Customers" },
  ];

  const bottomNavItems = [{ to: "/settings", icon: "⚙️", label: "Settings" }];

  useEffect(() => {
    // Close sidebar if clicked outside when in mobile view
    const handleClickOutside = (event: MouseEvent) => {
      if (
        window.innerWidth < 640 && // Only for mobile viewports
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        isSidebarOpen // Only if sidebar is actually open
      ) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen, setIsSidebarOpen]);

  return (
    <>
      <aside
        ref={sidebarRef}
        className={`w-64 py-4 overflow-y-auto flex-shrink-0 flex-col bg-light-bg-main dark:bg-dark-bg-secondary transition-transform duration-300 ease-in-out z-30 fixed sm:relative h-full ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
      >
        <nav className="px-4 flex flex-col justify-between h-full pb-4">
          <div>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2.5 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? "bg-sky-600 text-white"
                      : "text-light-text-secondary dark:text-dark-text-secondary hover:bg-slate-100 dark:hover:bg-dark-bg-main hover:text-light-text-main dark:hover:text-dark-text-main"
                  }`
                }
                onClick={() => {
                  if (window.innerWidth < 640) setIsSidebarOpen(false);
                }}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </div>
          <div className="mt-auto border-t border-gray-200">
            <div className="my-4"></div>
            {bottomNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2.5 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? "bg-sky-600 text-white"
                      : "text-light-text-secondary dark:text-dark-text-secondary hover:bg-slate-100 dark:hover:bg-dark-bg-main hover:text-light-text-main dark:hover:text-dark-text-main"
                  }`
                }
                onClick={() => {
                  if (window.innerWidth < 640) setIsSidebarOpen(false);
                }}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>
      </aside>
      {isSidebarOpen && (
        <div
          className="w-64 inset-0 bg-local-bg-main dark:bg-dark-bg-secondary z-20 sm:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </>
  );
};

export { Sidebar };
