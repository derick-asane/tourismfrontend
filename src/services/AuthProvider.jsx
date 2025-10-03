import React, { useState, createContext, useContext, useEffect } from "react";
import axios from "axios";

// --- 1. Create the Auth Context ---
const AuthContext = createContext({
  user: null,
  login: async () => ({ success: false, error: "Not implemented" }),
  logout: async () => {},
  loading: true,
});

// --- 2. Create the Auth Provider Component ---
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore user from sessionStorage on mount
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (userData) => {
    try {
      // Replace with your actual API endpoint
      const response = await axios.post("http://localhost:3000/users/login", {
        email: userData.email,
        password: userData.password,
      });

      if (response.data.status) {
        setUser(response.data.user);
        sessionStorage.setItem("user", JSON.stringify(response.data.user));

        if (response.data.site) {
          sessionStorage.setItem("site", JSON.stringify(response.data.site));
        }
        console.log("Login successful in provide:", response.data.user);
        return {
          success: true,
          error: response.data.message,
          user: response.data.user,
        };
      } else {
        return { success: false, error: response.data.message };
      }
    } catch (error) {
      console.error("Login failed:", error);
      return {
        success: false,
        error:
          error.response?.data?.message || "Login failed. Please try again.",
      };
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      sessionStorage.removeItem("user");

      // Optionally, notify your backend about the logout
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      sessionStorage.removeItem("user");
    }
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// --- 3. Create a custom hook to use the Auth Context ---
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
