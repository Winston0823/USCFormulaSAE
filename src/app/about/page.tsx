"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Target,
  Lightbulb,
  Users,
  Trophy,
  Calendar,
  ArrowRight,
  CheckCircle,
  Zap,
} from "lucide-react";

const milestones = [
  { year: "2022", event: "Team Founded at USC" },
  { year: "2022", event: "First Car Built" },
  { year: "2024", event: "Car Unveiled at AME Awards" },
  { year: "2025", event: "FSAE Electric Competition, Brooklyn, Michigan" },
];

const values = [
  {
    icon: <Target className="w-8 h-8" />,
    title: "Excellence",
    description: "We pursue engineering excellence in every component we design and build.",
  },
  {
    icon: <Lightbulb className="w-8 h-8" />,
    title: "Innovation",
    description: "Pushing boundaries with cutting-edge solutions and creative problem-solving.",
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Collaboration",
    description: "Working together across disciplines to achieve our common goals.",
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Passion",
    description: "Driven by our love for motorsport and automotive engineering.",
  },
];

const achievements = [
  "First car built in 2022, the same year the team was founded",
  "Car unveiled at the AME Awards, a first in team history",
  "Members have interned at SpaceX, including on the Falcon propulsion team",
  "50+ members ranging from freshmen to graduate students",
  "Open to all majors, not just engineering",
  "Comprehensive hands-on training in EV design and manufacturing",
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 cyber-grid opacity-20" />

        {/* Decorative elements */}
        <div className="absolute top-1/4 left-0 w-64 h-64 bg-[#8b0000]/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-[#e3b53d]/10 rounded-full blur-[100px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-[#e3b53d]/10 text-[#e3b53d] text-sm font-medium mb-6">
              <Users className="w-4 h-4 mr-2" />
              ABOUT US
            </span>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6">
              Engineering <span className="text-[#e3b53d]">Excellence</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Founded in 2022, USC Formula Electric designs, manufactures, and races
              miniature electric F1 vehicles, training rising engineers in innovative thinking,
              leadership, and electric vehicle design.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#e3b53d]/10 text-[#e3b53d] text-sm font-medium mb-4">
                OUR MISSION
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                Building the Future of <span className="text-[#e3b53d]">Motorsport</span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-6">
                USC Formula Electric is committed to developing the next generation of innovators
                through the complete design and construction of a high-performance electric race car
                for the Formula SAE Electric competition.
              </p>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                We cultivate engineers specializing in electric vehicle design and technology through
                hands-on projects and collaboration with industry experts, fostering an environment that
                enhances technical proficiency and creative problem-solving. Members take ownership of
                every aspect of the vehicle, from welding the chassis and developing software, to sourcing
                critical components and presenting to industry judges.
              </p>

              <div className="space-y-3">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircle className="w-5 h-5 text-[#e3b53d] shrink-0" />
                    <span className="text-gray-300">{achievement}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Team photo */}
              <div className="aspect-[4/3] rounded-2xl border border-[#e3b53d]/20 overflow-hidden relative">
                <img
                  src="/team-photo.jpg"
                  alt="USC Formula SAE team"
                  className="w-full h-full object-cover"
                />
                {/* Decorative overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black to-transparent" />
              </div>

              {/* Floating stat cards */}
              <div className="absolute -bottom-6 -left-6 p-4 rounded-xl bg-[#0a0a0a]/90 border border-[#e3b53d]/20 backdrop-blur-sm">
                <div className="text-3xl font-bold text-[#e3b53d]">50+</div>
                <div className="text-sm text-gray-400">Team Members</div>
              </div>
              <div className="absolute -top-6 -right-6 p-4 rounded-xl bg-[#0a0a0a]/90 border border-[#e3b53d]/20 backdrop-blur-sm">
                <div className="text-3xl font-bold text-[#e3b53d]">2022</div>
                <div className="text-sm text-gray-400">Founded</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-gradient-to-b from-black to-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#e3b53d]/10 text-[#e3b53d] text-sm font-medium mb-4">
              OUR VALUES
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-white">
              What Drives <span className="text-[#e3b53d]">Us</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-8 rounded-2xl bg-white/5 border border-[#e3b53d]/20 hover:border-[#e3b53d]/50 transition-all duration-300"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-to-br from-[#e3b53d]/20 to-transparent border border-[#e3b53d]/30 flex items-center justify-center text-[#e3b53d]">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                <p className="text-gray-400">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 circuit-pattern opacity-20" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#e3b53d]/10 text-[#e3b53d] text-sm font-medium mb-4">
              <Calendar className="w-4 h-4 mr-2" />
              OUR JOURNEY
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-white">
              Milestones in <span className="text-[#e3b53d]">Racing</span>
            </h2>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#e3b53d] via-[#e3b53d]/50 to-[#e3b53d] hidden md:block" />

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-8 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                    <div className="p-6 rounded-xl bg-white/5 border border-[#e3b53d]/20 inline-block hover:border-[#e3b53d]/50 transition-colors">
                      <div className="text-3xl font-bold text-[#e3b53d] mb-2">{milestone.year}</div>
                      <div className="text-gray-300">{milestone.event}</div>
                    </div>
                  </div>

                  {/* Center dot */}
                  <div className="hidden md:flex w-4 h-4 rounded-full bg-[#e3b53d] border-4 border-black shrink-0 relative z-10" />

                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-[#8b0000]/10 via-transparent to-[#e3b53d]/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Ready to Join the <span className="text-[#e3b53d]">Team</span>?
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              We&apos;re always looking for passionate students to join our mission.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="https://linktr.ee/scformulae24?fbclid=PAZXh0bgNhZW0CMTEAAaZL2QuvE6aLgnkuHAJWX5ACZBdP9GljMqVHRwkn4ii-aqm5UlbukIsNEtA_aem_gxNdBUzqxvWkYFSW-nVahQ"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 bg-[#e3b53d] rounded-full text-black font-bold text-xl leading-none hover:bg-[#c4ae5a] hover:shadow-lg hover:shadow-[#e3b53d]/30 transition-all duration-300 neon-button"
              >
                Join Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-white/5 border border-[#e3b53d]/30 rounded-full text-white font-bold text-lg hover:bg-white/10 transition-all duration-300"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
