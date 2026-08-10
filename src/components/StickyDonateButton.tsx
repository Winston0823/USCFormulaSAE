"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const DONATE_URL = "https://giveto.usc.edu/Donation";

export default function StickyDonateButton() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // The fundraiser page already has a giant "Ignite Us" CTA — the pill would be redundant there.
  if (!mounted || pathname === "/fundraiser") return null;

  return (
    <a
      href={DONATE_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Donate to USC Formula Electric"
      className="fixed z-40 bottom-6 right-6 sm:bottom-8 sm:right-8 group"
      style={{
        fontFamily: "var(--font-rajdhani), sans-serif",
      }}
    >
      <span
        className="flex items-center gap-2 px-6 py-3.5 sm:px-7 sm:py-4 rounded-full text-[#e3b53d] font-bold uppercase text-sm sm:text-base border border-[#e3b53d] bg-black/40 backdrop-blur-md shadow-[0_10px_40px_-10px_rgba(227,181,61,0.4)] transition-all duration-300 group-hover:scale-[1.03] group-hover:bg-[#e3b53d]/10 group-hover:shadow-[0_0_24px_rgba(227,181,61,0.35)]"
        style={{
          letterSpacing: "0.2em",
        }}
      >
        <svg
          aria-hidden="true"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="shrink-0"
        >
          <path d="M12 21s-6.5-4.35-9-8.5C1 9 3 5 6.5 5c2 0 3.5 1.1 5.5 3.2C14 6.1 15.5 5 17.5 5 21 5 23 9 21 12.5 18.5 16.65 12 21 12 21z" />
        </svg>
        Donate
      </span>
    </a>
  );
}
