/* eslint-disable prettier/prettier */
import React, { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  exp?: number; // expiry timestamp (seconds since epoch)
}

interface AuthContextType {
  isLoggedIn: boolean;
  login: (token: string) => void;
  logout: () => void;
  getToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const validateToken = (token: string): boolean => {
    try {
      const decoded = jwtDecode<JwtPayload>(token);

      if (!decoded.exp) return false; // no expiry claim, consider invalid

      const expiryTime = decoded.exp * 1000; // convert to ms

      if (Date.now() >= expiryTime) return false; // token expired

      return true; // valid token
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // decoding failed - invalid token
      return false;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token && validateToken(token)) {
      setIsLoggedIn(true);
    } else {
      localStorage.removeItem("token"); // remove invalid or expired token
      setIsLoggedIn(false);
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  const getToken = () => localStorage.getItem("token");

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);

  if (!ctx) throw new Error("useAuth must be used within AuthProvider");

  return ctx;
};
