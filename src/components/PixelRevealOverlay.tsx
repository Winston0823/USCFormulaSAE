"use client";

import { useEffect, useRef } from "react";

const PIXEL_SIZE = 14;
const RADIUS = 180;
const LERP = 0.1;

// Diagonal, non-axis-aligned waves break up the star/cross pattern
function waterNoise(x: number, y: number, t: number): number {
  return (
    Math.sin(x * 0.037 + y * 0.019 + t * 1.1) * 22 +
    Math.sin(x * 0.021 - y * 0.033 + t * 0.85) * 18 +
    Math.sin(x * 0.013 + y * 0.047 + t * 1.4) * 14 +
    Math.sin(-x * 0.029 + y * 0.023 + t * 0.65) * 12 +
    Math.sin(x * 0.051 + y * 0.011 + t * 1.7) * 8 +
    Math.sin(x * 0.017 - y * 0.043 + t * 2.0) * 6
  );
}

interface Props {
  foregroundSrc?: string;
}

export default function PixelRevealOverlay({ foregroundSrc }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const smoothRef = useRef({ x: -9999, y: -9999 });
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (foregroundSrc) {
      const img = new Image();
      img.src = foregroundSrc;
      img.onload = () => { imgRef.current = img; };
    }
  }, [foregroundSrc]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };
    window.addEventListener("mousemove", onMouseMove);

    let raf: number;

    function frame() {
      if (!ctx) return;
      const w = canvas!.width;
      const h = canvas!.height;
      const t = performance.now() / 1000;

      if (smoothRef.current.x === -9999) {
        smoothRef.current = { ...mouseRef.current };
      }

      smoothRef.current.x += (mouseRef.current.x - smoothRef.current.x) * LERP;
      smoothRef.current.y += (mouseRef.current.y - smoothRef.current.y) * LERP;

      const mx = smoothRef.current.x;
      const my = smoothRef.current.y;

      ctx.clearRect(0, 0, w, h);

      // FOREGROUND: real car photo (or dark fallback)
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      if (imgRef.current) {
        ctx.drawImage(imgRef.current, 0, 0, w, h);
      } else {
        ctx.fillStyle = "#0f0f12";
        ctx.fillRect(0, 0, w, h);
      }

      // Punch pixelated holes with animated water edge
      ctx.globalCompositeOperation = "destination-out";

      const padding = RADIUS + 80;
      const x0 = Math.floor((mx - padding) / PIXEL_SIZE) * PIXEL_SIZE;
      const x1 = Math.ceil((mx + padding) / PIXEL_SIZE) * PIXEL_SIZE;
      const y0 = Math.floor((my - padding) / PIXEL_SIZE) * PIXEL_SIZE;
      const y1 = Math.ceil((my + padding) / PIXEL_SIZE) * PIXEL_SIZE;

      for (let px = x0; px <= x1; px += PIXEL_SIZE) {
        for (let py = y0; py <= y1; py += PIXEL_SIZE) {
          const cx = px + PIXEL_SIZE / 2;
          const cy = py + PIXEL_SIZE / 2;
          const d = Math.hypot(cx - mx, cy - my);
          const wave = waterNoise(cx, cy, t);
          if (d < RADIUS + wave) {
            ctx.globalAlpha = 1;
            ctx.fillRect(px, py, PIXEL_SIZE, PIXEL_SIZE);
          }
        }
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";

      raf = requestAnimationFrame(frame);
    }

    frame();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 15, pointerEvents: "none" }}
    />
  );
}
