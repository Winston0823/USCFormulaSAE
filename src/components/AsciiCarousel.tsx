"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AsciiCarousel as Engine } from "@/lib/asciiEngine";

interface Props {
  images: string[];
  /** Announced to screen readers and used as the reduced-motion alt text. */
  label: string;
  className?: string;
}

/**
 * Full-bleed carousel that transitions between photos through a tinted ASCII
 * field. Pauses when scrolled out of view or when the tab is hidden, and falls
 * back to a plain crossfade when the user prefers reduced motion.
 */
export default function AsciiCarousel({ images, label, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const [index, setIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const reduced = useReducedMotion();

  /* Reduced motion: no canvas at all, just a slow CSS crossfade. */
  useEffect(() => {
    if (!reduced) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % images.length), 5000);
    return () => clearInterval(id);
  }, [reduced, images.length]);

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const engine = new Engine(canvas, { onIndexChange: setIndex });
    engineRef.current = engine;
    engine.load(images).then(() => setReady(true)).catch(() => setReady(false));

    // Resizes are debounced because each one rebuilds the atlas and resamples
    // every image against the new grid.
    let resizeTimer: ReturnType<typeof setTimeout>;
    const ro = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        engine.resize();
        engine.repaint();
      }, 150);
    });
    ro.observe(wrap);

    const io = new IntersectionObserver(
      ([entry]) => engine.setPaused(!entry.isIntersecting || document.hidden),
      { threshold: 0.01 }
    );
    io.observe(wrap);

    const onVisibility = () => engine.setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      clearTimeout(resizeTimer);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      engine.destroy();
      engineRef.current = null;
    };
  }, [reduced, images]);

  return (
    <div
      ref={wrapRef}
      className={className}
      style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#0b0b0d" }}
      aria-hidden="true"
    >
      {reduced ? (
        images.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={src + i}
            src={src}
            alt={i === index ? label : ""}
            style={{
              position: "absolute", inset: 0, width: "100%", height: "100%",
              objectFit: "cover", opacity: i === index ? 1 : 0,
              transition: "opacity 1.2s ease",
            }}
          />
        ))
      ) : (
        <canvas
          ref={canvasRef}
          style={{
            display: "block", width: "100%", height: "100%",
            opacity: ready ? 1 : 0, transition: "opacity 0.5s ease",
          }}
        />
      )}

      {/* Slide indicators — outside the canvas so they stay crisp and clickable. */}
      <div
        aria-hidden="false"
        style={{
          position: "absolute", right: 32, bottom: 32, display: "flex", gap: 10,
          zIndex: 3,
        }}
      >
        {images.map((src, i) => (
          <button
            key={src + i}
            onClick={() => {
              if (reduced) setIndex(i);
              else engineRef.current?.goTo(i);
            }}
            aria-label={`Show image ${i + 1} of ${images.length}`}
            style={{
              width: i === index ? 26 : 9, height: 9, borderRadius: 2, border: 0,
              padding: 0, cursor: "pointer",
              background: i === index ? "#e3b53d" : "rgba(255,255,255,0.32)",
              transition: "width 0.4s cubic-bezier(.2,.8,.2,1), background 0.4s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}

/** Live `prefers-reduced-motion`, read without a render-triggering effect. */
function useReducedMotion() {
  const subscribe = useCallback((cb: () => void) => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    mq.addEventListener("change", cb);
    return () => mq.removeEventListener("change", cb);
  }, []);
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );
}
