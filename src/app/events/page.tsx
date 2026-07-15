"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { MapPin, ArrowUpRight } from "lucide-react";
import EventsCarousel, { type EventsCarouselHandle } from "@/components/EventsCarousel";
import { events } from "@/lib/events";

export default function EventsPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<EventsCarouselHandle>(null);

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
          <h1 className="text-[clamp(3rem,8vw,7rem)] font-black text-white leading-[0.9] tracking-tight">
            Our <span className="text-[#e3b53d]">Events</span>
          </h1>
          <p className="text-gray-500 text-base sm:text-lg mt-4 max-w-xl font-secondary">
            From build season to race day. Follow the journey.
          </p>
        </motion.div>
      </div>

      {/* ── Carousel Section ── */}
      <section className="pb-16 sm:pb-28">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16">
          <EventsCarousel ref={carouselRef} onIndexChange={setActiveIndex} />
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
                    carouselRef.current?.goTo(i);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  <div className="flex items-start gap-6 py-5 px-4 -mx-4 rounded-xl hover:bg-white/[0.02] transition-colors">
                    {/* Dot */}
                    <div className="relative shrink-0 mt-1">
                      <div
                        className={`w-[38px] h-[38px] rounded-full border flex items-center justify-center transition-all duration-300 ${
                          i === activeIndex
                            ? "border-[#e3b53d] bg-[#e3b53d]/15 shadow-[0_0_20px_rgba(227,181,61,0.15)]"
                            : "border-white/10 bg-black group-hover:border-[#e3b53d]/40"
                        }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full transition-colors ${
                            i === activeIndex ? "bg-[#e3b53d]" : "bg-white/20 group-hover:bg-[#e3b53d]/60"
                          }`}
                        />
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
