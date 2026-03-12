"use client";

import { useState, useCallback, useEffect, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LoadingContext } from "./LoadingContext";
import LoadingScreen from "./LoadingScreen";

interface LoadingWrapperProps {
  children: ReactNode;
}

export default function LoadingWrapper({ children }: LoadingWrapperProps) {
  const [isReady, setIsReady] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [heroReady, setHeroReady] = useState(false);

  const handleReady = () => {
    setIsReady(true);
    // Small delay before showing content to ensure smooth transition
    setTimeout(() => setShowContent(true), 50);
  };

  const signalReady = useCallback(() => {
    setHeroReady(true);
  }, []);

  // 5-second failsafe — single source of truth
  useEffect(() => {
    const failsafe = setTimeout(() => {
      setHeroReady((prev) => {
        if (!prev) {
          console.warn("LoadingWrapper: Failsafe triggered - forcing hero ready");
        }
        return true;
      });
    }, 5000);
    return () => clearTimeout(failsafe);
  }, []);

  return (
    <>
      {/* Loading Screen */}
      <LoadingScreen onReady={handleReady} heroReady={heroReady} />

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
            <LoadingContext.Provider value={{ signalReady }}>
              {children}
            </LoadingContext.Provider>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden content for preloading - prevents layout shift */}
      {!showContent && (
        <div
          style={{
            visibility: "hidden",
            position: "absolute",
            pointerEvents: "none",
            opacity: 0,
          }}
        >
          <LoadingContext.Provider value={{ signalReady }}>
            {children}
          </LoadingContext.Provider>
        </div>
      )}
    </>
  );
}
