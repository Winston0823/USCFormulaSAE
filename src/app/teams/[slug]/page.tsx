"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { INTEREST_FORM_URL } from "@/lib/links";

/* ─── Types ─────────────────────────────────────────── */
interface TeamMember {
  name: string;
  role: string;
  isLead?: boolean;
}

interface WwdCard {
  icon: string;
  title: string;
  desc: string;
  tag: string;
}

interface ToolRow {
  name: string;
  category: string;
}

interface TeamData {
  name: string;
  index: number; // 1-based
  tagline: string;
  heroHighlight: string; // the word to highlight in h1
  lead: string;
  sub: string;
  collageImgs: [string, string, string];
  collageCaptions: [string, string, string];
  wwdCards: WwdCard[];
  skills: string[];
  tools: ToolRow[];
  members: TeamMember[];
  ctaHeading: string;
  ctaBody: string;
}

/* ─── Team data ──────────────────────────────────────── */
const teamsData: Record<string, TeamData> = {
  aerodynamics: {
    name: "Aerodynamics",
    index: 1,
    tagline: "We make air do what we want.",
    heroHighlight: "air",
    lead: "Wings, undertrays, diffusers, a lot of carbon dust. We're the team that turns invisible airflow into measurable lap time.",
    sub: "Half our time is behind a computer running CFD, the other half is in the shop with a vacuum bag and a lot of patience. Both halves are great.",
    collageImgs: ["/aerodynamics.jpg", "/collab-on-car.jpg", "/competition-2025-1.jpg"],
    collageCaptions: ["wing v3  -  finally", "layup night, 2am", "competition '25"],
    wwdCards: [
      { icon: "≈", title: "CFD simulations", desc: "We run pressure fields and streamline plots until the car makes sense on-screen.", tag: "01" },
      { icon: "↯", title: "On-track validation", desc: "Tuft strings, pressure taps, and driver feedback. The sim gets confirmed at speed.", tag: "02" },
      { icon: "✦", title: "Wing packages", desc: "Front & rear wings, from airfoil selection to a cured, bonded, on-car assembly.", tag: "03" },
      { icon: "△", title: "Undertrays", desc: "The quiet half of the downforce budget  -  all the grip, none of the drag.", tag: "04" },
      { icon: "❊", title: "Composite manufacturing", desc: "All layups done in-house. Vacuum bags, wet layup, and cured parts we made ourselves.", tag: "05" },
      { icon: "◐", title: "Track data", desc: "Post-session data review with driver feedback. Iterate the aero package each run.", tag: "06" },
    ],
    skills: ["SolidWorks CAD", "CFD basics", "Composites", "MATLAB", "Data analysis", "Reading a pressure plot"],
    tools: [
      { name: "STAR-CCM+", category: "primary solver" },
      { name: "SolidWorks", category: "cad" },
      { name: "ANSYS Fluent", category: "secondary" },
      { name: "HyperMesh", category: "meshing" },
      { name: "MATLAB", category: "post-process" },
      { name: "Autoclave", category: "fabrication" },
    ],
    members: [
      { name: "Juan Morales-Lopez", role: "Aerodynamics Co-Lead (Fall)", isLead: true },
      { name: "Zane Zacharia", role: "Aerodynamics Co-Lead (Spring)", isLead: true },
    ],
    ctaHeading: "Come build something fast.",
    ctaBody: "No experience? Great. We'll teach you. Come to a shop night, grab a vacuum bag, stay for the snacks.",
  },
  frame: {
    name: "Frame",
    index: 2,
    tagline: "We build the bones of speed.",
    heroHighlight: "bones",
    lead: "The chassis is the backbone that everything else bolts into. Every subteam's components come together here  -  we make sure they all fit, function, and hold together at speed.",
    sub: "FEA on the screen, TIG welder in hand. We design, jig, and weld the frame that holds the whole car together.",
    collageImgs: ["/frame.jpg", "/collab-on-car.jpg", "/competition-2025-2.jpg"],
    collageCaptions: ["chassis v4 tacked", "jig day", "competition '25"],
    wwdCards: [
      { icon: "⬡", title: "Chassis design", desc: "Geometry, triangulation, torsional stiffness  -  every tube placed with intent.", tag: "01" },
      { icon: "◈", title: "FEA analysis", desc: "ANSYS simulations to validate the structure before a single weld is struck.", tag: "02" },
      { icon: "✕", title: "In-house welding", desc: "All welding done in-house. Tube notching, tacking, and TIG welding by our own members.", tag: "03" },
      { icon: "△", title: "Jig design", desc: "Custom jigs built in-house to hold every tube true and square while we weld.", tag: "04" },
      { icon: "▣", title: "Systems integration", desc: "Every subteam's parts mount to our frame. We coordinate packaging so it all fits.", tag: "05" },
      { icon: "⊕", title: "Assembly coordination", desc: "We run full-vehicle assembly, bringing every subteam's work into one rolling car.", tag: "06" },
    ],
    skills: ["SolidWorks CAD", "FEA analysis", "TIG welding", "Tube notching", "Metal fabrication", "Jig design"],
    tools: [
      { name: "SolidWorks", category: "cad" },
      { name: "ANSYS", category: "fea" },
      { name: "TIG Welder", category: "fabrication" },
      { name: "Tube Notcher", category: "fabrication" },
      { name: "CMM", category: "metrology" },
      { name: "Band Saw", category: "cutting" },
    ],
    members: [
      { name: "Samantha Barrera", role: "Frame Lead", isLead: true },
    ],
    ctaHeading: "Come weld something cool.",
    ctaBody: "No welding experience required  -  we'll teach you everything from tube notching to TIG. Show up curious.",
  },
  drivetrain: {
    name: "Drivetrain",
    index: 3,
    tagline: "We get the power to the pavement.",
    heroHighlight: "power",
    lead: "Gear ratios, chain drives, differentials, axles. We're the mechanical link between the motor and the wheels.",
    sub: "Efficiency here means more speed there. We optimize every rotating assembly to waste as little energy as possible.",
    collageImgs: ["/drivetrain.jpg", "/collab-on-car.jpg", "/competition-2025-3.jpg"],
    collageCaptions: ["sprocket day", "assembly time", "competition '25"],
    wwdCards: [
      { icon: "⚙", title: "Driveline design", desc: "A custom driveline engineered for our motor output, ratio targets, and packaging constraints.", tag: "01" },
      { icon: "⛓", title: "Chain drive", desc: "Chain selection, tension, sprocket design  -  keeping power delivery smooth.", tag: "02" },
      { icon: "◎", title: "Differential", desc: "Selecting and tuning the diff for cornering balance and traction.", tag: "03" },
      { icon: "↔", title: "CV joints & axles", desc: "Constant-velocity joints designed to handle the torque without binding.", tag: "04" },
      { icon: "✦", title: "Sprocket design", desc: "Custom sprocket geometry machined to spec for our specific ratio needs.", tag: "05" },
      { icon: "↯", title: "Efficiency testing", desc: "Dyno runs and coast-down tests to measure and minimize drivetrain losses.", tag: "06" },
    ],
    skills: ["Gear design", "CNC machining", "Assembly & tolerancing", "Dyno testing", "KISSsoft analysis"],
    tools: [
      { name: "SolidWorks", category: "cad" },
      { name: "KISSsoft", category: "gear analysis" },
      { name: "CNC Mill", category: "machining" },
      { name: "Dynamometer", category: "testing" },
      { name: "MATLAB", category: "analysis" },
      { name: "Torque wrench", category: "assembly" },
    ],
    members: [
      { name: "Warren Dao", role: "Drivetrain Lead", isLead: true },
    ],
    ctaHeading: "Come spin something.",
    ctaBody: "No machining background needed. If you like gears, tolerances, and things that rotate efficiently  -  you'll fit right in.",
  },
  powertrain: {
    name: "Powertrain",
    index: 4,
    tagline: "We turn volts into pace.",
    heroHighlight: "pace",
    lead: "Motors, inverters, drive control, cooling, and the high-voltage battery pack. We own everything from the cell level to the wheel.",
    sub: "Motor control theory, pack architecture, thermal management, and HV safety all live here. Our job starts at the cell and doesn't stop until the wheel turns.",
    collageImgs: ["/frame.jpg", "/collab-on-car.jpg", "/competition-2025-4.jpg"],
    collageCaptions: ["motor install", "inverter tuning", "competition '25"],
    wwdCards: [
      { icon: "⚡", title: "Motor calibration", desc: "Tuning inverter parameters for peak torque, efficiency, and driveability.", tag: "01" },
      { icon: "▣", title: "Battery pack design", desc: "Cell selection, series/parallel topology, segment design, and serviceable mechanical packaging.", tag: "02" },
      { icon: "≈", title: "BMS development", desc: "The brain of the pack  -  monitoring, balancing, and protecting every cell in real time.", tag: "03" },
      { icon: "◐", title: "Thermal management", desc: "Motor, inverter, and pack cooling loops. Radiators, pumps, temp sensors  -  no thermal derate.", tag: "04" },
      { icon: "▲", title: "HV safety systems", desc: "IMD, AMS, precharge, HV interlock  -  the layers that keep the pack contained under any failure.", tag: "05" },
      { icon: "✦", title: "Dyno & HV testing", desc: "Full powertrain validation on the dyno and isolation tests before the car ever sees a track.", tag: "06" },
    ],
    skills: ["Motor controls", "Battery design", "BMS firmware", "Thermal analysis", "HV safety", "MATLAB/Simulink", "Soldering/spot welding"],
    tools: [
      { name: "MATLAB/Simulink", category: "simulation" },
      { name: "Altium Designer", category: "pcb" },
      { name: "Dynamometer", category: "testing" },
      { name: "Arbin Cycler", category: "cell testing" },
      { name: "Thermal camera", category: "analysis" },
      { name: "Oscilloscope", category: "debug" },
    ],
    members: [
      { name: "Shreya Nair", role: "Powertrain Co-Lead", isLead: true },
      { name: "Brenton Hong", role: "Powertrain Co-Lead", isLead: true },
      { name: "Brady Stark", role: "Powertrain Co-Lead", isLead: true },
    ],
    ctaHeading: "Come electrify the track.",
    ctaBody: "Electrical, mechanical, or just endlessly curious about how batteries work. Applications open  -  no HV experience required.",
  },
  "vehicle-dynamics": {
    name: "Vehicle Dynamics",
    index: 5,
    tagline: "We make the car talk to the track.",
    heroHighlight: "track",
    lead: "Suspension geometry, damper tuning, tire selection, steering. We're the team that makes the driver feel in control.",
    sub: "Half kinematics, half data archaeology. We tune the setup until the driver says 'yeah, that's it.'",
    collageImgs: ["/vehicle-dynamics.jpg", "/collab-on-car.jpg", "/competition-2025-5.jpg"],
    collageCaptions: ["corner weighting", "damper build day", "competition '25"],
    wwdCards: [
      { icon: "◎", title: "Suspension geometry", desc: "Roll centers, camber curves, anti-dive  -  the invisible geometry that defines handling.", tag: "01" },
      { icon: "≈", title: "Damper tuning", desc: "Compression and rebound maps. The shock absorber as a performance tool.", tag: "02" },
      { icon: "◐", title: "Tire analysis", desc: "Tire models, MF-Tire coefficients, lateral and longitudinal data from testing.", tag: "03" },
      { icon: "✦", title: "Steering design", desc: "Rack packaging, steering ratio, Ackermann geometry, and bump steer minimization.", tag: "04" },
      { icon: "△", title: "Data acquisition", desc: "Channel setup, lap analysis, driver coaching from logged data.", tag: "05" },
      { icon: "↯", title: "Setup optimization", desc: "Corner weights, ride heights, toe, camber  -  dialing in for each event.", tag: "06" },
    ],
    skills: ["Kinematics", "Data analysis", "Damper tuning", "Vehicle simulation", "MATLAB", "Tire modeling"],
    tools: [
      { name: "OptimumG", category: "kinematics" },
      { name: "MATLAB", category: "analysis" },
      { name: "SolidWorks", category: "cad" },
      { name: "MoTeC i2", category: "data" },
      { name: "Shock Dyno", category: "testing" },
      { name: "Corner scales", category: "setup" },
    ],
    members: [
      { name: "Javier de la Torre", role: "Vehicle Dynamics Lead", isLead: true },
    ],
    ctaHeading: "Come tune something precise.",
    ctaBody: "If you think in forces and like making things handle better, we have a corner scale with your name on it.",
  },
  ergonomics: {
    name: "Ergonomics",
    index: 6,
    tagline: "We design around the human.",
    heroHighlight: "human",
    lead: "Pedal box, steering, seat, harness, dash. We make sure the driver can extract everything the car has to offer.",
    sub: "Every millimeter matters when the cockpit is your office at 70 mph.",
    collageImgs: ["/ergonomics.jpg", "/collab-on-car.jpg", "/competition-2025-1.jpg"],
    collageCaptions: ["mock-up day", "seat fitting", "competition '25"],
    wwdCards: [
      { icon: "⊕", title: "Cockpit design", desc: "Dashboard, switch panel, visibility  -  the complete driver environment.", tag: "01" },
      { icon: "◈", title: "Pedal box", desc: "Adjustable pedal geometry for different driver dimensions. Feel and feedback.", tag: "02" },
      { icon: "◎", title: "Steering system", desc: "Column, wheel design, quick-release, and overall steering feel.", tag: "03" },
      { icon: "▣", title: "Seat & harness", desc: "Custom seat shells, Schroth harness routing, driver restraint.", tag: "04" },
      { icon: "△", title: "Driver analysis", desc: "Anthropometric data, reach analysis, sightlines, ingress/egress.", tag: "05" },
      { icon: "◐", title: "Brakes", desc: "Brake sizing and calculations, brakeline assembly, and bias bar tuning for balanced stopping.", tag: "06" },
    ],
    skills: ["Human factors", "CAD design", "Ergonomic analysis", "FEA", "Manufacturing", "3D printing"],
    tools: [
      { name: "NX", category: "cad" },
      { name: "Ansys", category: "fea" },
      { name: "MATLAB", category: "analysis" },
      { name: "MoTec I2", category: "data acquisition" },
    ],
    members: [
      { name: "Katarina Aryawan", role: "Ergonomics Lead", isLead: true },
    ],
    ctaHeading: "Come design for real people.",
    ctaBody: "Industrial design, mechanical, or just someone who cares about how things feel to use. We'd love to have you.",
  },
  electrical: {
    name: "Systems - Electrical",
    index: 8,
    tagline: "We keep every system alive.",
    heroHighlight: "alive",
    lead: "Wiring harness, PCBs, power distribution, low-voltage architecture. If it has a wire on it, we own it.",
    sub: "Soldering iron in one hand, Altium in the other. We design the electrical skeleton that every subsystem bolts into.",
    collageImgs: ["/systems.jpg", "/collab-on-car.jpg", "/competition-2025-5.jpg"],
    collageCaptions: ["harness build", "pcb milestone", "competition '25"],
    wwdCards: [
      { icon: "↯", title: "Wiring harness", desc: "Full vehicle harness design  -  routing, shielding, connectors, and the eternal fight against weight.", tag: "01" },
      { icon: "▣", title: "PCB design", desc: "Custom boards for power distribution, sensor interfacing, and driver displays.", tag: "02" },
      { icon: "⚙", title: "Power distribution", desc: "The PDM  -  every fuse, every relay, every protected load on the vehicle.", tag: "03" },
      { icon: "≈", title: "Low-voltage systems", desc: "12V architecture, DC-DC converters, and the logic that stays up even when HV is off.", tag: "04" },
      { icon: "◐", title: "Connector strategy", desc: "Deutsch, AMPseal, MilSpec  -  picking the right connector for each subsystem and keeping them serviceable.", tag: "05" },
      { icon: "✦", title: "EMI & grounding", desc: "The invisible work that keeps high-current buses from talking over low-level sensors.", tag: "06" },
    ],
    skills: ["Circuit design", "PCB layout", "Wiring/crimping", "Altium", "Schematic capture", "Soldering"],
    tools: [
      { name: "Altium Designer", category: "pcb" },
      { name: "KiCad", category: "pcb (secondary)" },
      { name: "Crimp tools", category: "assembly" },
      { name: "Heat gun + shrink", category: "assembly" },
      { name: "Multimeter", category: "debug" },
      { name: "Oscilloscope", category: "debug" },
    ],
    members: [
      { name: "Nick Costanzo", role: "Systems-Electrical Co-Lead", isLead: true },
      { name: "Armando Solis Jr.", role: "Systems-Electrical Co-Lead", isLead: true },
      { name: "Tianze Li", role: "Systems-Electrical Co-Lead", isLead: true },
    ],
    ctaHeading: "Come wire the whole car.",
    ctaBody: "EE, ME with an electrical itch, or anyone who finds schematics satisfying. We'll teach you the rest.",
  },
  communications: {
    name: "Systems - Communications",
    index: 9,
    tagline: "We make the car talk.",
    heroHighlight: "talk",
    lead: "Telemetry, CAN bus, data acquisition, driver display. If a sensor sees something, we make sure somebody hears about it.",
    sub: "Embedded firmware, data pipelines, and a dashboard that's readable at 70 mph. We live at the intersection of hardware and software.",
    // TODO(asset): needs a dedicated Communications photo  -  currently reuses /systems.jpg
    collageImgs: ["/systems.jpg", "/collab-on-car.jpg", "/competition-2025-2.jpg"],
    collageCaptions: ["telemetry bench", "logger install", "competition '25"],
    wwdCards: [
      { icon: "≈", title: "CAN bus", desc: "Vehicle-wide CAN network design  -  node IDs, message maps, and the DBC file nobody wants to own but everyone needs.", tag: "01" },
      { icon: "◐", title: "Data acquisition", desc: "Logger configuration, channel setup, and the 1kHz data stream that reveals what really happened on track.", tag: "02" },
      { icon: "↯", title: "Telemetry", desc: "Live radio link from car to pit. Real-time signals during test days and races.", tag: "03" },
      { icon: "✦", title: "Driver display", desc: "Dash layout  -  what the driver sees at 70 mph needs to be glanceable and readable.", tag: "04" },
      { icon: "⚙", title: "Firmware", desc: "Embedded code on every node  -  sensor interface, CAN dispatch, and the state machines that keep it all coherent.", tag: "05" },
      { icon: "▣", title: "Data analysis", desc: "Post-session log review. Driver feedback + data = next session's setup change.", tag: "06" },
    ],
    skills: ["C/C++ embedded", "CAN protocol", "Python", "Data analysis", "Radio/RF basics", "State machines"],
    tools: [
      { name: "MoTeC i2 Pro", category: "data" },
      { name: "Vector CANalyzer", category: "bus debug" },
      { name: "Python", category: "scripting" },
      { name: "MATLAB", category: "analysis" },
      { name: "STM32CubeIDE", category: "firmware" },
      { name: "Logic analyzer", category: "debug" },
    ],
    members: [
      { name: "Tim Hutapea", role: "Systems-Comms Co-Lead", isLead: true },
      { name: "Andy Zhang", role: "Systems-Comms Co-Lead", isLead: true },
    ],
    ctaHeading: "Come make the car talk.",
    ctaBody: "CS, CompE, or EE with a love for signals. We'll teach you CAN, logging, and the art of a good state machine.",
  },
  business: {
    name: "Business",
    index: 10,
    tagline: "We keep the lights on.",
    heroHighlight: "lights",
    lead: "Sponsorship, marketing, finances, logistics, recruitment. Without us, the engineers don't have parts to build with.",
    sub: "The team that turns relationships into resources. Equally at home in a pitch meeting or a sponsor dinner.",
    collageImgs: ["/business-group.jpg", "/collab-on-car.jpg", "/competition-2025-1.jpg"],
    collageCaptions: ["sponsor week", "presentation day", "competition '25"],
    wwdCards: [
      { icon: "◈", title: "Sponsorship", desc: "Identifying partners, building relationships, and closing deals that fund the car.", tag: "01" },
      { icon: "≈", title: "Marketing", desc: "Social media, brand identity, photography, content  -  making the team look as good as it is.", tag: "02" },
      { icon: "▣", title: "Budget & finance", desc: "Tracking expenditure, writing purchase orders, managing the team's annual budget.", tag: "03" },
      { icon: "✦", title: "Logistics", desc: "Competition travel, shipping, hotel blocks, schedule coordination across 9 subteams.", tag: "04" },
      { icon: "⊕", title: "Recruitment", desc: "Tabling, info sessions, outreach  -  filling the team with great people every fall.", tag: "05" },
      { icon: "△", title: "Business presentation", desc: "The FSAE Business Presentation event  -  where strategy and execution meet a panel of judges.", tag: "06" },
    ],
    skills: ["Communication", "Marketing", "Financial planning", "Project management", "Presentation design"],
    tools: [
      { name: "Excel / Sheets", category: "finance" },
      { name: "Adobe Creative Suite", category: "design" },
      { name: "Canva", category: "social" },
      { name: "LinkedIn", category: "outreach" },
      { name: "Notion", category: "planning" },
      { name: "Salesforce", category: "crm" },
    ],
    members: [
      { name: "Manuela Londono", role: "Project Manager", isLead: true },
      { name: "Marissa Jing", role: "Business Lead", isLead: true },
    ],
    ctaHeading: "Come build something beyond the car.",
    ctaBody: "Business, marketing, finance, communications  -  if you're driven and want to be part of something real, apply.",
  },
};

