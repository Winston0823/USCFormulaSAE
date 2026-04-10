"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Diamond,
  Award,
  Medal,
  Star,
  ArrowRight,
  CheckCircle,
  Users,
  Briefcase,
  Eye,
  Rocket,
  Zap,
} from "lucide-react";

const tiers = [
  {
    name: "Trojan",
    price: "$10,000+",
    icon: <Diamond className="w-10 h-10" />,
    color: "#8b0000",
    gradient: "from-[#8b0000] to-[#5c0000]",
    benefits: [
      "Logo on website",
      "Logo on car, shirts & banner",
      "Large (L) logo size",
      "3 logos on car",
      "Appreciation letter",
      "Resume book",
      "Shop tour",
      "1-on-1 with leadership",
    ],
    featured: true,
  },
  {
    name: "Gold",
    price: "$5,000+",
    icon: <Award className="w-10 h-10" />,
    color: "#e3b53d",
    gradient: "from-[#e3b53d] to-[#b8952a]",
    benefits: [
      "Logo on website",
      "Logo on car, shirts & banner",
      "Medium (M) logo size",
      "2 logos on car",
      "Appreciation letter",
      "Resume book",
      "Shop tour",
    ],
    featured: false,
  },
  {
    name: "Cardinal",
    price: "$1,000+",
    icon: <Medal className="w-10 h-10" />,
    color: "#a01010",
    gradient: "from-[#a01010] to-[#7a0c0c]",
    benefits: [
      "Logo on website",
      "Logo on car, shirts & banner",
      "Small (S) logo size",
      "1 logo on car",
      "Appreciation letter",
      "Resume book",
    ],
    featured: false,
  },
  {
    name: "Friends of SCFE",
    price: "<$999",
    icon: <Star className="w-10 h-10" />,
    color: "#a0a0a0",
    gradient: "from-[#a0a0a0] to-[#808080]",
    benefits: [
      "Logo on website",
      "Appreciation letter",
    ],
    featured: false,
  },
];

const stats = [
  { value: "70+", label: "Team Members", icon: <Users className="w-6 h-6" /> },
  { value: "8", label: "Specialized Teams", icon: <Zap className="w-6 h-6" /> },
  { value: "2020", label: "Founded", icon: <Award className="w-6 h-6" /> },
  { value: "2025", label: "Competition Year", icon: <Eye className="w-6 h-6" /> },
];

const benefits = [
  {
    icon: <Users className="w-8 h-8" />,
    title: "Talent Pipeline",
    description:
      "Direct access to top engineering talent from USC. Our members have interned at companies like SpaceX.",
  },
  {
    icon: <Eye className="w-8 h-8" />,
    title: "Brand Visibility",
    description:
      "Your logo on our race car, apparel, and social media reaching thousands of students and industry professionals.",
  },
  {
    icon: <Briefcase className="w-8 h-8" />,
    title: "Real Partnership",
    description:
      "Collaborate on engineering challenges, host workshops, and engage directly with our teams.",
  },
];

const currentSponsors = [
  { name: "Sponsor 1" },
  { name: "Sponsor 2" },
  { name: "Sponsor 3" },
  { name: "Sponsor 4" },
  { name: "Sponsor 5" },
  { name: "Sponsor 6" },
  { name: "Sponsor 7" },
  { name: "Sponsor 8" },
];

