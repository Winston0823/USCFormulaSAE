"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";

interface LoadingScreenProps {
  onReady?: () => void;
}

// USC Brand Colors
const USC_GOLD = "#FFC72C";
const USC_CARDINAL = "#990000";
const BG_COLOR = "#000000";

// SVG Paths decomposed from Trojan Helmet
const PLUME_PATH = "M16.7853 56.6631C17.9363 56.3692 18.7932 55.3951 18.936 54.2195C20.5154 41.3805 26.0433 33.4117 32.4197 28.4155C39.4094 22.9407 48.3146 20.7406 57.0097 21.5132C72.6693 22.8987 77.5504 34.1675 78.3905 35.0156C78.8273 35.4522 79.575 35.3011 80.0539 34.9232L92.7395 21.975C93.0924 21.4628 93.084 20.7826 92.7059 20.2872C90.236 16.962 81.4737 0 53.1956 0C42.207 0 28.9837 5.30692 19.7845 15.7528C8.62786 26.9124 6.09914 45.8309 4.2845 53.2707C3.38559 56.9654 2.30185 56.4616 0.125966 59.602C-0.252083 60.1562 0.251982 60.8868 0.898866 60.7188L16.7853 56.6631Z";

const CROWN_PATH = "M79.8859 65.8578C79.6255 66.2945 79.2474 66.4792 79.2474 66.4792C78.9366 66.6303 78.6089 66.6219 78.3653 66.58L59.6813 62.1044C59.2864 61.9952 58.9588 61.7181 58.7992 61.3402L54.8591 52.4058C54.649 51.9272 54.1786 51.6081 53.6493 51.5913L37.326 51.1043C36.5279 51.0791 36.3515 49.9707 37.0992 49.702L56.6569 42.5561C57.1442 42.3798 57.6902 42.4889 58.0683 42.85L65.3772 49.8195C65.6713 50.105 66.0829 50.2394 66.4946 50.189L79.3734 48.5264C79.6003 48.4928 79.9027 48.4844 80.1883 48.6355C80.6252 48.8706 80.81 49.3661 80.9024 49.7439C81.7173 52.9264 80.8352 64.254 79.8775 65.8578H79.8859Z";

const CHIN_PATH = "M69.1325 88.9999C69.8298 88.8824 70.0062 87.9671 69.4098 87.5892L22.5905 58.334C21.4564 57.6287 20.4734 58.5943 20.2634 59.9126C19.9442 61.8356 19.2973 67.4196 25.7157 70.5517C48.8103 81.8289 69.1325 88.9999 69.1325 88.9999Z";

// Animation variants
const plumeVariants = {
  hidden: {
    x: -80,
    y: -60,
    opacity: 0,
    rotate: -15,
  },
  visible: {
    x: 0,
    y: 0,
    opacity: 1,
    rotate: 0,
    transition: {
      type: "spring" as const,
      stiffness: 80,
      damping: 12,
      delay: 0.2,
    }
  }
};

const crownVariants = {
  hidden: {
    scale: 0,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 10,
      delay: 0.5,
    }
  }
};

const chinVariants = {
  hidden: {
    y: 60,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 90,
      damping: 14,
      delay: 0.4,
    }
  }
};

