"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Clock,
} from "lucide-react";

interface EventData {
  title: string;
  date: string;
  location: string;
  description: string;
  images: string[];
}

const events: EventData[] = [
  {
    title: "FSAE Electric Michigan 2025",
    date: "June 2025",
    location: "Brooklyn, Michigan",
    description:
      "Our team competes in the Formula SAE Electric competition — designing, manufacturing, and testing a fully functioning electric race car against top university teams from around the world.",
    images: ["/placeholder-event-1.jpg", "/placeholder-event-2.jpg", "/placeholder-event-3.jpg"],
  },
  {
    title: "AME Awards Car Unveiling",
    date: "Spring 2024",
    location: "USC Campus, Los Angeles",
    description:
      "A historic milestone — the first time in team history we unveiled our car at the AME Awards ceremony, showcasing months of engineering work to faculty, sponsors, and fellow students.",
    images: ["/placeholder-event-4.jpg", "/placeholder-event-5.jpg"],
  },
  {
    title: "Spring Build Season",
    date: "January – May 2025",
    location: "USC Workshop",
    description:
      "Our most intensive period — all eight subteams converge in the workshop to fabricate, assemble, and test every component of the car before competition season.",
    images: ["/placeholder-event-6.jpg", "/placeholder-event-7.jpg"],
  },
  {
    title: "Fall Kickoff & Recruitment",
    date: "September 2024",
    location: "USC Campus, Los Angeles",
    description:
      "We welcome new members of all majors and experience levels. Kickoff includes team introductions, subteam overviews, and hands-on demos to get everyone excited for the build season ahead.",
    images: ["/placeholder-event-8.jpg", "/placeholder-event-9.jpg"],
  },
];

