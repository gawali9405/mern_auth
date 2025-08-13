import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// Configure axios to include credentials with all requests
axios.defaults.withCredentials = true;

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [backend_url] = useState(
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem("user")) || null
  );

  const updateUser = (userData) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      localStorage.removeItem("user");
    }
  };

  const fetchUser = async (endpoint) => {
    try {
      setIsLoading(true);
      const method = endpoint === "/api/auth/is-auth" ? "post" : "get";
      const response = await axios({
        method,
        url: `${backend_url}${endpoint}`,
        withCredentials: true,
        data: endpoint === "/api/auth/is-auth" ? {} : undefined,
      });

      // Handle the response from is-auth endpoint
      if (endpoint === "/api/auth/is-auth") {
        if (response.data.user) {
          updateUser(response.data.user);
        }
      } else if (response.data.user) {
        updateUser(response.data.user);
      }

      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Something went wrong";
      if (endpoint !== "/api/auth/is-auth") {
        setError(errorMsg);
        toast.error(errorMsg);
      }
      console.error(errorMsg);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getAuthState = async () => {
    try {
      await fetchUser("/api/auth/is-auth");
    } catch (error) {
      // If there's an auth error, clear the user state
      if (error.response?.status === 401) {
        updateUser(null);
      }
    }
  };

  const getUserData = async () => {
    try {
      // Use the is-auth endpoint which already returns the complete user data
      const response = await fetchUser("/api/auth/is-auth");
      if (response?.user) {
        // Update the user state with the complete user data
        setUser(response.user);
      }
      return response;
    } catch (error) {
      console.error('Error fetching user data:', error);
      // If there's an error, clear the user to force re-authentication
      if (error.response?.status === 401) {
        setUser(null);
      }
      throw error;
    }
  };

  useEffect(() => {
    // Only check auth state if we don't have a user yet
    if (!user) {
      getAuthState();
    }
  }, []);

  const value = {
    backend_url,
    isLoading,
    setIsLoading,
    error,
    setError,
    user,
    setUser: updateUser,
    getUserData,
    getAuthState,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
