"use client";
import { useState, useEffect } from "react";
import { AppProvider, useApp } from "@/contexts/AppContext";
import SplashScreen from "@/components/SplashScreen";
import LoginPage from "@/components/LoginPage";
import Dashboard from "@/components/Dashboard";

function AppContent() {
  const { user } = useApp();
  const [showSplash, setShowSplash] = useState(true);
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    // If user is already logged in, skip splash
    const token = localStorage.getItem("bimxz_token");
    if (token) {
      setShowSplash(false);
      setSplashDone(true);
    }
  }, []);

  if (showSplash && !splashDone) {
    return (
      <SplashScreen onDone={() => {
        setShowSplash(false);
        setSplashDone(true);
      }} />
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return <Dashboard />;
}

export default function HomePage() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
