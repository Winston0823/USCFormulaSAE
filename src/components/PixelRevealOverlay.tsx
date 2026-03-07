"use client";

import { useEffect, useRef } from "react";

const PIXEL_SIZE = 14;
const RADIUS = 180;
const LERP = 0.1;
const TRAIL_DECAY = 0.015; // ~1.5 second fade at 60fps
const MIN_ALPHA = 0.01;    // Threshold to stop rendering pixel

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
  const pixelAlphaRef = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    if (foregroundSrc) {
      const img = new Image();
      img.src = foregroundSrc;
      img.onload = () => { imgRef.current = img; };
    }
    // Ensure fonts are loaded for canvas text
    document.fonts.ready.then(() => { /* fonts loaded, canvas will use them */ });
  }, [foregroundSrc]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cssSize = { w: 0, h: 0 };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      cssSize.w = canvas.offsetWidth;
      cssSize.h = canvas.offsetHeight;
      canvas.width = cssSize.w * dpr;
      canvas.height = cssSize.h * dpr;
      ctx.scale(dpr, dpr);
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
      const w = cssSize.w;
      const h = cssSize.h;
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
        // Mimic object-cover: scale image to cover canvas, centered
        const img = imgRef.current;
        const imgAspect = img.naturalWidth / img.naturalHeight;
        const canvasAspect = w / h;
        let sw = img.naturalWidth, sh = img.naturalHeight, sx = 0, sy = 0;
        if (imgAspect > canvasAspect) {
          sw = img.naturalHeight * canvasAspect;
          sx = (img.naturalWidth - sw) / 2;
        } else {
          sh = img.naturalWidth / canvasAspect;
          sy = (img.naturalHeight - sh) / 2;
        }
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
      }

      // Dark gradient overlay — covers full hero, fades from left to right
      {
        const grad = ctx.createLinearGradient(0, 0, w, 0);
        grad.addColorStop(0, "rgba(0, 0, 0, 0.7)");
        grad.addColorStop(0.45, "rgba(0, 0, 0, 0.3)");
        grad.addColorStop(0.75, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }

      // Positioning statement text — drawn on canvas so pixel mask erases it too
      {
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.letterSpacing = "0.05em";
        const baseX = w * 0.06;
        const textY = h * 0.58;

        // Scale based on smaller of width/height ratio to handle all resolutions
        const scale = Math.min(w / 1920, h / 1080);

        // Line 1
        const fontSize1 = Math.max(16, Math.round(44 * scale));
        ctx.font = `800 ${fontSize1}px "Rajdhani", sans-serif`;
        ctx.fillStyle = "#ffffff";
        ctx.fillText("USC'S PREMIER", baseX, textY);

        // Line 2 — larger
        const fontSize2 = Math.max(22, Math.round(72 * scale));
        ctx.font = `800 ${fontSize2}px "Rajdhani", sans-serif`;
        ctx.fillText("FORMULA ELECTRIC RACING TEAM", baseX, textY + fontSize1 * 1.2);

        // Established year
        const fontSize3 = Math.max(10, Math.round(18 * scale));
        ctx.font = `500 ${fontSize3}px "Rajdhani", sans-serif`;
        ctx.fillStyle = "#e3b53d";
        ctx.letterSpacing = "0.25em";
        ctx.fillText("EST. 2014", baseX, textY + fontSize1 * 1.2 + fontSize2 * 1.3);

      }

      if (!imgRef.current) {
        ctx.fillStyle = "#0f0f12";
        ctx.fillRect(0, 0, w, h);
      }

      // Punch pixelated holes with animated water edge and trail effect
      ctx.globalCompositeOperation = "destination-out";

      const pixelAlpha = pixelAlphaRef.current;

      // Update pixels near cursor - set their alpha to 1
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
            const key = `${px},${py}`;
            pixelAlpha.set(key, 1);
          }
        }
      }

      // Decay all pixel alphas and render them
      for (const [key, alpha] of pixelAlpha) {
        const newAlpha = alpha - TRAIL_DECAY;
        if (newAlpha < MIN_ALPHA) {
          pixelAlpha.delete(key);
        } else {
          pixelAlpha.set(key, newAlpha);
          const [px, py] = key.split(",").map(Number);
          ctx.globalAlpha = newAlpha;
          ctx.fillRect(px, py, PIXEL_SIZE, PIXEL_SIZE);
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
