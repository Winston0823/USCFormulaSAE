"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
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
  ArrowLeft,
  Users,
  Mail,
  Linkedin,
  Image as ImageIcon,
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
  bgIcon: React.ReactNode;
  tagline: string;
  description: string;
  responsibilities: string[];
  leads: TeamMember[];
  members: TeamMember[];
  skills: string[];
  tools: string[];
}

const teamsData: Record<string, TeamData> = {
  aerodynamics: {
    name: "Aerodynamics",
    icon: <Wind className="w-12 h-12" />,
    bgIcon: <Wind className="w-64 h-64" />,
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
    icon: <Box className="w-12 h-12" />,
    bgIcon: <Box className="w-64 h-64" />,
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
    icon: <Cog className="w-12 h-12" />,
    bgIcon: <Cog className="w-64 h-64" />,
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
    icon: <Zap className="w-12 h-12" />,
    bgIcon: <Zap className="w-64 h-64" />,
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
    icon: <Gauge className="w-12 h-12" />,
    bgIcon: <Gauge className="w-64 h-64" />,
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
    icon: <User className="w-12 h-12" />,
    bgIcon: <User className="w-64 h-64" />,
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
    icon: <Cpu className="w-12 h-12" />,
    bgIcon: <Cpu className="w-64 h-64" />,
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
    icon: <Briefcase className="w-12 h-12" />,
    bgIcon: <Briefcase className="w-64 h-64" />,
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

export default function TeamPage() {
  const params = useParams();
  const slug = params.slug as string;
  const team = teamsData[slug];

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
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

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 cyber-grid opacity-20" />

        {/* Large background icon */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[#e3b53d]/5">
          {team.bgIcon}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link
              href="/#teams"
              className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to All Teams
            </Link>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-12 items-start">
            {/* Team Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1"
            >
              <h1 className="text-5xl sm:text-6xl font-black text-white mb-4">{team.name}</h1>
              <p className="text-xl mb-6 text-[#e3b53d]">
                {team.tagline}
              </p>
              <p className="text-lg text-gray-400 leading-relaxed">{team.description}</p>
            </motion.div>

            {/* Team Image Placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:w-[400px]"
            >
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-[#0a0a0a] to-black border border-[#e3b53d]/20 overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#e3b53d]/20 flex items-center justify-center">
                      <ImageIcon className="w-10 h-10 text-[#e3b53d]" />
                    </div>
                    <p className="text-gray-500 text-sm">Team Photo Placeholder</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Responsibilities & Skills */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Responsibilities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-white mb-6">What We Do</h2>
              <div className="space-y-4">
                {team.responsibilities.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-[#e3b53d]/20"
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm font-bold bg-[#e3b53d]/20 text-[#e3b53d]">
                      {index + 1}
                    </div>
                    <span className="text-gray-300 font-secondary text-base">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Skills & Tools */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-white mb-6">Skills You&apos;ll Learn</h2>
              <div className="flex flex-wrap gap-3 mb-8 justify-center">
                {team.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-2 rounded-full text-base font-semibold font-secondary bg-[#e3b53d]/15 text-[#e3b53d] border border-[#e3b53d]/30"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <h2 className="text-3xl font-bold text-white mb-6">Tools We Use</h2>
              <div className="flex flex-wrap gap-3 justify-center">
                {team.tools.map((tool) => (
                  <span
                    key={tool}
                    className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-300 text-base font-semibold font-secondary"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Members */}
      <section className="py-20 bg-gradient-to-b from-transparent to-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Leads */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-8">
              <Users className="w-6 h-6 text-[#e3b53d]" />
              <h2 className="text-3xl font-bold text-white">Team Leads</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {team.leads.map((lead, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 rounded-2xl bg-white/5 border border-[#e3b53d]/20 hover:border-[#e3b53d]/40 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar placeholder */}
                    <div className="w-16 h-16 rounded-full bg-[#e3b53d]/20 flex items-center justify-center shrink-0">
                      <User className="w-8 h-8 text-[#e3b53d]" />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-1">{lead.name}</h3>
                      <p className="text-[#e3b53d] text-sm font-medium mb-2">
                        {lead.role}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {lead.major} &bull; {lead.year}
                      </p>
                    </div>

                    {/* Social links placeholder */}
                    <div className="flex gap-2">
                      <button className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                        <Mail className="w-4 h-4" />
                      </button>
                      <button className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                        <Linkedin className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Members */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-8">Team Members</h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {team.members.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 rounded-xl bg-white/5 border border-[#e3b53d]/20 hover:border-[#e3b53d]/40 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-[#e3b53d]/15 flex items-center justify-center">
                      <User className="w-5 h-5 text-[#e3b53d]" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{member.name}</h4>
                      <p className="text-xs text-gray-500">{member.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm">
                    {member.major} &bull; {member.year}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
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
              Join the <span className="text-[#e3b53d]">{team.name}</span> Team
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Ready to contribute to one of the most exciting engineering projects on campus?
              We&apos;d love to have you on the team.
            </p>
            <Link
              href="https://linktr.ee/scformulae24?fbclid=PAZXh0bgNhZW0CMTEAAaZL2QuvE6aLgnkuHAJWX5ACZBdP9GljMqVHRwkn4ii-aqm5UlbukIsNEtA_aem_gxNdBUzqxvWkYFSW-nVahQ"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-10 py-5 bg-[#e3b53d] rounded-full text-black font-bold text-xl leading-none hover:bg-[#c4ae5a] hover:shadow-2xl hover:shadow-[#e3b53d]/30 transition-all duration-300 neon-button"
            >
              Join Now
              <ArrowRight className="w-6 h-6 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
