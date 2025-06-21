// app/context/user-context.tsx
// This context provider manages the global user authentication state and user profile/role.
// It allows components throughout the application to access the current user's information.

import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface UserProfile {
  id: string;
  email: string;
  role:
    | "ADMIN"
    | "LAB_ADMIN"
    | "CUSTOMER"
    | "TECHNICIAN"
    | "DOCTOR"
    | "APPROVAL"
    | null;
}

interface UserContextType {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
