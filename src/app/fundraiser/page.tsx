"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import CTAButton from "@/components/CTAButton";
import {
  MapPin,
  Calendar,
  Users,
  Rocket,
  ArrowRight,
  Quote,
} from "lucide-react";

const impactStats = [
  {
    icon: <Calendar className="w-7 h-7" />,
    label: "Competition",
    value: "FSAE 2026",
  },
  {
    icon: <MapPin className="w-7 h-7" />,
    label: "Location",
    value: "Brooklyn, MI",
  },
  {
    icon: <Rocket className="w-7 h-7" />,
    label: "Duration",
    value: "4 Days",
  },
  {
    icon: <Users className="w-7 h-7" />,
    label: "Impact",
    value: "Every Member",
  },
];

export default function FundraiserPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* ═══ HERO ═══ */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 cyber-grid opacity-20" />

        {/* Decorative blurs */}
        <div className="absolute top-1/4 left-0 w-72 h-72 bg-[#8b0000]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-[#e3b53d]/10 rounded-full blur-[120px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1
              className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6"
              style={{ fontFamily: "'Ethnocentric', sans-serif" }}
            >
              Ignite Our{" "}
              <span className="text-[#e3b53d]">Drive</span>
            </h1>
            <p
              className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto"
              style={{ fontFamily: "var(--font-rajdhani), sans-serif" }}
            >
              An appeal to fuel USC Formula Electric&apos;s journey to FSAE 2026
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══ THE LETTER ═══ */}
      <section className="relative py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Opening */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2
              className="text-2xl sm:text-3xl text-[#e3b53d] mb-12"
              style={{ fontFamily: "'Ethnocentric', sans-serif" }}
            >
              Dear Potential Sponsor,
            </h2>
          </motion.div>

          {/* Paragraph 1: The Mission */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg sm:text-xl text-white/80 leading-relaxed mb-10"
            style={{ fontFamily: "var(--font-rajdhani), sans-serif" }}
          >
            We are building one of the{" "}
            <span className="text-[#e3b53d] font-semibold">
              most competitive student-engineered electric race cars
            </span>{" "}
            in the country, and we need your help getting it to the track.
          </motion.p>

          {/* Paragraph 2: The Team */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg sm:text-xl text-white/80 leading-relaxed mb-10"
            style={{ fontFamily: "var(--font-rajdhani), sans-serif" }}
          >
            Our team is made up of{" "}
            <span className="text-white font-semibold">
              passionate engineers, designers, and business minds
            </span>{" "}
            who pour countless hours outside of class into pushing the boundaries
            of what students can actually build. This year, FSAE 2026 takes us to{" "}
            <span className="text-[#e3b53d] font-semibold">
              Brooklyn, MI
            </span>
            , where we&apos;ll go head to head with top collegiate programs from
            across the country.
          </motion.p>

          {/* Image break  -  the team */}
          <motion.figure
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="my-14 relative aspect-[16/9] rounded-xl overflow-hidden border border-[#e3b53d]/20"
          >
            <Image
              src="/team-photo.jpg"
              alt="USC Formula Electric team"
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
            <figcaption
              className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-gradient-to-t from-black/80 to-transparent text-white/80 text-sm tracking-widest uppercase"
              style={{ fontFamily: "var(--font-rajdhani), sans-serif" }}
            >
              The team behind the car.
            </figcaption>
          </motion.figure>

          {/* Pull Quote 1 */}
          <motion.blockquote
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="border-l-4 border-[#e3b53d] pl-6 py-4 my-14"
          >
            <Quote className="w-6 h-6 text-[#e3b53d]/40 mb-3" />
            <p
              className="text-xl sm:text-2xl text-white/90 italic leading-relaxed"
              style={{ fontFamily: "var(--font-rajdhani), sans-serif" }}
            >
              We want to make sure no driven, talented student has to miss this
              experience because of cost.
            </p>
          </motion.blockquote>

          {/* Paragraph 3: Why Funding Matters */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg sm:text-xl text-white/80 leading-relaxed mb-10"
            style={{ fontFamily: "var(--font-rajdhani), sans-serif" }}
          >
            To get there, we&apos;re raising funds to cover{" "}
            <span className="text-white font-semibold">
              flights, meals, and lodging
            </span>{" "}
            for our traveling members across the 4 days of competition. Beyond
            travel, your support also helps with{" "}
            <span className="text-white font-semibold">
              competition fees, materials, and day-to-day operations
            </span>{" "}
            that make building and competing at this level possible. When those
            barriers are taken care of, our engineers and business team can focus
            on what they do best.
          </motion.p>

          {/* Paragraph 4: What FSAE Gives Back */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg sm:text-xl text-white/80 leading-relaxed mb-10"
            style={{ fontFamily: "var(--font-rajdhani), sans-serif" }}
          >
            FSAE puts our members directly in front of{" "}
            <span className="text-[#e3b53d] font-semibold">
              industry professionals
            </span>{" "}
            who evaluate our vehicle and strategy in real time. It&apos;s an
            experience that sharpens technical skills, builds confidence in public
            speaking, and deepens industry knowledge in ways a classroom setting
            can&apos;t replicate.
          </motion.p>

          {/* Image break  -  competition duo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="my-14 grid grid-cols-2 gap-3 sm:gap-4"
          >
            <div className="relative aspect-square rounded-xl overflow-hidden border border-[#e3b53d]/20">
              <Image
                src="/competition-2025-1.jpg"
                alt="Scrutineering at FSAE competition"
                fill
                sizes="(max-width: 768px) 50vw, 400px"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-square rounded-xl overflow-hidden border border-[#e3b53d]/20">
              <Image
                src="/competition-2025-3.jpg"
                alt="On the track at FSAE competition"
                fill
                sizes="(max-width: 768px) 50vw, 400px"
                className="object-cover"
              />
            </div>
          </motion.div>

          {/* Pull Quote 2: Spirit of Comp */}
          <motion.blockquote
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="border-l-4 border-[#e3b53d] pl-6 py-4 my-14"
          >
            <Quote className="w-6 h-6 text-[#e3b53d]/40 mb-3" />
            <p
              className="text-xl sm:text-2xl text-white/90 italic leading-relaxed"
              style={{ fontFamily: "var(--font-rajdhani), sans-serif" }}
            >
              There&apos;s something we call the Spirit of Comp. It&apos;s the
              feeling of being surrounded by the best collegiate teams in the
              world, knowing we built something extraordinary and we&apos;re
              there to prove it.
            </p>
          </motion.blockquote>

          {/* Paragraph 5: Spirit of Comp continued */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg sm:text-xl text-white/80 leading-relaxed mb-10"
            style={{ fontFamily: "var(--font-rajdhani), sans-serif" }}
          >
            It bonds our team in a way that carries forward into our culture and
            our drive to keep delivering our best every year.
          </motion.p>

          {/* Paragraph 6: The Ask */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg sm:text-xl text-white/90 leading-relaxed mb-16 font-medium"
            style={{ fontFamily: "var(--font-rajdhani), sans-serif" }}
          >
            Your donation gives passionate young engineers and innovators{" "}
            <span className="text-[#e3b53d] font-semibold">
              a stage to prove themselves
            </span>
            , and sends them back to USC more capable, more inspired, and ready
            to make a real impact.{" "}
            <span className="text-[#e3b53d] font-bold">
              Every dollar makes that possible.
            </span>
          </motion.p>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="h-px bg-gradient-to-r from-transparent via-[#e3b53d]/40 to-transparent mb-14"
          />

          {/* Sign-off */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-4"
          >
            <p
              className="text-lg text-white/60 italic mb-3"
              style={{ fontFamily: "var(--font-rajdhani), sans-serif" }}
            >
              With drive and determination,
            </p>
            <p
              className="text-2xl text-[#e3b53d] font-bold"
              style={{ fontFamily: "'Ethnocentric', sans-serif" }}
            >
              USC Formula Electric
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══ IMPACT STATS ═══ */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-10" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2
              className="text-3xl sm:text-4xl font-bold text-white mb-4"
              style={{ fontFamily: "'Ethnocentric', sans-serif" }}
            >
              The <span className="text-[#e3b53d]">Mission</span>
            </h2>
            <p
              className="text-white/50 text-lg"
              style={{ fontFamily: "var(--font-rajdhani), sans-serif" }}
            >
              Where your support takes us
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {impactStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white/5 border border-[#e3b53d]/20 rounded-xl p-6 text-center hover:border-[#e3b53d]/50 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="text-[#e3b53d] mb-3 flex justify-center">
                  {stat.icon}
                </div>
                <p
                  className="text-xl sm:text-2xl font-bold text-white mb-1"
                  style={{ fontFamily: "var(--font-rajdhani), sans-serif" }}
                >
                  {stat.value}
                </p>
                <p
                  className="text-sm text-white/40 uppercase tracking-widest"
                  style={{ fontFamily: "var(--font-rajdhani), sans-serif" }}
                >
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TEAM VIDEO ═══ */}
      <section className="relative py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative aspect-video rounded-2xl overflow-hidden border border-[#e3b53d]/20 bg-black"
          >
            <video
              id="ignite-video"
              className="w-full h-full object-cover"
              controls
              playsInline
              muted
              preload="metadata"
              poster="/competition-2025-4.jpg"
            >
              <source src="/fe-ignite.mp4" type="video/mp4" />
              <p className="p-6 text-white/70 text-center">
                Your browser can&apos;t play this video. You can{" "}
                <a
                  href="/fe-ignite.mp4"
                  className="text-[#e3b53d] underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  download it here
                </a>
                .
              </p>
            </video>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center text-white/30 text-sm mt-4 tracking-widest uppercase"
            style={{ fontFamily: "var(--font-rajdhani), sans-serif" }}
          >
            Thank you for your support!
          </motion.p>
        </div>
      </section>

      {/* ═══ GALLERY ═══ */}
      <section className="relative py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h2
              className="text-2xl sm:text-3xl font-bold text-white mb-3"
              style={{ fontFamily: "'Ethnocentric', sans-serif" }}
            >
              On the <span className="text-[#e3b53d]">Track</span>
            </h2>
            <p
              className="text-white/50 text-sm tracking-widest uppercase"
              style={{ fontFamily: "var(--font-rajdhani), sans-serif" }}
            >
              Scenes from FSAE 2025
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {[
              "/competition-2025-1.jpg",
              "/competition-2025-2.jpg",
              "/competition-2025-3.jpg",
              "/competition-2025-4.jpg",
              "/competition-2025-5.jpg",
            ].map((src, i) => (
              <motion.div
                key={src}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="relative aspect-square rounded-lg overflow-hidden border border-[#e3b53d]/15 hover:border-[#e3b53d]/50 transition-colors"
              >
                <Image
                  src={src}
                  alt={`FSAE 2025 moment ${i + 1}`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
              </motion.div>
            ))}
          </div>

          {/* Ignite Us CTA  -  car transforms into holographic on hover */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mt-16 group relative"
          >
            <a
              href="https://giveto.usc.edu/Donation"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Ignite Us  -  donate to USC Formula SAE"
              className="ignite-card relative block overflow-hidden rounded-3xl border border-white/10 transition-all duration-700 hover:border-[#e3b53d]/60 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e3b53d] focus-visible:ring-offset-4 focus-visible:ring-offset-black"
              style={{
                background: "#050505",
                boxShadow:
                  "0 20px 60px -20px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04) inset",
              }}
            >
              {/* Default  -  regular race car */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/HeroPageBackground.webp"
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover scale-105 transition-all duration-[1200ms] ease-out group-hover:opacity-0 group-hover:scale-110"
              />

              {/* Hover  -  holographic race car (crossfades in) */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/HeroPageBackgroundHolographicVFX.webp"
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover opacity-0 scale-110 transition-all duration-[1200ms] ease-out group-hover:opacity-100 group-hover:scale-[1.15]"
                style={{ filter: "saturate(1.15) contrast(1.05)" }}
              />

              {/* Holographic-only effects  -  fade in on hover */}
              <div
                className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100 pointer-events-none"
                aria-hidden="true"
              >
                {/* Neon glow ring */}
                <div
                  className="absolute"
                  style={{
                    left: "50%",
                    top: "55%",
                    transform: "translate(-50%, -50%)",
                    width: "70%",
                    height: "60%",
                    borderRadius: "50%",
                    background:
                      "radial-gradient(ellipse, rgba(227, 181, 61, 0.4) 0%, rgba(139, 0, 0, 0.2) 45%, transparent 75%)",
                    filter: "blur(40px)",
                  }}
                />
                {/* Cyber grid */}
                <div className="absolute inset-0 cyber-grid opacity-25" />
                {/* Scanlines */}
                <div className="absolute inset-0 scanlines opacity-15" />
                {/* Diagonal sweep */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(115deg, transparent 30%, rgba(227,181,61,0.18) 50%, transparent 70%)",
                    animation: "ignite-sweep 2.4s ease-in-out infinite",
                  }}
                />
              </div>

              {/* Vignette */}
              <div
                className="absolute inset-0 pointer-events-none"
                aria-hidden="true"
                style={{
                  background:
                    "radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.8) 100%)",
                }}
              />

              {/* Bottom legibility gradient */}
              <div
                className="absolute inset-0 pointer-events-none"
                aria-hidden="true"
                style={{
                  background:
                    "linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.55) 75%, rgba(0,0,0,0.9) 100%)",
                }}
              />

              {/* Corner brackets */}
              <span
                className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-white/30 rounded-tl-lg pointer-events-none transition-all duration-500 group-hover:w-8 group-hover:h-8 group-hover:border-[#e3b53d]"
                aria-hidden="true"
              />
              <span
                className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-white/30 rounded-tr-lg pointer-events-none transition-all duration-500 group-hover:w-8 group-hover:h-8 group-hover:border-[#e3b53d]"
                aria-hidden="true"
              />
              <span
                className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-white/30 rounded-bl-lg pointer-events-none transition-all duration-500 group-hover:w-8 group-hover:h-8 group-hover:border-[#e3b53d]"
                aria-hidden="true"
              />
              <span
                className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-white/30 rounded-br-lg pointer-events-none transition-all duration-500 group-hover:w-8 group-hover:h-8 group-hover:border-[#e3b53d]"
                aria-hidden="true"
              />

              {/* Content */}
              <div className="relative flex flex-col items-center justify-end text-center px-6 sm:px-10 py-14 sm:py-20 lg:py-24 min-h-[420px] sm:min-h-[460px] lg:min-h-[520px]">
                {/* Eyebrow */}
                <div className="flex items-center gap-3 mb-5">
                  <span className="h-px w-8 bg-white/40 transition-colors duration-500 group-hover:bg-[#e3b53d]/70" aria-hidden="true" />
                  <span
                    className="text-white/80 text-xs sm:text-sm uppercase transition-colors duration-500 group-hover:text-[#e3b53d]"
                    style={{
                      fontFamily: "var(--font-rajdhani), sans-serif",
                      letterSpacing: "0.4em",
                    }}
                  >
                    Fuel The Fight
                  </span>
                  <span className="h-px w-8 bg-white/40 transition-colors duration-500 group-hover:bg-[#e3b53d]/70" aria-hidden="true" />
                </div>

                {/* Headline */}
                <h3
                  className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-3 leading-tight"
                  style={{ fontFamily: "'Ethnocentric', sans-serif" }}
                >
                  Power Us To{" "}
                  <span className="text-[#e3b53d]">FSAE 2026</span>
                </h3>

                {/* Subline */}
                <p
                  className="text-white/65 text-base sm:text-lg max-w-md mb-9"
                  style={{ fontFamily: "var(--font-rajdhani), sans-serif" }}
                >
                  Every dollar puts us closer to the starting line in Brooklyn, MI.
                </p>

                {/* Liquid Glass button */}
                <span
                  className="liquid-glass relative inline-flex items-center gap-3 px-10 sm:px-12 py-4 sm:py-5 rounded-full text-white font-semibold text-lg sm:text-xl uppercase overflow-hidden transition-all duration-500 group-hover:scale-[1.04] group-hover:-translate-y-0.5"
                  style={{
                    fontFamily: "var(--font-rajdhani), sans-serif",
                    letterSpacing: "0.24em",
                  }}
                >
                  {/* Glass body */}
                  <span
                    className="absolute inset-0 rounded-full"
                    aria-hidden="true"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.06) 100%)",
                      backdropFilter: "blur(24px) saturate(180%)",
                      WebkitBackdropFilter: "blur(24px) saturate(180%)",
                      boxShadow:
                        "inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(255,255,255,0.08), 0 8px 32px rgba(0,0,0,0.35), 0 1px 2px rgba(0,0,0,0.4)",
                    }}
                  />
                  {/* Outer ring */}
                  <span
                    className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/25 transition-colors duration-500 group-hover:ring-[#e3b53d]/50"
                    aria-hidden="true"
                  />
                  {/* Top specular highlight */}
                  <span
                    className="absolute top-0 left-[10%] right-[10%] h-1/2 rounded-full pointer-events-none"
                    aria-hidden="true"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 80%)",
                      filter: "blur(2px)",
                    }}
                  />
                  {/* Bottom warm reflection */}
                  <span
                    className="absolute bottom-0 left-1/4 right-1/4 h-1/3 rounded-full pointer-events-none opacity-60 transition-opacity duration-500 group-hover:opacity-100"
                    aria-hidden="true"
                    style={{
                      background:
                        "radial-gradient(ellipse at center, rgba(227,181,61,0.35) 0%, transparent 70%)",
                      filter: "blur(8px)",
                    }}
                  />
                  {/* Sheen sweep on hover */}
                  <span
                    className="absolute inset-0 rounded-full overflow-hidden pointer-events-none opacity-0 group-hover:opacity-100"
                    aria-hidden="true"
                  >
                    <span
                      className="absolute top-0 left-0 h-full w-1/4"
                      style={{
                        background:
                          "linear-gradient(110deg, transparent, rgba(255,255,255,0.55), transparent)",
                        animation: "ignite-button-sweep 2.2s ease-in-out infinite",
                      }}
                    />
                  </span>

                  {/* Label */}
                  <span className="relative z-10">Ignite Us</span>
                  <ArrowRight
                    className="relative z-10 w-5 h-5 sm:w-6 sm:h-6 text-[#e3b53d] transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </span>
              </div>
            </a>
          </motion.div>
        </div>
      </section>

      {/* ═══ CTA FOOTER ═══ */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#e3b53d]/5 rounded-full blur-[150px]" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2
              className="text-3xl sm:text-4xl font-bold text-white mb-6"
              style={{ fontFamily: "'Ethnocentric', sans-serif" }}
            >
              Learn More About{" "}
              <span className="text-[#e3b53d]">Our Mission</span>
            </h2>
            <p
              className="text-white/50 text-lg mb-10 max-w-xl mx-auto"
              style={{ fontFamily: "var(--font-rajdhani), sans-serif" }}
            >
              Discover the team behind the car and the partners who make it
              possible.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTAButton href="/about">
                About Us
                <ArrowRight className="w-5 h-5" />
              </CTAButton>
              <CTAButton href="/sponsorship" variant="secondary">
                Our Sponsors
                <ArrowRight className="w-5 h-5" />
              </CTAButton>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
