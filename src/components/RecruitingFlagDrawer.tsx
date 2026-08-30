"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, Instagram, X } from "lucide-react";
import CTAButton from "@/components/CTAButton";

const INSTAGRAM_URL = "https://www.instagram.com/uscformulaelectric/";

// Auto-peek: extend once on arrival so the message lands without a click,
// then retract to the flag tab. Once per tab session, never on repeat navs.
const PEEK_DELAY_MS = 2000;
const PEEK_HOLD_MS = 5000;
const PEEK_SESSION_KEY = "fe-recruiting-peeked";

// Collapsed tab: a rectangle stemming from the right edge of the screen.
const TAB_W = 46;
const TAB_H = 96;

// The box expands first, then the content fades in  -  never both at once.
const EXPAND_S = 0.45;
const FADE_S = 0.28;
const EXPAND_EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Dark stained glass: leaded panes stretched to fill whatever it sits in.
 * preserveAspectRatio="none" means one non-repeating sheet, so there are no
 * tiling seams at any size the box animates through. Jewel tones are drawn
 * from the site palette only  -  gold #e3b53d, ambient cardinal #8b0000,
 * near-black #0a0a0a.
 */
function StainedGlass({ idPrefix, className = "" }: { idPrefix: string; className?: string }) {
  const light = `${idPrefix}-light`;
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 340 240"
      preserveAspectRatio="none"
      className={`absolute inset-0 h-full w-full ${className}`}
    >
      <g>
        <polygon points="0,0 78,0 92,70 0,58" fill="rgba(227,181,61,0.10)" />
        <polygon points="78,0 150,0 168,55 92,70" fill="rgba(10,10,10,0.55)" />
        <polygon points="150,0 236,0 252,66 168,55" fill="rgba(139,0,0,0.20)" />
        <polygon points="236,0 340,0 340,52 252,66" fill="rgba(227,181,61,0.06)" />
        <polygon points="0,58 92,70 66,132 0,142" fill="rgba(139,0,0,0.14)" />
        <polygon points="92,70 168,55 140,150 66,132" fill="rgba(227,181,61,0.13)" />
        <polygon points="168,55 252,66 228,136 140,150" fill="rgba(10,10,10,0.50)" />
        <polygon points="252,66 340,52 340,148 228,136" fill="rgba(168,150,69,0.10)" />
        <polygon points="0,142 66,132 84,240 0,240" fill="rgba(10,10,10,0.60)" />
        <polygon points="66,132 140,150 158,240 84,240" fill="rgba(139,0,0,0.18)" />
        <polygon points="140,150 228,136 244,240 158,240" fill="rgba(227,181,61,0.09)" />
        <polygon points="228,136 340,148 340,240 244,240" fill="rgba(10,10,10,0.45)" />
      </g>

      {/* Cames  -  the lead between panes */}
      <g stroke="#e3b53d" strokeOpacity="0.26" strokeWidth="1" fill="none">
        <polyline points="0,58 92,70 168,55 252,66 340,52" />
        <polyline points="0,142 66,132 140,150 228,136 340,148" />
        <line x1="78" y1="0" x2="92" y2="70" />
        <line x1="150" y1="0" x2="168" y2="55" />
        <line x1="236" y1="0" x2="252" y2="66" />
        <line x1="92" y1="70" x2="66" y2="132" />
        <line x1="168" y1="55" x2="140" y2="150" />
        <line x1="252" y1="66" x2="228" y2="136" />
        <line x1="66" y1="132" x2="84" y2="240" />
        <line x1="140" y1="150" x2="158" y2="240" />
        <line x1="228" y1="136" x2="244" y2="240" />
        {/* Diagonals break the quad grid into shards */}
        <line x1="92" y1="70" x2="140" y2="150" strokeOpacity="0.16" />
        <line x1="236" y1="0" x2="168" y2="55" strokeOpacity="0.16" />
        <line x1="66" y1="132" x2="158" y2="240" strokeOpacity="0.16" />
      </g>

      <defs>
        <radialGradient id={light} cx="0.18" cy="0.1" r="0.95">
          <stop offset="0%" stopColor="#e3b53d" stopOpacity="0.16" />
          <stop offset="55%" stopColor="#e3b53d" stopOpacity="0.03" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.35" />
        </radialGradient>
      </defs>
      <rect width="340" height="240" fill={`url(#${light})`} />
    </svg>
  );
}

