"use client";

import { useEffect, useRef } from "react";

const PIXEL_SIZE = 14;
const RADIUS = 180;
const LERP = 0.1;
const TRAIL_DECAY = 0.015; // ~1.5 second fade at 60fps
const MIN_ALPHA = 0.01;    // Threshold to stop rendering pixel

// Laser pulse constants
const PULSE_SPEED = 900;      // px per second
const PULSE_DURATION = 1.4;   // seconds
const PULSE_THICKNESS = 50;   // ring width in px
const MAX_PULSES = 3;         // max concurrent pulses

interface ClickPulse {
  x: number;
  y: number;
  time: number;
}

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
  const pulsesRef = useRef<ClickPulse[]>([]);

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

    const onClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const pulse: ClickPulse = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        time: performance.now() / 1000,
      };
      const pulses = pulsesRef.current;
      pulses.push(pulse);
      if (pulses.length > MAX_PULSES) pulses.shift();
    };
    window.addEventListener("mousedown", onClick);

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

        // Text glow for readability against dark/busy backgrounds
        ctx.shadowColor = "rgba(0, 0, 0, 0.9)";
        ctx.shadowBlur = 20 * scale;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 2 * scale;

        // Line 1
        const fontSize1 = Math.max(16, Math.round(44 * scale));
        ctx.font = `800 ${fontSize1}px "Rajdhani", sans-serif`;
        ctx.fillStyle = "#ffffff";
        ctx.fillText("USC'S PREMIER", baseX, textY);

        // Line 2 — larger
        const fontSize2 = Math.max(22, Math.round(72 * scale));
        ctx.font = `800 ${fontSize2}px "Rajdhani", sans-serif`;
        ctx.fillText("FORMULA ELECTRIC RACING TEAM", baseX, textY + fontSize1 * 1.2);

        // Established year — gold with its own glow
        ctx.shadowColor = "rgba(227, 181, 61, 0.4)";
        ctx.shadowBlur = 12 * scale;
        ctx.shadowOffsetY = 0;
        const fontSize3 = Math.max(10, Math.round(18 * scale));
        ctx.font = `500 ${fontSize3}px "Rajdhani", sans-serif`;
        ctx.fillStyle = "#e3b53d";
        ctx.letterSpacing = "0.25em";
        ctx.fillText("EST. 2014", baseX, textY + fontSize1 * 1.2 + fontSize2 * 1.3);

        // Reset shadow
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
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

      // === LASER PULSE EFFECT ON CLICK ===
      const pulses = pulsesRef.current;
      // Remove expired pulses
      for (let i = pulses.length - 1; i >= 0; i--) {
        if (t - pulses[i].time > PULSE_DURATION) pulses.splice(i, 1);
      }

      if (pulses.length > 0) {
        // Build edge pixel set — pixels that have at least one missing neighbor
        const edgePixels: { px: number; py: number }[] = [];
        for (const [key, alpha] of pixelAlpha) {
          if (alpha < MIN_ALPHA) continue;
          const [px, py] = key.split(",").map(Number);
          const hasEmptyNeighbor =
            !pixelAlpha.has(`${px - PIXEL_SIZE},${py}`) ||
            !pixelAlpha.has(`${px + PIXEL_SIZE},${py}`) ||
            !pixelAlpha.has(`${px},${py - PIXEL_SIZE}`) ||
            !pixelAlpha.has(`${px},${py + PIXEL_SIZE}`) ||
            (pixelAlpha.get(`${px - PIXEL_SIZE},${py}`) ?? 0) < MIN_ALPHA ||
            (pixelAlpha.get(`${px + PIXEL_SIZE},${py}`) ?? 0) < MIN_ALPHA ||
            (pixelAlpha.get(`${px},${py - PIXEL_SIZE}`) ?? 0) < MIN_ALPHA ||
            (pixelAlpha.get(`${px},${py + PIXEL_SIZE}`) ?? 0) < MIN_ALPHA;
          if (hasEmptyNeighbor) {
            edgePixels.push({ px, py });
          }
        }

        for (const pulse of pulses) {
          const elapsed = t - pulse.time;
          const pulseRadius = elapsed * PULSE_SPEED;
          const pulseFade = 1 - elapsed / PULSE_DURATION;
          const pulseFade2 = pulseFade * pulseFade; // quadratic falloff

          // Draw faint shockwave ring
          ctx.globalAlpha = pulseFade2 * 0.15;
          ctx.strokeStyle = "#e3b53d";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(pulse.x, pulse.y, pulseRadius, 0, Math.PI * 2);
          ctx.stroke();

          // Light up edge pixels hit by the shockwave
          for (const { px, py } of edgePixels) {
            const cx = px + PIXEL_SIZE / 2;
            const cy = py + PIXEL_SIZE / 2;
            const d = Math.hypot(cx - pulse.x, cy - pulse.y);
            const distFromRing = Math.abs(d - pulseRadius);

            if (distFromRing < PULSE_THICKNESS) {
              // Bell curve intensity based on distance from ring center
              const intensity = Math.exp(-(distFromRing * distFromRing) / (PULSE_THICKNESS * 8));
              const finalAlpha = intensity * pulseFade2;

              // White-hot core
              ctx.globalAlpha = finalAlpha * 0.9;
              ctx.fillStyle = "#ffffff";
              ctx.fillRect(px - 1, py - 1, PIXEL_SIZE + 2, PIXEL_SIZE + 2);

              // Gold glow layer
              ctx.globalAlpha = finalAlpha * 0.7;
              ctx.fillStyle = "#e3b53d";
              ctx.fillRect(px - 3, py - 3, PIXEL_SIZE + 6, PIXEL_SIZE + 6);

              // Outer bloom
              ctx.globalAlpha = finalAlpha * 0.25;
              ctx.fillStyle = "#e3b53d";
              ctx.fillRect(px - 6, py - 6, PIXEL_SIZE + 12, PIXEL_SIZE + 12);
            }
          }
        }

        ctx.globalAlpha = 1;
      }

      raf = requestAnimationFrame(frame);
    }

    frame();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onClick);
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
