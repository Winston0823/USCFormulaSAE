"use client";

import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoadingScreen from "./LoadingScreen";

interface LoadingWrapperProps {
  children: ReactNode;
}

export default function LoadingWrapper({ children }: LoadingWrapperProps) {
  const [isReady, setIsReady] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const handleReady = () => {
    setIsReady(true);
    // Small delay before showing content to ensure smooth transition
    setTimeout(() => setShowContent(true), 50);
  };

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
          {children}
        </div>
      )}
    </>
  );
}
