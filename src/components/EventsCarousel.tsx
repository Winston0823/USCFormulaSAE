"use client";

import { useState, useCallback, useEffect, useRef, useImperativeHandle, type Ref } from "react";
import Image from "next/image";
import { motion, AnimatePresence, LayoutGroup, useReducedMotion, type PanInfo } from "framer-motion";
import { CalendarDays, MapPin, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { events } from "@/lib/events";

export interface EventsCarouselHandle {
  goTo: (index: number) => void;
}

interface EventsCarouselProps {
  onIndexChange?: (index: number) => void;
  ref?: Ref<EventsCarouselHandle>;
}

/** Branded stand-in for events that don't have photos yet. */
function PlaceholderCard({ compact = false, showLabel = true }: { compact?: boolean; showLabel?: boolean }) {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-[#26221a] via-[#1c1c1f] to-[#141416]">
      <div className="absolute inset-0 circuit-pattern opacity-10" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        <CalendarDays className={compact ? "w-10 h-10 text-[#e3b53d]/25" : "w-16 h-16 text-[#e3b53d]/25"} />
        {showLabel && (
          <span className="text-[#e3b53d]/50 text-[10px] font-secondary font-semibold uppercase tracking-[0.3em]">
            Photos coming soon
          </span>
        )}
      </div>
    </div>
  );
}

export default function EventsCarousel({ onIndexChange, ref }: EventsCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [phase, setPhase] = useState<"idle" | "fading" | "moving">("idle");
  const [galleryPaused, setGalleryPaused] = useState(false);
  const [coarsePointer, setCoarsePointer] = useState(false);
  const pendingIndex = useRef<number | null>(null);
  const pendingDirection = useRef(0);
  const reducedMotion = useReducedMotion();

  const activeEvent = events[activeIndex];
  const prevIndex = (activeIndex - 1 + events.length) % events.length;
  const nextIndex = (activeIndex + 1) % events.length;
  const hasImages = activeEvent.images.length > 0;

  // Arrows/dots stay visible on touch devices where hover-reveal is unusable
  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    setCoarsePointer(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setCoarsePointer(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (phase === "fading") {
      const timer = setTimeout(() => {
        if (pendingIndex.current !== null) {
          setDirection(pendingDirection.current);
          setActiveIndex(pendingIndex.current);
          onIndexChange?.(pendingIndex.current);
          setImageIndex(0);
          pendingIndex.current = null;
        }
        setPhase("moving");
      }, 280);
      return () => clearTimeout(timer);
    }
  }, [phase, onIndexChange]);

  const triggerTransition = useCallback(
    (newIndex: number, dir: number) => {
      if (phase !== "idle" || newIndex === activeIndex) return;
      pendingIndex.current = newIndex;
      pendingDirection.current = dir;
      setPhase("fading");
    },
    [activeIndex, phase]
  );

  const goToEvent = useCallback(
    (newIndex: number) => {
      triggerTransition(newIndex, newIndex > activeIndex ? 1 : -1);
    },
    [activeIndex, triggerTransition]
  );

  useImperativeHandle(ref, () => ({ goTo: goToEvent }), [goToEvent]);

  const goNext = useCallback(() => {
    triggerTransition((activeIndex + 1) % events.length, 1);
  }, [activeIndex, triggerTransition]);

  const goPrev = useCallback(() => {
    triggerTransition((activeIndex - 1 + events.length) % events.length, -1);
  }, [activeIndex, triggerTransition]);

  const contentVisible = phase === "idle";

  const nextImage = useCallback(() => {
    setImageIndex((prev) => (prev + 1) % activeEvent.images.length);
  }, [activeEvent.images.length]);

  const prevImage = useCallback(() => {
    setImageIndex((prev) => (prev - 1 + activeEvent.images.length) % activeEvent.images.length);
  }, [activeEvent.images.length]);

  // Auto-scroll images every 3 seconds  -  paused while interacting, off under reduced motion
  useEffect(() => {
    if (activeEvent.images.length <= 1 || galleryPaused || reducedMotion) return;
    const timer = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % activeEvent.images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [activeIndex, activeEvent.images.length, galleryPaused, reducedMotion]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrev]);

  const handleSwipeEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      setGalleryPaused(false);
      if (info.offset.x < -60) goNext();
      else if (info.offset.x > 60) goPrev();
    },
    [goNext, goPrev]
  );

  return (
    <div>
      {/* Mobile layout */}
      <div className="lg:hidden">
        {/* Mobile prev/next */}
        <div className="flex gap-3 mb-5">
          <button
            onClick={goPrev}
            aria-label={`Previous: ${events[prevIndex].title}`}
            className="flex-1 flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] transition-all cursor-pointer active:scale-[0.98]"
          >
            <ChevronLeft className="w-5 h-5 text-[#e3b53d] shrink-0" />
            <div className="text-left min-w-0">
              <p className="text-white text-xs font-bold truncate">{events[prevIndex].title}</p>
              <p className="text-gray-600 text-xs">{events[prevIndex].date}</p>
            </div>
          </button>
          <button
            onClick={goNext}
            aria-label={`Next: ${events[nextIndex].title}`}
            className="flex-1 flex items-center justify-end gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] transition-all cursor-pointer active:scale-[0.98]"
          >
            <div className="text-right min-w-0">
              <p className="text-white text-xs font-bold truncate">{events[nextIndex].title}</p>
              <p className="text-gray-600 text-xs">{events[nextIndex].date}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-[#e3b53d] shrink-0" />
          </button>
        </div>

        {/* Mobile active card  -  swipeable */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={activeIndex}
            custom={direction}
            initial={{ x: direction > 0 ? 120 : -120, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction > 0 ? -120 : 120, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragStart={() => setGalleryPaused(true)}
            onDragEnd={handleSwipeEnd}
          >
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-[#2a2a2e] border border-white/[0.08]">
              {hasImages ? (
                <>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={imageIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={activeEvent.images[imageIndex]}
                        alt={`${activeEvent.title} photo ${imageIndex + 1}`}
                        fill
                        sizes="100vw"
                        className="object-cover pointer-events-none"
                        draggable={false}
                      />
                    </motion.div>
                  </AnimatePresence>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  {activeEvent.images.length > 1 && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                      {activeEvent.images.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setImageIndex(i)}
                          aria-label={`Photo ${i + 1}`}
                          className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                            i === imageIndex ? "bg-[#e3b53d] w-6" : "bg-white/40 w-1.5"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <PlaceholderCard compact />
              )}
            </div>
            <div className="mt-4">
              <span className="text-[#e3b53d] text-[10px] font-bold tracking-[0.2em] uppercase">{activeEvent.tag}</span>
              <h3 className="text-xl font-bold text-white mt-1 mb-2">{activeEvent.title}</h3>
              <div className="flex flex-wrap gap-3 mb-2 text-xs">
                <span className="inline-flex items-center gap-1.5 text-[#e3b53d] font-secondary">
                  <Clock className="w-3 h-3" />
                  {activeEvent.date}
                </span>
                <span className="inline-flex items-center gap-1.5 text-gray-500 font-secondary">
                  <MapPin className="w-3 h-3" />
                  {activeEvent.location}
                </span>
              </div>
              <p className="text-gray-500 leading-relaxed text-xs line-clamp-3">{activeEvent.description}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Desktop three-panel carousel ── */}
      <LayoutGroup>
        <div className="hidden lg:flex items-stretch gap-4" style={{ height: "clamp(500px, 65vh, 720px)" }}>
          {[prevIndex, activeIndex, nextIndex].map((eventIdx, pos) => {
            const isActive = pos === 1;
            const isPrev = pos === 0;
            const evt = events[eventIdx];
            return (
              <motion.div
                key={eventIdx}
                layoutId={`event-card-${eventIdx}`}
                layout="position"
                style={{ flex: isActive ? 5 : 1 }}
                initial={false}
                animate={{ opacity: isActive ? 1 : 0.4 }}
                whileHover={!isActive ? { opacity: 0.7 } : undefined}
                transition={{
                  layout: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
                  opacity: { duration: 0.3 },
                }}
                onLayoutAnimationComplete={() => {
                  if (phase === "moving") setPhase("idle");
                }}
                onClick={!isActive ? (isPrev ? goPrev : goNext) : undefined}
                className={`relative rounded-2xl overflow-hidden bg-[#2a2a2e] border border-white/[0.06] ${
                  !isActive ? "cursor-pointer group" : ""
                }`}
              >
                {/* Always-visible gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                {/* Subtle ambient glow for active */}
                {isActive && (
                  <div
                    className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[80%] h-40 rounded-full pointer-events-none"
                    style={{ background: "radial-gradient(ellipse, rgba(227,181,61,0.06) 0%, transparent 70%)" }}
                  />
                )}

                {/* Placeholder  -  shown when the event has no photos yet; label hidden behind side-panel content */}
                {evt.images.length === 0 && <PlaceholderCard compact={!isActive} showLabel={isActive} />}

                {/* ── Side panel content ── */}
                <AnimatePresence mode="wait">
                  {!isActive && contentVisible && (
                    <motion.div
                      key={`side-${eventIdx}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-3"
                    >
                      <div className="mb-5">
                        {isPrev ? (
                          <ChevronLeft className="w-6 h-6 text-[#e3b53d]/40 group-hover:text-[#e3b53d]/80 transition-colors mx-auto" />
                        ) : (
                          <ChevronRight className="w-6 h-6 text-[#e3b53d]/40 group-hover:text-[#e3b53d]/80 transition-colors mx-auto" />
                        )}
                      </div>
                      <span className="text-[#e3b53d]/60 text-[9px] font-bold tracking-[0.2em] uppercase mb-2">{evt.tag}</span>
                      <p className="text-white/60 group-hover:text-white/90 text-xs font-bold transition-colors leading-snug max-w-[120px]">
                        {evt.title}
                      </p>
                      <p className="text-gray-600 text-[10px] mt-2 font-secondary">{evt.date}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ── Active panel content ── */}
                <AnimatePresence mode="wait">
                  {isActive && contentVisible && (
                    <motion.div
                      key={`active-${eventIdx}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 z-10 flex flex-col"
                    >
                      {/* Gallery */}
                      <div
                        className="relative flex-1 min-h-0 group"
                        onPointerEnter={() => setGalleryPaused(true)}
                        onPointerLeave={() => setGalleryPaused(false)}
                      >
                        {hasImages && (
                          <>
                            <AnimatePresence mode="wait">
                              <motion.div
                                key={imageIndex}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="absolute inset-0"
                              >
                                <Image
                                  src={activeEvent.images[imageIndex]}
                                  alt={`${activeEvent.title} photo ${imageIndex + 1}`}
                                  fill
                                  sizes="(min-width: 1024px) 70vw, 100vw"
                                  className="object-cover"
                                />
                              </motion.div>
                            </AnimatePresence>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                          </>
                        )}

                        {/* Gallery arrows  -  hover-revealed on fine pointers, always visible on touch */}
                        {activeEvent.images.length > 1 && (
                          <>
                            <button
                              onClick={prevImage}
                              aria-label="Previous photo"
                              className={`absolute left-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-white/25 transition-all cursor-pointer z-20 focus-visible:opacity-100 ${
                                coarsePointer ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                              }`}
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                              onClick={nextImage}
                              aria-label="Next photo"
                              className={`absolute right-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-white/25 transition-all cursor-pointer z-20 focus-visible:opacity-100 ${
                                coarsePointer ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                              }`}
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </>
                        )}

                        {/* Dots  -  positioned above title */}
                        {activeEvent.images.length > 1 && (
                          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                            {activeEvent.images.map((_, i) => (
                              <button
                                key={i}
                                onClick={() => setImageIndex(i)}
                                aria-label={`Photo ${i + 1}`}
                                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                                  i === imageIndex ? "bg-[#e3b53d] w-6" : "bg-white/30 hover:bg-white/60 w-1.5"
                                }`}
                              />
                            ))}
                          </div>
                        )}

                        {/* Counter chip */}
                        {hasImages && (
                          <div className="absolute top-5 right-5 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-white/50 text-[10px] font-data z-20">
                            {imageIndex + 1} / {activeEvent.images.length}
                          </div>
                        )}

                        {/* Tag chip */}
                        <div className="absolute top-5 left-5 px-3 py-1 rounded-full bg-[#e3b53d]/10 border border-[#e3b53d]/20 text-[#e3b53d] text-[10px] font-bold tracking-[0.15em] z-20">
                          {activeEvent.tag}
                        </div>

                        {/* Title overlaid at bottom of gallery */}
                        <h3
                          className="absolute bottom-4 left-6 right-6 z-20 text-[clamp(1.25rem,2.5vw,2rem)] font-black text-white leading-tight tracking-tight"
                          style={{ textShadow: "0 2px 12px rgba(0,0,0,0.7), 0 1px 3px rgba(0,0,0,0.5)" }}
                        >
                          {activeEvent.title}
                        </h3>
                      </div>

                      {/* Compact details bar below gallery */}
                      <div className="shrink-0 px-6 py-4">
                        <div className="flex flex-wrap items-center gap-5 mb-2">
                          <span className="inline-flex items-center gap-2 text-[#e3b53d] text-sm font-secondary font-semibold">
                            <Clock className="w-4 h-4" />
                            {activeEvent.date}
                          </span>
                          <span className="inline-flex items-center gap-2 text-gray-500 text-sm font-secondary">
                            <MapPin className="w-4 h-4" />
                            {activeEvent.location}
                          </span>
                        </div>
                        <p className="text-gray-400 leading-relaxed max-w-2xl text-[0.9rem] line-clamp-3">
                          {activeEvent.description}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </LayoutGroup>

      {/* Event index  -  horizontal pills */}
      <div className="flex justify-center gap-2 mt-10">
        {events.map((evt, i) => (
          <button
            key={i}
            onClick={() => goToEvent(i)}
            aria-label={`Go to ${evt.title}`}
            className={`relative px-4 py-2 rounded-full text-[11px] font-secondary font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
              i === activeIndex
                ? "bg-[#e3b53d] text-black"
                : "bg-white/[0.04] text-gray-600 hover:text-gray-300 hover:bg-white/[0.08]"
            }`}
          >
            {evt.tag}
          </button>
        ))}
      </div>
    </div>
  );
}
