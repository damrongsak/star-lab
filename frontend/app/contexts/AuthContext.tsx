import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface AuthContextProps {
  user: User | null;
  token: string | null;
  login: (user: User, token: string, stayLoggedIn: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
  }, []);

  const login = (user: User, token: string, stayLoggedIn: boolean) => {
    setUser(user);
    setToken(token);
    if (stayLoggedIn) {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
    } else {
      sessionStorage.setItem("user", JSON.stringify(user));
      sessionStorage.setItem("token", token);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.clear();
    sessionStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
