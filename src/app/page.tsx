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
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div className="relative">
      {/* Hero Section */}
      <section ref={heroRef} className="relative h-screen overflow-hidden bg-black">

        {/* LAYER 1 — BACKGROUND: Holographic wireframe car (revealed through pixel mask) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/HeroPageBackgroundHolographicVFX.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: 0 }}
        />

        {/* Animated grid overlay */}
        <div className="absolute inset-0 cyber-grid opacity-20" style={{ zIndex: 1 }} />

        {/* Scanlines effect */}
        <div className="absolute inset-0 scanlines opacity-20" style={{ zIndex: 2 }} />

        {/* LAYER 2 — FOREGROUND: Realistic car photo drawn on canvas, pixel holes reveal holographic behind */}
        <PixelRevealOverlay foregroundSrc="/HeroPageBackground.png" />

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          style={{ opacity, zIndex: 20, position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)" }}
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

      {/* Performance Stats Section */}
      <section className="relative py-24 bg-black overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 circuit-pattern opacity-30" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#8b0000]/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#e3b53d]/10 rounded-full blur-[100px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
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
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
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
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Teams Section */}
      <section className="relative py-24 bg-gradient-to-b from-black to-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
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
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teams.map((team, index) => (
              <motion.div
                key={team.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/teams/${team.slug}`}>
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
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              href="/teams"
              className="inline-flex items-center px-8 py-4 rounded-full bg-white/5 border border-[#e3b53d]/30 text-white font-semibold hover:bg-white/10 hover:border-[#e3b53d]/50 transition-all duration-300"
            >
              View All Teams
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Sponsorship CTA Section */}
      <section className="relative py-24 overflow-hidden">
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
  );
}
