"use client";

import { Player } from "@remotion/player";
import Link from "next/link";
import { useState, useEffect } from "react";
import { FireAnimation } from "../../remotion/FireAnimation";

interface FireIconProps {
  className?: string;
  size?: number;
}

// Static gold flame for prefers-reduced-motion
function StaticFlame({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="sf-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g filter="url(#sf-glow)">
        <path
          d="M34 104 C20 92,14 76,16 64 C18 50,24 38,28 28 C32 36,38 48,42 44 C48 32,56 16,63 6 C68 14,76 30,84 40 C88 34,94 24,96 18 C100 30,106 48,110 66 C112 82,106 94,94 104 Z"
          stroke="#e3b53d" strokeWidth="3.5" strokeLinecap="round" fill="none"
        />
        <path
          d="M58 90 C54 68,50 46,56 26 C58 16,61 10,63 8"
          stroke="#f5d066" strokeWidth="2.8" strokeLinecap="round" fill="none"
        />
        <path
          d="M72 88 C78 66,82 46,80 30 C79 24,82 20,84 18"
          stroke="#e3b53d" strokeWidth="2.5" strokeLinecap="round" fill="none"
        />
        <path
          d="M28 106 C40 114,86 114,100 106"
          stroke="#e3b53d" strokeWidth="3.5" strokeLinecap="round" fill="none"
        />
      </g>
    </svg>
  );
}

export default function FireIcon({ className = "", size = 40 }: FireIconProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) =>
      setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <Link
      href="/fundraiser"
      className={`relative flex items-center justify-center ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Fundraiser"
      style={{
        width: size,
        height: size,
        transform: isHovered ? "scale(1.15)" : "scale(1)",
        filter: isHovered
          ? "drop-shadow(0 0 12px rgba(227,181,61,0.8)) drop-shadow(0 0 24px rgba(160,88,24,0.5)) drop-shadow(0 0 48px rgba(139,0,0,0.25))"
          : "drop-shadow(0 0 4px rgba(227,181,61,0.2)) drop-shadow(0 0 10px rgba(160,88,24,0.1))",
        transition: isHovered
          ? "transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.25s ease-out"
          : "transform 0.4s ease-out, filter 0.5s ease-out",
      }}
    >
      {prefersReducedMotion ? (
        <StaticFlame size={size} />
      ) : (
        <Player
          component={FireAnimation}
          inputProps={{ isHovered }}
          compositionWidth={128}
          compositionHeight={128}
          durationInFrames={90}
          fps={30}
          loop
          autoPlay
          style={{
            width: size,
            height: size,
            backgroundColor: "transparent",
          }}
        />
      )}
    </Link>
  );
}
