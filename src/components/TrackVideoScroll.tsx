"use client";

import { useRef, useEffect, useCallback } from "react";
import { motion, MotionValue, useSpring } from "framer-motion";

const FRAME_COUNT = 97;

interface TrackVideoScrollProps {
  scrollProgress: MotionValue<number>;
  opacity: MotionValue<number>;
}

export default function TrackVideoScroll({ scrollProgress, opacity }: TrackVideoScrollProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const lastFrameRef = useRef<number>(-1);
  const readyCount = useRef(0);
  const isReady = useRef(false);

  const smoothProgress = useSpring(scrollProgress, {
    stiffness: 100,
    damping: 30,
    mass: 0.5,
  });

  // Preload all frame images on mount
  useEffect(() => {
    const images: HTMLImageElement[] = [];

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.src = `/track-frames/frame-${String(i).padStart(3, "0")}.jpg`;
      img.onload = () => {
        readyCount.current++;
        if (readyCount.current === FRAME_COUNT) {
          isReady.current = true;
          // Size canvas to first image
          const canvas = canvasRef.current;
          if (canvas) {
            canvas.width = images[0].naturalWidth;
            canvas.height = images[0].naturalHeight;
            const ctx = canvas.getContext("2d");
            if (ctx) ctx.drawImage(images[0], 0, 0);
          }
        }
      };
      images.push(img);
    }

    framesRef.current = images;
  }, []);

  const paintFrame = useCallback(() => {
    const frames = framesRef.current;
    const canvas = canvasRef.current;
    if (!isReady.current || !frames.length || !canvas) return;

    const idx = Math.min(
      Math.floor(smoothProgress.get() * (frames.length - 1)),
      frames.length - 1
    );

    if (idx === lastFrameRef.current) return;
    lastFrameRef.current = idx;

    const ctx = canvas.getContext("2d");
    if (ctx) ctx.drawImage(frames[idx], 0, 0);
  }, [smoothProgress]);

  // rAF loop
  useEffect(() => {
    let raf: number;
    const loop = () => {
      paintFrame();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [paintFrame]);

  return (
    <motion.div
      className="fixed inset-0 overflow-hidden pointer-events-none bg-black"
      style={{ zIndex: 1, opacity }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Subtle overlay grid */}
      <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
      {/* Vignette for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ boxShadow: "inset 0 0 150px 60px rgba(0,0,0,0.8)" }}
      />
    </motion.div>
  );
}
