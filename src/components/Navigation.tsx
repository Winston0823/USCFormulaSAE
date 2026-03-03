"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";

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
  { name: "About", href: "/about" },
  {
    name: "Teams",
    href: "/teams",
    hasDropdown: true,
    dropdownItems: teams.map(t => ({ name: t.name, href: `/teams/${t.slug}` }))
  },
  { name: "Sponsors", href: "/sponsorship" },
  { name: "Contact", href: "/contact" },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNavDropdownOpen, setIsNavDropdownOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-black/95 backdrop-blur-md border-b border-[#e3b53d]/20"
          : "bg-transparent"
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

          {/* Menu button - center */}
          <div className="hidden lg:flex justify-center">
            <div
              className="relative"
              onMouseEnter={() => setIsNavDropdownOpen(true)}
              onMouseLeave={() => {
                setIsNavDropdownOpen(false);
                setActiveDropdown(null);
              }}
            >
              <button className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white transition-colors" style={{ fontFamily: "var(--font-rajdhani)", fontWeight: 600, letterSpacing: "0.05em", fontSize: "1.15rem" }}>
                <span>Menu</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isNavDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isNavDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 w-56 py-2 bg-black/95 backdrop-blur-md rounded-lg border border-[#e3b53d]/20 shadow-xl"
                  >
                    {navItems.map((item) => (
                      <div key={item.name} className="relative">
                        {item.hasDropdown ? (
                          <div
                            onMouseEnter={() => setActiveDropdown(item.name)}
                            onMouseLeave={() => setActiveDropdown(null)}
                          >
                            <button className="w-full flex items-center justify-between px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                              <span>{item.name}</span>
                              <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === item.name ? '-rotate-90' : ''}`} />
                            </button>

                            <AnimatePresence>
                              {activeDropdown === item.name && (
                                <motion.div
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: -10 }}
                                  className="absolute left-full top-0 w-48 py-2 bg-black/95 backdrop-blur-md rounded-lg border border-[#e3b53d]/20 shadow-xl ml-1"
                                >
                                  <Link
                                    href={item.href}
                                    className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                                  >
                                    All Teams
                                  </Link>
                                  <div className="border-t border-[#e3b53d]/10 my-1" />
                                  {item.dropdownItems?.map((subItem) => (
                                    <Link
                                      key={subItem.href}
                                      href={subItem.href}
                                      className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                                    >
                                      {subItem.name}
                                    </Link>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ) : (
                          <Link
                            href={item.href}
                            className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                          >
                            {item.name}
                          </Link>
                        )}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Join Us button - right */}
          <div className="flex-1 flex justify-end">
            <Link
              href="https://linktr.ee/scformulae24?fbclid=PAZXh0bgNhZW0CMTEAAaZL2QuvE6aLgnkuHAJWX5ACZBdP9GljMqVHRwkn4ii-aqm5UlbukIsNEtA_aem_gxNdBUzqxvWkYFSW-nVahQ"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center justify-center px-7 py-3 bg-[#e3b53d] rounded-full text-black font-bold text-lg leading-none hover:bg-[#c4ae5a] hover:shadow-lg hover:shadow-[#e3b53d]/25 transition-all duration-300 neon-button"
            >
              Join Us
            </Link>

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
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-lg text-gray-300 hover:text-white transition-colors py-2 border-b border-[#e3b53d]/10"
                  >
                    {item.name}
                  </Link>
                </div>
              ))}
              <Link
                href="https://linktr.ee/scformulae24?fbclid=PAZXh0bgNhZW0CMTEAAaZL2QuvE6aLgnkuHAJWX5ACZBdP9GljMqVHRwkn4ii-aqm5UlbukIsNEtA_aem_gxNdBUzqxvWkYFSW-nVahQ"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center px-6 py-3 bg-[#e3b53d] rounded-full text-black font-semibold text-lg leading-none"
              >
                Join Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
