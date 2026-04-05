import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";

// ── Holographic palette (matching wireframe race car) ──
const GOLD = "#e3b53d";
const GOLD_HOT = "#f5d066";
const GOLD_WHITE = "#ffe566";
const AMBER = "#d49430";
const ORANGE = "#a05818";
const CYAN = "#4de8e8";
const VIOLET = "#8b3de3";
const BLUE_TINT = "#3d5ce3";

const loopSin = (
  frame: number,
  total: number,
  freq: number,
  phase: number
): number => Math.sin((frame / total) * Math.PI * 2 * freq + phase);

interface FireAnimationProps {
  isHovered?: boolean;
}

export const FireAnimation: React.FC<FireAnimationProps> = ({
  isHovered = false,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames: N } = useVideoConfig();

  // ── Y-dependent wobble: base stable, tips chaotic ──
  const w = (baseAmp: number, freq: number, phase: number, y: number = 50) => {
    const hf = interpolate(y, [6, 106], [2.5, 0.2], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return baseAmp * hf * loopSin(frame, N, freq, phase);
  };

  // ── Lean / sway (non-harmonic for organic feel) ──
  const lean = 3 * loopSin(frame, N, 1, 0) + 2 * loopSin(frame, N, 3, 2.1);

  // ── Asymmetric breathing (slow inhale, fast exhale) ──
  const breatheRaw = loopSin(frame, N, 2, 0);
  const breathe =
    1 + 0.015 * Math.sign(breatheRaw) * Math.pow(Math.abs(breatheRaw), 0.7);

  // ── Global opacity pulse ──
  const globalOp = 0.92 + 0.08 * loopSin(frame, N, 1, 0.5);

  // ── Tip flicker (y-scaled) ──
  const tipCenter = w(1.5, 3, 0.7, 6);
  const tipLeft = w(1.0, 3, 4.1, 28);
  const tipRight = w(1.2, 2, 2.8, 18);

  // ── Glitch system (faster on hover) ──
  const glitchInterval = isHovered ? 20 : 45;
  const glitchActive = frame % glitchInterval < 3;
  const glitchJitterX = glitchActive ? Math.sin(frame * 37) * 2 : 0;
  const glitchBrightSpike = glitchActive && frame % glitchInterval === 0;

  // ── Glow pulses ──
  const outerGlowOp = 0.22 + 0.12 * loopSin(frame, N, 2, 0);
  const midGlowOp = 0.28 + 0.1 * loopSin(frame, N, 2, 0.5);
  const innerGlowOp = glitchBrightSpike ? 0.85 : 0.58;

  // ── Hue cycling on inner glow (±7 degrees) ──
  const hueShift = 7 * loopSin(frame, N, 1, 1.5);

  // ── Chromatic aberration (amplified during glitch) ──
  const aberrScale = glitchActive ? 2.5 : 1;
  const aberrX1 = 2.5 * aberrScale + w(0.5, 3, 8.8, 50);
  const aberrY1 = -1.5 * aberrScale;
  const aberrX2 = -2 * aberrScale + w(0.4, 2, 6.1, 50);
  const aberrY2 = 1 * aberrScale;

  // ── Scan sweep ──
  const sweepY = interpolate(frame, [0, N - 1], [116, -16]);

  // ── Interior fill opacity ──
  const fillOp = interpolate(loopSin(frame, N, 2, 1.0), [-1, 1], [0.03, 0.08]);

  // ═══════════════════════════════════════════════
  //  FLAME PATHS — 3 tips, concave pinch, asymmetric
  //  ViewBox 0 0 128 128
  //  Base ≈ y104, center tip ≈ y6
  // ═══════════════════════════════════════════════

  const outer = [
    `M ${34 + w(0.5, 1, 0, 104)} ${104 + w(0.1, 2, 1, 104)}`,
    // Left side — swell outward
    `C ${20 + w(0.6, 1, 2, 92)} ${92 + w(0.2, 2, 3, 92)},
       ${14 + w(0.8, 1, 4, 76)} ${76 + w(0.3, 2, 5, 76)},
       ${16 + w(0.7, 2, 6, 64)} ${64 + w(0.4, 1, 7, 64)}`,
    // Up toward left tip
    `C ${18 + w(0.6, 1, 8, 50)} ${50 + w(0.5, 2, 9, 50)},
       ${24 + w(0.5, 2, 10, 38)} ${38 + w(0.6, 1, 11, 38)},
       ${28 + w(0.4, 1, 12, 28)} ${28 + tipLeft}`,
    // Left tip → valley → pinch
    `C ${32 + w(0.5, 2, 13, 36)} ${36 + w(0.5, 1, 14, 36)},
       ${38 + w(0.5, 1, 15, 48)} ${48 + w(0.4, 2, 16, 48)},
       ${42 + w(0.4, 2, 17, 44)} ${44 + w(0.4, 1, 18, 44)}`,
    // Neck → center tip (tallest, slight right lean)
    `C ${48 + w(0.4, 1, 19, 32)} ${32 + w(0.6, 2, 20, 32)},
       ${56 + w(0.3, 2, 21, 16)} ${16 + w(0.7, 1, 22, 16)},
       ${63 + w(0.2, 1, 23, 6)} ${6 + tipCenter}`,
    // Descend → neck right side
    `C ${68 + w(0.3, 2, 24, 14)} ${14 + w(0.7, 1, 25, 14)},
       ${76 + w(0.4, 1, 26, 30)} ${30 + w(0.6, 2, 27, 30)},
       ${84 + w(0.4, 2, 28, 40)} ${40 + w(0.4, 1, 29, 40)}`,
    // Valley → right tip (taller than left)
    `C ${88 + w(0.5, 1, 30, 34)} ${34 + w(0.5, 2, 31, 34)},
       ${94 + w(0.4, 2, 32, 24)} ${24 + w(0.6, 1, 33, 24)},
       ${96 + w(0.3, 1, 34, 18)} ${18 + tipRight}`,
    // Descend right side
    `C ${100 + w(0.5, 2, 35, 30)} ${30 + w(0.5, 1, 36, 30)},
       ${106 + w(0.6, 1, 37, 48)} ${48 + w(0.4, 2, 38, 48)},
       ${110 + w(0.7, 2, 39, 66)} ${66 + w(0.3, 1, 40, 66)}`,
    // Right swell → base
    `C ${112 + w(0.8, 1, 41, 80)} ${80 + w(0.2, 2, 42, 80)},
       ${106 + w(0.7, 2, 43, 94)} ${94 + w(0.15, 1, 44, 94)},
       ${94 + w(0.5, 1, 45, 104)} ${104 + w(0.1, 2, 46, 104)}`,
    `Z`,
  ].join("\n");

  // ── Center tongue (rises to near center tip) ──
  const tongueCenter = [
    `M ${58 + w(0.4, 2, 100, 90)} ${90 + w(0.1, 1, 101, 90)}`,
    `C ${54 + w(0.5, 1, 102, 68)} ${68 + w(0.3, 2, 103, 68)},
       ${50 + w(0.5, 2, 104, 46)} ${46 + w(0.5, 1, 105, 46)},
       ${56 + w(0.4, 1, 106, 26)} ${26 + w(0.7, 2, 107, 26)}`,
    `C ${58 + w(0.3, 2, 108, 16)} ${16 + w(0.6, 1, 109, 16)},
       ${61 + w(0.2, 1, 110, 10)} ${10 + w(0.5, 2, 111, 10)},
       ${63 + w(0.2, 2, 112, 8)} ${8 + tipCenter * 0.7}`,
  ].join("\n");

  // ── Offset tongue (right of center, shorter, toward right tip) ──
  const tongueOffset = [
    `M ${72 + w(0.4, 1, 120, 88)} ${88 + w(0.1, 2, 121, 88)}`,
    `C ${78 + w(0.5, 2, 122, 66)} ${66 + w(0.3, 1, 123, 66)},
       ${82 + w(0.5, 1, 124, 46)} ${46 + w(0.5, 2, 125, 46)},
       ${80 + w(0.4, 2, 126, 30)} ${30 + w(0.7, 1, 127, 30)}`,
    `C ${79 + w(0.3, 1, 128, 24)} ${24 + w(0.6, 2, 129, 24)},
       ${82 + w(0.2, 2, 130, 20)} ${20 + w(0.5, 1, 131, 20)},
       ${84 + w(0.2, 1, 132, 18)} ${18 + tipRight * 0.5}`,
  ].join("\n");

  // ── Bowl / base ──
  const bowl = [
    `M ${28 + w(0.4, 1, 140, 106)} ${106 + w(0.05, 2, 141, 106)}`,
    `C ${40 + w(0.3, 2, 142, 114)} ${114 + w(0.03, 1, 143, 114)},
       ${86 + w(0.3, 1, 144, 114)} ${114 + w(0.03, 2, 145, 114)},
       ${100 + w(0.4, 2, 146, 106)} ${106 + w(0.05, 1, 147, 106)}`,
  ].join("\n");

  // ── Tongue opacity lifecycle (wide range, occasional dropout) ──
  const centerTongueOp = interpolate(
    loopSin(frame, N, 3, 1.2),
    [-1, 1],
    [0.15, 1]
  );
  const offsetTongueOp = interpolate(
    loopSin(frame, N, 2, 3.8),
    [-1, 1],
    [0.0, 0.9]
  );
  const outerOp = interpolate(loopSin(frame, N, 3, 0), [-1, 1], [0.85, 1]);

  // Glitch drops one tongue
  const glitchDropIdx = glitchActive ? (frame % 2) : -1;
  const finalCenterOp = glitchDropIdx === 0 ? 0.1 : centerTongueOp;
  const finalOffsetOp = glitchDropIdx === 1 ? 0.1 : offsetTongueOp;

  // ── Tip positions for hotspot dots ──
  const tips = [
    { x: 28 + w(0.4, 1, 12, 28), y: 28 + tipLeft, op: 0.4 },
    { x: 63 + w(0.2, 1, 23, 6), y: 6 + tipCenter, op: 0.6 },
    { x: 96 + w(0.3, 1, 34, 18), y: 18 + tipRight, op: 0.5 },
  ];

  // ── Sparks ──
  const sparks = Array.from({ length: 4 }, (_, i) => {
    const progress = ((frame / N + i / 4) % 1);
    const baseX = 46 + i * 14;
    const x = baseX + w(5, 2, i * 13, 16);
    const y = interpolate(progress, [0, 1], [14, -8]);
    const opacity = interpolate(progress, [0, 0.08, 0.5, 1], [0, 0.6, 0.15, 0]);
    const r = interpolate(progress, [0, 0.2, 1], [1.0, 2.5, 0.5]);
    const color = i % 2 === 0 ? GOLD_HOT : GOLD_WHITE;
    return { x, y, opacity, r, color };
  });

  // All paths for glow rendering
  const allPaths = [outer, tongueCenter, tongueOffset, bowl];

  return (
    <AbsoluteFill style={{ backgroundColor: "transparent" }}>
      <svg
        width="128"
        height="128"
        viewBox="0 0 128 128"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          transform: `scale(${breathe}) rotate(${lean}deg) translateX(${glitchJitterX}px)`,
          transformOrigin: "64px 106px",
          opacity: globalOp,
        }}
      >
        <defs>
          {/* Glow filters (reduced region sizes for perf) */}
          <filter id="hf-bo" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feColorMatrix in="b" type="saturate" values="1.5" />
          </filter>
          <filter id="hf-bm" x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feColorMatrix in="b" type="saturate" values="1.4" />
          </filter>
          <filter id="hf-bi" x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur stdDeviation="2.5" result="b" />
            <feColorMatrix in="b" type="hueRotate" values={String(hueShift)} />
          </filter>
          <filter id="hf-cb" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.2" />
          </filter>

          {/* Clip for scan sweep */}
          <clipPath id="hf-fc">
            <path d={outer} />
          </clipPath>

          {/* Gradients */}
          <linearGradient id="hf-swg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={GOLD_HOT} stopOpacity="0" />
            <stop offset="35%" stopColor={GOLD_HOT} stopOpacity="0.4" />
            <stop offset="50%" stopColor={GOLD_WHITE} stopOpacity="0.7" />
            <stop offset="65%" stopColor={GOLD_HOT} stopOpacity="0.4" />
            <stop offset="100%" stopColor={GOLD_HOT} stopOpacity="0" />
          </linearGradient>
          <linearGradient id="hf-fg" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0.10" />
            <stop offset="100%" stopColor={ORANGE} stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* ═══ L1: Cool outermost ring (chromatic dispersion) ═══ */}
        <g filter="url(#hf-bo)" style={{ mixBlendMode: "screen" }} opacity={outerGlowOp * 0.35}>
          <path d={outer} stroke={BLUE_TINT} strokeWidth="12" strokeLinecap="round" fill="none" />
        </g>

        {/* ═══ L2: Outer bloom (deep orange, heavy blur) ═══ */}
        <g filter="url(#hf-bo)" style={{ mixBlendMode: "screen" }} opacity={outerGlowOp}>
          {allPaths.map((d, i) => (
            <path key={`bo-${i}`} d={d} stroke={ORANGE} strokeWidth={i === 0 ? 10 : 7} strokeLinecap="round" fill="none" />
          ))}
        </g>

        {/* ═══ L3: Mid bloom (amber, new intermediate layer) ═══ */}
        <g filter="url(#hf-bm)" style={{ mixBlendMode: "screen" }} opacity={midGlowOp}>
          {allPaths.map((d, i) => (
            <path key={`bm-${i}`} d={d} stroke={AMBER} strokeWidth={i === 0 ? 6 : 4.5} strokeLinecap="round" fill="none" />
          ))}
        </g>

        {/* ═══ L4: Inner glow with hue rotation ═══ */}
        <g filter="url(#hf-bi)" opacity={innerGlowOp}>
          {allPaths.map((d, i) => (
            <path key={`bi-${i}`} d={d} stroke={GOLD} strokeWidth={i === 0 ? 4 : 3} strokeLinecap="round" fill="none" />
          ))}
        </g>

        {/* ═══ L5: Interior fill gradient ═══ */}
        <path d={outer} fill="url(#hf-fg)" stroke="none" opacity={fillOp} />

        {/* ═══ L6: Chromatic aberration — cyan + violet ghosts ═══ */}
        <g filter="url(#hf-cb)" opacity={0.14}>
          <g transform={`translate(${aberrX1}, ${aberrY1})`}>
            <path d={outer} stroke={CYAN} strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </g>
        </g>
        <g filter="url(#hf-cb)" opacity={0.09}>
          <g transform={`translate(${aberrX2}, ${aberrY2})`}>
            <path d={outer} stroke={VIOLET} strokeWidth="2" strokeLinecap="round" fill="none" />
          </g>
        </g>

        {/* ═══ L7: Scan sweep (clipped to flame shape) ═══ */}
        <rect
          x="0" y={sweepY} width="128" height="16"
          fill="url(#hf-swg)"
          clipPath="url(#hf-fc)"
          opacity={0.25}
        />

        {/* ═══ L8: Core wireframe — bowl ═══ */}
        <path d={bowl} stroke={GOLD} strokeWidth="3.5"
          strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={0.9} />

        {/* ═══ L9: Core wireframe — outer silhouette ═══ */}
        <path d={outer} stroke={GOLD} strokeWidth="3.5"
          strokeLinecap="round" fill="none" opacity={outerOp} />

        {/* ═══ L10: Core wireframe — tongues ═══ */}
        <path d={tongueCenter} stroke={GOLD_HOT} strokeWidth="2.8"
          strokeLinecap="round" fill="none" opacity={finalCenterOp} />
        <path d={tongueOffset} stroke={GOLD} strokeWidth="2.5"
          strokeLinecap="round" fill="none" opacity={finalOffsetOp} />

        {/* ═══ L11: Hot highlight — center tongue bright core ═══ */}
        <path d={tongueCenter} stroke={GOLD_WHITE} strokeWidth="1.2"
          strokeLinecap="round" fill="none" opacity={0.65 * finalCenterOp} />

        {/* ═══ L12: Tip hotspot dots (larger, no filter) ═══ */}
        {tips.map((t, i) => (
          <circle key={`tip-${i}`} cx={t.x} cy={t.y} r="3.5"
            fill={GOLD_WHITE} opacity={t.op} />
        ))}

        {/* ═══ L13: Sparks (larger, no filter) ═══ */}
        {sparks.map((s, i) => (
          <circle key={`sp-${i}`} cx={s.x} cy={s.y} r={s.r}
            fill={s.color} opacity={s.opacity} />
        ))}
      </svg>
    </AbsoluteFill>
  );
};
