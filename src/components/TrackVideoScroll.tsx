"use client";

import { useRef, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const FRAME_COUNT = 97;

export default function TrackVideoScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const lastFrameRef = useRef<number>(-1);
  const readyCount = useRef(0);
  const isReady = useRef(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    mass: 0.5,
  });

  const hudOpacity = useTransform(scrollYProgress, [0, 0.05, 0.9, 1], [0, 1, 1, 0]);
  const scanlineY = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);
  const progressPercent = useTransform(smoothProgress, (v) => `${Math.round(v * 100)}%`);

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
    <div ref={containerRef} className="h-[400vh] relative">
      <div className="sticky top-0 h-screen overflow-hidden bg-[var(--background)]">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ objectFit: "cover" }}
        />

        <div className="absolute inset-0 cyber-grid opacity-15 pointer-events-none" />

        <motion.div
          className="absolute left-0 w-full h-px pointer-events-none"
          style={{
            top: scanlineY,
            background:
              "linear-gradient(90deg, transparent, rgba(227,181,61,0.4), transparent)",
            boxShadow: "0 0 12px rgba(227,181,61,0.3)",
          }}
        />

        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ opacity: hudOpacity }}
        >
          <div className="absolute top-8 left-8 sm:top-12 sm:left-12">
            <p
              className="text-[#e3b53d]/50 uppercase tracking-[0.3em] text-xs mb-1"
              style={{ fontFamily: "var(--font-jetbrains), monospace" }}
            >
              USC Formula Electric
            </p>
            <h2
              className="text-white text-2xl sm:text-3xl md:text-4xl tracking-wider"
              style={{ fontFamily: "'Ethnocentric', sans-serif" }}
            >
              CIRCUIT <span className="text-[#e3b53d]">ANALYSIS</span>
            </h2>
            <div
              className="mt-3 h-px w-32"
              style={{
                background: "linear-gradient(90deg, #e3b53d, transparent)",
              }}
            />
          </div>

          <div className="absolute bottom-8 right-8 sm:bottom-12 sm:right-12 text-right">
            <p
              className="text-[#e3b53d]/50 uppercase tracking-[0.3em] text-xs mb-1"
              style={{ fontFamily: "var(--font-jetbrains), monospace" }}
            >
              Telemetry
            </p>
            <motion.span
              className="block text-3xl sm:text-4xl font-bold text-[#e3b53d]"
              style={{ fontFamily: "var(--font-jetbrains), monospace" }}
            >
              {progressPercent}
            </motion.span>
          </div>

          <svg className="absolute top-6 left-6 w-6 h-6 text-[#e3b53d]/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 8V1h7" /></svg>
          <svg className="absolute top-6 right-6 w-6 h-6 text-[#e3b53d]/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M23 8V1h-7" /></svg>
          <svg className="absolute bottom-6 left-6 w-6 h-6 text-[#e3b53d]/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 16v7h7" /></svg>
          <svg className="absolute bottom-6 right-6 w-6 h-6 text-[#e3b53d]/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M23 16v7h-7" /></svg>

          <div
            className="absolute inset-0"
            style={{ boxShadow: "inset 0 0 120px 40px rgba(0,0,0,0.7)" }}
          />
        </motion.div>
      </div>
    </div>
  );
}
