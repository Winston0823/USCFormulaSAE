"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";
import { Menu, X } from "lucide-react";
import FireIcon from "./FireIcon";

// Liquid hover effect hook - inspired by landonorris.com
// Uses snappy easing (quick response, smooth settle) + morphing blob shape
function useLiquidHover() {
  const containerRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Springs tuned for trailing effect - blob lags behind cursor
  // Lower stiffness = more lag, higher mass = more inertia
  const primarySpring = { stiffness: 120, damping: 14, mass: 0.8 };
  const trailSpring = { stiffness: 70, damping: 12, mass: 1.2 };

  // Primary blob position - trails behind cursor
  const blobX = useSpring(50, primarySpring);
  const blobY = useSpring(50, primarySpring);

  // Trail blob (follows with slight delay)
  const blob2X = useSpring(50, trailSpring);
  const blob2Y = useSpring(50, trailSpring);

  // Blob morphing - stretch in movement direction
  const blobStretchX = useSpring(1, { stiffness: 400, damping: 15 });
  const blobStretchY = useSpring(1, { stiffness: 400, damping: 15 });
  const blobRotation = useSpring(0, { stiffness: 200, damping: 12 });

  // Clip-path morph values for organic shape
  const morphTop = useSpring(50, { stiffness: 250, damping: 18 });
  const morphRight = useSpring(50, { stiffness: 250, damping: 18 });
  const morphBottom = useSpring(50, { stiffness: 250, damping: 18 });
  const morphLeft = useSpring(50, { stiffness: 250, damping: 18 });

  // Line animations
  const lineStretch = useSpring(1, { stiffness: 400, damping: 20 });
  const lineOffset = useSpring(0, { stiffness: 300, damping: 15 });

  // Pre-compute transforms
  const blobLeftPercent = useTransform(blobX, (v) => `${v}%`);
  const blobTopPercent = useTransform(blobY, (v) => `${v}%`);
  const blob2LeftPercent = useTransform(blob2X, (v) => `${v}%`);
  const blob2TopPercent = useTransform(blob2Y, (v) => `${v}%`);

  // Create organic blob shape using clip-path
  const blobClipPath = useTransform(
    [morphTop, morphRight, morphBottom, morphLeft],
    ([t, r, b, l]) =>
      `polygon(${50 + (t as number - 50) * 0.3}% 0%, 100% ${50 + (r as number - 50) * 0.3}%, ${50 + (b as number - 50) * 0.3}% 100%, 0% ${50 + (l as number - 50) * 0.3}%)`
  );

  const lineStretchTop = useTransform(lineStretch, [1, 1.5], [1, 1.2]);
  const lineStretchMid = useTransform(lineStretch, [1, 1.5], [1, 0.6]);
  const lineOffsetTop = useTransform(lineOffset, (v) => v * 0.4);
  const lineOffsetMid = useTransform(lineOffset, (v) => v * -0.25);

  // Velocity tracking with smoothing
  const lastPos = useRef({ x: 50, y: 50, time: Date.now() });
  const velocitySmooth = useRef({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Calculate velocity with smoothing
    const now = Date.now();
    const dt = Math.max(now - lastPos.current.time, 1);
    const rawVx = (x - lastPos.current.x) / dt;
    const rawVy = (y - lastPos.current.y) / dt;

    // Smooth velocity for more fluid feel
    velocitySmooth.current.x = velocitySmooth.current.x * 0.7 + rawVx * 0.3;
    velocitySmooth.current.y = velocitySmooth.current.y * 0.7 + rawVy * 0.3;
    const vx = velocitySmooth.current.x;
    const vy = velocitySmooth.current.y;
    const speed = Math.sqrt(vx * vx + vy * vy);

    lastPos.current = { x, y, time: now };

    // Blob trails behind cursor - spring physics creates the lag naturally
    // Just set target to cursor position, the spring does the rest
    blobX.set(x);
    blobY.set(y);
    blob2X.set(x);
    blob2Y.set(y);

    // Morph the blob shape - stretch in movement direction like pulled liquid
    // The blob elongates towards where cursor is going
    const morphIntensity = 100;
    morphTop.set(50 + vy * -morphIntensity);
    morphRight.set(50 + vx * morphIntensity);
    morphBottom.set(50 + vy * morphIntensity);
    morphLeft.set(50 + vx * -morphIntensity);

    // Dramatic stretch in movement direction - like liquid being pulled
    const stretchIntensity = Math.min(speed * 1.2, 1.5);
    const angle = Math.atan2(vy, vx);

    // Stretch along movement axis, compress perpendicular
    blobStretchX.set(1 + Math.abs(vx) * stretchIntensity);
    blobStretchY.set(1 + Math.abs(vy) * stretchIntensity);
    blobRotation.set(angle * (180 / Math.PI) * 0.15);

    // Line animations
    lineStretch.set(1 + speed * 0.15);
    lineOffset.set(vx * 50);
  }, [blobX, blobY, blob2X, blob2Y, blobStretchX, blobStretchY, blobRotation, morphTop, morphRight, morphBottom, morphLeft, lineStretch, lineOffset]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    velocitySmooth.current = { x: 0, y: 0 };
    // Snap back to center
    blobX.set(50);
    blobY.set(50);
    blob2X.set(50);
    blob2Y.set(50);
    blobStretchX.set(1);
    blobStretchY.set(1);
    blobRotation.set(0);
    morphTop.set(50);
    morphRight.set(50);
    morphBottom.set(50);
    morphLeft.set(50);
    lineStretch.set(1);
    lineOffset.set(0);
  }, [blobX, blobY, blob2X, blob2Y, blobStretchX, blobStretchY, blobRotation, morphTop, morphRight, morphBottom, morphLeft, lineStretch, lineOffset]);

  return {
    containerRef,
    isHovered,
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave,
    blobLeftPercent,
    blobTopPercent,
    blob2LeftPercent,
    blob2TopPercent,
    blobStretchX,
    blobStretchY,
    blobRotation,
    blobClipPath,
    lineStretchTop,
    lineStretchMid,
    lineOffsetTop,
    lineOffsetMid,
  };
}

