"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

interface FireIconProps {
  className?: string;
  size?: number;
}

export default function FireIcon({ className = "", size = 40 }: FireIconProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href="/fundraiser"
      className={`relative flex items-center justify-center ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Fundraiser"
    >
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={{
          scale: isHovered ? 1.12 : 1,
          filter: isHovered
            ? "drop-shadow(0 0 8px rgba(227,181,61,0.6)) drop-shadow(0 0 16px rgba(227,181,61,0.3))"
            : "drop-shadow(0 0 3px rgba(227,181,61,0.15))",
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Outer flame body — rises from bowl, curves up and back */}
        <motion.path
          d="M20 44 C14 38, 14 28, 22 20 C24 18, 26 14, 27 10 C28 14, 32 20, 36 24 C42 30, 44 36, 42 42 C40 46, 36 48, 32 48 C28 48, 24 47, 20 44Z"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          animate={{
            opacity: isHovered ? [1, 0.85, 1] : [1, 0.9, 1],
            scale: isHovered ? [1, 1.04, 1] : [1, 1.02, 1],
          }}
          transition={{
            duration: isHovered ? 0.6 : 1.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ originX: "50%", originY: "100%" }}
        />

        {/* Inner left flame tongue — tall, curving right at top */}
        <motion.path
          d="M28 42 C24 36, 24 30, 26 24 C27 21, 28 18, 29 15 C30 18, 30 20, 31 23"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          animate={{
            y: isHovered ? [0, -2, 0, -1, 0] : [0, -1.5, 0],
            opacity: isHovered ? [1, 0.7, 1, 0.8, 1] : [1, 0.85, 1],
          }}
          transition={{
            duration: isHovered ? 0.5 : 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.1,
          }}
        />

        {/* Inner right flame tongue — shorter */}
        <motion.path
          d="M34 40 C36 34, 37 30, 35 26 C34 24, 33 22, 33 20"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          animate={{
            y: isHovered ? [0, -1.5, 0, -2, 0] : [0, -1, 0],
            opacity: isHovered ? [1, 0.75, 1, 0.85, 1] : [1, 0.88, 1],
          }}
          transition={{
            duration: isHovered ? 0.55 : 1.6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.25,
          }}
        />

        {/* Bottom bowl / crescent */}
        <motion.path
          d="M18 44 C20 52, 30 54, 38 52 C42 50, 46 46, 44 42"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          animate={{
            opacity: isHovered ? [1, 0.9, 1] : 1,
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.svg>
    </Link>
  );
}
