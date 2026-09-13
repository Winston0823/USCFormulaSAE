"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  animate,
  MotionValue,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import styles from "./MilestoneTrack.module.css";

export type Milestone = {
  year: string;
  event: string;
};

/* ── Track geometry (px) ────────────────────────────────────────────────────
   The car art is 600 × 1018 and points DOWN the page: front wing at the
   bottom, rear wing at the top. So it drives nose-first, and the rubber is
   laid from the rear (upper) axle.                                          */
const CAR_ASPECT = 1018 / 600;
const CAR_W_DESKTOP = 148;
const CAR_W_MOBILE = 96;

/* Measured off the sprite so the rubber matches the car that laid it:
   rear tyre centres sit 0.36 of the car's width either side of the
   centreline, each tyre is 0.193 of the car's width, and the rear axle
   line is 0.263 of the way down the art.                                   */
const TYRE_CENTRE_FRAC = 0.36;
const TYRE_WIDTH_FRAC = 0.193;
const REAR_AXLE_FRAC = 0.263;

/* tyre-mark.webp is a seamless 128 × 1024 rubber tile (alpha channel only) */
const MARK_TILE_ASPECT = 14; // stretched lengthwise: longer smears, fewer repeats

const LEAD_IN = 250; // travel before the first milestone
const SEG = 230; // travel between milestones
const RUN_OUT = 170; // travel after the last one

const DRIVE_EASE = [0.32, 0.02, 0.18, 1] as const; // launch hard, settle soft

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return isDesktop;
}

