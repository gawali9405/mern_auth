import React, { createContext, useState } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [backend_url] = useState(import.meta.env.VITE_BACKEND_URL);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  return (
    <AppContext.Provider
      value={{
        backend_url,
        isLoading,
        setIsLoading,
        error,
        setError,
        user,
        setUser
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
