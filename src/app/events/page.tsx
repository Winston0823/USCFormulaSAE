"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import {
  CalendarDays,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Clock,
  ArrowUpRight,
} from "lucide-react";

interface EventData {
  title: string;
  date: string;
  location: string;
  description: string;
  images: string[];
  tag: string;
}

const events: EventData[] = [
  {
    title: "FSAE Electric Michigan 2025",
    date: "June 2025",
    location: "Brooklyn, Michigan",
    tag: "COMPETITION",
    description:
      "Our team competes in the Formula SAE Electric competition — designing, manufacturing, and testing a fully functioning electric race car against top university teams from around the world.",
    images: ["/competition-2025-1.jpg", "/competition-2025-2.jpg", "/competition-2025-3.jpg", "/competition-2025-4.jpg", "/competition-2025-5.jpg"],
  },
  {
    title: "AME Awards Car Unveiling",
    date: "Spring 2024",
    location: "USC Campus, Los Angeles",
    tag: "MILESTONE",
    description:
      "A historic milestone — the first time in team history we unveiled our car at the AME Awards ceremony, showcasing months of engineering work to faculty, sponsors, and fellow students.",
    images: ["/placeholder-event-4.jpg", "/placeholder-event-5.jpg"],
  },
  {
    title: "Spring Build Season",
    date: "January – May 2025",
    location: "USC Workshop",
    tag: "BUILD",
    description:
      "Our most intensive period — all eight subteams converge in the workshop to fabricate, assemble, and test every component of the car before competition season.",
    images: ["/placeholder-event-6.jpg", "/placeholder-event-7.jpg"],
  },
  {
    title: "Fall Kickoff & Recruitment",
    date: "September 2024",
    location: "USC Campus, Los Angeles",
    tag: "RECRUITMENT",
    description:
      "We welcome new members of all majors and experience levels. Kickoff includes team introductions, subteam overviews, and hands-on demos to get everyone excited for the build season ahead.",
    images: ["/placeholder-event-8.jpg", "/placeholder-event-9.jpg"],
  },
];

