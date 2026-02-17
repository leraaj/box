import { createContext, useContext, useState, useEffect, useRef } from "react";

const AuthContext = createContext(null);

const AUTH_COOKIE = "otp_auth";
const USER_COOKIE = "otp_user";

function setCookie(name, value, hours) {
  const expires = new Date(Date.now() + hours * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${expires}; path=/`;
}

function getCookie(name) {
  const v = document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="))
    ?.split("=")[1];

  return v ? decodeURIComponent(v) : null;
}

function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loggedInUser, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const logoutTimerRef = useRef(null);

  // --- Helper: start or reset sliding logout timer ---
  const startLogoutTimer = () => {
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);

    // logout after 1 hour
    logoutTimerRef.current = setTimeout(() => {
      logout();
    }, 60 * 60 * 1000); // 3600000 ms
  };

  // --- Logout ---
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    deleteCookie(AUTH_COOKIE);
    deleteCookie(USER_COOKIE);

    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
  };

  // --- Login with code ---
  const loginWithCode = async (code) => {
    if (!/^\d{6}$/.test(code)) return false;

    const URI = import.meta.env.VITE_API_URL;

    try {
      const res = await fetch(`${URI}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      if (!res.ok) return false;
      const data = await res.json();
      if (!data.user) return false;

      setIsAuthenticated(true);
      setUser(data.user);

      // set cookie for 30 seconds
      setCookie(AUTH_COOKIE, "true", 1); // 1 hour
      setCookie(USER_COOKIE, loggedInUser, 1);

      // start sliding logout timer
      startLogoutTimer();

      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // --- Restore from cookie on page refresh ---
  useEffect(() => {
    const auth = getCookie(AUTH_COOKIE);
    const user = getCookie(USER_COOKIE);

    if (auth === "true" && user) {
      setIsAuthenticated(true);
      setUser(user);
      startLogoutTimer();
    }

    setIsReady(true);
  }, []);

  // --- Reset timer on user activity (click, keypress) ---
  useEffect(() => {
    if (!isAuthenticated) return;

    const resetTimer = () => {
      startLogoutTimer();
      // also extend cookie for another 30s
      setCookie(AUTH_COOKIE, "true", 0.0083333);
      setCookie(USER_COOKIE, loggedInUser, 0.0083333);
    };

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);

    return () => {
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
    };
  }, [isAuthenticated, loggedInUser]);

  if (!isReady) return null;

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        loggedInUser,
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
