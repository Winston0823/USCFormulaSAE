import Link from "next/link";
import type { ReactNode, MouseEventHandler } from "react";

// Single source of truth for CTA styling sitewide.
// Language: accent border + dark tinted glass interior + accent text,
// uppercase Rajdhani, one tracking (0.2em), one radius (full).
type CTAButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  type?: "button" | "submit";
  className?: string;
  onClick?: MouseEventHandler<HTMLElement>;
  "aria-label"?: string;
};

const SIZES: Record<NonNullable<CTAButtonProps["size"]>, string> = {
  sm: "px-6 py-3 text-sm",
  md: "px-8 py-4 text-base",
  lg: "px-10 py-5 text-lg",
};

const VARIANTS: Record<NonNullable<CTAButtonProps["variant"]>, string> = {
  primary:
    "border border-[#e3b53d] text-[#e3b53d] bg-black/40 backdrop-blur-md hover:bg-[#e3b53d]/10 hover:shadow-[0_0_24px_rgba(227,181,61,0.35)]",
  secondary:
    "border border-white/25 text-white/90 bg-black/40 backdrop-blur-md hover:border-white/50 hover:bg-white/5",
};

export default function CTAButton({
  children,
  href,
  variant = "primary",
  size = "md",
  type = "button",
  className = "",
  onClick,
  "aria-label": ariaLabel,
}: CTAButtonProps) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-full uppercase font-bold leading-none transition-all duration-300 hover:scale-[1.03] ${VARIANTS[variant]} ${SIZES[size]} ${className}`;
  const style = {
    fontFamily: "var(--font-rajdhani), sans-serif",
    letterSpacing: "0.2em",
  };

  if (href) {
    const external = href.startsWith("http");
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={ariaLabel}
          className={classes}
          style={style}
          onClick={onClick}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} aria-label={ariaLabel} className={classes} style={style} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} aria-label={ariaLabel} className={classes} style={style} onClick={onClick}>
      {children}
    </button>
  );
}
