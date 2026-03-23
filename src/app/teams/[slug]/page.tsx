"use client";

import { useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
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
  ArrowLeft,
  ArrowUpRight,
  Users,
  Mail,
  Linkedin,
  Wrench,
  GraduationCap,
} from "lucide-react";

interface TeamMember {
  name: string;
  role: string;
  major: string;
  year: string;
}

interface TeamData {
  name: string;
  icon: React.ReactNode;
  tagline: string;
  description: string;
  responsibilities: string[];
  leads: TeamMember[];
  members: TeamMember[];
  skills: string[];
  tools: string[];
  accentHue: string; // subtle per-team color variation
}

const teamsData: Record<string, TeamData> = {
  aerodynamics: {
    name: "Aerodynamics",
    icon: <Wind />,
    accentHue: "from-sky-500/20 via-transparent",
    tagline: "Shaping the Air, Defining Performance",
    description:
      "The Aerodynamics team is responsible for designing and manufacturing all aerodynamic components on the vehicle. We use computational fluid dynamics (CFD) simulations and wind tunnel testing to optimize airflow around the car, maximizing downforce while minimizing drag. Our work directly impacts the car's cornering speed and overall lap times.",
    responsibilities: [
      "CFD simulation and analysis using STAR-CCM+ and Ansys Fluent",
      "Wind tunnel model design and testing",
      "Front and rear wing design and manufacturing",
      "Undertray and diffuser development",
      "Carbon fiber composite layups",
      "Aerodynamic data analysis and optimization",
    ],
    leads: [
      { name: "Team Lead Placeholder", role: "Aerodynamics Lead", major: "Aerospace Engineering", year: "Senior" },
      { name: "Deputy Lead Placeholder", role: "CFD Lead", major: "Mechanical Engineering", year: "Junior" },
    ],
    members: [
      { name: "Member 1", role: "CFD Analyst", major: "Aerospace Engineering", year: "Junior" },
      { name: "Member 2", role: "Composites Specialist", major: "Materials Science", year: "Senior" },
      { name: "Member 3", role: "Design Engineer", major: "Mechanical Engineering", year: "Sophomore" },
      { name: "Member 4", role: "Testing Lead", major: "Aerospace Engineering", year: "Junior" },
    ],
    skills: ["CAD Modeling", "CFD Analysis", "Composite Manufacturing", "Data Analysis"],
    tools: ["STAR-CCM+", "SolidWorks", "ANSYS", "MATLAB"],
  },
  frame: {
    name: "Frame",
    icon: <Box />,
    accentHue: "from-orange-500/20 via-transparent",
    tagline: "The Foundation of Speed",
    description:
      "The Frame team designs and builds the structural backbone of our race car. We create a chassis that is lightweight yet incredibly rigid, providing optimal handling characteristics while ensuring driver safety. Our work involves extensive finite element analysis, material selection, and precision fabrication.",
    responsibilities: [
      "Chassis design and finite element analysis",
      "Steel tube frame fabrication and welding",
      "Jig design and manufacturing",
      "Impact attenuator design",
      "Roll hoop and safety structure development",
      "Weight optimization strategies",
    ],
    leads: [
      { name: "Team Lead Placeholder", role: "Frame Lead", major: "Mechanical Engineering", year: "Senior" },
      { name: "Deputy Lead Placeholder", role: "Fabrication Lead", major: "Mechanical Engineering", year: "Senior" },
    ],
    members: [
      { name: "Member 1", role: "FEA Analyst", major: "Mechanical Engineering", year: "Junior" },
      { name: "Member 2", role: "Welder", major: "Manufacturing Engineering", year: "Senior" },
      { name: "Member 3", role: "Design Engineer", major: "Mechanical Engineering", year: "Sophomore" },
      { name: "Member 4", role: "Safety Systems", major: "Mechanical Engineering", year: "Junior" },
    ],
    skills: ["Welding", "FEA Analysis", "CAD Design", "Metal Fabrication"],
    tools: ["SolidWorks", "ANSYS", "TIG Welder", "Tube Notcher"],
  },
  drivetrain: {
    name: "Drivetrain",
    icon: <Cog />,
    accentHue: "from-emerald-500/20 via-transparent",
    tagline: "Connecting Power to Performance",
    description:
      "The Drivetrain team is responsible for all systems that transfer power from the motor to the wheels. We design and optimize gear ratios, chain systems, differentials, and axles to ensure efficient power delivery and reliability during competition events.",
    responsibilities: [
      "Gear ratio optimization and selection",
      "Chain drive system design",
      "Differential selection and tuning",
      "CV joint and axle design",
      "Sprocket design and manufacturing",
      "Drivetrain efficiency testing",
    ],
    leads: [
      { name: "Team Lead Placeholder", role: "Drivetrain Lead", major: "Mechanical Engineering", year: "Senior" },
      { name: "Deputy Lead Placeholder", role: "Transmission Lead", major: "Mechanical Engineering", year: "Junior" },
    ],
    members: [
      { name: "Member 1", role: "Gear Designer", major: "Mechanical Engineering", year: "Junior" },
      { name: "Member 2", role: "Manufacturing", major: "Industrial Engineering", year: "Senior" },
      { name: "Member 3", role: "Testing Engineer", major: "Mechanical Engineering", year: "Sophomore" },
    ],
    skills: ["Gear Design", "CNC Machining", "Assembly", "Testing"],
    tools: ["SolidWorks", "KISSsoft", "CNC Mill", "Dyno"],
  },
  powertrain: {
    name: "Powertrain",
    icon: <Zap />,
    accentHue: "from-amber-500/20 via-transparent",
    tagline: "Engineering Pure Performance",
    description:
      "The Powertrain team extracts maximum performance from our electric motor package. We handle motor selection, tuning, battery management systems, and cooling. Our goal is to deliver reliable power throughout competition while maximizing efficiency and performance.",
    responsibilities: [
      "Electric motor tuning and calibration",
      "Battery pack design and manufacturing",
      "Battery management system development",
      "Cooling system design (motor, battery, inverter)",
      "High voltage system integration",
      "Dynamometer testing and data analysis",
    ],
    leads: [
      { name: "Team Lead Placeholder", role: "Powertrain Lead", major: "Electrical Engineering", year: "Senior" },
      { name: "Deputy Lead Placeholder", role: "Battery Lead", major: "Mechanical Engineering", year: "Senior" },
    ],
    members: [
      { name: "Member 1", role: "Motor Controls", major: "Electrical Engineering", year: "Junior" },
      { name: "Member 2", role: "Battery Design", major: "Mechanical Engineering", year: "Junior" },
      { name: "Member 3", role: "Cooling Systems", major: "Mechanical Engineering", year: "Sophomore" },
      { name: "Member 4", role: "HV Systems", major: "Electrical Engineering", year: "Senior" },
    ],
    skills: ["Motor Controls", "Battery Design", "Thermal Management", "Data Analysis"],
    tools: ["MATLAB/Simulink", "SolidWorks", "Dynamometer", "Thermal Imaging"],
  },
  "vehicle-dynamics": {
    name: "Vehicle Dynamics",
    icon: <Gauge />,
    accentHue: "from-rose-500/20 via-transparent",
    tagline: "Mastering Motion",
    description:
      "The Vehicle Dynamics team optimizes how the car handles through corners and over various track surfaces. We design suspension geometry, select and tune dampers, choose tire compounds, and use data acquisition to continuously refine our setup for maximum grip and driver confidence.",
    responsibilities: [
      "Suspension geometry design and optimization",
      "Spring and damper selection/tuning",
      "Tire testing and compound selection",
      "Steering system design",
      "Data acquisition and lap analysis",
      "Setup optimization for different events",
    ],
    leads: [
      { name: "Team Lead Placeholder", role: "Vehicle Dynamics Lead", major: "Mechanical Engineering", year: "Senior" },
      { name: "Deputy Lead Placeholder", role: "Suspension Lead", major: "Mechanical Engineering", year: "Junior" },
    ],
    members: [
      { name: "Member 1", role: "Damper Tuning", major: "Mechanical Engineering", year: "Junior" },
      { name: "Member 2", role: "Data Engineer", major: "Computer Science", year: "Senior" },
      { name: "Member 3", role: "Tire Specialist", major: "Mechanical Engineering", year: "Sophomore" },
      { name: "Member 4", role: "Kinematics", major: "Mechanical Engineering", year: "Junior" },
    ],
    skills: ["Kinematics", "Data Analysis", "Damper Tuning", "Vehicle Simulation"],
    tools: ["OptimumG", "MATLAB", "SolidWorks", "MoTeC i2"],
  },
  ergonomics: {
    name: "Ergonomics",
    icon: <User />,
    accentHue: "from-violet-500/20 via-transparent",
    tagline: "The Driver-Machine Interface",
    description:
      "The Ergonomics team creates the perfect connection between driver and machine. We design the cockpit layout, pedal box, steering system, seat, and all driver controls. Our focus is on maximizing driver comfort, visibility, and the ability to extract maximum performance from the car.",
    responsibilities: [
      "Cockpit and dashboard design",
      "Pedal box design and adjustment",
      "Steering wheel and column design",
      "Seat design and driver positioning",
      "Safety harness and headrest",
      "Driver controls and switch layout",
    ],
    leads: [
      { name: "Team Lead Placeholder", role: "Ergonomics Lead", major: "Mechanical Engineering", year: "Senior" },
      { name: "Deputy Lead Placeholder", role: "Cockpit Lead", major: "Industrial Design", year: "Junior" },
    ],
    members: [
      { name: "Member 1", role: "Pedal Design", major: "Mechanical Engineering", year: "Junior" },
      { name: "Member 2", role: "Steering Systems", major: "Mechanical Engineering", year: "Senior" },
      { name: "Member 3", role: "Seat Design", major: "Industrial Design", year: "Sophomore" },
    ],
    skills: ["Human Factors", "CAD Design", "Ergonomic Analysis", "Prototyping"],
    tools: ["SolidWorks", "3D Printing", "Foam Molding", "Anthropometric Data"],
  },
  systems: {
    name: "Systems",
    icon: <Cpu />,
    accentHue: "from-cyan-500/20 via-transparent",
    tagline: "Bringing Intelligence to Speed",
    description:
      "The Systems team handles all electronics, wiring, sensors, and vehicle control systems. We design the electrical architecture, program the ECU, create custom circuit boards, and develop data acquisition systems that allow us to monitor and optimize every aspect of the car's performance.",
    responsibilities: [
      "Vehicle wiring harness design and manufacturing",
      "ECU programming and calibration",
      "Custom PCB design and fabrication",
      "Sensor integration and calibration",
      "Data acquisition system development",
      "Dashboard and driver display design",
    ],
    leads: [
      { name: "Team Lead Placeholder", role: "Systems Lead", major: "Electrical Engineering", year: "Senior" },
      { name: "Deputy Lead Placeholder", role: "ECU Lead", major: "Computer Engineering", year: "Senior" },
    ],
    members: [
      { name: "Member 1", role: "Wiring Design", major: "Electrical Engineering", year: "Junior" },
      { name: "Member 2", role: "PCB Designer", major: "Electrical Engineering", year: "Junior" },
      { name: "Member 3", role: "Embedded Systems", major: "Computer Engineering", year: "Sophomore" },
      { name: "Member 4", role: "Data Systems", major: "Computer Science", year: "Senior" },
    ],
    skills: ["Circuit Design", "Embedded Programming", "Wiring", "Data Systems"],
    tools: ["Altium Designer", "MoTeC", "Python", "Soldering Station"],
  },
  business: {
    name: "Business",
    icon: <Briefcase />,
    accentHue: "from-[#e3b53d]/20 via-transparent",
    tagline: "Driving Success Beyond the Track",
    description:
      "The Business team is the engine that keeps our organization running. We manage sponsorship relationships, marketing campaigns, team finances, event logistics, and recruitment. Our work ensures the team has the resources, visibility, and organizational structure needed to succeed.",
    responsibilities: [
      "Sponsorship acquisition and management",
      "Marketing and social media management",
      "Team budget and financial planning",
      "Competition logistics and travel",
      "Recruitment and member relations",
      "Business presentation preparation",
    ],
    leads: [
      { name: "Team Lead Placeholder", role: "Business Lead", major: "Business Administration", year: "Senior" },
      { name: "Deputy Lead Placeholder", role: "Marketing Lead", major: "Marketing", year: "Junior" },
    ],
    members: [
      { name: "Member 1", role: "Sponsorship", major: "Business Administration", year: "Junior" },
      { name: "Member 2", role: "Social Media", major: "Communications", year: "Sophomore" },
      { name: "Member 3", role: "Finance", major: "Finance", year: "Senior" },
      { name: "Member 4", role: "Logistics", major: "Operations Management", year: "Junior" },
    ],
    skills: ["Communication", "Marketing", "Financial Planning", "Project Management"],
    tools: ["Excel", "Adobe Creative Suite", "Canva", "LinkedIn"],
  },
};

