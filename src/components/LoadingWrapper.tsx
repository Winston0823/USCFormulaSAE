"use client";

import { useState, useEffect, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoadingScreen from "./LoadingScreen";

interface LoadingWrapperProps {
  children: ReactNode;
}

// Module-level flag to track if this is a fresh page load
// This resets on hard refresh but persists during client-side navigation
let hasLoadedInSession = false;

export default function LoadingWrapper({ children }: LoadingWrapperProps) {
  const [shouldShowLoader, setShouldShowLoader] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Only show loader on fresh page loads (refresh), not client-side navigation
    if (!hasLoadedInSession) {
      setShouldShowLoader(true);
      hasLoadedInSession = true;
    } else {
      // Skip loading screen for client-side navigation
      setIsReady(true);
      setShowContent(true);
    }
  }, []);

  const handleReady = () => {
    setIsReady(true);
    setTimeout(() => setShowContent(true), 50);
  };

  // If not showing loader, render children immediately
  if (!shouldShowLoader) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Loading Screen */}
      <LoadingScreen onReady={handleReady} />

      {/* Main Content - with zoom-in effect */}
      <AnimatePresence>
        {showContent && (
          <motion.div
            initial={{
              opacity: 0,
              scale: 1.1,
              filter: "blur(10px)",
            }}
            animate={{
              opacity: 1,
              scale: 1,
              filter: "blur(0px)",
            }}
            transition={{
              duration: 0.8,
              ease: [0.4, 0, 0.2, 1],
              scale: {
                type: "spring",
                stiffness: 80,
                damping: 20,
              }
            }}
            style={{
              transformOrigin: "center center",
            }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden content for preloading */}
      {!showContent && (
        <div
          style={{
            visibility: "hidden",
            position: "absolute",
            pointerEvents: "none",
            opacity: 0,
          }}
        >
          {children}
        </div>
      )}
    </>
  );
}
