import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

export interface UserProfile {
  id: string;
  email: string;
  role:
    | "ADMIN"
    | "LAB_ADMIN"
    | "CUSTOMER"
    | "TECHNICIAN"
    | "DOCTOR"
  | "APPROVAL"
  | "GUEST"
    | null;
}

export type UserContextType = {
  user: UserProfile | null;
  login: (user: UserProfile) => void;
  logout: () => void;
  setUser: (user: UserProfile | null) => void;
};

export const UserContext = createContext<UserContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  setUser: () => {},
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);

  const login = (user: UserProfile) => setUser(user);
  const logout = () => setUser(null);

  return (
    <UserContext.Provider value={{ user, login, logout, setUser }}>
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