export default function EventsPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 = left, 1 = right

  const activeEvent = events[activeIndex];
  const prevIndex = (activeIndex - 1 + events.length) % events.length;
  const nextIndex = (activeIndex + 1) % events.length;

  const goToEvent = useCallback(
    (newIndex: number) => {
      setDirection(newIndex > activeIndex ? 1 : -1);
      setActiveIndex(newIndex);
      setImageIndex(0);
    },
    [activeIndex]
  );

  const goNext = useCallback(() => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % events.length);
    setImageIndex(0);
  }, []);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + events.length) % events.length);
    setImageIndex(0);
  }, []);

  const nextImage = useCallback(() => {
    setImageIndex((prev) => (prev + 1) % activeEvent.images.length);
  }, [activeEvent.images.length]);

  const prevImage = useCallback(() => {
    setImageIndex((prev) => (prev - 1 + activeEvent.images.length) % activeEvent.images.length);
  }, [activeEvent.images.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrev]);

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 cyber-grid opacity-20" />
        <div className="absolute top-1/4 left-0 w-64 h-64 bg-[#8b0000]/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-[#e3b53d]/10 rounded-full blur-[100px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-[#e3b53d]/10 text-[#e3b53d] text-sm font-medium mb-6">
              <CalendarDays className="w-4 h-4 mr-2" />
              EVENTS
            </span>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6">
              Our <span className="text-[#e3b53d]">Events</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              From build season to race day — follow our journey through competitions, workshops, and team milestones.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Event Carousel Section */}
      <section className="py-12 sm:py-24">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-stretch gap-4 lg:gap-6">
            {/* Previous Event Preview */}
            <button
              onClick={goPrev}
              aria-label={`Previous event: ${events[prevIndex].title}`}
              className="hidden lg:flex flex-col items-center justify-center w-[20%] min-h-[400px] rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-[#e3b53d]/30 hover:bg-white/[0.06] opacity-50 hover:opacity-80 scale-[0.97] hover:scale-100 transition-all duration-300 cursor-pointer group overflow-hidden relative"
            >
              {/* Thumbnail */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10" />
              <div
                className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-60 transition-opacity duration-300"
                style={{ backgroundImage: `url(${events[prevIndex].images[0]})` }}
              />
              <div className="relative z-20 flex flex-col items-center text-center px-4">
                <ChevronLeft className="w-8 h-8 text-[#e3b53d]/60 group-hover:text-[#e3b53d] transition-colors mb-4" />
                <p className="text-white/70 group-hover:text-white text-sm font-bold transition-colors leading-tight">
                  {events[prevIndex].title}
                </p>
                <p className="text-gray-500 text-xs mt-2 font-secondary">{events[prevIndex].date}</p>
              </div>
            </button>

            {/* Mobile prev/next bar (top) */}
            <div className="flex lg:hidden gap-3">
              <button
                onClick={goPrev}
                aria-label={`Previous event: ${events[prevIndex].title}`}
                className="flex-1 flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-[#e3b53d]/30 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5 text-[#e3b53d] shrink-0" />
                <div className="text-left min-w-0">
                  <p className="text-white text-xs font-bold truncate">{events[prevIndex].title}</p>
                  <p className="text-gray-500 text-xs">{events[prevIndex].date}</p>
                </div>
              </button>
              <button
                onClick={goNext}
                aria-label={`Next event: ${events[nextIndex].title}`}
                className="flex-1 flex items-center justify-end gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-[#e3b53d]/30 transition-all cursor-pointer"
              >
                <div className="text-right min-w-0">
                  <p className="text-white text-xs font-bold truncate">{events[nextIndex].title}</p>
                  <p className="text-gray-500 text-xs">{events[nextIndex].date}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-[#e3b53d] shrink-0" />
              </button>
            </div>

            {/* Active Event (Center) */}
            <div className="flex-1 lg:w-[60%]">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={activeIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  {/* Gallery */}
                  <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-[#0a0a0a] border border-[#e3b53d]/20 group">
                    {/* Image */}
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

                    {/* Placeholder overlay when no real images */}
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] to-black">
                      <div className="text-center">
                        <CalendarDays className="w-16 h-16 text-[#e3b53d]/20 mx-auto mb-3" />
                        <p className="text-gray-600 text-sm">Event Photo {imageIndex + 1}</p>
                      </div>
                    </div>

                    {/* Gallery nav arrows */}
                    {activeEvent.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          aria-label="Previous photo"
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/80 hover:border-[#e3b53d]/40 transition-all opacity-0 group-hover:opacity-100 cursor-pointer z-20"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={nextImage}
                          aria-label="Next photo"
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/80 hover:border-[#e3b53d]/40 transition-all opacity-0 group-hover:opacity-100 cursor-pointer z-20"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}

                    {/* Dot indicators */}
                    {activeEvent.images.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                        {activeEvent.images.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setImageIndex(i)}
                            aria-label={`Go to photo ${i + 1}`}
                            className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                              i === imageIndex
                                ? "bg-[#e3b53d] w-6"
                                : "bg-white/40 hover:bg-white/70"
                            }`}
                          />
                        ))}
                      </div>
                    )}

                    {/* Image counter */}
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/60 border border-white/10 text-white/70 text-xs font-secondary z-20">
                      {imageIndex + 1} / {activeEvent.images.length}
                    </div>
                  </div>

                  {/* Event details below gallery */}
                  <div className="mt-6 px-1">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                      {activeEvent.title}
                    </h2>
                    <div className="flex flex-wrap gap-4 mb-4">
                      <span className="inline-flex items-center gap-1.5 text-[#e3b53d] text-sm font-secondary">
                        <Clock className="w-4 h-4" />
                        {activeEvent.date}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-gray-400 text-sm font-secondary">
                        <MapPin className="w-4 h-4" />
                        {activeEvent.location}
                      </span>
                    </div>
                    <p className="text-gray-400 leading-relaxed max-w-2xl">
                      {activeEvent.description}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Event selector dots */}
              <div className="flex justify-center gap-3 mt-8">
                {events.map((evt, i) => (
                  <button
                    key={i}
                    onClick={() => goToEvent(i)}
                    aria-label={`Go to ${evt.title}`}
                    className={`px-3 py-1.5 rounded-full text-xs font-secondary font-medium transition-all duration-300 cursor-pointer ${
                      i === activeIndex
                        ? "bg-[#e3b53d] text-black"
                        : "bg-white/[0.06] text-gray-500 hover:text-white hover:bg-white/[0.12]"
                    }`}
                  >
                    {evt.title.length > 20 ? evt.title.slice(0, 20) + "..." : evt.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Next Event Preview */}
            <button
              onClick={goNext}
              aria-label={`Next event: ${events[nextIndex].title}`}
              className="hidden lg:flex flex-col items-center justify-center w-[20%] min-h-[400px] rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-[#e3b53d]/30 hover:bg-white/[0.06] opacity-50 hover:opacity-80 scale-[0.97] hover:scale-100 transition-all duration-300 cursor-pointer group overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10" />
              <div
                className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-60 transition-opacity duration-300"
                style={{ backgroundImage: `url(${events[nextIndex].images[0]})` }}
              />
              <div className="relative z-20 flex flex-col items-center text-center px-4">
                <ChevronRight className="w-8 h-8 text-[#e3b53d]/60 group-hover:text-[#e3b53d] transition-colors mb-4" />
                <p className="text-white/70 group-hover:text-white text-sm font-bold transition-colors leading-tight">
                  {events[nextIndex].title}
                </p>
                <p className="text-gray-500 text-xs mt-2 font-secondary">{events[nextIndex].date}</p>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Upcoming Events Timeline */}
      <section className="py-24 border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <span className="text-[#e3b53d] text-sm font-secondary uppercase tracking-[0.2em] block mb-3">
              What&apos;s Ahead
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Upcoming Events
            </h2>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-[#e3b53d]/40 via-[#e3b53d]/20 to-transparent" />

            <div className="space-y-8">
              {events.map((evt, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-6 group cursor-pointer"
                  onClick={() => {
                    goToEvent(i);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  {/* Dot */}
                  <div className="relative shrink-0">
                    <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-colors ${
                      i === activeIndex
                        ? "border-[#e3b53d] bg-[#e3b53d]/20"
                        : "border-white/20 bg-black group-hover:border-[#e3b53d]/50"
                    }`}>
                      <CalendarDays className={`w-4 h-4 transition-colors ${
                        i === activeIndex ? "text-[#e3b53d]" : "text-gray-600 group-hover:text-[#e3b53d]"
                      }`} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="pb-2">
                    <p className="text-[#e3b53d] text-sm font-secondary font-medium">{evt.date}</p>
                    <h3 className="text-white font-bold text-lg group-hover:text-[#e3b53d] transition-colors mt-1">
                      {evt.title}
                    </h3>
                    <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {evt.location}
                    </p>
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
