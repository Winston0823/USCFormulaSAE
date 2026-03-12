"use client";

import { useRef, useEffect, useCallback, useState, type ReactNode } from "react";
import { useScroll, useSpring } from "framer-motion";

const FRAME_COUNT = 97;

interface TrackVideoScrollProps {
  children: ReactNode;
}

export default function TrackVideoScroll({ children }: TrackVideoScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const lastFrameRef = useRef<number>(-1);
  const readyCount = useRef(0);
  const isReady = useRef(false);
  const imgDims = useRef({ w: 0, h: 0 });
  const [, forceRender] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    mass: 0.5,
  });

  // Draw a frame with cover-fit: crops to fill the canvas viewport
  const drawCover = useCallback((ctx: CanvasRenderingContext2D, img: HTMLImageElement) => {
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

  // Resize canvas to match viewport
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    lastFrameRef.current = -1;
  }, []);

  // Preload all frame images
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

  useEffect(() => {
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [resizeCanvas]);

  const paintFrame = useCallback(() => {
    const frames = framesRef.current;
    const canvas = canvasRef.current;
    if (!isReady.current || !frames.length || !canvas) return;

    const idx = Math.min(
      Math.max(0, Math.floor(smoothProgress.get() * (frames.length - 1))),
      frames.length - 1
    );

    if (idx === lastFrameRef.current) return;
    lastFrameRef.current = idx;

    const ctx = canvas.getContext("2d");
    if (ctx) drawCover(ctx, frames[idx]);
  }, [smoothProgress, drawCover]);

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
    <div ref={containerRef} className="relative">
      {/* Sticky video background — viewport-sized, stays behind content */}
      <div className="sticky top-0 h-screen overflow-hidden" style={{ zIndex: 0 }}>
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
      </div>

      {/* Content scrolls over the sticky video — pulled up to overlap */}
      <div className="relative" style={{ zIndex: 1, marginTop: "-100vh" }}>
        {children}
      </div>
    </div>
  );
}
