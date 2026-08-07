"use client";
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

export interface User {
  id: number;
  username: string;
  role: string;
  expiresAt: string | null;
  profilePic: string | null;
  createdAt: string;
}

export interface Background {
  url: string | null;
  type: "image" | "video";
  updatedAt?: string | null;
}

interface AppContextType {
  user: User | null;
  token: string | null;
  background: Background;
  isConnected: boolean;
  connectedPhone: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  setBackground: (bg: Background) => void;
  setConnected: (val: boolean, phone?: string) => void;
  refreshBackground: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [background, setBackgroundState] = useState<Background>({ url: null, type: "image" });
  const [isConnected, setIsConnected] = useState(false);
  const [connectedPhone, setConnectedPhone] = useState<string | null>(null);

  const refreshBackground = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/background", { cache: "no-store" });
      const data = await res.json();
      if (data.url) {
        setBackgroundState({ 
          url: data.url, 
          type: data.type || "image",
          updatedAt: data.updatedAt || new Date().toISOString()
        });
      } else {
        setBackgroundState({ url: null, type: "image" });
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem("bimxz_token");
    const storedUser = localStorage.getItem("bimxz_user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch {}
    }
    refreshBackground();

    // Poll background every 8 seconds to get updates from admin
    const interval = setInterval(refreshBackground, 8000);
    return () => clearInterval(interval);
  }, [refreshBackground]);

  const login = (tok: string, usr: User) => {
    setToken(tok);
    setUser(usr);
    localStorage.setItem("bimxz_token", tok);
    localStorage.setItem("bimxz_user", JSON.stringify(usr));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setIsConnected(false);
    setConnectedPhone(null);
    localStorage.removeItem("bimxz_token");
    localStorage.removeItem("bimxz_user");
  };

  const setBackground = (bg: Background) => {
    setBackgroundState(bg);
  };

  const setConnected = (val: boolean, phone?: string) => {
    setIsConnected(val);
    if (phone) setConnectedPhone(phone);
    if (!val) setConnectedPhone(null);
  };

  return (
    <AppContext.Provider value={{
      user, token, background, isConnected, connectedPhone,
      login, logout, setBackground, setConnected, refreshBackground,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