export default function SponsorshipPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Hero Section — Image LEFT, Text RIGHT */}
      <section className="relative pt-24 lg:pt-0 overflow-hidden h-screen">
          {/* Full-bleed background image starting from left edge */}
          <div className="absolute inset-0">
            <img
              src="/car-sticker-sae.jpg"
              alt="Formula SAE car sticker"
              className="absolute left-0 top-0 h-[120%] w-auto max-w-none -top-[10%]"
            />

            {/* Fade to dark toward the right */}
            <div
              className="absolute inset-y-0 left-0 hidden lg:block"
              style={{
                width: "70vw",
                background: "linear-gradient(to right, transparent 10%, rgba(10,10,15,0.5) 40%, rgba(10,10,15,0.85) 60%, #0a0a0f 75%)",
              }}
            />

            {/* Fade to dark downward — mobile */}
            <div
              className="absolute inset-0 lg:hidden"
              style={{
                background: "linear-gradient(to bottom, transparent 30%, #0a0a0f 70%)",
              }}
            />

            {/* Top vignette for nav blending */}
            <div
              className="absolute inset-x-0 top-0 h-32"
              style={{
                background: "linear-gradient(to bottom, #0a0a0f, transparent)",
              }}
            />
          </div>

          <div className="relative flex flex-col lg:flex-row items-stretch h-full">
            {/* LEFT: spacer for image area */}
            <div className="w-full lg:w-1/2 h-[50vh] lg:h-auto" />

            {/* RIGHT: Text */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full lg:w-1/2 flex items-center px-6 sm:px-8 lg:pl-16 lg:pr-12 py-12 lg:py-0 text-center lg:text-left"
            >
              <div>
                <span className="inline-flex items-center px-4 py-2 rounded-full bg-[#e3b53d]/10 text-[#e3b53d] text-sm font-medium mb-6">
                  <Rocket className="w-4 h-4 mr-2" />
                  SPONSORSHIP
                </span>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6">
                  Fuel Our{" "}
                  <span className="text-[#e3b53d]">Mission</span>
                </h1>
                <p className="text-xl text-gray-400 max-w-xl mx-auto lg:mx-0 mb-12">
                  Join the companies shaping the future of automotive engineering.
                  Your support helps us build championship-winning machines.
                </p>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="p-4 rounded-xl bg-white/5 border border-[#e3b53d]/20 backdrop-blur-sm"
                    >
                      <div className="flex items-center justify-center lg:justify-start mb-2 text-[#e3b53d]">
                        {stat.icon}
                      </div>
                      <div className="text-3xl font-bold text-white">{stat.value}</div>
                      <div className="text-sm text-gray-400">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
      </section>

      {/* Why Sponsor Section — Text LEFT, Abstract/Graphic RIGHT */}
      <section className="py-24 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-0 px-6 sm:px-8 lg:px-12">
            {/* LEFT: Text + Benefit Cards */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="w-full lg:w-1/2 lg:pr-12"
            >
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#e3b53d]/10 text-[#e3b53d] text-sm font-medium mb-4">
                <Rocket className="w-4 h-4 mr-2" />
                WHY SPONSOR US
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                Invest in Tomorrow&apos;s{" "}
                <span className="text-[#e3b53d]">Engineers</span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                Your partnership directly supports students gaining real-world
                experience in electric vehicle design, manufacturing, and competition.
              </p>

              {/* Benefit cards — stacked vertically */}
              <div className="space-y-4">
                {benefits.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4 p-5 rounded-xl bg-white/5 border border-[#e3b53d]/20 hover:border-[#e3b53d]/40 transition-all duration-300 group"
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        background: "linear-gradient(135deg, rgba(227,181,61,0.2), transparent)",
                        border: "1px solid rgba(227,181,61,0.3)",
                      }}
                    >
                      <span className="text-[#e3b53d]">{item.icon}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* RIGHT: Abstract graphic */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="w-full lg:w-1/2 relative h-[400px] lg:h-[600px] flex items-center justify-center"
            >
              {/* Ambient glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#8b0000]/15 rounded-full blur-[120px]" />
              <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-[#e3b53d]/10 rounded-full blur-[100px]" />

              {/* Large logo wireframe */}
              <div className="relative">
                <img
                  src="/icons/icon_negative.svg"
                  alt=""
                  aria-hidden="true"
                  className="w-64 h-64 lg:w-80 lg:h-80 object-contain opacity-15"
                />
                {/* Glow ring around logo */}
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    boxShadow: "0 0 80px 20px rgba(227,181,61,0.08), 0 0 160px 60px rgba(139,0,0,0.06)",
                  }}
                />
              </div>

              {/* Geometric accent lines */}
              <div className="absolute top-1/4 right-0 w-32 h-px bg-gradient-to-l from-[#e3b53d]/30 to-transparent" />
              <div className="absolute bottom-1/3 left-0 w-24 h-px bg-gradient-to-r from-[#8b0000]/30 to-transparent" />
              <div className="absolute top-1/2 right-1/4 w-px h-20 bg-gradient-to-b from-[#e3b53d]/20 to-transparent" />
            </motion.div>
          </div>
      </section>

      {/* Sponsorship Tiers */}
      <section className="py-24 bg-gradient-to-b from-[#0a0a0f] to-[#0a0a0a] relative overflow-hidden">
        {/* Logo watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ opacity: 0.07 }}>
          <img
            src="/icons/icon_negative.svg"
            alt=""
            aria-hidden="true"
            className="w-[100vw] h-[100vw] max-w-[1200px] max-h-[1200px] object-contain"
          />
        </div>

        <div className="absolute inset-0 circuit-pattern opacity-20" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#e3b53d]/10 text-[#e3b53d] text-sm font-medium mb-4">
              PARTNERSHIP LEVELS
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Sponsorship <span className="text-[#e3b53d]">Tiers</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Choose the partnership level that best fits your goals. All tiers include meaningful benefits and recognition.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative rounded-2xl overflow-hidden ${
                  tier.featured ? "lg:scale-105 lg:-my-4" : ""
                }`}
              >
                {tier.featured && (
                  <div className="absolute top-0 left-0 right-0 py-2 bg-gradient-to-r from-[#8b0000] to-[#5c0000] text-center text-white text-sm font-bold z-10">
                    MOST POPULAR
                  </div>
                )}

                <div
                  className={`h-full p-6 bg-white/5 border transition-all duration-300 hover:border-white/30 ${
                    tier.featured ? "pt-12" : ""
                  }`}
                  style={{
                    borderRadius: "1rem",
                    borderColor: tier.featured ? tier.color : "rgba(255,255,255,0.1)",
                  }}
                >
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: `linear-gradient(135deg, ${tier.color}30, ${tier.color}10)` }}
                  >
                    <span style={{ color: tier.color }}>{tier.icon}</span>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-1">{tier.name}</h3>
                  <p className="text-3xl font-black mb-6" style={{ color: tier.color }}>
                    {tier.price}
                  </p>

                  <ul className="space-y-3 mb-8">
                    {tier.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: tier.color }} />
                        <span className="text-gray-300 text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/contact"
                    className={`block w-full py-3 rounded-xl text-center font-semibold transition-all duration-300 ${
                      tier.featured
                        ? `bg-gradient-to-r ${tier.gradient} text-white hover:shadow-lg`
                        : "bg-white/5 border border-white/20 text-white hover:bg-white/10"
                    }`}
                    style={{ boxShadow: tier.featured ? `0 10px 30px ${tier.color}30` : undefined }}
                  >
                    Get Started
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-gray-500 mt-8"
          >
            Custom sponsorship packages available. Contact us to discuss your specific needs.
          </motion.p>
        </div>
      </section>

      {/* Current Sponsors — Marquee Scroll */}
      <section className="py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#e3b53d]/10 text-[#e3b53d] text-sm font-medium mb-4">
              <Star className="w-4 h-4 mr-2" />
              OUR PARTNERS
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Current <span className="text-[#e3b53d]">Sponsors</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              We&apos;re proud to partner with these amazing companies who share our passion for engineering excellence.
            </p>
          </motion.div>
        </div>

        {/* Marquee */}
        <div className="relative">
          {/* Fade masks */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0a0a0f] to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0a0a0f] to-transparent z-10" />

          <motion.div
            className="flex gap-6 will-change-transform"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          >
            {[...currentSponsors, ...currentSponsors].map((sponsor, i) => (
              <div
                key={i}
                className="shrink-0 w-36 h-20 sm:w-48 sm:h-28 rounded-xl bg-white/5 border border-[#e3b53d]/10 flex items-center justify-center p-4 sm:p-6 hover:border-[#e3b53d]/30 transition-colors"
              >
                <span className="text-gray-500 text-sm">{sponsor.name}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#8b0000]/10 via-transparent to-[#e3b53d]/10" />
          <div className="absolute inset-0 cyber-grid opacity-30" />
        </div>

        {/* Animated border */}
        <div className="absolute top-0 left-0 right-0 h-px">
          <motion.div
            className="h-full bg-gradient-to-r from-transparent via-[#e3b53d] to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-6xl font-black text-white mb-6">
              Ready to <span className="text-[#e3b53d]">Partner</span>?
            </h2>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              Let&apos;s discuss how we can create a mutually beneficial partnership that drives innovation and develops future talent.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-10 py-5 bg-[#e3b53d] rounded-full text-black font-bold text-lg hover:bg-[#d4a634] hover:shadow-2xl hover:shadow-[#e3b53d]/30 transition-all duration-300"
              >
                Contact Us
                <ArrowRight className="w-6 h-6 ml-2" />
              </Link>
              <a
                href="#"
                className="inline-flex items-center justify-center px-10 py-5 bg-white/5 border border-white/20 rounded-full text-white font-bold text-lg hover:bg-white/10 transition-all duration-300"
              >
                Download Prospectus
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
