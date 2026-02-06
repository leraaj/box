import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const AUTH_COOKIE = "otp_auth";

function setCookie(name, value, hours) {
  const expires = new Date(Date.now() + hours * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}

function getCookie(name) {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="))
    ?.split("=")[1];
}

function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export function AuthProvider({ children }) {
  const pass = import.meta.env.VITE_PASS;

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isReady, setIsReady] = useState(false); // avoids flicker on refresh

  // ✅ check cookie on every full refresh
  useEffect(() => {
    const v = getCookie(AUTH_COOKIE);
    setIsAuthenticated(v === "true");
    setIsReady(true);
  }, []);

  const loginWithCode = (code) => {
    if (!/^\d{6}$/.test(code)) return false;

    if (code === pass) {
      setIsAuthenticated(true);

      // ✅ 6 hours expiry
      setCookie(AUTH_COOKIE, "true", 6);

      return true;
    }

    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    deleteCookie(AUTH_COOKIE);
  };

  // avoid rendering routes before cookie check finishes
  if (!isReady) return null;

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        loginWithCode,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
