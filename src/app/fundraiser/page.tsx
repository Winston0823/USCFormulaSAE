"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Flame,
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
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-[#e3b53d]/10 text-[#e3b53d] text-sm font-medium mb-6">
              <Flame className="w-4 h-4 mr-2" />
              USC IGNITE
            </span>
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
              Dear USC Ignite,
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

      {/* ═══ TEAM PHOTO PLACEHOLDER ═══ */}
      <section className="relative py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative aspect-video rounded-2xl overflow-hidden border border-[#e3b53d]/20 bg-white/5"
          >
            {/* Placeholder content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-[#e3b53d]/10 flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-[#e3b53d]/50" />
              </div>
              <p
                className="text-white/30 text-lg"
                style={{ fontFamily: "var(--font-rajdhani), sans-serif" }}
              >
                Team photo coming soon
              </p>
            </div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center text-white/30 text-sm mt-4 tracking-widest uppercase"
            style={{ fontFamily: "var(--font-rajdhani), sans-serif" }}
          >
            Our team, ready to compete
          </motion.p>
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
              <Link
                href="/about"
                className="inline-flex items-center justify-center px-8 py-4 rounded-lg text-black font-semibold text-base tracking-wider transition-all duration-300 hover:scale-105 uppercase"
                style={{
                  background: "linear-gradient(90deg, #e3b53d, #daa520)",
                  fontFamily: "var(--font-rajdhani), sans-serif",
                  letterSpacing: "0.15em",
                  boxShadow: "0 0 20px rgba(227, 181, 61, 0.3)",
                }}
              >
                About Us
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                href="/sponsorship"
                className="inline-flex items-center justify-center px-8 py-4 rounded-lg text-[#e3b53d] font-semibold text-base tracking-wider border border-[#e3b53d]/40 hover:border-[#e3b53d] hover:bg-[#e3b53d]/10 transition-all duration-300 hover:scale-105 uppercase"
                style={{
                  fontFamily: "var(--font-rajdhani), sans-serif",
                  letterSpacing: "0.15em",
                }}
              >
                Our Sponsors
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
