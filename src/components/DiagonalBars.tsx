"use client";

import { useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import styles from "./DiagonalBars.module.css";

interface Team {
  id: string;
  idx: string;
  name: string;
  slug: string;
  desc: string;
  gradient: string;
}

const teams: Team[] = [
  {
    id: "aero",
    idx: "01",
    name: "AERODYNAMICS",
    slug: "aerodynamics",
    desc: "Optimizing airflow for maximum downforce and minimal drag through CFD analysis and wind tunnel testing.",
    gradient: "linear-gradient(135deg, #1a1a2e, #16213e, #0f3460, #1a1a2e, #16213e)",
  },
  {
    id: "frame",
    idx: "02",
    name: "FRAME",
    slug: "frame",
    desc: "Designing the structural backbone with carbon fiber and steel, optimized through FEA for rigidity and safety.",
    gradient: "linear-gradient(135deg, #2d1b00, #4a2c0a, #6b3a0a, #2d1b00, #4a2c0a)",
  },
  {
    id: "drivetrain",
    idx: "03",
    name: "DRIVETRAIN",
    slug: "drivetrain",
    desc: "Engineering power transfer from motor to wheels with custom gearboxes and differential systems.",
    gradient: "linear-gradient(135deg, #0a2e0a, #1a3a1a, #0d4d0d, #0a2e0a, #1a3a1a)",
  },
  {
    id: "powertrain",
    idx: "04",
    name: "POWERTRAIN",
    slug: "powertrain",
    desc: "High-voltage battery systems, motor controllers, and thermal management for peak performance.",
    gradient: "linear-gradient(135deg, #2e1a2e, #3a1a3a, #4d0d4d, #2e1a2e, #3a1a3a)",
  },
  {
    id: "dynamics",
    idx: "05",
    name: "VEHICLE DYNAMICS",
    slug: "vehicle-dynamics",
    desc: "Suspension geometry and damper tuning optimized for autocross cornering performance.",
    gradient: "linear-gradient(135deg, #0a1e2e, #0d2a3a, #0a3a4d, #0a1e2e, #0d2a3a)",
  },
  {
    id: "ergonomics",
    idx: "06",
    name: "ERGONOMICS",
    slug: "ergonomics",
    desc: "Creating the perfect driver-machine interface with optimized cockpit design and controls.",
    gradient: "linear-gradient(135deg, #2e2e0a, #3a3a0d, #4d4d0a, #2e2e0a, #3a3a0d)",
  },
  {
    id: "systems",
    idx: "07",
    name: "SYSTEMS",
    slug: "systems",
    desc: "Embedded firmware, telemetry, and data acquisition running at 1kHz for real-time control.",
    gradient: "linear-gradient(135deg, #0a2e2e, #0d3a3a, #0a4d4d, #0a2e2e, #0d3a3a)",
  },
  {
    id: "business",
    idx: "08",
    name: "BUSINESS",
    slug: "business",
    desc: "Sponsorship, project management, and operations — the backbone keeping the team running.",
    gradient: "linear-gradient(135deg, #1e0a0a, #2e1515, #3a0d0d, #1e0a0a, #2e1515)",
  },
];

const OFFSET = 60;
const ANIM_DURATION = 600;

export default function DiagonalBars() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafIdRef = useRef<number | null>(null);
  const animStartTimeRef = useRef<number>(0);
  const isAnimatingRef = useRef<boolean>(false);

  const updateGeometry = useCallback(() => {
    if (!containerRef.current) return;

    const items = containerRef.current.querySelectorAll<HTMLAnchorElement>(`.${styles.barItem}`);
    items.forEach((item) => {
      const w = item.offsetWidth;
      const h = item.offsetHeight;
      if (w === 0 || h === 0) return;

      const tl = [OFFSET, 0];
      const tr = [w, 0];
      const br = [w - OFFSET, h];
      const bl = [0, h];

      // Clip-path for the shape
      const shape = item.querySelector<HTMLDivElement>(`.${styles.barShape}`);
      if (shape) {
        shape.style.clipPath = `polygon(${tl[0]}px ${tl[1]}px, ${tr[0]}px ${tr[1]}px, ${br[0]}px ${br[1]}px, ${bl[0]}px ${bl[1]}px)`;
      }

      // SVG border
      const svg = item.querySelector<SVGSVGElement>(`.${styles.barBorder}`);
      const polygon = svg?.querySelector("polygon");
      if (svg && polygon) {
        svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
        svg.style.width = `${w}px`;
        svg.style.height = `${h}px`;
        polygon.setAttribute(
          "points",
          `${tl[0]},${tl[1]} ${tr[0]},${tr[1]} ${br[0]},${br[1]} ${bl[0]},${bl[1]}`
        );
      }

      // Corner accents positioning
      const cTL = item.querySelector<HTMLDivElement>(`.${styles.topLeft}`);
      if (cTL) {
        cTL.style.top = "4px";
        cTL.style.left = `${OFFSET + 4}px`;
      }

      const cBR = item.querySelector<HTMLDivElement>(`.${styles.bottomRight}`);
      if (cBR) {
        cBR.style.bottom = "4px";
        cBR.style.right = `${OFFSET + 4}px`;
      }

      // Index position
      const idx = item.querySelector<HTMLSpanElement>(`.${styles.barIndex}`);
      if (idx) {
        idx.style.top = "14px";
        idx.style.left = `${OFFSET + 14}px`;
      }
    });
  }, []);

  const animationLoop = useCallback(
    (timestamp: number) => {
      updateGeometry();

      if (timestamp - animStartTimeRef.current < ANIM_DURATION) {
        rafIdRef.current = requestAnimationFrame(animationLoop);
      } else {
        isAnimatingRef.current = false;
        rafIdRef.current = null;
        updateGeometry();
      }
    },
    [updateGeometry]
  );

  const startGeometryAnimation = useCallback(() => {
    animStartTimeRef.current = performance.now();
    if (!isAnimatingRef.current) {
      isAnimatingRef.current = true;
      rafIdRef.current = requestAnimationFrame(animationLoop);
    }
  }, [animationLoop]);

  useEffect(() => {
    // Initial geometry calculation
    updateGeometry();

    // Small delay to ensure layout is complete
    const timer = setTimeout(updateGeometry, 100);

    window.addEventListener("resize", updateGeometry);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateGeometry);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [updateGeometry]);

  return (
    <div
      ref={containerRef}
      className={styles.barsContainer}
      onMouseEnter={startGeometryAnimation}
      onMouseLeave={startGeometryAnimation}
    >
      {teams.map((team) => (
        <Link
          key={team.id}
          href={`/teams/${team.slug}`}
          className={styles.barItem}
          data-team={team.id}
          onMouseEnter={startGeometryAnimation}
        >
          {/* Clipped background shape */}
          <div className={styles.barShape}>
            <div className={styles.barVideo}>
              <div
                className={styles.videoPlaceholder}
                style={{ background: team.gradient, backgroundSize: "300% 300%" }}
              />
              <div className={styles.barVideoOverlay} />
            </div>
          </div>

          {/* SVG border */}
          <svg
            className={styles.barBorder}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <polygon points="" />
          </svg>

          {/* Corner accents */}
          <div className={`${styles.cornerAccent} ${styles.topLeft}`} />
          <div className={`${styles.cornerAccent} ${styles.bottomRight}`} />

          {/* Index number */}
          <span className={styles.barIndex}>{team.idx}</span>

          {/* Label */}
          <span className={styles.barLabel}>{team.name}</span>

          {/* Description */}
          <p className={styles.barDescription}>{team.desc}</p>
        </Link>
      ))}
    </div>
  );
}
