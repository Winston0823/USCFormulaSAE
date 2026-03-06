"use client";

import { useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Zap,
  Gauge,
  Wind,
  Cog,
  Users,
  ArrowRight,
  ChevronDown,
  Timer,
  Target,
  Rocket,
  Box,
  User,
  Cpu,
  Briefcase,
} from "lucide-react";

const PixelRevealOverlay = dynamic(() => import("@/components/PixelRevealOverlay"), {
  ssr: false,
});

const teams = [
  {
    name: "Aerodynamics",
    slug: "aerodynamics",
    icon: <Wind className="w-24 h-24" />,
    description: "Optimizing airflow for maximum downforce and minimal drag",
  },
  {
    name: "Frame",
    slug: "frame",
    icon: <Box className="w-24 h-24" />,
    description: "Designing the structural backbone of our racing machine",
  },
  {
    name: "Drivetrain",
    slug: "drivetrain",
    icon: <Cog className="w-24 h-24" />,
    description: "Transferring power from engine to wheels efficiently",
  },
  {
    name: "Powertrain",
    slug: "powertrain",
    icon: <Zap className="w-24 h-24" />,
    description: "Engineering peak performance and reliability",
  },
  {
    name: "Vehicle Dynamics",
    slug: "vehicle-dynamics",
    icon: <Gauge className="w-24 h-24" />,
    description: "Fine-tuning handling and suspension systems",
  },
  {
    name: "Ergonomics",
    slug: "ergonomics",
    icon: <User className="w-24 h-24" />,
    description: "Creating the perfect driver-machine interface",
  },
  {
    name: "Systems",
    slug: "systems",
    icon: <Cpu className="w-24 h-24" />,
    description: "Integrating electronics and data systems",
  },
  {
    name: "Business",
    slug: "business",
    icon: <Briefcase className="w-24 h-24" />,
    description: "Driving partnerships and team operations",
  },
];

