"use client";

import {
  useState,
  useCallback,
  useEffect,
  useRef,
  useImperativeHandle,
  useSyncExternalStore,
  type Ref,
} from "react";
import Image from "next/image";
import { motion, useReducedMotion, type PanInfo } from "framer-motion";
import { MapPin, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { events, type EventData } from "@/lib/events";

/** How long each event holds the stage before auto-advancing. */
const AUTO_ADVANCE_MS = 13000;

export interface EventsCarouselHandle {
  goTo: (index: number) => void;
}

interface EventsCarouselProps {
  onIndexChange?: (index: number) => void;
  ref?: Ref<EventsCarouselHandle>;
}

/**
 * One event's frame. Every slide stays mounted and stacked so all media is
 * fetched and decoded up front - the crossfade never waits on the network.
 */
function Slide({
  event,
  isActive,
  priority,
  reducedMotion,
}: {
  event: EventData;
  isActive: boolean;
  priority: boolean;
  reducedMotion: boolean;
}) {
  const [loaded, setLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { media } = event;

  // Only the on-stage video decodes frames; the rest hold on their poster.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isActive) {
      void video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isActive]);

  return (
    <motion.div
      className="absolute inset-0"
      initial={false}
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.5, ease: [0.4, 0, 0.2, 1] }}
      aria-hidden={!isActive}
      style={{ pointerEvents: isActive ? undefined : "none" }}
      inert={!isActive}
    >
      {/* Media */}
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{ scale: isActive || reducedMotion ? 1 : 1.04 }}
        transition={{ duration: reducedMotion ? 0 : 0.7, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Sits under the media so an undecoded frame fades up from the shell, never pops */}
        <div className="absolute inset-0 bg-[#141416]" />

        {media.type === "image" && (
          <Image
            src={media.src}
            alt={media.alt}
            fill
            priority={priority}
            loading={priority ? undefined : "eager"}
            sizes="(min-width: 1024px) 1536px, 100vw"
            onLoad={() => setLoaded(true)}
            draggable={false}
            className={`object-cover pointer-events-none transition-opacity duration-500 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
          />
        )}

        {media.type === "video" && (
          <video
            ref={videoRef}
            src={media.src}
            poster={media.poster}
            aria-label={media.alt}
            muted
            loop
            playsInline
            preload="metadata"
            onLoadedData={() => setLoaded(true)}
            className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-500 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
          />
        )}
      </motion.div>

      {/* Bottom-weighted scrim carrying the type */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent" />

      {/* Overlay copy */}
      <motion.div
        className="absolute inset-x-0 bottom-0 px-6 pb-8 sm:px-10 sm:pb-10 lg:px-14 lg:pb-14"
        initial={false}
        animate={{ y: isActive || reducedMotion ? 0 : 14 }}
        transition={{ duration: reducedMotion ? 0 : 0.5, ease: [0.4, 0, 0.2, 1] }}
      >
        <h3
          className="font-black text-white leading-[0.95] tracking-tight max-w-3xl"
          style={{
            fontSize: "clamp(1.75rem, 4.5vw, 4rem)",
            textShadow: "0 2px 24px rgba(0,0,0,0.65)",
          }}
        >
          {event.title}
        </h3>
        <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm">
          <span className="inline-flex items-center gap-2 text-[#e3b53d] font-secondary font-semibold">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            {event.date}
          </span>
          <span className="inline-flex items-center gap-2 text-gray-400 font-secondary">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            {event.location}
          </span>
        </div>
        <p className="hidden sm:block mt-3 max-w-2xl text-gray-400 text-sm leading-relaxed line-clamp-2">
          {event.description}
        </p>
      </motion.div>
    </motion.div>
  );
}

/** Arrows stay visible on touch devices, where hover-reveal is unusable. */
const coarsePointerQuery = () => window.matchMedia("(pointer: coarse)");

function subscribeCoarsePointer(onChange: () => void) {
  const mq = coarsePointerQuery();
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function useCoarsePointer() {
  return useSyncExternalStore(
    subscribeCoarsePointer,
    () => coarsePointerQuery().matches,
    () => false
  );
}

export default function EventsCarousel({ onIndexChange, ref }: EventsCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const coarsePointer = useCoarsePointer();
  const reducedMotion = useReducedMotion() ?? false;

  // Hovering pauses the interval in place rather than restarting it: `elapsed`
  // banks how much of the current event's turn has already run. The CSS fill is
  // frozen the same way (animationPlayState) and keyed to the event rather than
  // to each run, so the two stay in step across any number of pauses.
  const elapsedRef = useRef(0);
  const lastIndexRef = useRef(0);

  const prevIndex = (activeIndex - 1 + events.length) % events.length;
  const nextIndex = (activeIndex + 1) % events.length;

  const goToEvent = useCallback(
    (newIndex: number) => {
      if (newIndex === activeIndex) return;
      // A new event gets a full turn, however far the last one had got.
      elapsedRef.current = 0;
      setActiveIndex(newIndex);
      onIndexChange?.(newIndex);
    },
    [activeIndex, onIndexChange]
  );

  useImperativeHandle(ref, () => ({ goTo: goToEvent }), [goToEvent]);

  const goNext = useCallback(() => {
    goToEvent((activeIndex + 1) % events.length);
  }, [activeIndex, goToEvent]);

  const goPrev = useCallback(() => {
    goToEvent((activeIndex - 1 + events.length) % events.length);
  }, [activeIndex, goToEvent]);

  // Auto-advance - paused while the viewer is engaged, off under reduced motion.
  // Banking elapsed time in the cleanup (rather than only when pausing) means any
  // re-run of this effect resumes the countdown instead of restarting it.
  useEffect(() => {
    if (lastIndexRef.current !== activeIndex) {
      lastIndexRef.current = activeIndex;
      elapsedRef.current = 0;
    }
    if (paused || reducedMotion || events.length <= 1) return;

    const banked = elapsedRef.current;
    const start = performance.now();
    const timer = setTimeout(goNext, Math.max(0, AUTO_ADVANCE_MS - banked));
    return () => {
      clearTimeout(timer);
      elapsedRef.current = banked + (performance.now() - start);
    };
  }, [activeIndex, paused, reducedMotion, goNext]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrev]);

  const pause = useCallback(() => setPaused(true), []);
  const resume = useCallback(() => setPaused(false), []);

  const handleDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      resume();
      if (info.offset.x < -60) goNext();
      else if (info.offset.x > 60) goPrev();
    },
    [goNext, goPrev, resume]
  );

  const edgeButton =
    "absolute top-0 bottom-0 w-12 sm:w-16 z-30 flex items-center justify-center text-white/70 hover:text-white transition-opacity duration-300 cursor-pointer focus-visible:opacity-100 focus-visible:outline-none";

  return (
    <div>
      <motion.div
        className="group relative w-full overflow-hidden rounded-2xl sm:rounded-3xl bg-[#141416] border border-white/[0.07] aspect-[4/5] sm:aspect-[16/10] lg:aspect-[21/9] touch-pan-y"
        onPointerEnter={pause}
        onPointerLeave={resume}
        onFocusCapture={pause}
        onBlurCapture={resume}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.18}
        onDragStart={pause}
        onDragEnd={handleDragEnd}
      >
        {events.map((evt, i) => (
          <Slide
            key={evt.title}
            event={evt}
            isActive={i === activeIndex}
            priority={i === 0}
            reducedMotion={reducedMotion}
          />
        ))}

        {/* Edge affordances - hover-revealed on fine pointers, always visible on touch */}
        <button
          onClick={goPrev}
          aria-label={`Previous event: ${events[prevIndex].title}`}
          className={`${edgeButton} left-0 bg-gradient-to-r from-black/50 to-transparent ${
            coarsePointer ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={goNext}
          aria-label={`Next event: ${events[nextIndex].title}`}
          className={`${edgeButton} right-0 bg-gradient-to-l from-black/50 to-transparent ${
            coarsePointer ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </motion.div>

      {/* Event index - each pill doubles as the auto-advance progress bar */}
      <div className="flex flex-wrap justify-center gap-2 mt-6 sm:mt-8">
        {events.map((evt, i) => {
          const isActive = i === activeIndex;
          return (
            <button
              key={evt.title}
              onClick={() => goToEvent(i)}
              aria-label={`Go to ${evt.title}`}
              aria-current={isActive}
              className={`relative overflow-hidden px-4 py-2 rounded-full text-[11px] font-secondary font-semibold tracking-wide transition-colors duration-300 cursor-pointer ${
                isActive
                  ? "bg-[#e3b53d]/15 text-[#e3b53d]"
                  : "bg-white/[0.04] text-gray-600 hover:text-gray-300 hover:bg-white/[0.08]"
              }`}
            >
              {isActive && (
                <span
                  key={activeIndex}
                  aria-hidden
                  className="absolute inset-0 origin-left bg-[#e3b53d]/30"
                  style={
                    reducedMotion
                      ? { transform: "scaleX(1)" }
                      : {
                          animation: `event-pill-progress ${AUTO_ADVANCE_MS}ms linear forwards`,
                          animationPlayState: paused ? "paused" : "running",
                        }
                  }
                />
              )}
              <span className="relative">{evt.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