export default function EventsPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [phase, setPhase] = useState<"idle" | "fading" | "moving">("idle");
  const pendingIndex = useRef<number | null>(null);
  const pendingDirection = useRef(0);

  const activeEvent = events[activeIndex];
  const prevIndex = (activeIndex - 1 + events.length) % events.length;
  const nextIndex = (activeIndex + 1) % events.length;

  useEffect(() => {
    if (phase === "fading") {
      const timer = setTimeout(() => {
        if (pendingIndex.current !== null) {
          setDirection(pendingDirection.current);
          setActiveIndex(pendingIndex.current);
          setImageIndex(0);
          pendingIndex.current = null;
        }
        setPhase("moving");
      }, 280);
      return () => clearTimeout(timer);
    }
  }, [phase]);

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrev]);

  return (
    <div className="min-h-screen bg-black">
      {/* Header — editorial, asymmetric */}
      <div className="pt-36 pb-6 sm:pt-40 sm:pb-10 max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-[#e3b53d]" />
            <span className="text-[#e3b53d] text-xs font-secondary uppercase tracking-[0.25em] font-semibold">
              Season {new Date().getFullYear()}
            </span>
          </div>
          <h1
            className="text-[clamp(3rem,8vw,7rem)] font-black text-white leading-[0.9] tracking-tight"
          >
            Our <span className="text-[#e3b53d]">Events</span>
          </h1>
          <p className="text-gray-500 text-base sm:text-lg mt-4 max-w-xl font-secondary">
            From build season to race day — follow the journey.
          </p>
        </motion.div>
      </div>

      {/* ── Carousel Section ── */}
      <section className="pb-16 sm:pb-28">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16">

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

            {/* Mobile active card */}
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={activeIndex}
                custom={direction}
                initial={{ x: direction > 0 ? 120 : -120, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: direction > 0 ? -120 : 120, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-[#2a2a2e] border border-white/[0.08]">
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#3a3a3e] to-[#2a2a2e]">
                    <CalendarDays className="w-12 h-12 text-[#e3b53d]/20" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-[#e3b53d] text-[10px] font-bold tracking-[0.2em] uppercase">{activeEvent.tag}</span>
                  <h2 className="text-xl font-bold text-white mt-1 mb-2">{activeEvent.title}</h2>
                  <div className="flex flex-wrap gap-3 mb-2 text-xs">
                    <span className="inline-flex items-center gap-1.5 text-[#e3b53d] font-secondary">
                      <Clock className="w-3 h-3" />{activeEvent.date}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-gray-500 font-secondary">
                      <MapPin className="w-3 h-3" />{activeEvent.location}
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
                    onLayoutAnimationComplete={() => { if (phase === "moving") setPhase("idle"); }}
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

                    {/* Placeholder icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <CalendarDays className={`transition-all duration-500 ${isActive ? "w-20 h-20 text-[#e3b53d]/15" : "w-10 h-10 text-[#e3b53d]/20"}`} />
                    </div>

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
                          <div className="relative flex-1 min-h-0 group">
                            <AnimatePresence mode="wait">
                              <motion.div
                                key={imageIndex}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="absolute inset-0 bg-cover bg-center"
                                style={{ backgroundImage: `url(${activeEvent.images[imageIndex]})` }}
                              />
                            </AnimatePresence>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                            {/* Gallery arrows */}
                            {activeEvent.images.length > 1 && (
                              <>
                                <button
                                  onClick={prevImage}
                                  aria-label="Previous photo"
                                  className="absolute left-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-white/25 transition-all opacity-0 group-hover:opacity-100 cursor-pointer z-20"
                                >
                                  <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={nextImage}
                                  aria-label="Next photo"
                                  className="absolute right-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-white/25 transition-all opacity-0 group-hover:opacity-100 cursor-pointer z-20"
                                >
                                  <ChevronRight className="w-4 h-4" />
                                </button>
                              </>
                            )}

                            {/* Dots — positioned above title */}
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
                            <div className="absolute top-5 right-5 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-white/50 text-[10px] font-data z-20">
                              {imageIndex + 1} / {activeEvent.images.length}
                            </div>

                            {/* Tag chip */}
                            <div className="absolute top-5 left-5 px-3 py-1 rounded-full bg-[#e3b53d]/10 border border-[#e3b53d]/20 text-[#e3b53d] text-[10px] font-bold tracking-[0.15em] z-20">
                              {activeEvent.tag}
                            </div>

                            {/* Title overlaid at bottom of gallery */}
                            <h2
                              className="absolute bottom-4 left-6 right-6 z-20 text-[clamp(1.25rem,2.5vw,2rem)] font-black text-white leading-tight tracking-tight"
                              style={{ textShadow: "0 2px 12px rgba(0,0,0,0.7), 0 1px 3px rgba(0,0,0,0.5)" }}
                            >
                              {activeEvent.title}
                            </h2>
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

          {/* Event index — horizontal pills */}
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
      </section>

      {/* ── Timeline Section ── */}
      <section className="relative py-28 overflow-hidden">
        {/* Background accent */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-[#e3b53d]/[0.02] rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-[#e3b53d]/50" />
              <span className="text-[#e3b53d]/70 text-xs font-secondary uppercase tracking-[0.25em] font-semibold">
                Timeline
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
              Season at a Glance
            </h2>
          </motion.div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[18px] top-2 bottom-2 w-px bg-gradient-to-b from-[#e3b53d]/30 via-white/[0.06] to-transparent" />

            <div className="space-y-2">
              {events.map((evt, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="group cursor-pointer"
                  onClick={() => {
                    goToEvent(i);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  <div className="flex items-start gap-6 py-5 px-4 -mx-4 rounded-xl hover:bg-white/[0.02] transition-colors">
                    {/* Dot */}
                    <div className="relative shrink-0 mt-1">
                      <div className={`w-[38px] h-[38px] rounded-full border flex items-center justify-center transition-all duration-300 ${
                        i === activeIndex
                          ? "border-[#e3b53d] bg-[#e3b53d]/15 shadow-[0_0_20px_rgba(227,181,61,0.15)]"
                          : "border-white/10 bg-black group-hover:border-[#e3b53d]/40"
                      }`}>
                        <div className={`w-2 h-2 rounded-full transition-colors ${
                          i === activeIndex ? "bg-[#e3b53d]" : "bg-white/20 group-hover:bg-[#e3b53d]/60"
                        }`} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-[#e3b53d] text-xs font-bold tracking-[0.15em] uppercase font-secondary">{evt.tag}</span>
                        <span className="text-gray-700 text-[10px] font-data">{evt.date}</span>
                      </div>
                      <h3 className="text-white font-bold text-lg group-hover:text-[#e3b53d] transition-colors leading-tight">
                        {evt.title}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1 flex items-center gap-1.5 font-secondary">
                        <MapPin className="w-3 h-3 shrink-0" />
                        {evt.location}
                      </p>
                    </div>

                    {/* Arrow */}
                    <ArrowUpRight className="w-4 h-4 text-gray-700 group-hover:text-[#e3b53d] transition-colors mt-2 shrink-0" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