const teams = [
  { name: "Aerodynamics", slug: "aerodynamics" },
  { name: "Frame", slug: "frame" },
  { name: "Drivetrain", slug: "drivetrain" },
  { name: "Powertrain", slug: "powertrain" },
  { name: "Vehicle Dynamics", slug: "vehicle-dynamics" },
  { name: "Ergonomics", slug: "ergonomics" },
  { name: "Systems", slug: "systems" },
  { name: "Business", slug: "business" },
];

const navItems = [
  { name: "Home", href: "/" },
  { name: "Events", href: "/events" },
  { name: "About", href: "/about" },
  { name: "Teams", href: "/#teams" },
  { name: "Sponsors", href: "/sponsorship" },
  { name: "Fundraiser", href: "/fundraiser" },
  { name: "Contact", href: "/contact" },
];

const REVEAL_RADIUS = 180; // Match PixelRevealOverlay radius

export default function Navigation() {
  const [isMounted, setIsMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPastHero, setIsPastHero] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNavDropdownOpen, setIsNavDropdownOpen] = useState(false);

  const [isOnDarkLayer, setIsOnDarkLayer] = useState(false);
  const menuButtonRef = useRef<HTMLDivElement>(null);

  // Liquid hover effect for menu button
  const liquid = useLiquidHover();

  // Mark as mounted after hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Track mouse proximity to menu button for adaptive coloring
  useEffect(() => {
    if (!isMounted) return;
    const handleMouseMove = (e: MouseEvent) => {
      if (!menuButtonRef.current) return;
      const rect = menuButtonRef.current.getBoundingClientRect();
      const buttonCenterX = rect.left + rect.width / 2;
      const buttonCenterY = rect.top + rect.height / 2;
      const distance = Math.hypot(e.clientX - buttonCenterX, e.clientY - buttonCenterY);
      setIsOnDarkLayer(distance < REVEAL_RADIUS);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      // Check if scrolled past hero section (viewport height)
      setIsPastHero(window.scrollY > window.innerHeight * 0.8);
    };
    // Check initial scroll position
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMounted]);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isPastHero
          ? "bg-transparent backdrop-blur-none border-b border-transparent"
          : isScrolled
            ? "bg-black/40 backdrop-blur-xl border-b border-white/10"
            : "bg-black/20 backdrop-blur-lg border-b border-white/5"
      }`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-20">
          {/* Logo - left */}
          <div className="flex-1">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <Image
                  src="/icons/icon_negative.svg"
                  alt="USC Formula Electric"
                  width={48}
                  height={46}
                  className="object-contain"
                />
              </div>
              <div className="hidden sm:block">
                <span className="text-white font-bold text-lg tracking-wider" style={{ fontFamily: "'Ethnocentric', sans-serif" }}>USC Formula Electric</span>
              </div>
            </Link>
          </div>

          {/* Fire icon, Join Us button and Menu - right */}
          <div className="flex-1 flex justify-end items-center gap-4">
            <FireIcon className="hidden lg:flex" size={40} />
            <Link
              href="https://docs.google.com/forms/d/e/1FAIpQLScz1sdeI-fGvj-IhghyPXXLrBP1jk_dhaq9NP0hriJ1DS57uw/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className="group/btn hidden lg:flex items-center justify-center px-7 py-3.5 rounded-lg text-black font-semibold text-base tracking-widest leading-none transition-all duration-300 relative overflow-hidden hover:scale-105 hover:text-[#e3b53d] border border-[#e3b53d] hover:border-[#e3b53d] uppercase"
              style={{
                background: "linear-gradient(90deg, #e3b53d, #daa520)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                fontFamily: "var(--font-rajdhani), sans-serif",
                letterSpacing: "0.25em",
                boxShadow: "0 0 15px rgba(227, 181, 61, 0.3)",
                transition: "all 0.3s ease, box-shadow 0.3s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px rgba(227, 181, 61, 0.4), 0 0 40px rgba(227, 181, 61, 0.2)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 0 15px rgba(227, 181, 61, 0.3)";
              }}
            >
              {/* Black fill on hover */}
              <span
                className="absolute inset-0 pointer-events-none transition-transform duration-500 ease-out origin-left scale-x-0 group-hover/btn:scale-x-100"
                style={{
                  background: "rgba(0, 0, 0, 0.9)",
                }}
              />
              <span className="relative z-10">Join Us</span>
            </Link>

            {/* Menu icon button - desktop */}
            <div
              ref={menuButtonRef}
              className="relative hidden lg:block"
              onMouseEnter={() => {
                setIsNavDropdownOpen(true);
                liquid.handleMouseEnter();
              }}
              onMouseLeave={() => {
                setIsNavDropdownOpen(false);
                liquid.handleMouseLeave();
              }}
            >
              <motion.button
                ref={liquid.containerRef}
                onMouseMove={liquid.handleMouseMove}
                className={`group relative flex items-center justify-center w-12 h-12 rounded-lg border-2 transition-all duration-300 overflow-hidden hover:shadow-[0_0_16px_rgba(227,181,61,0.3)] hover:rotate-[6deg] ${isOnDarkLayer || isScrolled ? 'border-white hover:border-[#e3b53d]/60' : 'border-gray-400 hover:border-[#e3b53d]/60'}`}
              >
                {/* Primary liquid blob - trails behind cursor with stretch morphing */}
                <motion.div
                  className="absolute w-44 h-44 pointer-events-none"
                  style={{
                    left: liquid.blobLeftPercent,
                    top: liquid.blobTopPercent,
                    x: "-50%",
                    y: "-50%",
                    scaleX: liquid.blobStretchX,
                    scaleY: liquid.blobStretchY,
                    rotate: liquid.blobRotation,
                    clipPath: liquid.blobClipPath,
                    background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(227, 181, 61, 0.5) 0%, rgba(227, 181, 61, 0.25) 40%, transparent 70%)",
                    opacity: liquid.isHovered ? 1 : 0,
                    filter: "blur(3px)",
                  }}
                />
                {/* Secondary blob - trails even more for liquid depth */}
                <motion.div
                  className="absolute w-40 h-40 pointer-events-none"
                  style={{
                    left: liquid.blob2LeftPercent,
                    top: liquid.blob2TopPercent,
                    x: "-50%",
                    y: "-50%",
                    scaleX: liquid.blobStretchX,
                    scaleY: liquid.blobStretchY,
                    clipPath: liquid.blobClipPath,
                    background: "radial-gradient(ellipse 55% 55% at 50% 50%, rgba(227, 181, 61, 0.35) 0%, rgba(227, 181, 61, 0.15) 50%, transparent 75%)",
                    opacity: liquid.isHovered ? 1 : 0,
                    filter: "blur(6px)",
                  }}
                />
                {/* Ambient glow */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    opacity: liquid.isHovered ? 0.5 : 0,
                    background: "radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 70%)",
                    transition: "opacity 0.3s ease",
                  }}
                />
                {/* Hamburger lines with momentum-based animation */}
                <div className="relative z-10 flex flex-col justify-center items-center w-5 h-5 gap-[5px]">
                  <motion.span
                    className={`block w-5 h-[3px] rounded-full transition-colors duration-300 origin-center ${isOnDarkLayer || isScrolled ? 'bg-white' : 'bg-gray-400'}`}
                    style={{
                      scaleX: liquid.lineStretchTop,
                      x: liquid.lineOffsetTop,
                    }}
                  />
                  <motion.span
                    className={`block w-5 h-[3px] rounded-full transition-colors duration-300 origin-center ${isOnDarkLayer || isScrolled ? 'bg-white' : 'bg-gray-400'}`}
                    style={{
                      scaleX: liquid.lineStretchMid,
                      x: liquid.lineOffsetMid,
                    }}
                  />
                  <motion.span
                    className={`block w-5 h-[3px] rounded-full transition-colors duration-300 origin-center ${isOnDarkLayer || isScrolled ? 'bg-white' : 'bg-gray-400'}`}
                    style={{
                      scaleX: liquid.lineStretchTop,
                      x: liquid.lineOffsetTop,
                    }}
                  />
                </div>
              </motion.button>

              <AnimatePresence>
                {isNavDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full right-0 w-56 py-2 mt-2 bg-black/95 backdrop-blur-md rounded-lg border border-[#e3b53d]/20 shadow-xl"
                  >
                    {navItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={(e) => {
                          if (item.href.startsWith("/#")) {
                            const id = item.href.slice(2);
                            const el = document.getElementById(id);
                            if (el) {
                              e.preventDefault();
                              const lenis = (window as Window & { __lenis?: { scrollTo: (target: HTMLElement, opts?: { offset?: number }) => void } }).__lenis;
                              // Teams section needs extra offset to scroll past animation triggers
                              const offset = id === "teams" ? window.innerHeight * 0.18 : -80;
                              if (lenis) {
                                lenis.scrollTo(el, { offset });
                              } else {
                                el.scrollIntoView({ behavior: "smooth" });
                              }
                            }
                          }
                        }}
                        className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-white"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-black/95 backdrop-blur-md border-t border-[#e3b53d]/20"
          >
            <div className="px-4 py-6 space-y-4">
              {navItems.map((item) => (
                <div key={item.name}>
                  <Link
                    href={item.href}
                    onClick={(e) => {
                      setIsMobileMenuOpen(false);
                      if (item.href.startsWith("/#")) {
                        const id = item.href.slice(2);
                        const el = document.getElementById(id);
                        if (el) {
                          e.preventDefault();
                          const lenis = (window as Window & { __lenis?: { scrollTo: (target: HTMLElement, opts?: { offset?: number }) => void } }).__lenis;
                          const offset = id === "teams" ? window.innerHeight * 0.18 : -80;
                          if (lenis) {
                            lenis.scrollTo(el, { offset });
                          } else {
                            el.scrollIntoView({ behavior: "smooth" });
                          }
                        }
                      }
                    }}
                    className="block text-lg text-gray-300 hover:text-white transition-colors py-2 border-b border-[#e3b53d]/10"
                  >
                    {item.name}
                  </Link>
                </div>
              ))}
              <div className="flex items-center justify-center gap-4">
                <FireIcon size={36} />
                <Link
                  href="https://docs.google.com/forms/d/e/1FAIpQLScz1sdeI-fGvj-IhghyPXXLrBP1jk_dhaq9NP0hriJ1DS57uw/viewform"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center px-6 py-3 bg-[#e3b53d] rounded-full text-black font-semibold text-lg leading-none"
                >
                  Join Now
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