// Team navigation order for prev/next
const teamOrder = [
  "aerodynamics",
  "frame",
  "drivetrain",
  "powertrain",
  "vehicle-dynamics",
  "ergonomics",
  "systems",
  "business",
];

function getAdjacentTeams(slug: string) {
  const idx = teamOrder.indexOf(slug);
  const prev = idx > 0 ? teamOrder[idx - 1] : teamOrder[teamOrder.length - 1];
  const next = idx < teamOrder.length - 1 ? teamOrder[idx + 1] : teamOrder[0];
  return { prev, next };
}

export default function TeamPage() {
  const params = useParams();
  const slug = params.slug as string;
  const team = teamsData[slug];
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const iconScale = useTransform(scrollYProgress, [0, 1], [1, 1.3]);
  const iconOpacity = useTransform(scrollYProgress, [0, 0.6], [0.06, 0]);

  useEffect(() => {
    const lenis = (window as Window & { __lenis?: { scrollTo: (target: number) => void } }).__lenis;
    if (lenis) {
      lenis.scrollTo(0);
    } else {
      window.scrollTo(0, 0);
    }
  }, [slug]);

  if (!team) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Team Not Found</h1>
          <Link href="/#teams" className="text-[#e3b53d] hover:underline">
            Back to Teams
          </Link>
        </div>
      </div>
    );
  }

  const { prev, next } = getAdjacentTeams(slug);

  return (
    <div className="min-h-screen bg-black">
      {/* ═══════════════════════════════════════════
          HERO — Full viewport, dramatic type scale
         ═══════════════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-[90vh] flex items-end overflow-hidden">
        {/* Layered background */}
        <div className="absolute inset-0 hero-gradient" />
        <div className={`absolute inset-0 bg-gradient-to-br ${team.accentHue} to-transparent`} />
        <div className="absolute inset-0 cyber-grid opacity-10" />

        {/* Massive team icon watermark */}
        <motion.div
          style={{ scale: iconScale, opacity: iconOpacity }}
          className="absolute right-[-5%] top-[15%] text-[#e3b53d] pointer-events-none"
        >
          <div className="w-[30vw] h-[30vw] max-w-[500px] max-h-[500px] [&>svg]:w-full [&>svg]:h-full">
            {team.icon}
          </div>
        </motion.div>

        {/* Hero content — pinned to bottom for editorial feel */}
        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-40"
        >
          {/* Back navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link
              href="/#teams"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#e3b53d] transition-colors font-secondary uppercase tracking-[0.15em] cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              All Teams
            </Link>
          </motion.div>

          {/* Team name — oversized editorial treatment */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-6"
          >
            <h1 className="text-[clamp(3rem,10vw,8rem)] font-black text-white leading-[0.9] tracking-tight">
              {team.name}
            </h1>
          </motion.div>

          {/* Tagline + description — asymmetric two-column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-col lg:flex-row gap-6 lg:gap-16 items-start"
          >
            <p className="text-[#e3b53d] text-xl sm:text-2xl font-secondary font-medium leading-tight lg:w-1/3 shrink-0">
              {team.tagline}
            </p>
            <p className="text-gray-400 text-lg leading-relaxed lg:max-w-xl">
              {team.description}
            </p>
          </motion.div>

          {/* Divider line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-12 h-px bg-gradient-to-r from-[#e3b53d]/60 via-[#e3b53d]/20 to-transparent origin-left"
          />
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════
          WHAT WE DO — Staggered responsibility grid
         ═══════════════════════════════════════════ */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14"
          >
            <span className="text-[#e3b53d] text-sm font-secondary uppercase tracking-[0.2em] block mb-3">
              Responsibilities
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-white">
              What We Do
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {team.responsibilities.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
                className="group relative p-6 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-[#e3b53d]/30 hover:bg-white/[0.06] transition-all duration-300 cursor-default"
              >
                <span className="text-[#e3b53d]/40 text-5xl font-black font-data absolute top-4 right-5 group-hover:text-[#e3b53d]/20 transition-colors select-none">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="text-gray-300 font-secondary text-base leading-relaxed relative z-10 pr-8 mt-6">
                  {item}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SKILLS & TOOLS — Side-by-side compact layout
         ═══════════════════════════════════════════ */}
      <section className="py-20 border-y border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Skills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-8">
                <GraduationCap className="w-5 h-5 text-[#e3b53d]" />
                <span className="text-sm font-secondary uppercase tracking-[0.2em] text-[#e3b53d]">
                  Skills You&apos;ll Learn
                </span>
              </div>
              <div className="space-y-3">
                {team.skills.map((skill, i) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-4 group"
                  >
                    <span className="w-8 h-px bg-[#e3b53d]/40 group-hover:w-12 group-hover:bg-[#e3b53d] transition-all duration-300" />
                    <span className="text-white text-lg font-secondary font-medium group-hover:text-[#e3b53d] transition-colors">
                      {skill}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Tools */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
            >
              <div className="flex items-center gap-3 mb-8">
                <Wrench className="w-5 h-5 text-[#e3b53d]" />
                <span className="text-sm font-secondary uppercase tracking-[0.2em] text-[#e3b53d]">
                  Tools We Use
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                {team.tools.map((tool, i) => (
                  <motion.span
                    key={tool}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="px-5 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-gray-300 text-base font-secondary font-medium hover:border-[#e3b53d]/30 hover:text-white transition-all duration-300"
                  >
                    {tool}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          TEAM — Leads featured, members in clean grid
         ═══════════════════════════════════════════ */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14"
          >
            <span className="text-[#e3b53d] text-sm font-secondary uppercase tracking-[0.2em] block mb-3">
              The People
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-white">
              Our Team
            </h2>
          </motion.div>

          {/* Leads — Featured cards */}
          <div className="grid md:grid-cols-2 gap-5 mb-12">
            {team.leads.map((lead, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.12 }}
                className="relative p-7 rounded-2xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/[0.08] hover:border-[#e3b53d]/30 transition-all duration-300 group overflow-hidden"
              >
                {/* Subtle gold accent line */}
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-[#e3b53d]/50 via-[#e3b53d]/10 to-transparent" />

                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-full bg-[#e3b53d]/10 border border-[#e3b53d]/20 flex items-center justify-center shrink-0 group-hover:bg-[#e3b53d]/15 transition-colors">
                    <User className="w-6 h-6 text-[#e3b53d]" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-white leading-tight">{lead.name}</h3>
                        <p className="text-[#e3b53d] text-sm font-secondary font-semibold mt-1 uppercase tracking-wider">
                          {lead.role}
                        </p>
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        <button className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-gray-500 hover:text-[#e3b53d] hover:border-[#e3b53d]/30 transition-all cursor-pointer">
                          <Mail className="w-3.5 h-3.5" />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-gray-500 hover:text-[#e3b53d] hover:border-[#e3b53d]/30 transition-all cursor-pointer">
                          <Linkedin className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-500 text-sm mt-2.5 font-secondary">
                      {lead.major} &middot; {lead.year}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Members — Clean minimal grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {team.members.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
                className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.12] hover:bg-white/[0.04] transition-all duration-300 group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-white/[0.06] flex items-center justify-center group-hover:bg-[#e3b53d]/10 transition-colors">
                    <User className="w-4 h-4 text-gray-500 group-hover:text-[#e3b53d] transition-colors" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-white text-sm leading-tight truncate">{member.name}</h4>
                    <p className="text-[#e3b53d]/70 text-xs font-secondary">{member.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 text-xs font-secondary">
                  {member.major} &middot; {member.year}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          JOIN CTA — Bold, simple
         ═══════════════════════════════════════════ */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#e3b53d]/[0.04] via-transparent to-transparent" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[0.95] mb-6">
              Join{" "}
              <span className="text-[#e3b53d]">{team.name}</span>
            </h2>
            <p className="text-gray-500 text-lg sm:text-xl max-w-lg mx-auto mb-10 font-secondary">
              Ready to contribute to one of the most exciting engineering projects on campus?
            </p>
            <Link
              href="https://linktr.ee/scformulae24?fbclid=PAZXh0bgNhZW0CMTEAAaZL2QuvE6aLgnkuHAJWX5ACZBdP9GljMqVHRwkn4ii-aqm5UlbukIsNEtA_aem_gxNdBUzqxvWkYFSW-nVahQ"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-4 bg-[#e3b53d] rounded-full text-black font-bold text-lg leading-none hover:bg-[#d4a832] hover:shadow-[0_0_40px_rgba(227,181,61,0.25)] transition-all duration-300 neon-button cursor-pointer"
            >
              Join Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          TEAM NAVIGATION — Previous / Next
         ═══════════════════════════════════════════ */}
      <section className="border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto grid grid-cols-2">
          <Link
            href={`/teams/${prev}`}
            className="group flex items-center gap-4 px-6 sm:px-10 py-8 border-r border-white/[0.06] hover:bg-white/[0.02] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-[#e3b53d] transition-colors shrink-0" />
            <div className="min-w-0">
              <span className="text-xs text-gray-600 font-secondary uppercase tracking-[0.15em] block mb-1">
                Previous
              </span>
              <span className="text-white font-bold text-sm sm:text-base group-hover:text-[#e3b53d] transition-colors truncate block">
                {teamsData[prev]?.name}
              </span>
            </div>
          </Link>
          <Link
            href={`/teams/${next}`}
            className="group flex items-center justify-end gap-4 px-6 sm:px-10 py-8 hover:bg-white/[0.02] transition-colors cursor-pointer"
          >
            <div className="min-w-0 text-right">
              <span className="text-xs text-gray-600 font-secondary uppercase tracking-[0.15em] block mb-1">
                Next
              </span>
              <span className="text-white font-bold text-sm sm:text-base group-hover:text-[#e3b53d] transition-colors truncate block">
                {teamsData[next]?.name}
              </span>
            </div>
            <ArrowUpRight className="w-5 h-5 text-gray-600 group-hover:text-[#e3b53d] transition-colors shrink-0" />
          </Link>
        </div>
      </section>
    </div>
  );
}
