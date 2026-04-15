"use client";

import Link from "next/link";
import Image from "next/image";
import { Instagram, Linkedin, Mail, MapPin, ExternalLink } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-black border-t border-[#e3b53d]/20">
      {/* Gradient line at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#e3b53d] to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Image
                src="/icons/icon_negative.svg"
                alt="USC Formula Electric"
                width={40}
                height={38}
                className="object-contain"
              />
              <div>
                <span className="text-white font-bold tracking-wider">USC Formula Electric</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Engineering excellence through motorsport innovation. Building the future of racing, one component at a time.
            </p>
            <div className="flex space-x-4">
              <SocialLink href="https://www.instagram.com/uscformulaelectric/" icon={<Instagram className="w-5 h-5" />} label="Instagram" />
              <SocialLink href="https://www.linkedin.com/company/usc-electric-racing" icon={<Linkedin className="w-5 h-5" />} label="LinkedIn" />
              <SocialLink href="mailto:formulae@usc.edu" icon={<Mail className="w-5 h-5" />} label="Email" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Quick Links</h3>
            <ul className="space-y-3">
              <FooterLink href="/">Home</FooterLink>
              <FooterLink href="/about">About Us</FooterLink>
              <FooterLink href="/#teams">Our Teams</FooterLink>
              <FooterLink href="/sponsorship">Sponsorship</FooterLink>
              <FooterLink href="/contact">Contact</FooterLink>
            </ul>
          </div>

          {/* Teams */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Teams</h3>
            <ul className="space-y-3">
              <FooterLink href="/teams/aerodynamics">Aerodynamics</FooterLink>
              <FooterLink href="/teams/frame">Frame</FooterLink>
              <FooterLink href="/teams/drivetrain">Drivetrain</FooterLink>
              <FooterLink href="/teams/powertrain">Powertrain</FooterLink>
              <FooterLink href="/teams/vehicle-dynamics">Vehicle Dynamics</FooterLink>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-gray-400 text-sm">
                <MapPin className="w-5 h-5 text-[#e3b53d] shrink-0 mt-0.5" />
                <span>University of Southern California<br />620 USC McCarthy Way<br />Los Angeles, CA 90089</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400 text-sm">
                <Mail className="w-5 h-5 text-[#e3b53d]" />
                <a href="mailto:formulae@usc.edu" className="hover:text-white transition-colors">formulae@usc.edu</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#e3b53d]/20 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} USC Formula Electric. All rights reserved.
          </p>
          <Link
            href="https://linktr.ee/scformulae24?fbclid=PAZXh0bgNhZW0CMTEAAaZL2QuvE6aLgnkuHAJWX5ACZBdP9GljMqVHRwkn4ii-aqm5UlbukIsNEtA_aem_gxNdBUzqxvWkYFSW-nVahQ"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-[#e3b53d] hover:text-[#c4ae5a] transition-colors text-sm font-medium"
          >
            <span>Join Our Team</span>
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-[#e3b53d]/5 to-transparent pointer-events-none" />
    </footer>
  );
}

function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:bg-[#e3b53d] hover:text-black transition-all duration-300"
    >
      {icon}
    </a>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="text-gray-400 hover:text-white transition-colors text-sm"
      >
        {children}
      </Link>
    </li>
  );
}
