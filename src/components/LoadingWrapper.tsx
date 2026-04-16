"use client";

import { useState, useCallback, useEffect, type ReactNode } from "react";
import { LoadingContext } from "./LoadingContext";
import LoadingScreen from "./LoadingScreen";

interface LoadingWrapperProps {
  children: ReactNode;
}

export default function LoadingWrapper({ children }: LoadingWrapperProps) {
  const [heroReady, setHeroReady] = useState(false);
  const [startPreload, setStartPreload] = useState(false);

  const signalReady = useCallback(() => {
    setHeroReady(true);
  }, []);

  // Start preloading after animation finishes (1800ms) but before loading bar completes
  useEffect(() => {
    const timer = setTimeout(() => setStartPreload(true), 1800);
    return () => clearTimeout(timer);
  }, []);

  // 5-second failsafe
  useEffect(() => {
    const failsafe = setTimeout(() => {
      setHeroReady((prev) => {
        if (!prev) console.warn("LoadingWrapper: Failsafe triggered - forcing hero ready");
        return true;
      });
    }, 5000);
    return () => clearTimeout(failsafe);
  }, []);

  return (
    <>
      {/* Loading Screen sits on top and fades out when done */}
      <LoadingScreen onReady={() => {}} heroReady={heroReady} />

      {/* Home page rendered underneath from the start — revealed when loading screen fades out */}
      <LoadingContext.Provider value={{ signalReady }}>
        {startPreload ? children : null}
      </LoadingContext.Provider>
    </>
  );
}