export default function MilestoneTrack({ milestones }: { milestones: Milestone[] }) {
  const prefersReduced = useReducedMotion();
  const isDesktop = useIsDesktop();

  const CAR_W = isDesktop ? CAR_W_DESKTOP : CAR_W_MOBILE;
  const CAR_H = Math.round(CAR_W * CAR_ASPECT);
  const REAR_AXLE = Math.round(CAR_H * REAR_AXLE_FRAC); // where the rubber leaves the car
  const MARK_HALF = Math.round(CAR_W * TYRE_CENTRE_FRAC); // rear track half-width
  const MARK_W = Math.round(CAR_W * TYRE_WIDTH_FRAC); // one tyre's contact width
  const trackXMobile = Math.round(CAR_W / 2) + 10;

  const [driving, setDriving] = useState(false);
  const [finished, setFinished] = useState(false);
  const [passed, setPassed] = useState(-1);

  const progress = useMotionValue(0);

  const stops = useMemo(
    () => milestones.map((_, i) => LEAD_IN + i * SEG),
    [milestones],
  );
  const total = (stops[stops.length - 1] ?? LEAD_IN) + RUN_OUT;

  const collapsedH = CAR_H + 96;
  const expandedH = total + CAR_H + 48;

  const stageHeight = useTransform(progress, [0, 1], [collapsedH, expandedH]);
  const carY = useTransform(progress, [0, 1], [0, total]);
  const hintOpacity = useTransform(progress, [0, 0.06], [1, 0]);

  // A card lights up as the car's midpoint crosses its marker, and goes dark
  // again as the car reverses past it. Assign rather than latch to the high
  // water mark: `y` is monotonic in `p`, so a plain assignment tracks the car
  // in both directions. Latching upward would re-light every card on the
  // first frame of a reset, before the car had moved back down the track.
  useMotionValueEvent(progress, "change", (p) => {
    const y = p * total + CAR_H * 0.5;
    let next = -1;
    for (let i = 0; i < stops.length; i++) if (y >= stops[i]) next = i;
    setPassed(next);
  });

  const drive = useCallback(() => {
    if (driving) return;
    setDriving(true);
    setFinished(false);
    setPassed(-1);
    progress.set(0);
    animate(progress, 1, {
      duration: 0.9 + milestones.length * 0.42,
      ease: DRIVE_EASE,
      onComplete: () => {
        setDriving(false);
        setFinished(true);
      },
    });
  }, [driving, milestones.length, progress]);

  const reset = useCallback(() => {
    setFinished(false);
    setPassed(-1);
    animate(progress, 0, { duration: 0.5, ease: "easeInOut" });
  }, [progress]);

  /* ── Reduced motion: skip the drive, show the finished state ───────────── */
  if (prefersReduced) {
    return (
      <div
        className={styles.wrap}
        style={{ "--track-x-mobile": `${trackXMobile}px` } as React.CSSProperties}
      >
        <div className={styles.stage} style={{ height: expandedH }}>
          <Marks total={total} rearAxle={REAR_AXLE} markHalf={MARK_HALF} markW={MARK_W} />
          {stops.map((s, i) => (
            <Node key={i} top={s} lit />
          ))}
          {milestones.map((m, i) => (
            <div
              key={`${m.year}-${m.event}`}
              className={`${styles.card} ${i % 2 === 0 ? styles.left : ""}`}
              style={{ top: stops[i], transform: "translateY(-50%)" }}
            >
              <MilestoneCard milestone={m} align={i % 2 === 0 ? "right" : "left"} />
            </div>
          ))}
          <div
            className={styles.centre}
            style={{ top: total, marginLeft: -CAR_W / 2 }}
          >
            <CarImage w={CAR_W} h={CAR_H} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={styles.wrap}
      style={{ "--track-x-mobile": `${trackXMobile}px` } as React.CSSProperties}
    >
      <motion.div className={styles.stage} style={{ height: stageHeight }}>
        {/* Tyre marks — these *are* the timeline's line */}
        <Marks
          total={total}
          rearAxle={REAR_AXLE}
          markHalf={MARK_HALF}
          markW={MARK_W}
          progress={progress}
        />

        {/* Milestone nodes */}
        {stops.map((s, i) => (
          <Node key={i} top={s} lit={i <= passed} />
        ))}

        {/* Milestone cards */}
        {milestones.map((m, i) => {
          const lit = i <= passed;
          const onLeft = i % 2 === 0;
          return (
            <motion.div
              key={`${m.year}-${m.event}`}
              className={`${styles.card} ${onLeft ? styles.left : ""}`}
              style={{ top: stops[i] }}
              initial={false}
              animate={{
                opacity: lit ? 1 : 0,
                x: lit ? 0 : onLeft ? 28 : -28,
                y: lit ? "-50%" : "-42%",
                pointerEvents: lit ? "auto" : "none",
              }}
              transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <MilestoneCard milestone={m} align={onLeft ? "right" : "left"} />
            </motion.div>
          );
        })}

        {/* The car */}
        <motion.div
          className={styles.centre}
          style={{ y: carY, top: 0, marginLeft: -CAR_W / 2 }}
        >
          <motion.button
            type="button"
            onClick={driving ? undefined : finished ? reset : drive}
            aria-label={
              finished
                ? "Reset the milestone timeline"
                : "Drive the car to reveal our milestones"
            }
            className="relative block cursor-pointer border-0 bg-transparent p-0"
            style={{ width: CAR_W, height: CAR_H }}
            whileHover={driving ? undefined : { scale: 1.04 }}
            whileTap={driving ? undefined : { scale: 0.97 }}
          >
            {/* soft halo so the parked car reads as interactive */}
            <motion.span
              aria-hidden
              className="absolute left-1/2 top-1/2 -z-10 block -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                width: CAR_W * 1.9,
                height: CAR_H * 0.95,
                background:
                  "radial-gradient(ellipse, rgba(255,120,40,0.30) 0%, rgba(139,0,0,0.16) 46%, transparent 72%)",
                filter: "blur(18px)",
              }}
              animate={
                driving ? { opacity: [0.85, 1, 0.85] } : { opacity: [0.4, 0.8, 0.4] }
              }
              transition={{ duration: driving ? 0.7 : 2.8, repeat: Infinity }}
            />
            <CarImage w={CAR_W} h={CAR_H} />
          </motion.button>
        </motion.div>

        {/* Prompt under the parked car */}
        <motion.div
          className={styles.centre}
          style={{
            top: CAR_H + 30,
            opacity: hintOpacity,
            width: 260,
            marginLeft: -130,
          }}
        >
          <span
            className="block text-center text-[11px] uppercase tracking-[0.4em] text-[#e3b53d]/80"
            style={{ fontFamily: "var(--font-jetbrains), monospace" }}
          >
            Tap to launch
          </span>
        </motion.div>
      </motion.div>

      {/* Replay */}
      <div className="mt-8 flex justify-center">
        <motion.button
          type="button"
          onClick={reset}
          initial={false}
          animate={{ opacity: finished ? 1 : 0, y: finished ? 0 : 8 }}
          transition={{ duration: 0.35 }}
          style={{
            pointerEvents: finished ? "auto" : "none",
            fontFamily: "var(--font-jetbrains), monospace",
          }}
          className="cursor-pointer rounded-full border border-[#e3b53d]/30 px-5 py-2 text-[11px] uppercase tracking-[0.3em] text-[#e3b53d]/80 transition-colors hover:border-[#e3b53d]/70 hover:text-[#ffe566]"
        >
          Reset lap
        </motion.button>
      </div>
    </div>
  );
}

