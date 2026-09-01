"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import {
  Users,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";
import CountUp from "@/components/CountUp";
import CTAButton from "@/components/CTAButton";
import DiagonalBars from "@/components/DiagonalBars";
import EventsCarousel from "@/components/EventsCarousel";
import { useLoadingSignal } from "@/components/LoadingContext";

const PixelRevealOverlay = dynamic(() => import("@/components/PixelRevealOverlay"), {
  ssr: false,
});

const teamStat = { label: "Team Members", value: "50+", unit: "MEMBERS", icon: <Users className="w-6 h-6" /> };

const sectionEase = [0.25, 0.46, 0.45, 0.94] as const;

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLElement>(null);

  const { signalReady } = useLoadingSignal();

  // Hero asset loading state
  const [heroAssetsLoaded, setHeroAssetsLoaded] = useState({
    holographic: false,
    foreground: false,
  });

  // Signal loading complete when both hero images are loaded
  useEffect(() => {
    if (heroAssetsLoaded.holographic && heroAssetsLoaded.foreground) {
      signalReady();
    }
  }, [heroAssetsLoaded, signalReady]);

  const handleHolographicLoad = useCallback(() => {
    setHeroAssetsLoaded(prev => ({ ...prev, holographic: true }));
  }, []);

  const handleForegroundLoad = useCallback(() => {
    setHeroAssetsLoaded(prev => ({ ...prev, foreground: true }));
  }, []);

  // Hero scroll tracking
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Hero parallax effects  -  use vh for screen-size independence
  const heroY = useTransform(heroProgress, [0, 1], ["0vh", "-15vh"]);
  const foregroundOpacity = useTransform(heroProgress, [0, 0.8], [1, 0]);
  const scrollIndicatorOpacity = useTransform(heroProgress, [0, 0.3], [1, 0]);

  // 3D parallax tilt  -  high-damping springs for smooth settle
  const tiltSpring = { stiffness: 150, damping: 30, mass: 0.5 };
  const bgTiltX = useSpring(0, tiltSpring); // background rotateX (±1°)
  const bgTiltY = useSpring(0, tiltSpring); // background rotateY (±1°)
  const fgTiltX = useSpring(0, tiltSpring); // foreground rotateX (±2°)
  const fgTiltY = useSpring(0, tiltSpring); // foreground rotateY (±2°)
  const fgShiftX = useSpring(0, tiltSpring); // foreground parallax X
  const fgShiftY = useSpring(0, tiltSpring); // foreground parallax Y

  const handleHeroMouseMove = (e: React.MouseEvent) => {
    const rect = heroSectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    // Normalize to -1..1 from center
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    // Shared tilt: ±3.5°
    bgTiltX.set(-ny * 3.5);
    bgTiltY.set(nx * 3.5);
    fgTiltX.set(-ny * 3.5);
    fgTiltY.set(nx * 3.5);
    // Foreground shifts faster for depth (max ±0.5vw equivalent)
    const shiftScale = window.innerWidth * 0.005;
    fgShiftX.set(nx * shiftScale);
    fgShiftY.set(ny * shiftScale);
  };

  const handleHeroMouseLeave = () => {
    bgTiltX.set(0);
    bgTiltY.set(0);
    fgTiltX.set(0);
    fgTiltY.set(0);
    fgShiftX.set(0);
    fgShiftY.set(0);
  };

  // Count-up triggers  -  fire when each stat scrolls into view
  const [engineersRevealed, setEngineersRevealed] = useState(false);

  return (
    <div className="relative">
      {/* Hero Section Container - creates scroll tracking area */}
      <div ref={heroRef} className="h-screen" />

      {/* Fixed Hero - stays in place while content scrolls over */}
      <section
        ref={heroSectionRef}
        className="fixed inset-0 h-screen overflow-hidden bg-black"
        style={{ zIndex: 0, perspective: "1200px" }}
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
      >
        {/* Parallax container - single tilt applied to all layers together */}
        <motion.div
          className="absolute inset-0"
          style={{
            y: heroY,
            rotateX: bgTiltX,
            rotateY: bgTiltY,
            willChange: "transform",
            transformStyle: "preserve-3d",
            scale: 1.08,
          }}
        >
          {/* LAYER 1  -  BACKGROUND: Holographic wireframe car (revealed through pixel mask) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/HeroPageBackgroundHolographicVFX.webp"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{ zIndex: 0, willChange: "transform" }}
            onLoad={handleHolographicLoad}
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

          {/* REVEALED CONTENT  -  visible when foreground canvas is erased */}
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 4 }}>
            {/* Revealed text  -  appears when mask erases foreground */}
            <p
              className="absolute text-white/90 uppercase whitespace-nowrap text-right"
              style={{
                right: "clamp(1rem, 4%, 3rem)",
                top: "clamp(4rem, 18vh, 11rem)",
                fontFamily: "var(--font-rajdhani), sans-serif",
                fontWeight: 800,
                fontSize: "clamp(0.75rem, 2.3vw, 2.75rem)",
                letterSpacing: "0.05em",
                lineHeight: 1.2,
              }}
            >
              Built by students. Driven by purpose. <span className="text-[#e3b53d]">Powered by electricity.</span>
            </p>

            {/* Telemetry stat boxes */}
            <div
              className="absolute glass rounded-lg px-3 py-2 sm:px-4 sm:py-3"
              style={{ right: "4%", top: "35%" }}
            >
              <span
                className="block uppercase tracking-widest text-white/40 mb-1"
                style={{ fontFamily: "var(--font-inter-tight), sans-serif", fontSize: "clamp(8px, 0.65vw, 12px)" }}
              >
                Peak Power
              </span>
              <span
                className="block text-lg sm:text-xl md:text-2xl font-bold text-[#e3b53d]"
                style={{ fontFamily: "var(--font-jetbrains), monospace" }}
              >
                48 kW
              </span>
            </div>

            <div
              className="absolute glass rounded-lg px-3 py-2 sm:px-4 sm:py-3"
              style={{ right: "12%", top: "55%" }}
            >
              <span
                className="block uppercase tracking-widest text-white/40 mb-1"
                style={{ fontFamily: "var(--font-inter-tight), sans-serif", fontSize: "clamp(8px, 0.65vw, 12px)" }}
              >
                Battery
              </span>
              <span
                className="block text-lg sm:text-xl md:text-2xl font-bold text-[#e3b53d]"
                style={{ fontFamily: "var(--font-jetbrains), monospace" }}
              >
                400V
              </span>
            </div>

            <div
              className="absolute glass rounded-lg px-3 py-2 sm:px-4 sm:py-3"
              style={{ left: "6%", bottom: "18%" }}
            >
              <span
                className="block uppercase tracking-widest text-white/40 mb-1"
                style={{ fontFamily: "var(--font-inter-tight), sans-serif", fontSize: "clamp(8px, 0.65vw, 12px)" }}
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

          {/* LAYER 2  -  FOREGROUND: Realistic car photo drawn on canvas, fades to reveal holographic */}
          <motion.div
            className="absolute inset-0"
            style={{
              opacity: foregroundOpacity,
              zIndex: 15,
              x: fgShiftX,
              y: fgShiftY,
              willChange: "transform",
            }}
          >
            <PixelRevealOverlay foregroundSrc="/HeroPageBackground.webp" onImageLoad={handleForegroundLoad} />
          </motion.div>
        </motion.div>

        {/* Vignette  -  hides tilt edge offsets */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 16,
            boxShadow: "inset 0 0 5vw 2.5vw rgba(0, 0, 0, 1), inset 0 0 12vw 5vw rgba(0, 0, 0, 0.7)",
          }}
        />

        {/* Hero text  -  above vignette, reacts to tilt */}
        <motion.div
          className="absolute pointer-events-none"
          style={{
            zIndex: 17,
            left: "6%",
            top: "58%",
            rotateX: fgTiltX,
            rotateY: fgTiltY,
            x: fgShiftX,
            y: fgShiftY,
            willChange: "transform",
          }}
        >
          <p
            className="uppercase"
            style={{
              fontFamily: "var(--font-rajdhani), sans-serif",
              fontWeight: 800,
              fontSize: "clamp(1rem, 2.3vw, 2.75rem)",
              letterSpacing: "0.05em",
              color: "#f5f5f5",
              textShadow: "0 0 30px rgba(255, 255, 255, 0.5), 0 2px 20px rgba(0, 0, 0, 0.9)",
            }}
          >
            USC&apos;S PREMIER
          </p>
          <p
            className="uppercase"
            style={{
              fontFamily: "var(--font-rajdhani), sans-serif",
              fontWeight: 800,
              fontSize: "clamp(1.4rem, 3.75vw, 4.5rem)",
              letterSpacing: "0.05em",
              color: "#f5f5f5",
              textShadow: "0 0 30px rgba(255, 255, 255, 0.5), 0 2px 20px rgba(0, 0, 0, 0.9)",
              marginTop: "-0.1em",
            }}
          >
            FORMULA ELECTRIC RACING TEAM
          </p>
          <p
            className="uppercase"
            style={{
              fontFamily: "var(--font-rajdhani), sans-serif",
              fontWeight: 600,
              fontSize: "clamp(0.6rem, 0.95vw, 1.125rem)",
              letterSpacing: "0.25em",
              color: "#ffe566",
              textShadow: "0 0 20px rgba(255, 229, 102, 0.8), 0 0 40px rgba(255, 229, 102, 0.5)",
              marginTop: "0.2em",
            }}
          >
            EST. 2022
          </p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          style={{ opacity: scrollIndicatorOpacity, zIndex: 20, position: "absolute", bottom: "3vh", left: "50%", transform: "translateX(-50%)" }}
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

      {/* Content Container - scrolls over the hero with drop shadow.
          Must be opaque: the fixed hero sits behind it, and any transparency
          inside a section (e.g. mask-image fades) would let the hero bleed through. */}
      <div className="relative bg-black" style={{ zIndex: 10 }}>
        {/* Fade-to-black overlay  -  smoothly covers the Hero as content scrolls up */}
        <div
          className="absolute inset-x-0 -top-[50vh] h-[50vh] pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.85) 70%, #000000 100%)"
          }}
        />

        {/* Solid black transition zone  -  fully hides the Hero before content begins */}
        <div className="h-[4vh] bg-black" />

        {/* Events Section  -  first thing revealed below the hero */}
        <section className="relative bg-black py-20 sm:py-24">
          <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, ease: sectionEase }}
              className="flex flex-wrap items-end justify-between gap-6 mb-10 sm:mb-14"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-px bg-[#e3b53d]" />
                  <span className="text-[#e3b53d] text-xs font-secondary uppercase tracking-[0.25em] font-semibold">
                    Follow the journey
                  </span>
                </div>
                <h2 className="font-bold text-white leading-[0.95]" style={{ fontSize: "clamp(1.5rem, 4vw, 3rem)" }}>
                  Our <span className="text-[#e3b53d]">Events</span>
                </h2>
              </div>
              <Link
                href="/events"
                className="group inline-flex items-center gap-2 text-sm font-secondary font-semibold text-[#e3b53d] hover:text-[#ffe566] transition-colors"
              >
                View all events
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
            <EventsCarousel />
          </div>
        </section>

        {/* Engineers Section */}
        <section
          className="relative bg-black min-h-screen overflow-hidden"
          style={{
            maskImage: "linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)",
          }}
        >
          {/* Background effects */}
          <div className="absolute inset-0 circuit-pattern opacity-15" />

          {/* Right-side image with left fade */}
          <div className="absolute inset-0">
            <div
              className="absolute top-0 right-0 h-full"
              style={{ width: "clamp(50%, 65vw, 75%)" }}
            >
              <Image
                src="/collab-on-car.jpg"
                alt="Team collaborating on the Formula SAE car"
                fill
                sizes="75vw"
                className="object-cover"
                style={{ objectPosition: "center center" }}
              />
            </div>
            {/* Gradient fade on the left edge of the image */}
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(to right, rgba(0,0,0,1) 25%, rgba(0,0,0,0.85) 40%, rgba(0,0,0,0.4) 55%, transparent 70%)",
              }}
            />
            {/* Subtle top/bottom vignette for depth */}
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.6) 100%)",
              }}
            />
          </div>

          {/* Content container  -  left-aligned */}
          <div className="relative min-h-screen flex items-center">
            <div
              className="flex flex-col justify-center px-6 sm:px-10 lg:px-16"
              style={{ maxWidth: "clamp(320px, 50vw, 600px)" }}
            >
              {/* Heading */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.7, ease: sectionEase }}
                style={{ marginBottom: "clamp(1.5rem, 4vh, 3rem)" }}
              >
                <h2
                  className="font-bold text-white leading-tight"
                  style={{ fontSize: "clamp(1.5rem, 4vw, 3.5rem)" }}
                >
                  Built by <span className="text-[#e3b53d]">Students</span>
                </h2>
                <p
                  className="text-gray-400 font-secondary mt-3"
                  style={{
                    fontSize: "clamp(0.9rem, 1.5vw, 1.25rem)",
                    maxWidth: "clamp(280px, 40vw, 500px)",
                  }}
                >
                  A passionate team of engineers, designers, and innovators pushing the limits of electric motorsport
                </p>
              </motion.div>

              {/* Large number display */}
              <motion.div
                className="relative flex flex-col"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.7, delay: 0.15, ease: sectionEase }}
                onViewportEnter={() => setEngineersRevealed(true)}
              >
                {/* Number */}
                <span
                  className="relative z-10 font-black text-[#e3b53d] tracking-tighter leading-none"
                  style={{ fontSize: "clamp(4rem, 15vw, 10rem)" }}
                >
                  <CountUp value={teamStat.value} active={engineersRevealed} />
                </span>

                {/* Label */}
                <span
                  className="relative z-10 font-semibold text-white uppercase"
                  style={{
                    fontSize: "clamp(1rem, 2.5vw, 1.75rem)",
                    letterSpacing: "0.25em",
                    marginTop: "clamp(0.25rem, 1vh, 0.75rem)",
                  }}
                >
                  {teamStat.unit}
                </span>

                {/* Subtitle */}
                <span
                  className="relative z-10 text-gray-500 font-secondary"
                  style={{
                    fontSize: "clamp(0.85rem, 1.4vw, 1.1rem)",
                    marginTop: "clamp(0.75rem, 2vh, 1.5rem)",
                  }}
                >
                  across all subteams
                </span>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Teams Section */}
        <section id="teams" className="relative bg-black overflow-hidden scroll-mt-20">
          <div className="relative w-full min-h-[calc(100vh-5rem)] py-16 flex flex-col justify-center">
            {/* Title area  -  fades in first */}
            <motion.div
              className="text-center px-4 mb-6"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, ease: sectionEase }}
            >
              <h2 className="font-bold text-white mb-3" style={{ fontSize: "clamp(1.25rem, 3.8vw, 3rem)" }}>
                Specialized <span className="text-[#e3b53d]">Subteams</span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
                No matter your major, there&apos;s a team that sharpens your skills and puts them on the track
              </p>
            </motion.div>

            {/* Bars area  -  fades in after heading */}
            <motion.div
              className="w-full flex items-center justify-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: 0.15, ease: sectionEase }}
            >
              <DiagonalBars />
            </motion.div>
          </div>
        </section>

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
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <CTAButton href="/sponsorship" size="lg">
                  Become a Sponsor
                  <ArrowRight className="w-5 h-5" />
                </CTAButton>
                <CTAButton
                  href="https://giveto.usc.edu/Donation"
                  variant="secondary"
                  size="lg"
                >
                  Donate Now
                  <ArrowRight className="w-5 h-5" />
                </CTAButton>
              </div>
            </motion.div>
          </div>
        </section>

      </div>
    </div>
  );
}