const stats = [
  { label: "Top Speed Target", value: "85+", unit: "MPH", icon: <Gauge className="w-6 h-6" /> },
  { label: "0-60 Acceleration", value: "3.5", unit: "SEC", icon: <Timer className="w-6 h-6" /> },
  { label: "Team Members", value: "50+", unit: "ENGINEERS", icon: <Users className="w-6 h-6" /> },
];

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Hero scroll tracking
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Carousel scroll tracking
  const { scrollYProgress: carouselProgress } = useScroll({
    target: carouselRef,
    offset: ["start start", "end end"],
  });

  // Hero parallax effects
  const heroY = useTransform(heroProgress, [0, 1], [0, -150]);
  const foregroundOpacity = useTransform(heroProgress, [0, 0.8], [1, 0]);
  const scrollIndicatorOpacity = useTransform(heroProgress, [0, 0.3], [1, 0]);

  // Carousel horizontal slide + fade effects
  // 0-40% = Stats visible and centered (hold)
  // 40-60% = transition (Stats slides left + fades, Teams slides in + fades in)
  // 60-100% = Teams visible and centered (hold)
  const statsX = useTransform(carouselProgress, [0.4, 0.6], ["0%", "-100%"]);
  const statsOpacity = useTransform(carouselProgress, [0.4, 0.6], [1, 0]);
  const teamsX = useTransform(carouselProgress, [0.4, 0.6], ["100%", "0%"]);
  const teamsOpacity = useTransform(carouselProgress, [0.4, 0.6], [0, 1]);

  return (
    <div className="relative">
      {/* Hero Section Container - creates scroll tracking area */}
      <div ref={heroRef} className="h-screen" />

      {/* Fixed Hero - stays in place while content scrolls over */}
      <section className="fixed inset-0 h-screen overflow-hidden bg-black" style={{ zIndex: 0 }}>
        {/* Parallax container - both layers move together */}
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          {/* LAYER 1 — BACKGROUND: Holographic wireframe car (revealed through pixel mask) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/HeroPageBackgroundHolographicVFXSVG.svg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{ zIndex: 0 }}
          />

          {/* Animated grid overlay */}
          <div className="absolute inset-0 cyber-grid opacity-20" style={{ zIndex: 1 }} />

          {/* Scanlines effect */}
          <div className="absolute inset-0 scanlines opacity-20" style={{ zIndex: 2 }} />

          {/* LAYER 2 — FOREGROUND: Realistic car photo drawn on canvas, fades to reveal holographic */}
          <motion.div className="absolute inset-0" style={{ opacity: foregroundOpacity, zIndex: 15 }}>
            <PixelRevealOverlay foregroundSrc="/HeroPageBackgroundSVG.svg" />
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          style={{ opacity: scrollIndicatorOpacity, zIndex: 20, position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)" }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center text-gray-400"
          >
            <span className="text-xs uppercase tracking-widest mb-2">Scroll</span>
            <ChevronDown className="w-6 h-6" />
          </motion.div>
        </motion.div>
      </section>

      {/* Content Container - scrolls over the hero with drop shadow */}
      <div className="relative" style={{ zIndex: 10 }}>
        {/* Drop shadow that casts onto the hero below */}
        <div
          className="absolute inset-x-0 -top-32 h-32 pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.9))"
          }}
        />

        {/* Carousel Section - horizontal scroll-jacked transition */}
        <div ref={carouselRef} className="h-[350vh] relative">
          {/* Sticky container - stays in viewport during scroll */}
          <div className="sticky top-0 h-screen overflow-hidden bg-black">

            {/* Performance Stats Section - slides out left, fades out */}
            <motion.section
              className="absolute inset-0 flex items-center justify-center bg-black overflow-hidden"
              style={{ x: statsX, opacity: statsOpacity }}
            >
              {/* Background effects */}
              <div className="absolute inset-0 circuit-pattern opacity-30" />
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#8b0000]/10 rounded-full blur-[100px]" />
              <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#e3b53d]/10 rounded-full blur-[100px]" />

              <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="text-center mb-16">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#e3b53d]/10 text-[#e3b53d] text-sm font-medium mb-4">
                    <Target className="w-4 h-4 mr-2" />
                    PERFORMANCE TARGETS
                  </span>
                  <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                    Built for <span className="text-[#e3b53d]">Speed</span>
                  </h2>
                  <p className="text-gray-400 max-w-2xl mx-auto font-secondary">
                    Our engineering targets push the boundaries of what&apos;s possible in Formula SAE competition
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
                  {stats.map((stat) => (
                    <div key={stat.label} className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#e3b53d]/20 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="relative p-6 sm:p-8 rounded-2xl bg-white/5 border border-[#e3b53d]/20 backdrop-blur-sm hover:border-[#e3b53d]/50 transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-[#e3b53d]">{stat.icon}</span>
                          <Rocket className="w-4 h-4 text-gray-600" />
                        </div>
                        <div className="text-4xl sm:text-5xl font-black text-white mb-1">
                          {stat.value}
                          <span className="text-lg sm:text-xl font-medium text-[#e3b53d] ml-1">{stat.unit}</span>
                        </div>
                        <p className="text-gray-400 text-sm font-secondary">{stat.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>

            {/* Teams Section - slides in from right, fades in */}
            <motion.section
              className="absolute inset-0 flex items-center justify-center bg-black overflow-hidden"
              style={{ x: teamsX, opacity: teamsOpacity }}
            >
              <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="text-center mb-16">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#e3b53d]/10 text-[#e3b53d] text-sm font-medium mb-4">
                    <Users className="w-4 h-4 mr-2" />
                    OUR TEAMS
                  </span>
                  <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                    Specialized <span className="text-[#e3b53d]">Divisions</span>
                  </h2>
                  <p className="text-gray-400 max-w-2xl mx-auto">
                    Eight specialized teams working in harmony to create a championship-winning machine
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {teams.map((team) => (
                    <Link key={team.slug} href={`/teams/${team.slug}`}>
                      <div className="group relative h-full p-6 rounded-2xl bg-white/5 border border-[#e3b53d]/20 backdrop-blur-sm hover:border-[#e3b53d]/50 transition-all duration-300 tech-card cursor-pointer overflow-hidden">
                        {/* Background icon */}
                        <div className="absolute -right-4 -bottom-4 text-[#e3b53d]/5 group-hover:text-[#e3b53d]/10 transition-colors duration-500">
                          {team.icon}
                        </div>

                        <div className="relative">
                          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#e3b53d] transition-colors">
                            {team.name}
                          </h3>

                          <p className="text-gray-400 text-sm leading-relaxed mb-4 font-secondary">{team.description}</p>

                          <div className="flex items-center text-sm font-medium text-[#e3b53d] group-hover:translate-x-2 transition-transform duration-300">
                            <span>Explore Team</span>
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="text-center mt-12">
                  <Link
                    href="/teams"
                    className="inline-flex items-center px-8 py-4 rounded-full bg-white/5 border border-[#e3b53d]/30 text-white font-semibold hover:bg-white/10 hover:border-[#e3b53d]/50 transition-all duration-300"
                  >
                    View All Teams
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </div>
              </div>
            </motion.section>

          </div>
        </div>

        {/* Sponsorship CTA Section */}
        <section className="relative py-24 overflow-hidden bg-black">
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#8b0000]/10 via-black to-[#e3b53d]/10" />
          <div className="absolute inset-0 cyber-grid opacity-20" />

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                Fuel Our <span className="text-[#e3b53d]">Vision</span>
              </h2>
              <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                Partner with USC Formula Electric and help shape the next generation of automotive engineers
              </p>
              <Link
                href="/sponsorship"
                className="inline-flex items-center px-10 py-5 bg-[#e3b53d] rounded-full text-black font-bold text-lg hover:bg-[#c4ae5a] hover:shadow-2xl hover:shadow-[#e3b53d]/30 transition-all duration-300 neon-button"
              >
                Become a Sponsor
                <ArrowRight className="w-6 h-6 ml-2" />
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}