/* ── Pieces ─────────────────────────────────────────────────────────────── */

function CarImage({ w, h }: { w: number; h: number }) {
  return (
    <Image
      src="/car-topdown-holo.webp"
      alt="Holographic top-down view of the USC Formula Electric car"
      width={600}
      height={1018}
      style={{
        width: w,
        height: h,
        display: "block",
        filter: "drop-shadow(0 0 14px rgba(255,96,32,0.35))",
      }}
      className="select-none"
      draggable={false}
    />
  );
}

function Marks({
  total,
  rearAxle,
  markHalf,
  markW,
  progress,
}: {
  total: number;
  rearAxle: number;
  markHalf: number;
  markW: number;
  progress?: MotionValue<number>;
}) {
  // Grow by animating height, not scaleY — scaling would squash the rubber
  // texture instead of laying more of it down.
  const fallback = useMotionValue(1); // hooks must run unconditionally
  const grown = useTransform(progress ?? fallback, (p: number) => p * total);
  const height = progress ? grown : total;

  const rubber =
    "linear-gradient(to bottom, rgba(120,0,0,0) 0%, rgba(150,20,0,0.34) 14%, rgba(196,80,22,0.62) 50%, rgba(255,142,58,0.95) 100%)";
  const tile = "url(/tyre-mark.webp)";
  const maskSize = `${markW}px ${Math.round(markW * MARK_TILE_ASPECT)}px`;

  return (
    <div
      className={styles.centre}
      style={{
        top: rearAxle,
        width: markHalf * 2 + markW,
        marginLeft: -(markHalf + markW / 2),
        height: total,
        pointerEvents: "none",
      }}
    >
      {[-1, 1].map((side) => (
        <motion.div
          key={side}
          style={{
            position: "absolute",
            top: 0,
            left: `calc(50% + ${side * markHalf}px)`,
            marginLeft: -markW / 2,
            width: markW,
            height,
            overflow: "hidden",
            // applied to the already-masked child, so the glow follows the
            // ragged edge of the rubber rather than a rectangle
            filter: "drop-shadow(0 0 7px rgba(255,120,40,0.32))",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              background: rubber,
              maskImage: tile,
              WebkitMaskImage: tile,
              maskRepeat: "repeat-y",
              WebkitMaskRepeat: "repeat-y",
              maskSize,
              WebkitMaskSize: maskSize,
              // flip and offset the right-hand mark so the two aren't twins
              transform: side > 0 ? "scaleX(-1)" : undefined,
              maskPosition: side > 0 ? `0 ${-markW * 3.1}px` : "0 0",
              WebkitMaskPosition: side > 0 ? `0 ${-markW * 3.1}px` : "0 0",
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}

function MilestoneCard({
  milestone,
  align,
}: {
  milestone: Milestone;
  align: "left" | "right";
}) {
  return (
    <div
      className="inline-block rounded-xl border border-[#e3b53d]/20 bg-white/5 p-5 backdrop-blur-sm transition-colors hover:border-[#e3b53d]/50 sm:p-6"
      style={{ textAlign: align === "right" ? "inherit" : "left" }}
    >
      <div className="mb-2 text-2xl font-bold text-[#e3b53d] sm:text-3xl">
        {milestone.year}
      </div>
      <div className="text-sm text-gray-300 sm:text-base">{milestone.event}</div>
    </div>
  );
}

function Node({ top, lit }: { top: number; lit: boolean }) {
  return (
    <div className={styles.centre} style={{ top, width: 0 }}>
      <motion.span
        className="block rounded-full"
        style={{
          width: 12,
          height: 12,
          marginLeft: -6,
          marginTop: -6,
          background: "#e3b53d",
          boxShadow: "0 0 0 4px #000, 0 0 18px rgba(227,181,61,0.9)",
        }}
        initial={false}
        animate={{ scale: lit ? 1 : 0.3, opacity: lit ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 420, damping: 18 }}
      />
      <motion.span
        aria-hidden
        className="absolute left-0 top-0 block rounded-full border border-[#e3b53d]"
        style={{ width: 12, height: 12, marginLeft: -6, marginTop: -6 }}
        initial={false}
        animate={lit ? { scale: [1, 3.4], opacity: [0.8, 0] } : { scale: 1, opacity: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      />
    </div>
  );
}