function CheckeredFlag({ size = 24, idPrefix }: { size?: number; idPrefix: string }) {
  const checker = `${idPrefix}-checker`;
  const clip = `${idPrefix}-clip`;
  const flag =
    "M7 5 C 12 2.2, 17 7.4, 22 4.8 C 24 3.8, 26 4, 27.5 4.8 L 27.5 16.4 C 26 15.6, 24 15.4, 22 16.4 C 17 19, 12 13.8, 7 16.6 Z";

  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className="shrink-0"
    >
      <defs>
        <pattern id={checker} width="6.4" height="6.4" patternUnits="userSpaceOnUse">
          <rect width="3.2" height="3.2" fill="currentColor" />
          <rect x="3.2" y="3.2" width="3.2" height="3.2" fill="currentColor" />
        </pattern>
        <clipPath id={clip}>
          <path d={flag} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clip})`}>
        <rect x="0" y="0" width="32" height="20" fill="rgba(0,0,0,0.6)" />
        <rect x="0" y="0" width="32" height="20" fill={`url(#${checker})`} />
      </g>
      <path d={flag} stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M7 4 L7 28.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function RecruitingFlagDrawer() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const reducedMotion = useReducedMotion() ?? false;

  // The drawer belongs to the homepage hero, not the whole site.
  const onHome = pathname === "/";

  const rootRef = useRef<HTMLDivElement>(null);
  const tabRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const hoveredRef = useRef(false);
  const interactedRef = useRef(false);
  // Focus the panel only when the visitor opened it themselves  -  the
  // auto-peek must never steal focus out from under someone mid-task.
  const focusOnOpenRef = useRef(false);

  // The box animates to explicit pixels, so it has to know how big the content
  // actually is. Measuring (rather than hardcoding) keeps the expanded size
  // correct when the copy wraps differently at a narrow viewport.
  const [size, setSize] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setSize({ w: el.offsetWidth, h: el.offsetHeight });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const measured = size.w > 0 && size.h > 0;
  const expanded = open && measured;

  const close = useCallback(() => {
    interactedRef.current = true;
    setOpen(false);
  }, []);

  const openDrawer = useCallback(() => {
    interactedRef.current = true;
    focusOnOpenRef.current = true;
    setOpen(true);
  }, []);

  // Auto-peek, once per tab session.
  useEffect(() => {
    if (!onHome) return;
    if (sessionStorage.getItem(PEEK_SESSION_KEY)) return;

    let closeTimer: ReturnType<typeof setTimeout> | undefined;

    // If they're reading it when the hold expires, wait  -  don't yank it away.
    const scheduleRetract = () => {
      closeTimer = setTimeout(() => {
        if (interactedRef.current) return;
        if (hoveredRef.current) {
          scheduleRetract();
          return;
        }
        setOpen(false);
      }, PEEK_HOLD_MS);
    };

    const openTimer = setTimeout(() => {
      if (interactedRef.current) return;
      sessionStorage.setItem(PEEK_SESSION_KEY, "1");
      setOpen(true);
      scheduleRetract();
    }, PEEK_DELAY_MS);

    return () => {
      clearTimeout(openTimer);
      if (closeTimer) clearTimeout(closeTimer);
    };
  }, [onHome]);

  // Escape and outside click dismiss the panel.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      close();
      tabRef.current?.focus();
    };
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current?.contains(e.target as Node)) return;
      close();
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open, close]);

  // Focus lands only once the content has actually faded in.
  useEffect(() => {
    if (!expanded || !focusOnOpenRef.current) return;
    focusOnOpenRef.current = false;
    const t = setTimeout(
      () => contentRef.current?.focus(),
      reducedMotion ? 0 : (EXPAND_S + FADE_S) * 1000
    );
    return () => clearTimeout(t);
  }, [expanded, reducedMotion]);

  if (!onHome) return null;

  // Expand the box, THEN fade the content in. On close, run it in reverse:
  // fade the content out first, then contract the box.
  const boxTransition = reducedMotion
    ? { duration: 0 }
    : { duration: EXPAND_S, ease: EXPAND_EASE, delay: expanded ? 0 : 0.16 };

  const contentTransition = reducedMotion
    ? { duration: 0 }
    : expanded
      ? { duration: FADE_S, delay: EXPAND_S }
      : { duration: 0.16, delay: 0 };

  const tabFaceTransition = reducedMotion
    ? { duration: 0 }
    : expanded
      ? { duration: 0.14, delay: 0 }
      : { duration: 0.2, delay: EXPAND_S + 0.1 };

  return (
    <div
      ref={rootRef}
      // Flush to the right edge of the viewport so the tab reads as part of the
      // screen border. Vertically it clears the sticky Donate pill.
      className="fixed z-40 bottom-[5.5rem] right-0 sm:bottom-[6.5rem]"
      onMouseEnter={() => {
        hoveredRef.current = true;
      }}
      onMouseLeave={() => {
        hoveredRef.current = false;
      }}
    >
      <motion.div
        animate={{
          width: expanded ? size.w : TAB_W,
          height: expanded ? size.h : TAB_H,
        }}
        initial={false}
        transition={boxTransition}
        // No style width/height here: `initial={false}` already seeds the box at
        // the collapsed `animate` values, and a static style prop would fight
        // motion by resetting the size on every React re-render.
        // No right border or right radius: that edge is off-screen.
        className="relative overflow-hidden rounded-l-2xl border-y border-l border-[#e3b53d]/40 bg-black/55 shadow-[-14px_0_50px_-12px_rgba(0,0,0,0.9),0_0_28px_-10px_rgba(227,181,61,0.35)] backdrop-blur-xl"
      >
        <StainedGlass idPrefix="fe-glass-drawer" />

        {/* Collapsed face  -  fades out the instant the box starts opening. */}
        <motion.button
          ref={tabRef}
          type="button"
          onClick={openDrawer}
          aria-expanded={open}
          aria-controls="recruiting-drawer-panel"
          aria-label="We're recruiting  -  open for details"
          animate={{ opacity: expanded ? 0 : 1 }}
          initial={false}
          transition={tabFaceTransition}
          inert={expanded}
          style={{ width: TAB_W }}
          className="absolute inset-y-0 right-0 flex flex-col items-center justify-center gap-1.5 text-[#e3b53d] transition-colors duration-300 hover:bg-[#e3b53d]/10 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#e3b53d]"
        >
          <CheckeredFlag size={24} idPrefix="fe-flag-tab" />
          <ChevronLeft className="h-3.5 w-3.5 text-[#e3b53d]/55" />
        </motion.button>

        {/* Panel content  -  anchored to the bottom-right corner so the box
            unmasks it as it grows up and to the left. Fixed width, so the
            measurement above is independent of the box's current size. */}
        <motion.div
          ref={contentRef}
          id="recruiting-drawer-panel"
          tabIndex={-1}
          animate={{ opacity: expanded ? 1 : 0 }}
          initial={false}
          transition={contentTransition}
          inert={!expanded}
          className="absolute bottom-0 right-0 w-[min(22.5rem,calc(100vw-2rem))] px-6 pb-6 pt-5 outline-none"
        >
          <button
            type="button"
            onClick={close}
            aria-label="Dismiss recruiting notice"
            className="absolute right-3 top-3 rounded-full p-1.5 text-white/40 transition-colors hover:bg-white/5 hover:text-[#e3b53d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#e3b53d]"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="mb-3 flex items-center gap-2.5 text-[#e3b53d]">
            <CheckeredFlag size={22} idPrefix="fe-flag-panel" />
            <span
              className="text-[11px] font-bold uppercase"
              style={{
                fontFamily: "var(--font-rajdhani), sans-serif",
                letterSpacing: "0.25em",
              }}
            >
              Now Recruiting
            </span>
          </div>

          <p
            className="mb-2 text-xl leading-tight text-white"
            style={{ fontFamily: "'Ethnocentric', sans-serif" }}
          >
            Race with us
          </p>

          <p
            className="mb-5 text-pretty text-[15px] leading-snug text-white/70"
            style={{ fontFamily: "var(--font-rajdhani), sans-serif" }}
          >
            New members, all majors. No experience required.
          </p>

          <CTAButton
            href={INSTAGRAM_URL}
            size="sm"
            className="w-full"
            onClick={close}
            aria-label="USC Formula Electric on Instagram"
          >
            <Instagram className="h-4 w-4" />
            @uscformulaelectric
          </CTAButton>

          <p
            className="mt-2.5 text-center text-[11px] uppercase text-white/45"
            style={{
              fontFamily: "var(--font-rajdhani), sans-serif",
              letterSpacing: "0.15em",
            }}
          >
            Details in our bio
          </p>
        </motion.div>
      </motion.div>

      {/* Attract glow  -  the tab's edge brightens and settles. Opacity only:
          translating it would peel the tab off the border it stems from.
          Only while closed, and never under reduced motion. */}
      {!expanded && !reducedMotion && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 rounded-l-2xl border-y border-l border-[#e3b53d] shadow-[-6px_0_20px_-4px_rgba(227,181,61,0.6)]"
          style={{ width: TAB_W }}
          animate={{ opacity: [0, 0.55, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 2.4, ease: "easeInOut" }}
        />
      )}
    </div>
  );
}
