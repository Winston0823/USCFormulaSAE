"use client";

import { useRef, useEffect, useCallback, useState } from "react";
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
  const imgDims = useRef({ w: 0, h: 0 });
  const [, forceRender] = useState(0);

  const smoothProgress = useSpring(scrollProgress, {
    stiffness: 100,
    damping: 30,
    mass: 0.5,
  });

  // Draw a frame with cover-fit: crops to fill the canvas viewport
  const drawCover = useCallback((ctx: CanvasRenderingContext2D, img: HTMLImageElement | ImageBitmap) => {
    const canvas = ctx.canvas;
    const cw = canvas.width;
    const ch = canvas.height;
    const iw = imgDims.current.w;
    const ih = imgDims.current.h;
    if (!iw || !ih) return;

    const scale = Math.max(cw / iw, ch / ih);
    const sw = iw * scale;
    const sh = ih * scale;
    const sx = (cw - sw) / 2;
    const sy = (ch - sh) / 2;

    ctx.drawImage(img, sx, sy, sw, sh);
  }, []);

  // Resize canvas to match screen
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    // Repaint current frame after resize
    lastFrameRef.current = -1;
  }, []);

  // Preload all frame images on mount
  useEffect(() => {
    const images: HTMLImageElement[] = [];

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.src = `/track-frames/frame-${String(i).padStart(3, "0")}.jpg`;
      img.onload = () => {
        readyCount.current++;
        if (readyCount.current === FRAME_COUNT) {
          imgDims.current = { w: images[0].naturalWidth, h: images[0].naturalHeight };
          isReady.current = true;
          resizeCanvas();
          const canvas = canvasRef.current;
          if (canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx) drawCover(ctx, images[0]);
          }
          forceRender((n) => n + 1);
        }
      };
      images.push(img);
    }

    framesRef.current = images;
  }, [resizeCanvas, drawCover]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      resizeCanvas();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [resizeCanvas]);

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
    if (ctx) drawCover(ctx, frames[idx]);
  }, [smoothProgress, drawCover]);

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
        className="absolute inset-0 w-full h-full"
      />
      {/* Subtle overlay grid */}
      <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
      {/* Vignette for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ boxShadow: "inset 0 0 10vw 4vw rgba(0,0,0,0.8)" }}
      />
    </motion.div>
  );
}
