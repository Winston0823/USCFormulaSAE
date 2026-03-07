"use client";

import { useState, useEffect, useMemo } from "react";
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
  Handshake,
  Rocket,
  Zap,
  Image as ImageIcon,
} from "lucide-react";

const tiers = [
  {
    name: "Trojan",
    price: "$10,000+",
    icon: <Diamond className="w-10 h-10" />,
    color: "#cc2200",
    gradient: "from-[#cc2200] to-[#991a00]",
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
    color: "#d4b050",
    gradient: "from-[#d4b050] to-[#b8952a]",
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
    color: "#c0392b",
    gradient: "from-[#c0392b] to-[#96281b]",
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
  { value: "50+", label: "Team Members", icon: <Users className="w-6 h-6" /> },
  { value: "100K+", label: "Social Impressions", icon: <Eye className="w-6 h-6" /> },
  { value: "8", label: "Specialized Teams", icon: <Zap className="w-6 h-6" /> },
  { value: "20+", label: "Years of Excellence", icon: <Award className="w-6 h-6" /> },
];

const currentSponsors = [
  { name: "Sponsor 1", tier: "Platinum" },
  { name: "Sponsor 2", tier: "Gold" },
  { name: "Sponsor 3", tier: "Gold" },
  { name: "Sponsor 4", tier: "Silver" },
  { name: "Sponsor 5", tier: "Silver" },
  { name: "Sponsor 6", tier: "Bronze" },
  { name: "Sponsor 7", tier: "Bronze" },
  { name: "Sponsor 8", tier: "Bronze" },
];

export default function SponsorshipPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Generate stable random values only on client to avoid hydration mismatch
  const particles = useMemo(() => {
    if (!isMounted) return [];
    return [...Array(20)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 3 + Math.random() * 2,
      delay: Math.random() * 2,
    }));
  }, [isMounted]);

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Hero Section */}
      <section className="relative pt-32 pb-32 overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 cyber-grid opacity-20" />

        {/* Animated particles - only render after mount to avoid hydration mismatch */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-[#ff3d00] rounded-full"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
            }}
          />
        ))}

        {/* Large glow effects */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#ff3d00]/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#00d4ff]/10 rounded-full blur-[150px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-[#ff3d00]/20 to-[#00d4ff]/20 border border-white/10 mb-8"
            >
              <Handshake className="w-5 h-5 mr-2 text-[#ff3d00]" />
              <span className="text-white font-medium">Partner With Excellence</span>
            </motion.div>

            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black text-white mb-6">
              Fuel Our <span className="bg-gradient-to-r from-[#ff3d00] via-[#ff6b35] to-[#ffcc00] bg-clip-text text-transparent">Mission</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-400 max-w-3xl mx-auto mb-12">
              Join the companies shaping the future of automotive engineering.
              Your support helps us build championship-winning machines.
            </p>

            {/* Quick stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
                >
                  <div className="flex items-center justify-center mb-2 text-[#00d4ff]">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Animated racing lines */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#ff3d00] to-transparent opacity-50" />
      </section>

      {/* Why Sponsor Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#ff3d00]/10 text-[#ff3d00] text-sm font-medium mb-4">
              <Rocket className="w-4 h-4 mr-2" />
              WHY SPONSOR US
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Invest in Tomorrow&apos;s <span className="text-[#ff3d00]">Engineers</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="w-10 h-10" />,
                title: "Talent Pipeline",
                description:
                  "Direct access to top engineering talent from USC. Our alumni work at Tesla, SpaceX, Ford, Apple, and more.",
                color: "#ff3d00",
              },
              {
                icon: <Eye className="w-10 h-10" />,
                title: "Brand Visibility",
                description:
                  "Your logo on our race car, apparel, and social media reaching thousands of students and industry professionals.",
                color: "#00d4ff",
              },
              {
                icon: <Briefcase className="w-10 h-10" />,
                title: "Real Partnership",
                description:
                  "Collaborate on engineering challenges, host workshops, and engage directly with our teams.",
                color: "#ffcc00",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative p-8 rounded-2xl bg-white/5 border border-white/10 overflow-hidden group hover:border-white/20 transition-all duration-500"
              >
                {/* Glow effect */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(circle at center, ${item.color}10 0%, transparent 70%)`,
                  }}
                />

                <div className="relative">
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center mb-6"
                    style={{
                      background: `linear-gradient(135deg, ${item.color}20, transparent)`,
                      border: `1px solid ${item.color}40`,
                    }}
                  >
                    <span style={{ color: item.color }}>{item.icon}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsorship Tiers */}
      <section className="py-24 bg-gradient-to-b from-[#0a0a0f] to-[#0f0f1a] relative overflow-hidden">
        <div className="absolute inset-0 circuit-pattern opacity-20" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#ff3d00]/10 text-[#ff3d00] text-sm font-medium mb-4">
              PARTNERSHIP LEVELS
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Sponsorship <span className="text-[#ff3d00]">Tiers</span>
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
                  <div className="absolute top-0 left-0 right-0 py-2 bg-gradient-to-r from-[#cc2200] to-[#991a00] text-center text-white text-sm font-bold z-10">
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
                        ? `bg-gradient-to-r ${tier.gradient} text-black hover:shadow-lg`
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

      {/* Current Sponsors */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#ff3d00]/10 text-[#ff3d00] text-sm font-medium mb-4">
              <Star className="w-4 h-4 mr-2" />
              OUR PARTNERS
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Current <span className="text-[#ff3d00]">Sponsors</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              We&apos;re proud to partner with these amazing companies who share our passion for engineering excellence.
            </p>
          </motion.div>

          {/* Sponsor logos grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {currentSponsors.map((sponsor, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="aspect-[3/2] rounded-xl bg-white/5 border border-white/10 flex items-center justify-center p-6 hover:border-white/20 transition-colors"
              >
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-lg bg-white/5 flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-gray-500" />
                  </div>
                  <p className="text-gray-400 text-sm">{sponsor.name}</p>
                  <p className="text-xs text-gray-600">{sponsor.tier}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#ff3d00]/20 via-transparent to-[#00d4ff]/20" />
          <div className="absolute inset-0 cyber-grid opacity-30" />
        </div>

        {/* Animated border */}
        <div className="absolute top-0 left-0 right-0 h-px">
          <motion.div
            className="h-full bg-gradient-to-r from-transparent via-[#ff3d00] to-transparent"
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
              Ready to <span className="text-[#ff3d00]">Partner</span>?
            </h2>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              Let&apos;s discuss how we can create a mutually beneficial partnership that drives innovation and develops future talent.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-10 py-5 bg-gradient-to-r from-[#ff3d00] to-[#ff6b35] rounded-full text-white font-bold text-lg hover:shadow-2xl hover:shadow-[#ff3d00]/30 transition-all duration-300 neon-button"
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
