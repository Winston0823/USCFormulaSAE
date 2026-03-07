"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Wind,
  Box,
  Cog,
  Zap,
  Gauge,
  User,
  Cpu,
  Briefcase,
  ArrowRight,
  Users,
} from "lucide-react";

const teams = [
  {
    name: "Aerodynamics",
    slug: "aerodynamics",
    icon: <Wind className="w-32 h-32" />,
    description:
      "Our aero team designs and manufactures aerodynamic components that maximize downforce while minimizing drag. Using CFD simulations and wind tunnel testing, we optimize every surface for peak performance.",
    highlights: ["CFD Analysis", "Wind Tunnel Testing", "Carbon Fiber Manufacturing"],
  },
  {
    name: "Frame",
    slug: "frame",
    icon: <Box className="w-32 h-32" />,
    description:
      "The frame team designs the structural backbone of our vehicle. We focus on creating a lightweight yet rigid chassis that provides optimal handling characteristics and driver safety.",
    highlights: ["FEA Analysis", "Steel Tube Fabrication", "Jig Design"],
  },
  {
    name: "Drivetrain",
    slug: "drivetrain",
    icon: <Cog className="w-32 h-32" />,
    description:
      "We engineer the systems that transfer power from the motor to the wheels. Our focus is on efficiency, reliability, and optimal gear ratios for competition events.",
    highlights: ["Gear Design", "Chain Systems", "Differential Tuning"],
  },
  {
    name: "Powertrain",
    slug: "powertrain",
    icon: <Zap className="w-32 h-32" />,
    description:
      "The powertrain team extracts maximum performance from our electric motor package. We handle motor tuning, battery management, and cooling systems.",
    highlights: ["Motor Tuning", "Battery Design", "Cooling Systems"],
  },
  {
    name: "Vehicle Dynamics",
    slug: "vehicle-dynamics",
    icon: <Gauge className="w-32 h-32" />,
    description:
      "We optimize the car's handling through suspension geometry, spring rates, damper tuning, and tire selection. Data acquisition helps us refine our setup.",
    highlights: ["Suspension Design", "Damper Tuning", "Data Analysis"],
  },
  {
    name: "Ergonomics",
    slug: "ergonomics",
    icon: <User className="w-32 h-32" />,
    description:
      "Creating the perfect driver-machine interface is our priority. We design the cockpit, pedal box, steering system, and all driver controls for maximum comfort and performance.",
    highlights: ["Cockpit Design", "Steering Systems", "Driver Controls"],
  },
  {
    name: "Systems",
    slug: "systems",
    icon: <Cpu className="w-32 h-32" />,
    description:
      "Our electronics and systems team handles all wiring, sensors, data acquisition, and vehicle control systems. We bring the car to life with intelligent integration.",
    highlights: ["ECU Programming", "Wiring Design", "Data Systems"],
  },
  {
    name: "Business",
    slug: "business",
    icon: <Briefcase className="w-32 h-32" />,
    description:
      "The business team drives partnerships, manages sponsorships, handles marketing, and coordinates team operations. We make sure the team has the resources to succeed.",
    highlights: ["Sponsorship", "Marketing", "Operations"],
  },
];

export default function TeamsPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 cyber-grid opacity-20" />

        <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#8b0000]/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-[#e3b53d]/10 rounded-full blur-[100px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-[#e3b53d]/10 text-[#e3b53d] text-sm font-medium mb-6">
              <Users className="w-4 h-4 mr-2" />
              OUR TEAMS
            </span>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6">
              Specialized <span className="text-[#e3b53d]">Divisions</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Eight specialized teams working in harmony to engineer a championship-winning
              formula electric racing machine. Find your place in the team.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Teams Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {teams.map((team, index) => (
              <motion.div
                key={team.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/teams/${team.slug}`}>
                  <div className="group relative h-full p-8 rounded-2xl bg-white/5 border border-[#e3b53d]/20 backdrop-blur-sm hover:border-[#e3b53d]/50 transition-all duration-500 overflow-hidden">
                    {/* Background icon */}
                    <div className="absolute -right-8 -bottom-8 text-[#e3b53d]/5 group-hover:text-[#e3b53d]/10 transition-colors duration-500">
                      {team.icon}
                    </div>

                    {/* Animated border line */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-[#e3b53d] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />

                    <div className="relative">
                      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#e3b53d] transition-colors">
                        {team.name}
                      </h3>
                      <p className="text-gray-400 leading-relaxed mb-4 font-secondary">{team.description}</p>

                      {/* Highlights */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {team.highlights.map((highlight) => (
                          <span
                            key={highlight}
                            className="px-3 py-1 text-xs font-medium rounded-full bg-[#e3b53d]/10 text-[#e3b53d] border border-[#e3b53d]/20"
                          >
                            {highlight}
                          </span>
                        ))}
                      </div>

                      {/* CTA */}
                      <div className="inline-flex items-center text-sm font-semibold text-[#e3b53d] group-hover:translate-x-2 transition-transform duration-300">
                        <span>Learn More</span>
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#8b0000]/10 via-transparent to-[#e3b53d]/10" />
        <div className="absolute inset-0 circuit-pattern opacity-20" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Find Your <span className="text-[#e3b53d]">Place</span>
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              No matter your major or experience level, there&apos;s a place for you on our team.
              We provide training and mentorship to help you grow.
            </p>
            <Link
              href="https://linktr.ee/scformulae24?fbclid=PAZXh0bgNhZW0CMTEAAaZL2QuvE6aLgnkuHAJWX5ACZBdP9GljMqVHRwkn4ii-aqm5UlbukIsNEtA_aem_gxNdBUzqxvWkYFSW-nVahQ"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-10 py-5 bg-[#e3b53d] rounded-full text-black font-bold text-xl leading-none hover:bg-[#c4ae5a] hover:shadow-2xl hover:shadow-[#e3b53d]/30 transition-all duration-300 neon-button"
            >
              Join a Team
              <ArrowRight className="w-6 h-6 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
