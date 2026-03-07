"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
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
import CountUp from "@/components/CountUp";

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
  const statsRef = useRef<HTMLDivElement>(null);
  const teamsRef = useRef<HTMLDivElement>(null);

  // Hero scroll tracking
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Stats section scroll tracking
  const { scrollYProgress: statsProgress } = useScroll({
    target: statsRef,
    offset: ["start start", "end end"],
  });

  // Teams section scroll tracking
  const { scrollYProgress: teamsProgress } = useScroll({
    target: teamsRef,
    offset: ["start start", "end end"],
  });

  // Hero parallax effects
  const heroY = useTransform(heroProgress, [0, 1], [0, -150]);
  const foregroundOpacity = useTransform(heroProgress, [0, 0.8], [1, 0]);
  const scrollIndicatorOpacity = useTransform(heroProgress, [0, 0.3], [1, 0]);

  // Heading text fade in (stats section)
  const headingOpacity = useTransform(statsProgress, [0.0, 0.12], [0, 1]);
  const headingY = useTransform(statsProgress, [0.0, 0.12], [40, 0]);

  // Horizontal accent line sweep
  const lineWidth = useTransform(statsProgress, [0.08, 0.22], ["0%", "100%"]);
  const lineOpacity = useTransform(statsProgress, [0.08, 0.14], [0, 1]);

  // Stat columns — staggered fade-in from left to right
  const stat0Y = useTransform(statsProgress, [0.13, 0.26], [60, 0]);
  const stat0Opacity = useTransform(statsProgress, [0.13, 0.26], [0, 1]);

  const stat1Y = useTransform(statsProgress, [0.18, 0.31], [60, 0]);
  const stat1Opacity = useTransform(statsProgress, [0.18, 0.31], [0, 1]);

  const stat2Y = useTransform(statsProgress, [0.23, 0.36], [60, 0]);
  const stat2Opacity = useTransform(statsProgress, [0.23, 0.36], [0, 1]);

  const statAnimations = [
    { y: stat0Y, opacity: stat0Opacity },
    { y: stat1Y, opacity: stat1Opacity },
    { y: stat2Y, opacity: stat2Opacity },
  ];

  // Teams content fade in
  const teamsContentOpacity = useTransform(teamsProgress, [0.0, 0.15], [0, 1]);
  const teamsContentY = useTransform(teamsProgress, [0.0, 0.15], [40, 0]);

  // Count-up triggers — fire when each stat becomes visible via scroll
  const [statRevealed, setStatRevealed] = useState([false, false, false]);

  useMotionValueEvent(stat0Opacity, "change", (v) => {
    if (v > 0.7 && !statRevealed[0]) setStatRevealed((prev) => [true, prev[1], prev[2]]);
  });
  useMotionValueEvent(stat1Opacity, "change", (v) => {
    if (v > 0.7 && !statRevealed[1]) setStatRevealed((prev) => [prev[0], true, prev[2]]);
  });
  useMotionValueEvent(stat2Opacity, "change", (v) => {
    if (v > 0.7 && !statRevealed[2]) setStatRevealed((prev) => [prev[0], prev[1], true]);
  });

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

          {/* Neon ring glow behind car */}
          <div
            className="absolute pulse-glow"
            style={{
              zIndex: 1,
              left: "50%",
              top: "62%",
              transform: "translate(-50%, -50%)",
              width: "70vw",
              height: "20vh",
              borderRadius: "50%",
              background: "radial-gradient(ellipse, rgba(227, 181, 61, 0.12) 0%, rgba(139, 0, 0, 0.08) 40%, transparent 70%)",
              filter: "blur(30px)",
            }}
          />

          {/* Animated grid overlay */}
          <div className="absolute inset-0 cyber-grid opacity-20" style={{ zIndex: 2 }} />

          {/* Scanlines effect */}
          <div className="absolute inset-0 scanlines opacity-20" style={{ zIndex: 3 }} />

          {/* REVEALED CONTENT — visible when foreground canvas is erased */}
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 4 }}>
            {/* Revealed text — appears when mask erases foreground */}
            <p
              className="absolute text-white/90"
              style={{
                right: "6%",
                top: "12%",
                fontFamily: "var(--font-rajdhani), sans-serif",
                fontWeight: 700,
                fontSize: "clamp(0.9rem, 2.2vw, 2.5rem)",
                letterSpacing: "0.03em",
              }}
            >
              Built by students. Driven by purpose. <span className="text-[#e3b53d]">Powered by electricity.</span>
            </p>

            {/* Telemetry stat boxes */}
            <div
              className="absolute glass rounded-lg px-3 py-2 sm:px-4 sm:py-3"
              style={{ right: "8%", top: "30%" }}
            >
              <span
                className="block text-[10px] uppercase tracking-widest text-white/40 mb-1"
                style={{ fontFamily: "var(--font-inter-tight), sans-serif" }}
              >
                0–60 mph
              </span>
              <span
                className="block text-lg sm:text-xl md:text-2xl font-bold text-[#e3b53d]"
                style={{ fontFamily: "var(--font-jetbrains), monospace" }}
              >
                3.2s
              </span>
            </div>

            <div
              className="absolute glass rounded-lg px-3 py-2 sm:px-4 sm:py-3"
              style={{ right: "4%", top: "35%" }}
            >
              <span
                className="block text-[10px] uppercase tracking-widest text-white/40 mb-1"
                style={{ fontFamily: "var(--font-inter-tight), sans-serif" }}
              >
                Peak Power
              </span>
              <span
                className="block text-lg sm:text-xl md:text-2xl font-bold text-[#e3b53d]"
                style={{ fontFamily: "var(--font-jetbrains), monospace" }}
              >
                80 kW
              </span>
            </div>

            <div
              className="absolute glass rounded-lg px-3 py-2 sm:px-4 sm:py-3"
              style={{ right: "12%", top: "55%" }}
            >
              <span
                className="block text-[10px] uppercase tracking-widest text-white/40 mb-1"
                style={{ fontFamily: "var(--font-inter-tight), sans-serif" }}
              >
                Battery
              </span>
              <span
                className="block text-lg sm:text-xl md:text-2xl font-bold text-[#e3b53d]"
                style={{ fontFamily: "var(--font-jetbrains), monospace" }}
              >
                600V
              </span>
            </div>

            <div
              className="absolute glass rounded-lg px-3 py-2 sm:px-4 sm:py-3"
              style={{ left: "6%", bottom: "18%" }}
            >
              <span
                className="block text-[10px] uppercase tracking-widest text-white/40 mb-1"
                style={{ fontFamily: "var(--font-inter-tight), sans-serif" }}
              >
                Weight
              </span>
              <span
                className="block text-lg sm:text-xl md:text-2xl font-bold text-[#e3b53d]"
                style={{ fontFamily: "var(--font-jetbrains), monospace" }}
              >
                230 kg
              </span>
            </div>
          </div>

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

        {/* Stats Section - sticky scroll zone */}
        <div ref={statsRef} className="h-[280vh] relative">
          <div className="sticky top-0 h-screen overflow-hidden bg-black">
            <section className="absolute inset-0 flex items-center bg-black overflow-hidden">
              {/* Background effects */}
              <div className="absolute inset-0 circuit-pattern opacity-30" />
              <div className="absolute top-0 left-0 w-[30vw] h-[30vw] max-w-[500px] max-h-[500px] bg-[#8b0000]/10 rounded-full blur-[120px]" />
              <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#e3b53d]/8 rounded-full blur-[100px]" />

              <div className="relative max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 w-full flex flex-col items-center justify-center h-full">

                {/* Heading — centered */}
                <motion.div
                  className="text-center mb-6 sm:mb-10"
                  style={{ opacity: headingOpacity, y: headingY }}
                >
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#e3b53d]/10 text-[#e3b53d] text-sm font-medium mb-6">
                    <Target className="w-4 h-4 mr-2" />
                    PERFORMANCE TARGETS
                  </span>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-[0.95]">
                    Engineering the future,{" "}
                    <span className="text-[#e3b53d] italic">one lap at a time.</span>
                  </h2>
                  <p className="text-gray-400 text-base sm:text-lg max-w-lg mx-auto font-secondary">
                    Our engineering targets push the boundaries of what&apos;s possible in Formula SAE competition
                  </p>
                </motion.div>

                {/* Horizontal accent line — sweeps in */}
                <motion.div
                  className="h-px mb-10 sm:mb-14"
                  style={{
                    width: lineWidth,
                    opacity: lineOpacity,
                    background: "linear-gradient(90deg, transparent, rgba(227,181,61,0.4), rgba(227,181,61,0.6), rgba(227,181,61,0.4), transparent)",
                  }}
                />

                {/* Stats row — 3 columns, massive numbers */}
                <div className="grid grid-cols-1 md:grid-cols-3 w-full max-w-5xl">
                  {stats.map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      className="group relative flex flex-col items-center text-center py-10 sm:py-14 px-6"
                      style={{
                        y: statAnimations[i].y,
                        opacity: statAnimations[i].opacity,
                      }}
                    >
                      {/* Vertical gold divider between columns */}
                      {i > 0 && (
                        <div
                          className="absolute left-0 top-[15%] h-[70%] w-px hidden md:block"
                          style={{
                            background: "linear-gradient(180deg, transparent, rgba(227,181,61,0.25) 30%, rgba(227,181,61,0.25) 70%, transparent)",
                          }}
                        />
                      )}

                      {/* Icon */}
                      <span className="text-[#e3b53d]/50 mb-5 group-hover:text-[#e3b53d] transition-colors duration-500">
                        {stat.icon}
                      </span>

                      {/* Number — MASSIVE */}
                      <span className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[110px] font-black text-white tracking-tighter leading-none transition-colors duration-700 group-hover:text-[#e3b53d]">
                        <CountUp value={stat.value} active={statRevealed[i]} />
                      </span>

                      {/* Unit */}
                      <span className="text-base sm:text-lg font-semibold text-[#e3b53d] tracking-[0.3em] mt-4 uppercase">
                        {stat.unit}
                      </span>

                      {/* Label */}
                      <span className="text-xs sm:text-sm text-gray-500 tracking-widest uppercase mt-2 font-secondary">
                        {stat.label}
                      </span>

                      {/* Hover glow — radial gold aura behind the number */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-2xl"
                        style={{
                          background: "radial-gradient(ellipse at center 45%, rgba(227,181,61,0.07) 0%, transparent 65%)",
                        }}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Teams Section - separate sticky scroll zone */}
        <div ref={teamsRef} className="h-[250vh] relative">
          <div className="sticky top-0 h-screen overflow-hidden bg-black flex items-center justify-center">
            <motion.div
              className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24"
              style={{ opacity: teamsContentOpacity, y: teamsContentY }}
            >
              <div className="text-center mb-16">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#e3b53d]/10 text-[#e3b53d] text-sm font-medium mb-4">
                  <Users className="w-4 h-4 mr-2" />
                  OUR TEAMS
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
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
            </motion.div>
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
