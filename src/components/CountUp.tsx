"use client";

import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  value: string;
  duration?: number;
  /** When true, starts the count-up animation. Allows parent to control timing (e.g. scroll-driven). */
  active?: boolean;
}

export default function CountUp({ value, duration = 2000, active }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [displayValue, setDisplayValue] = useState("0");
  const [hasAnimated, setHasAnimated] = useState(false);

  // Parse the value to extract number and suffix (e.g., "85+" -> 85, "+")
  const match = value.match(/^([\d.]+)(.*)$/);
  const targetNumber = match ? parseFloat(match[1]) : 0;
  const suffix = match ? match[2] : "";
  const hasDecimal = value.includes(".");
  const decimalPlaces = hasDecimal ? (match?.[1].split(".")[1]?.length || 0) : 0;

  useEffect(() => {
    // Only start when active becomes true, and only animate once
    if (!active || hasAnimated) return;
    setHasAnimated(true);

    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out cubic)
      const eased = 1 - Math.pow(1 - progress, 3);

      const currentValue = targetNumber * eased;

      if (hasDecimal) {
        setDisplayValue(currentValue.toFixed(decimalPlaces));
      } else {
        setDisplayValue(Math.floor(currentValue).toString());
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(hasDecimal ? targetNumber.toFixed(decimalPlaces) : targetNumber.toString());
      }
    };

    requestAnimationFrame(animate);
  }, [active, hasAnimated, targetNumber, duration, hasDecimal, decimalPlaces]);

  return (
    <span ref={ref}>
      {displayValue}{suffix}
    </span>
  );
}