const teamOrder = ["aerodynamics","frame","drivetrain","powertrain","vehicle-dynamics","ergonomics","electrical","communications","business"];

function getAdjacent(slug: string) {
  const i = teamOrder.indexOf(slug);
  return {
    prev: teamOrder[i > 0 ? i - 1 : teamOrder.length - 1],
    next: teamOrder[i < teamOrder.length - 1 ? i + 1 : 0],
  };
}

/* ─── Team roster component ───────────────────────────── */
function TeamRoster({ members }: { members: TeamMember[] }) {
  if (members.length === 0) return null;

  return (
    <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
      {members.map((m) => (
        <div
          key={m.name}
          style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "22px 0",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <span style={{
            fontFamily: "var(--font-inter-tight), sans-serif",
            fontWeight: 700, fontSize: "clamp(18px, 2vw, 26px)",
            color: "#ededed", letterSpacing: "-0.01em",
          }}>
            {m.name}
          </span>
          <span style={{
            fontFamily: "var(--font-jetbrains), monospace",
            fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase",
            color: m.isLead ? "#e3b53d" : "#9a9a9a",
            flexShrink: 0, marginLeft: 24,
          }}>
            {m.role}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─── Polaroid Collage ───────────────────────────────── */
function PolaroidCollage({ imgs, captions }: { imgs: [string, string, string]; captions: [string, string, string] }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.15 }}
      style={{ position: "relative", aspectRatio: "1/1", minWidth: 0, cursor: "default" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Polaroid 1  -  fans up-left */}
      <div style={{
        position: "absolute", top: "4%", left: "8%", width: "58%", aspectRatio: "4/5",
        background: "#f4f1e8", padding: "12px 12px 44px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)", borderRadius: 2,
        transform: hovered ? "translate(-22%, -12%) rotate(-14deg) scale(1.03)" : "rotate(-5deg)",
        transition: "transform 0.45s cubic-bezier(.2,.8,.2,1)",
        zIndex: 1,
      }}>
        <div style={{ position: "absolute", top: -8, left: "40%", width: 80, height: 22,
          background: "rgba(227,181,61,0.65)", mixBlendMode: "multiply" }} />
        <img src={imgs[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        <span style={{ position: "absolute", bottom: 14, left: 12, right: 12,
          fontFamily: "var(--font-caveat), cursive", fontSize: 20, color: "#2a2a2a", textAlign: "center" }}>
          {captions[0]}
        </span>
      </div>
      {/* Polaroid 2  -  fans right */}
      <div style={{
        position: "absolute", top: "30%", right: "0%", width: "48%", aspectRatio: "4/5",
        background: "#f4f1e8", padding: "12px 12px 44px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)", borderRadius: 2,
        transform: hovered ? "translate(18%, -6%) rotate(16deg) scale(1.03)" : "rotate(6deg)",
        transition: "transform 0.45s cubic-bezier(.2,.8,.2,1) 0.04s",
        zIndex: 2,
      }}>
        <div style={{ position: "absolute", top: -8, left: "30%", width: 80, height: 22,
          background: "rgba(227,181,61,0.65)", mixBlendMode: "multiply" }} />
        <img src={imgs[1]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        <span style={{ position: "absolute", bottom: 14, left: 12, right: 12,
          fontFamily: "var(--font-caveat), cursive", fontSize: 20, color: "#2a2a2a", textAlign: "center" }}>
          {captions[1]}
        </span>
      </div>
      {/* Polaroid 3  -  fans down-center */}
      <div style={{
        position: "absolute", bottom: "2%", left: "18%", width: "42%", aspectRatio: "4/5",
        background: "#f4f1e8", padding: "12px 12px 44px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)", borderRadius: 2,
        transform: hovered ? "translate(-4%, 14%) rotate(-10deg) scale(1.03)" : "rotate(-3deg)",
        transition: "transform 0.45s cubic-bezier(.2,.8,.2,1) 0.08s",
        zIndex: 3,
      }}>
        <div style={{ position: "absolute", top: -8, left: "50%", width: 80, height: 22,
          background: "rgba(227,181,61,0.65)", mixBlendMode: "multiply" }} />
        <img src={imgs[2]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        <span style={{ position: "absolute", bottom: 14, left: 12, right: 12,
          fontFamily: "var(--font-caveat), cursive", fontSize: 20, color: "#2a2a2a", textAlign: "center" }}>
          {captions[2]}
        </span>
      </div>
    </motion.div>
  );
}

/* ─── Page ───────────────────────────────────────────── */
export default function TeamPage() {
  const params = useParams();
  const slug = params.slug as string;
  const team = teamsData[slug];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!team) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Team Not Found</h1>
          <Link href="/#teams" className="text-[#e3b53d] hover:underline">Back to Teams</Link>
        </div>
      </div>
    );
  }

  const { prev, next } = getAdjacent(slug);

  // Build hero h1 with highlighted word
  const hi = team.heroHighlight;
  const tagParts = team.tagline.split(new RegExp(`(${hi})`, "i"));

  return (
    <div style={{ background: "#0b0b0d", color: "#ededed", minHeight: "100vh" }}>

      {/* ══════════════════════════════════════
          HERO  -  Scrapbook / Zine
         ══════════════════════════════════════ */}
      <section style={{ padding: "120px 0 60px", position: "relative" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 32px" }}>
          <div style={{
            display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 40,
            alignItems: "center",
          }} className="hero-grid-responsive">

            {/* Copy */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{ minWidth: 0 }}
            >
              {/* Label */}
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
                <span style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: 11,
                  letterSpacing: "0.24em", color: "#5f5f5f", textTransform: "uppercase" }}>
                  {String(team.index).padStart(2, "0")} / {String(teamOrder.length).padStart(2, "0")}
                </span>
                <span style={{ flexShrink: 0, width: 28, height: 1, background: "#c8372d" }} />
                <span style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: 11,
                  letterSpacing: "0.24em", color: "#ff8a7a", textTransform: "uppercase", fontWeight: 600 }}>
                  {team.name}
                </span>
              </div>

              {/* H1 */}
              <h1 style={{
                fontFamily: "'Ethnocentric', sans-serif",
                fontSize: "clamp(42px, 5.6vw, 88px)",
                lineHeight: 0.9, margin: "0 0 24px",
                wordBreak: "break-word",
              }}>
                {tagParts.map((part, i) =>
                  part.toLowerCase() === hi.toLowerCase()
                    ? <span key={i} style={{
                        display: "inline-block",
                        background: "#c8372d", color: "#fff",
                        padding: "2px 14px 6px", borderRadius: 8,
                        transform: "rotate(-2deg)",
                      }}>{part}</span>
                    : <span key={i}>{part}</span>
                )}
              </h1>

              <p style={{ fontSize: 21, lineHeight: 1.4, color: "#ededed", maxWidth: 540, margin: "0 0 32px", fontWeight: 500,
                fontFamily: "var(--font-inter-tight), sans-serif" }}>{team.lead}</p>

              {/* CTAs */}
              <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                <Link
                  href={INTEREST_FORM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 10,
                    padding: "14px 28px", background: "#e3b53d", color: "#000",
                    borderRadius: 999, fontWeight: 700, fontSize: 16, letterSpacing: "0.02em",
                    transition: "transform 0.2s, box-shadow 0.2s", border: 0,
                    fontFamily: "var(--font-inter-tight), sans-serif",
                  }}
                  className="btn-join"
                >
                  Join us <ArrowRight size={16} />
                </Link>
                <span style={{
                  fontFamily: "var(--font-caveat), cursive", fontSize: 24, color: "#ff8a7a",
                  display: "inline-flex", gap: 6, alignItems: "center",
                }}>← yes really, first-years welcome</span>
              </div>
            </motion.div>

            {/* Polaroid collage */}
            <PolaroidCollage imgs={team.collageImgs} captions={team.collageCaptions} />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          WHAT WE DO  -  Card grid
         ══════════════════════════════════════ */}
      <section style={{ padding: "100px 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between",
            marginBottom: 48, flexWrap: "wrap", gap: 20 }}>
            <motion.h2
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              style={{ fontFamily: "'Ethnocentric', sans-serif",
                fontSize: "clamp(40px, 5vw, 68px)", margin: 0, lineHeight: 0.9 }}>
              What we{" "}
              <em style={{ fontStyle: "normal", color: "#ff8a7a",
                fontFamily: "var(--font-caveat), cursive", fontSize: "1em",
                display: "inline-block", transform: "translateY(-0.05em) rotate(-2deg)" }}>
                actually
              </em>
              <br />spend our time on.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              style={{ fontFamily: "var(--font-caveat), cursive", fontSize: 22, color: "#9a9a9a", maxWidth: 280 }}>
              p.s.  -  it&apos;s 60% computer, 40% in the shop. we love both.
            </motion.p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}
            className="wwd-grid-responsive">
            {team.wwdCards.map((card, i) => (
              <motion.div
                key={card.tag}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                style={{
                  padding: "26px 24px 28px",
                  border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14,
                  background: "#000", position: "relative", cursor: "default",
                  transition: "transform 0.25s ease, border-color 0.25s ease",
                }}
                whileHover={{ y: -3, borderColor: "rgba(200,55,45,0.6)" }}
              >
                <span style={{
                  position: "absolute", top: -10, right: 18,
                  fontFamily: "var(--font-jetbrains), monospace", fontSize: 10,
                  letterSpacing: "0.18em", textTransform: "uppercase",
                  background: "#0b0b0d", padding: "4px 10px",
                  border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, color: "#ff8a7a",
                }}>{card.tag}</span>
                <div style={{
                  width: 44, height: 44, borderRadius: 10,
                  background: "rgba(200,55,45,0.1)",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  color: "#ff8a7a", fontSize: 18, marginBottom: 18,
                  fontFamily: "'Ethnocentric', sans-serif",
                }}>{card.icon}</div>
                <h3 style={{ fontFamily: "var(--font-inter-tight), sans-serif", fontWeight: 700,
                  fontSize: 20, margin: "0 0 10px", lineHeight: 1.2, color: "#ededed" }}>{card.title}</h3>
                <p style={{ fontSize: 15, color: "#9a9a9a", lineHeight: 1.55, margin: 0 }}>{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SKILLS & TOOLS  -  Two-col split
         ══════════════════════════════════════ */}
      <section style={{ padding: "100px 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "start" }}
            className="skills-grid-responsive">
            {/* Skills */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: 11,
                letterSpacing: "0.22em", textTransform: "uppercase", color: "#ff8a7a", marginBottom: 10 }}>
                stuff you&apos;ll learn ↓
              </div>
              <h2 style={{ fontFamily: "'Ethnocentric', sans-serif",
                fontSize: "clamp(28px, 3vw, 40px)", margin: "0 0 24px" }}>
                Skills for new members.
              </h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {team.skills.map(s => (
                  <motion.span
                    key={s}
                    whileHover={{ x: -1, y: -1, boxShadow: "3px 3px 0 #c8372d" }}
                    style={{
                      fontFamily: "var(--font-inter-tight), sans-serif", fontWeight: 600, fontSize: 16,
                      padding: "10px 16px", borderRadius: 8,
                      background: "rgba(200,55,45,0.07)", color: "#ededed",
                      border: "1px solid rgba(200,55,45,0.22)", cursor: "default",
                      transition: "all 0.25s ease",
                    }}
                  >{s}</motion.span>
                ))}
              </div>
            </motion.div>

            {/* Tools */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.1 }}>
              <div style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: 11,
                letterSpacing: "0.22em", textTransform: "uppercase", color: "#ff8a7a", marginBottom: 10 }}>
                tools we use ↓
              </div>
              <h2 style={{ fontFamily: "'Ethnocentric', sans-serif",
                fontSize: "clamp(28px, 3vw, 40px)", margin: "0 0 24px" }}>
                The software &amp; shop.
              </h2>
              <div>
                {team.tools.map((tool, i) => (
                  <div key={tool.name} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "15px 0",
                    borderTop: "1px solid rgba(255,255,255,0.06)",
                    borderBottom: i === team.tools.length - 1 ? "1px solid rgba(255,255,255,0.06)" : undefined,
                    fontFamily: "var(--font-inter-tight), sans-serif", fontWeight: 600, fontSize: 17, color: "#ededed",
                  }}>
                    <span>{tool.name}</span>
                    <span style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: 11,
                      color: "#9a9a9a", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                      {tool.category}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          MEET THE TEAM  -  Bubble portraits
         ══════════════════════════════════════ */}
      <section style={{ padding: "72px 0 80px", borderTop: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 32px" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end",
              marginBottom: 32, flexWrap: "wrap", gap: 12 }}>
            <h2 style={{ fontFamily: "'Ethnocentric', sans-serif",
              fontSize: "clamp(28px, 3.5vw, 48px)", margin: 0 }}>
              Meet the team.
            </h2>
          </motion.div>

          <TeamRoster members={team.members} />
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA
         ══════════════════════════════════════ */}
      <section style={{ padding: "110px 0 130px", borderTop: "1px solid rgba(255,255,255,0.06)",
        textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 50% 100%, rgba(200,55,45,0.1), transparent 60%)",
          pointerEvents: "none" }} />
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 32px", position: "relative" }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 style={{ fontFamily: "'Ethnocentric', sans-serif",
              fontSize: "clamp(48px, 7vw, 96px)", margin: "0 0 20px", lineHeight: 0.9 }}>
              {team.ctaHeading.split(" ").map((word, i, arr) =>
                i === arr.length - 1
                  ? <span key={i} style={{ color: "#ff8a7a" }}>{word}</span>
                  : <span key={i}>{word} </span>
              )}
            </h2>
            <p style={{ fontSize: 19, color: "#9a9a9a", maxWidth: 520, margin: "0 auto 32px", lineHeight: 1.5 }}>
              {team.ctaBody}
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
              <Link
                href={INTEREST_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 10,
                  padding: "14px 28px", background: "#e3b53d", color: "#000",
                  borderRadius: 999, fontWeight: 700, fontSize: 16,
                  fontFamily: "var(--font-inter-tight), sans-serif",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                className="btn-join"
              >
                Join us <ArrowRight size={16} />
              </Link>
              <Link
                href="/#teams"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 10,
                  padding: "13px 24px", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 999,
                  color: "#ededed", fontWeight: 500, fontSize: 14, letterSpacing: "0.08em",
                  textTransform: "uppercase", fontFamily: "var(--font-inter-tight), sans-serif",
                  transition: "all 0.2s",
                }}
              >
                Meet the team first
              </Link>
            </div>
            <p style={{ marginTop: 28, fontFamily: "var(--font-caveat), cursive",
              fontSize: 28, color: "#ff8a7a" }}>
              see you in the shop ✶
            </p>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TEAM NAV  -  Previous / Next
         ══════════════════════════════════════ */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <Link
          href={`/teams/${prev}`}
          style={{ padding: "32px 40px", display: "flex", alignItems: "center", gap: 18,
            borderRight: "1px solid rgba(255,255,255,0.06)", transition: "background 0.2s",
            textDecoration: "none" }}
          className="footer-nav-link"
        >
          <span style={{ color: "#5f5f5f", fontSize: 20 }}>←</span>
          <span>
            <span style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: 10,
              letterSpacing: "0.2em", color: "#5f5f5f", textTransform: "uppercase", display: "block", marginBottom: 4 }}>
              Previous
            </span>
            <span style={{ fontFamily: "var(--font-inter-tight), sans-serif", fontWeight: 700,
              fontSize: 18, color: "#ededed" }}>
              {teamsData[prev]?.name}
            </span>
          </span>
        </Link>
        <Link
          href={`/teams/${next}`}
          style={{ padding: "32px 40px", display: "flex", alignItems: "center", justifyContent: "flex-end",
            gap: 18, flexDirection: "row-reverse", transition: "background 0.2s", textDecoration: "none" }}
          className="footer-nav-link"
        >
          <span style={{ color: "#5f5f5f", fontSize: 20 }}>→</span>
          <span style={{ textAlign: "right" }}>
            <span style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: 10,
              letterSpacing: "0.2em", color: "#5f5f5f", textTransform: "uppercase", display: "block", marginBottom: 4 }}>
              Next
            </span>
            <span style={{ fontFamily: "var(--font-inter-tight), sans-serif", fontWeight: 700,
              fontSize: 18, color: "#ededed" }}>
              {teamsData[next]?.name}
            </span>
          </span>
        </Link>
      </div>

      {/* Inline responsive styles */}
      <style>{`
        .btn-join:hover { transform: translateY(-1px); box-shadow: 0 10px 30px rgba(227,181,61,0.3); }
        .footer-nav-link:hover { background: rgba(255,255,255,0.02); }

        @media (max-width: 1024px) {
          .hero-grid-responsive { grid-template-columns: 1fr !important; }
          .wwd-grid-responsive { grid-template-columns: repeat(2, 1fr) !important; }
          .skills-grid-responsive { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .wwd-grid-responsive { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