// Glitch effect component
function GlitchOverlay() {
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    const triggerGlitch = () => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 150);
    };

    // Random glitch intervals
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        triggerGlitch();
      }
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Scanlines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(255, 199, 44, 0.03) 2px,
            rgba(255, 199, 44, 0.03) 4px
          )`,
          zIndex: 2,
        }}
      />

      {/* CRT flicker */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          opacity: [0.97, 1, 0.98, 1, 0.96, 1],
        }}
        transition={{
          duration: 0.15,
          repeat: Infinity,
          repeatType: "mirror",
        }}
        style={{
          background: "transparent",
          zIndex: 3,
        }}
      />

      {/* Glitch effect */}
      <AnimatePresence>
        {glitchActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: 4 }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(
                  90deg,
                  transparent 0%,
                  rgba(255, 199, 44, 0.1) 15%,
                  transparent 30%,
                  rgba(153, 0, 0, 0.1) 50%,
                  transparent 70%,
                  rgba(255, 199, 44, 0.1) 85%,
                  transparent 100%
                )`,
                transform: `translateX(${Math.random() * 10 - 5}px)`,
              }}
            />
            <div
              className="absolute top-0 left-0 w-full"
              style={{
                height: `${Math.random() * 5 + 2}px`,
                top: `${Math.random() * 100}%`,
                background: `rgba(255, 199, 44, 0.3)`,
                filter: "blur(1px)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 0%, transparent 50%, rgba(0,0,0,0.5) 100%)",
          zIndex: 1,
        }}
      />
    </>
  );
}

// Telemetry data display
function TelemetryData({ progress }: { progress: number }) {
  const [dataFlicker, setDataFlicker] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setDataFlicker(prev => !prev);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-8 text-xs font-mono"
      style={{
        color: USC_GOLD,
        opacity: dataFlicker ? 0.8 : 0.9,
        fontFamily: "var(--font-jetbrains), monospace",
      }}
    >
      <div className="flex flex-col items-center">
        <span className="text-white/40 uppercase tracking-widest text-[10px]">SYS</span>
        <span>{progress < 100 ? "INIT" : "READY"}</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-white/40 uppercase tracking-widest text-[10px]">LOAD</span>
        <span>{progress.toFixed(0)}%</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-white/40 uppercase tracking-widest text-[10px]">STATUS</span>
        <motion.span
          animate={{ opacity: progress < 100 ? [1, 0.3, 1] : 1 }}
          transition={{ duration: 0.5, repeat: progress < 100 ? Infinity : 0 }}
        >
          {progress < 100 ? "LOADING" : "ONLINE"}
        </motion.span>
      </div>
    </motion.div>
  );
}

