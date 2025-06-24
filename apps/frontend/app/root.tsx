// --- app/root.tsx ---
// Root React component, sets up providers, global layout, and error boundary.
import React, { useState, useEffect, useMemo as reactUseMemo } from "react";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "react-router"; // Use react-router-dom for DOM-specific hooks/components

import { ThemeProvider, useTheme } from "./context/theme-provider";
import "./app.css"; // Ensure global styles are imported
import { UserProvider, useUser } from "./context/user-context";
import { Toaster } from "./components/ui/toaster";
import { Header } from "./components/header";
import { Sidebar } from "./components/sidebar";
import Footer from "./components/footer";
import { ToastProvider, useToast } from "./components/ui/use-toast";
import { getUserProfile } from "~/libs/utils"; // Import from utils

// Layout component wraps the entire HTML document structure.
// This is typically rendered by the server (in SSR) or forms the base HTML.
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

// AppContent handles the main application layout and conditional rendering based on auth/route.
// This component will be rendered inside the `Layout`'s children prop.
function AppContent() {
    const { theme } = useTheme();
    // Retrieve user profile from local storage or default to guest
    const userProfile = reactUseMemo(() => getUserProfile(), []);
    const { setUser } = useUser();
    const { toast } = useToast();
    const location = useLocation(); // Hook to get current URL information

    // show user profile
    console.log('User Profile:', userProfile);

    // State for mobile sidebar visibility
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Set user profile in context on initial load
    useEffect(() => {
        setUser(userProfile);
        // Optionally show a toast for guests or users on first visit
        if (!userProfile.id || userProfile.id === 'guest') {
            toast({
                title: 'Welcome!',
                description: 'You are browsing as a guest.',
            });
        }
    }, [userProfile, setUser, toast]); // Dependencies ensure effect runs only when necessary

    // Determine if the sidebar should be rendered based on path and user role.
    // Routes starting with '/lab' are considered "lab routes" and will show the sidebar.
    // The login route does not use the main layout or sidebar.
    const isLabRoute = userProfile.role && location.pathname !== '/login';
    const isLoginPage = location.pathname === '/login';

    // If it's the sign-in page, render only the Outlet.
    // The Router will match the /login route directly to login.tsx.
    if (isLoginPage) {
        return <Outlet />;
    }

    // Render the main application layout for all other routes
    return (
        <div className={theme}>
            <Header setIsSidebarOpen={setIsSidebarOpen} />
            <div className="flex flex-1 overflow-auto max-h-full border-r border-gray-200 dark:border-gray-700">
                {/* Render Sidebar only if it's a lab route and user is implicitly authenticated (not guest) */}
                {isLabRoute && (
                    <Sidebar
                        isSidebarOpen={isSidebarOpen}
                        setIsSidebarOpen={setIsSidebarOpen}
                    />
                )}
                <main className="flex-1 overflow-auto p-4 md:p-6 max-h-full">
                    <Outlet />
                    {/* This is where the matched child route component will be rendered */}
                </main>
            </div>
            <Footer />
            <Toaster /> {/* Toaster component for displaying notifications */}
        </div>
    );
}

// Default export for the Root component, which is wrapped by `Layout`.
// This component aggregates all necessary providers and renders the main AppContent.
export default function Root() {
  return (
    // All providers wrapped here to ensure their contexts are available throughout the app
    <ToastProvider>
      <ThemeProvider>
        <UserProvider>
          {/* AppContent renders the actual UI within the HTML layout */}
          <AppContent />
        </UserProvider>
      </ThemeProvider>
    </ToastProvider>
  );
}

// ErrorBoundary for top-level errors.
// This catches errors that bubble up from child components or loaders/actions.
export function ErrorBoundary({ error }: { error: any }) {
  // Using `any` for `error` type for broad compatibility without @react-router/dev types directly
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  // Use `isRouteErrorResponse` from `react-router-dom` to check for specific HTTP errors
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    // In development mode, display more detailed error information
    details = error.message;
    stack = error.stack;
  }

  // Render a full HTML page for the error, maintaining basic styling
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{message}</title>
        <Meta />
        <Links />
        <style>{`
          body { font-family: 'Sarabun', sans-serif; background-color: #0A0A0A; color: #E0E0E0; margin: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
          main { background-color: #1A1A1A; padding: 24px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 800px; width: 90%; text-align: center; }
          h1 { font-size: 2.5rem; font-weight: bold; margin-bottom: 16px; color: #FF0000; }
          p { font-size: 1rem; color: #A0A0A0; margin-bottom: 24px; }
          pre { background-color: #000; color: #0f0; padding: 16px; border-radius: 4px; overflow-x: auto; text-align: left; }
          code { font-family: monospace; }
        `}</style>
      </head>
      <body>
        <main className="pt-16 p-4 container mx-auto">
          <h1>{message}</h1>
          <p>{details}</p>
          {stack && (
            <pre className="w-full p-4 overflow-x-auto">
              <code>{stack}</code>
            </pre>
          )}
        </main>
        <Scripts />
      </body>
    </html>
  );
}