export default function LoadingScreen({ onReady }: LoadingScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  // Simulated progress with spring physics
  const progress = useSpring(0, { stiffness: 30, damping: 20 });
  const progressValue = useTransform(progress, [0, 100], [0, 100]);
  const [displayProgress, setDisplayProgress] = useState(0);

  // Track progress value changes
  useEffect(() => {
    const unsubscribe = progressValue.on("change", (v) => {
      setDisplayProgress(v);
    });
    return () => unsubscribe();
  }, [progressValue]);

  // Disable body scroll while loading
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isVisible]);

  // Progress simulation and asset loading
  useEffect(() => {
    // Simulate progress stages
    const stages = [
      { target: 30, delay: 300 },
      { target: 60, delay: 800 },
      { target: 85, delay: 1200 },
    ];

    stages.forEach(({ target, delay }) => {
      setTimeout(() => progress.set(target), delay);
    });

    // Mark animation sequence as complete
    setTimeout(() => {
      setAnimationComplete(true);
    }, 1800);
  }, [progress]);

  // Callback for when hero assets are loaded
  const handleHeroLoaded = useCallback(() => {
    setAssetsLoaded(true);
    progress.set(100);
  }, [progress]);

  // Expose the loading callback globally for the page to call
  useEffect(() => {
    (window as Window & { __heroLoaded?: () => void }).__heroLoaded = handleHeroLoaded;
    return () => {
      delete (window as Window & { __heroLoaded?: () => void }).__heroLoaded;
    };
  }, [handleHeroLoaded]);

  // 5-second failsafe
  useEffect(() => {
    const failsafe = setTimeout(() => {
      if (!assetsLoaded) {
        console.warn("LoadingScreen: Failsafe triggered - forcing ready state");
        handleHeroLoaded();
      }
    }, 5000);

    return () => clearTimeout(failsafe);
  }, [assetsLoaded, handleHeroLoaded]);

  // Dismiss loader when ready
  useEffect(() => {
    if (assetsLoaded && animationComplete && displayProgress >= 99) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onReady?.();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [assetsLoaded, animationComplete, displayProgress, onReady]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 flex items-center justify-center"
          style={{
            backgroundColor: BG_COLOR,
            zIndex: 9999,
          }}
        >
          {/* Glitch/Scanline overlay */}
          <GlitchOverlay />

          {/* Animated helmet SVG */}
          <div className="relative" style={{ zIndex: 10 }}>
            <motion.svg
              width="186"
              height="178"
              viewBox="0 0 93 89"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              initial={{ filter: "drop-shadow(0 0 0px transparent)" }}
              animate={{
                filter: [
                  `drop-shadow(0 0 20px ${USC_GOLD}40)`,
                  `drop-shadow(0 0 40px ${USC_GOLD}60)`,
                  `drop-shadow(0 0 20px ${USC_GOLD}40)`,
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {/* Plume - slides from top-left */}
              <motion.path
                d={PLUME_PATH}
                fill={USC_GOLD}
                variants={plumeVariants}
                initial="hidden"
                animate="visible"
                style={{ transformOrigin: "50px 30px" }}
              />

              {/* Crown - scales from center */}
              <motion.path
                d={CROWN_PATH}
                fill={USC_GOLD}
                variants={crownVariants}
                initial="hidden"
                animate="visible"
                style={{ transformOrigin: "58px 55px" }}
              />

              {/* Chin - slides from bottom */}
              <motion.path
                d={CHIN_PATH}
                fill={USC_GOLD}
                variants={chinVariants}
                initial="hidden"
                animate="visible"
                style={{ transformOrigin: "46px 75px" }}
              />
            </motion.svg>

            {/* Glow effect behind helmet */}
            <motion.div
              className="absolute inset-0 -z-10"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.8,
              }}
              style={{
                background: `radial-gradient(ellipse at center, ${USC_GOLD}20 0%, transparent 70%)`,
                filter: "blur(30px)",
              }}
            />
          </div>

          {/* Telemetry data */}
          <TelemetryData progress={displayProgress} />

          {/* Progress bar */}
          <div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 w-48 h-[2px] overflow-hidden"
            style={{
              backgroundColor: `${USC_CARDINAL}30`,
            }}
          >
            <motion.div
              className="h-full"
              style={{
                backgroundColor: USC_CARDINAL,
                width: `${displayProgress}%`,
                boxShadow: `0 0 10px ${USC_CARDINAL}, 0 0 20px ${USC_CARDINAL}80`,
              }}
            />
          </div>

          {/* Corner decorations - racing telemetry style */}
          <div className="absolute top-4 left-4 text-[10px] font-mono" style={{ color: `${USC_GOLD}60` }}>
            <div>USC_FSAE_v2.0</div>
            <div>SYS.BOOT</div>
          </div>
          <div className="absolute top-4 right-4 text-[10px] font-mono text-right" style={{ color: `${USC_GOLD}60` }}>
            <div>TROJAN.ELECTRIC</div>
            <div>2024_SEASON</div>
          </div>
          <div className="absolute bottom-4 left-4 text-[10px] font-mono" style={{ color: `${USC_GOLD}40` }}>
            <motion.span
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              ▸
            </motion.span>
            {" INITIALIZING"}
          </div>
          <div className="absolute bottom-4 right-4 text-[10px] font-mono" style={{ color: `${USC_GOLD}40` }}>
            FRAME: {Math.floor(displayProgress * 0.97).toString().padStart(3, "0")}/097
          </div>

          {/* Grid lines */}
          <div
            className="absolute inset-0 pointer-events-none opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(${USC_GOLD}10 1px, transparent 1px),
                linear-gradient(90deg, ${USC_GOLD}10 1px, transparent 1px)
              `,
              backgroundSize: "40px 40px",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
