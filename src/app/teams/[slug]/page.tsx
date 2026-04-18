"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";

/* ─── Types ─────────────────────────────────────────── */
interface BubbleMember {
  name: string;
  handle: string;
  role: string;
  isLead?: boolean;
  img: string;
  quote: string;
  bio: string;
  meta: [string, string][];
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
  members: BubbleMember[];
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
    collageCaptions: ["wing v3 — finally", "layup night, 2am", "competition '25"],
    wwdCards: [
      { icon: "≈", title: "CFD simulations", desc: "We run pressure fields and streamline plots until the car makes sense on-screen.", tag: "01" },
      { icon: "◐", title: "Wind tunnel tests", desc: "Scale models, pitot tubes, tuft strings. Confirming the sim wasn't lying.", tag: "02" },
      { icon: "✦", title: "Wing packages", desc: "Front & rear wings, from airfoil selection to a cured, bonded, on-car assembly.", tag: "03" },
      { icon: "△", title: "Undertrays", desc: "The quiet half of the downforce budget — all the grip, none of the drag.", tag: "04" },
      { icon: "❊", title: "Composite layups", desc: "Pre-preg carbon, vacuum bags, autoclave cycles. Long nights, good playlists.", tag: "05" },
      { icon: "↯", title: "Track data", desc: "Pressure taps + tuft tests + driver feedback. Iteration, then repeat.", tag: "06" },
    ],
    skills: ["SolidWorks CAD", "CFD basics", "Composites", "MATLAB", "Wind tunnel", "Data analysis", "Reading a pressure plot"],
    tools: [
      { name: "STAR-CCM+", category: "primary solver" },
      { name: "SolidWorks", category: "cad" },
      { name: "ANSYS Fluent", category: "secondary" },
      { name: "HyperMesh", category: "meshing" },
      { name: "MATLAB", category: "post-process" },
      { name: "Autoclave", category: "fabrication" },
    ],
    members: [
      { name: "Alex Rivera", handle: "@alex.rivera", role: "Aerodynamics Lead", isLead: true, img: "/aerodynamics.jpg",
        quote: "\"The day the tufts lined up on the undertray exactly like the sim said — that's when I knew I picked the right major.\"",
        bio: "Four years deep into USC Racing. Started bolting wings on as a freshman, now runs the subteam and teaches the next generation how to read a pressure plot.",
        meta: [["Major","Aerospace Eng."], ["Year","Senior"], ["Joined","Fall 2022"], ["Focus","Diffusers"]] },
      { name: "Jordan Chen", handle: "@jchen", role: "Wings Lead", img: "/competition-2025-1.jpg",
        quote: "\"A well-designed wing is the difference between a good lap and a great one. We obsess over every millimeter.\"",
        bio: "Owns the front and rear wing packages from airfoil selection to cured assembly. Pretends not to love SolidWorks.",
        meta: [["Major","Mechanical Eng."], ["Year","Junior"], ["Joined","Fall 2023"], ["Focus","Rear Wing"]] },
      { name: "Maya Patel", handle: "@maya", role: "CFD Engineer", img: "/competition-2025-2.jpg",
        quote: "\"Running CFD at 2am with the cluster all to yourself — nothing beats it.\"",
        bio: "STAR-CCM+ power user. The person you call when your residuals won't converge. Runs the overnight simulation cluster.",
        meta: [["Major","Aerospace Eng."], ["Year","Junior"], ["Joined","Fall 2023"], ["Focus","Simulation"]] },
      { name: "Sam Torres", handle: "@sam", role: "Composites Lead", img: "/collab-on-car.jpg",
        quote: "\"Composites is 80% patience and 20% panic. Both are good.\"",
        bio: "Pre-preg specialist. Will explain bleeder ply to anyone who will listen. Runs layup nights and keeps the autoclave schedule.",
        meta: [["Major","Mechanical Eng."], ["Year","Sophomore"], ["Joined","Fall 2024"], ["Focus","Carbon Layup"]] },
    ],
    ctaHeading: "Come build something fast.",
    ctaBody: "No experience? Great. We'll teach you. Come to a shop night, grab a vacuum bag, stay for the snacks.",
  },
  frame: {
    name: "Frame",
    index: 2,
    tagline: "We build the bones of speed.",
    heroHighlight: "bones",
    lead: "The chassis is everything. We design and fabricate the structural foundation of the car — lightweight, rigid, safe.",
    sub: "FEA on the screen, TIG welder in hand. We make the frame that every other system bolts onto.",
    collageImgs: ["/frame.jpg", "/collab-on-car.jpg", "/competition-2025-2.jpg"],
    collageCaptions: ["chassis v4 tacked", "jig day", "competition '25"],
    wwdCards: [
      { icon: "⬡", title: "Chassis design", desc: "Geometry, triangulation, torsional stiffness — every tube placed with intent.", tag: "01" },
      { icon: "◈", title: "FEA analysis", desc: "ANSYS simulations to validate the structure before a single weld is struck.", tag: "02" },
      { icon: "✕", title: "Tube fabrication", desc: "Notching, bending, tacking, welding. Steel to race car.", tag: "03" },
      { icon: "△", title: "Jig design", desc: "The fixture that holds it all true while we weld. Precision before process.", tag: "04" },
      { icon: "▣", title: "Impact attenuator", desc: "The crumple zone. Designed to absorb energy so the driver doesn't have to.", tag: "05" },
      { icon: "⊕", title: "Weight optimization", desc: "Every gram counts. Material selection, wall thickness, tube diameter.", tag: "06" },
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
      { name: "Casey Morgan", handle: "@casey", role: "Frame Lead", isLead: true, img: "/frame.jpg",
        quote: "\"A good chassis disappears — you stop thinking about it and just drive.\"",
        bio: "Three years on Frame, two as lead. Responsible for the current chassis architecture and the new jig system.",
        meta: [["Major","Mechanical Eng."], ["Year","Senior"], ["Joined","Fall 2022"], ["Focus","Chassis"]] },
      { name: "Jamie Park", handle: "@jamie", role: "Welding Lead", img: "/competition-2025-3.jpg",
        quote: "\"Welding is just drawing with fire.\"",
        bio: "Certified TIG welder. Runs the welding rotations and teaches new members technique from day one.",
        meta: [["Major","Mechanical Eng."], ["Year","Junior"], ["Joined","Fall 2023"], ["Focus","Welding"]] },
      { name: "Blake Nguyen", handle: "@blake", role: "FEA Engineer", img: "/competition-2025-4.jpg",
        quote: "\"The stress plot never lies. Listen to the stress plot.\"",
        bio: "Runs all structural simulations. Keeps the team from over-building and under-designing.",
        meta: [["Major","Civil Eng."], ["Year","Junior"], ["Joined","Spring 2023"], ["Focus","FEA"]] },
      { name: "Reese Kim", handle: "@reese", role: "Fabrication", img: "/competition-2025-5.jpg",
        quote: "\"There's no substitute for a well-notched tube.\"",
        bio: "Master of the notcher and band saw. First-year who moved up fast because they actually show up to every shop day.",
        meta: [["Major","Mechanical Eng."], ["Year","Sophomore"], ["Joined","Fall 2024"], ["Focus","Fab"]] },
    ],
    ctaHeading: "Come weld something cool.",
    ctaBody: "No welding experience required — we'll teach you everything from tube notching to TIG. Show up curious.",
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
      { icon: "⚙", title: "Gear ratios", desc: "Optimizing the ratio stack for acceleration, top speed, and competition events.", tag: "01" },
      { icon: "⛓", title: "Chain drive", desc: "Chain selection, tension, sprocket design — keeping power delivery smooth.", tag: "02" },
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
      { name: "Logan Hayes", handle: "@logan", role: "Drivetrain Lead", isLead: true, img: "/drivetrain.jpg",
        quote: "\"Every watt lost in drivetrain friction is a watt the powertrain team worked hard for. We don't waste watts.\"",
        bio: "Owns the full drivetrain architecture. Designed the current sprocket set and differential selection methodology.",
        meta: [["Major","Mechanical Eng."], ["Year","Senior"], ["Joined","Fall 2022"], ["Focus","Gear systems"]] },
      { name: "Avery Wu", handle: "@avery", role: "Machining Lead", img: "/competition-2025-1.jpg",
        quote: "\"The CNC doesn't care about your feelings. Tolerances do.\"",
        bio: "Runs all machining operations for the drivetrain. Custom sprockets, hubs, bearing carriers.",
        meta: [["Major","Mechanical Eng."], ["Year","Junior"], ["Joined","Fall 2023"], ["Focus","CNC"]] },
      { name: "Skyler Ross", handle: "@skyler", role: "Testing Engineer", img: "/competition-2025-2.jpg",
        quote: "\"Data from the dyno is worth more than any simulation.\"",
        bio: "Designs and runs all drivetrain test protocols. Keeps the efficiency log and coordinates with powertrain.",
        meta: [["Major","Mechanical Eng."], ["Year","Junior"], ["Joined","Fall 2023"], ["Focus","Testing"]] },
      { name: "Finley Cross", handle: "@finley", role: "Assembly Tech", img: "/competition-2025-3.jpg",
        quote: "\"I like things that spin. Correctly.\"",
        bio: "First-year with a gift for assembly and an obsessive attention to torque specs. Keeps the service manual.",
        meta: [["Major","Mechanical Eng."], ["Year","Freshman"], ["Joined","Fall 2025"], ["Focus","Assembly"]] },
    ],
    ctaHeading: "Come spin something.",
    ctaBody: "No machining background needed. If you like gears, tolerances, and things that rotate efficiently — you'll fit right in.",
  },
  powertrain: {
    name: "Powertrain",
    index: 4,
    tagline: "We make the volts go fast.",
    heroHighlight: "volts",
    lead: "Motors, batteries, BMS, cooling. We're the high-voltage heart of the car — and the team that keeps it from catching fire.",
    sub: "Half electrical engineering, half thermal management, and a healthy respect for anything above 60V.",
    collageImgs: ["/powertrain.jpg", "/collab-on-car.jpg", "/competition-2025-4.jpg"],
    collageCaptions: ["accumulator build", "HV testing day", "competition '25"],
    wwdCards: [
      { icon: "⚡", title: "Motor calibration", desc: "Tuning the inverter and motor parameters for peak torque delivery.", tag: "01" },
      { icon: "▣", title: "Battery pack design", desc: "Cell selection, module layout, packaging, and thermal management.", tag: "02" },
      { icon: "≈", title: "BMS development", desc: "The brain of the accumulator — monitoring, balancing, and protecting every cell.", tag: "03" },
      { icon: "◐", title: "Cooling systems", desc: "Motor, inverter, and battery cooling loops. Thermal runaway prevention.", tag: "04" },
      { icon: "↯", title: "HV integration", desc: "High-voltage system wiring, contactors, TSMP, and shutdown circuits.", tag: "05" },
      { icon: "✦", title: "Dyno testing", desc: "Full powertrain validation on the dyno before the car ever sees a track.", tag: "06" },
    ],
    skills: ["Motor controls", "Battery design", "Thermal management", "HV safety", "PCB design", "Data analysis"],
    tools: [
      { name: "MATLAB/Simulink", category: "simulation" },
      { name: "SolidWorks", category: "cad" },
      { name: "Dynamometer", category: "testing" },
      { name: "Thermal camera", category: "analysis" },
      { name: "Altium Designer", category: "pcb" },
      { name: "Oscilloscope", category: "debug" },
    ],
    members: [
      { name: "Morgan Ellis", handle: "@morgan", role: "Powertrain Lead", isLead: true, img: "/powertrain.jpg",
        quote: "\"High voltage keeps you honest. You either respect the system or you don't work here.\"",
        bio: "Oversees accumulator design and HV system architecture. Three-year veteran who's built two battery packs from scratch.",
        meta: [["Major","Electrical Eng."], ["Year","Senior"], ["Joined","Fall 2022"], ["Focus","Accumulator"]] },
      { name: "River Stone", handle: "@river", role: "BMS Engineer", img: "/competition-2025-1.jpg",
        quote: "\"The BMS is the quiet hero. It never gets credit until it saves the pack.\"",
        bio: "Designs and programs the battery management system. Keeps the pack in balance and the cells happy.",
        meta: [["Major","Electrical Eng."], ["Year","Junior"], ["Joined","Fall 2023"], ["Focus","BMS"]] },
      { name: "Dakota Bell", handle: "@dakota", role: "Thermal Engineer", img: "/competition-2025-2.jpg",
        quote: "\"Heat is the enemy of performance. I fight heat for a living.\"",
        bio: "Responsible for all cooling loops — motor, inverter, and battery. Simulates and validates thermal performance.",
        meta: [["Major","Mechanical Eng."], ["Year","Junior"], ["Joined","Fall 2023"], ["Focus","Cooling"]] },
      { name: "Emery Lane", handle: "@emery", role: "HV Safety Tech", img: "/competition-2025-3.jpg",
        quote: "\"Respect the voltage. Always.\"",
        bio: "Manages HV safety protocols and shutdown system wiring. Makes sure everyone goes home with the same number of fingers.",
        meta: [["Major","Electrical Eng."], ["Year","Sophomore"], ["Joined","Fall 2024"], ["Focus","HV Safety"]] },
    ],
    ctaHeading: "Come electrify the track.",
    ctaBody: "Electrical, mechanical, or just endlessly curious about how batteries work. Applications open — no HV experience required.",
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
      { icon: "◎", title: "Suspension geometry", desc: "Roll centers, camber curves, anti-dive — the invisible geometry that defines handling.", tag: "01" },
      { icon: "≈", title: "Damper tuning", desc: "Compression and rebound maps. The shock absorber as a performance tool.", tag: "02" },
      { icon: "◐", title: "Tire analysis", desc: "Tire models, MF-Tire coefficients, lateral and longitudinal data from testing.", tag: "03" },
      { icon: "✦", title: "Steering design", desc: "Rack packaging, steering ratio, Ackermann geometry, and bump steer minimization.", tag: "04" },
      { icon: "△", title: "Data acquisition", desc: "Channel setup, lap analysis, driver coaching from logged data.", tag: "05" },
      { icon: "↯", title: "Setup optimization", desc: "Corner weights, ride heights, toe, camber — dialing in for each event.", tag: "06" },
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
      { name: "Quinn Okafor", handle: "@quinn", role: "VD Lead", isLead: true, img: "/vehicle-dynamics.jpg",
        quote: "\"The car should disappear and let the driver focus. That's a good suspension.\"",
        bio: "Owns the full suspension geometry and setup philosophy. Doubles as the team's data engineer on event days.",
        meta: [["Major","Mechanical Eng."], ["Year","Senior"], ["Joined","Fall 2022"], ["Focus","Geometry"]] },
      { name: "Sage Brennan", handle: "@sage", role: "Data Engineer", img: "/competition-2025-1.jpg",
        quote: "\"If you're not logging it, you can't improve it.\"",
        bio: "Manages data acquisition and post-processing. The person combing lap data at midnight to find a tenth.",
        meta: [["Major","Mechanical Eng."], ["Year","Junior"], ["Joined","Fall 2023"], ["Focus","Data"]] },
      { name: "Remy Hart", handle: "@remy", role: "Damper Tech", img: "/competition-2025-2.jpg",
        quote: "\"Tuning a damper is half physics, half feel. The good engineers have both.\"",
        bio: "Rebuilds and tunes all four dampers. Runs shock dyno sessions and maps out the force-velocity curves.",
        meta: [["Major","Mechanical Eng."], ["Year","Junior"], ["Joined","Fall 2023"], ["Focus","Dampers"]] },
      { name: "Arlo James", handle: "@arlo", role: "Setup Engineer", img: "/competition-2025-3.jpg",
        quote: "\"Corner weighting is where math and feel finally agree.\"",
        bio: "Handles all pre-event setup work — corner weights, alignment, ride heights. First-year making a fast impression.",
        meta: [["Major","Mechanical Eng."], ["Year","Freshman"], ["Joined","Fall 2025"], ["Focus","Setup"]] },
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
      { icon: "⊕", title: "Cockpit design", desc: "Dashboard, switch panel, visibility — the complete driver environment.", tag: "01" },
      { icon: "◈", title: "Pedal box", desc: "Adjustable pedal geometry for different driver dimensions. Feel and feedback.", tag: "02" },
      { icon: "◎", title: "Steering system", desc: "Column, wheel design, quick-release, and overall steering feel.", tag: "03" },
      { icon: "▣", title: "Seat & harness", desc: "Custom seat shells, Schroth harness routing, driver restraint.", tag: "04" },
      { icon: "△", title: "Driver analysis", desc: "Anthropometric data, reach analysis, sightlines, ingress/egress.", tag: "05" },
      { icon: "✦", title: "Prototyping", desc: "Foam mockups, 3D printed brackets, iterating until the driver smiles.", tag: "06" },
    ],
    skills: ["Human factors", "CAD design", "Ergonomic analysis", "Prototyping", "3D printing"],
    tools: [
      { name: "SolidWorks", category: "cad" },
      { name: "3D Printer", category: "prototyping" },
      { name: "Foam molding", category: "seat making" },
      { name: "Anthropometric data", category: "analysis" },
      { name: "MATLAB", category: "analysis" },
      { name: "Camera rig", category: "visibility test" },
    ],
    members: [
      { name: "Jules Mercer", handle: "@jules", role: "Ergonomics Lead", isLead: true, img: "/ergonomics.jpg",
        quote: "\"If the driver is fighting the car, the ergonomics team hasn't done their job.\"",
        bio: "Leads cockpit design and driver accommodation studies. Personal goal: zero driver complaints about reach or visibility.",
        meta: [["Major","Industrial Design"], ["Year","Senior"], ["Joined","Fall 2022"], ["Focus","Cockpit"]] },
      { name: "Wren Castillo", handle: "@wren", role: "Pedal Systems", img: "/competition-2025-2.jpg",
        quote: "\"The pedal feel is the first thing the driver notices. We make it right.\"",
        bio: "Owns pedal box design and steering column integration. Obsesses over pedal ratio and brake bias.",
        meta: [["Major","Mechanical Eng."], ["Year","Junior"], ["Joined","Fall 2023"], ["Focus","Pedals"]] },
      { name: "Ash Deluca", handle: "@ash", role: "Seat & Harness", img: "/competition-2025-3.jpg",
        quote: "\"The seat is the driver's interface with the suspension. It has to be perfect.\"",
        bio: "Custom seat fabrication and harness routing. Knows every Schroth mounting point spec by heart.",
        meta: [["Major","Mechanical Eng."], ["Year","Junior"], ["Joined","Fall 2023"], ["Focus","Seat"]] },
      { name: "Piper Walsh", handle: "@piper", role: "Prototype Tech", img: "/competition-2025-4.jpg",
        quote: "\"The foam mockup is when the sketch becomes real.\"",
        bio: "Builds physical mockups for driver fit testing. First to arrive on mockup day, last to leave.",
        meta: [["Major","Industrial Design"], ["Year","Sophomore"], ["Joined","Fall 2024"], ["Focus","Mockup"]] },
    ],
    ctaHeading: "Come design for real people.",
    ctaBody: "Industrial design, mechanical, or just someone who cares about how things feel to use. We'd love to have you.",
  },
  systems: {
    name: "Systems",
    index: 7,
    tagline: "We wire the brain of the car.",
    heroHighlight: "brain",
    lead: "Wiring harness, ECU, PCBs, sensors, data systems. We make the car smart and keep it from going dark mid-race.",
    sub: "Embedded programming and soldering iron in the same hand. We live at the intersection of hardware and software.",
    collageImgs: ["/systems.jpg", "/collab-on-car.jpg", "/competition-2025-5.jpg"],
    collageCaptions: ["harness build", "pcb milestone", "competition '25"],
    wwdCards: [
      { icon: "↯", title: "Wiring harness", desc: "Full vehicle harness design — routing, shielding, connectors, and the eternal fight against weight.", tag: "01" },
      { icon: "⚙", title: "ECU programming", desc: "Calibration tables, fault detection, CAN bus configuration.", tag: "02" },
      { icon: "▣", title: "PCB design", desc: "Custom boards for power distribution, sensor interfacing, and driver displays.", tag: "03" },
      { icon: "≈", title: "Sensor integration", desc: "Accelerometers, wheel speed, temp sensors — getting clean data to the logger.", tag: "04" },
      { icon: "◐", title: "Data acquisition", desc: "Logger configuration, channel setup, real-time telemetry.", tag: "05" },
      { icon: "✦", title: "Driver display", desc: "Dash layout design — what the driver sees at 70 mph needs to be glanceable.", tag: "06" },
    ],
    skills: ["Circuit design", "Embedded programming", "Wiring", "PCB layout", "CAN bus", "Python"],
    tools: [
      { name: "Altium Designer", category: "pcb" },
      { name: "MoTeC", category: "data" },
      { name: "Python", category: "scripting" },
      { name: "Soldering station", category: "assembly" },
      { name: "Oscilloscope", category: "debug" },
      { name: "CAN analyzer", category: "debug" },
    ],
    members: [
      { name: "Hayden Park", handle: "@hayden", role: "Systems Lead", isLead: true, img: "/systems.jpg",
        quote: "\"If it's intermittent, it's a ground. If it's constant, it's probably also a ground.\"",
        bio: "Full vehicle electrical architect. Designed the current harness topology and CAN network from scratch.",
        meta: [["Major","Electrical Eng."], ["Year","Senior"], ["Joined","Fall 2022"], ["Focus","Architecture"]] },
      { name: "Sloane Yu", handle: "@sloane", role: "PCB Engineer", img: "/competition-2025-1.jpg",
        quote: "\"A clean schematic is a beautiful thing. A clean layout is art.\"",
        bio: "Designs all custom PCBs in Altium. Current project: a new PDM board with built-in telemetry.",
        meta: [["Major","Electrical Eng."], ["Year","Junior"], ["Joined","Fall 2023"], ["Focus","PCB"]] },
      { name: "Rowan Vale", handle: "@rowan", role: "Firmware Engineer", img: "/competition-2025-2.jpg",
        quote: "\"The ECU does what you tell it. Be very specific.\"",
        bio: "Programs and calibrates the ECU. Writes the Python scripts that make sense of the logged data.",
        meta: [["Major","Computer Science"], ["Year","Junior"], ["Joined","Fall 2023"], ["Focus","Firmware"]] },
      { name: "Avery Quinn", handle: "@avery_q", role: "Wiring Tech", img: "/competition-2025-3.jpg",
        quote: "\"Good harness routing is invisible. Bad harness routing is a fire.\"",
        bio: "Builds and maintains the wiring harness. Expert at deutsch connectors and heatshrink at scale.",
        meta: [["Major","Electrical Eng."], ["Year","Sophomore"], ["Joined","Fall 2024"], ["Focus","Harness"]] },
    ],
    ctaHeading: "Come wire something important.",
    ctaBody: "Electrical, CS, or just someone who finds debugging satisfying. We'll teach you the rest.",
  },
  business: {
    name: "Business",
    index: 8,
    tagline: "We keep the lights on.",
    heroHighlight: "lights",
    lead: "Sponsorship, marketing, finances, logistics, recruitment. Without us, the engineers don't have parts to build with.",
    sub: "The team that turns relationships into resources. Equally at home in a pitch meeting or a sponsor dinner.",
    collageImgs: ["/business-group.jpg", "/collab-on-car.jpg", "/competition-2025-1.jpg"],
    collageCaptions: ["sponsor week", "presentation day", "competition '25"],
    wwdCards: [
      { icon: "◈", title: "Sponsorship", desc: "Identifying partners, building relationships, and closing deals that fund the car.", tag: "01" },
      { icon: "≈", title: "Marketing", desc: "Social media, brand identity, photography, content — making the team look as good as it is.", tag: "02" },
      { icon: "▣", title: "Budget & finance", desc: "Tracking expenditure, writing purchase orders, managing the team's annual budget.", tag: "03" },
      { icon: "✦", title: "Logistics", desc: "Competition travel, shipping, hotel blocks, schedule coordination across 8 subteams.", tag: "04" },
      { icon: "⊕", title: "Recruitment", desc: "Tabling, info sessions, outreach — filling the team with great people every fall.", tag: "05" },
      { icon: "△", title: "Business presentation", desc: "The FSAE Business Presentation event — where strategy and execution meet a panel of judges.", tag: "06" },
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
      { name: "Cleo Martin", handle: "@cleo", role: "Business Lead", isLead: true, img: "/business-group.jpg",
        quote: "\"Every part on the car was funded by a relationship someone on this team built.\"",
        bio: "Runs the sponsorship pipeline and coordinates all external partnerships. Has closed more deals than any previous lead.",
        meta: [["Major","Business Admin."], ["Year","Senior"], ["Joined","Fall 2022"], ["Focus","Sponsorship"]] },
      { name: "Theo Garcia", handle: "@theo", role: "Marketing Lead", img: "/competition-2025-2.jpg",
        quote: "\"Good content makes sponsors want to be part of the story.\"",
        bio: "Owns all social media, photography, and visual identity. Responsible for the current brand refresh.",
        meta: [["Major","Marketing"], ["Year","Junior"], ["Joined","Fall 2023"], ["Focus","Brand"]] },
      { name: "Nia Foster", handle: "@nia", role: "Finance Manager", img: "/competition-2025-3.jpg",
        quote: "\"The budget is the plan. Stick to the plan.\"",
        bio: "Tracks all purchases and manages the annual budget. Writes the financial section of the business presentation.",
        meta: [["Major","Accounting"], ["Year","Junior"], ["Joined","Fall 2023"], ["Focus","Finance"]] },
      { name: "Leo Shaw", handle: "@leo", role: "Recruitment", img: "/competition-2025-4.jpg",
        quote: "\"The team is only as good as the people we bring in next.\"",
        bio: "Coordinates fall recruitment events and the new member onboarding experience. Makes the info sessions worth attending.",
        meta: [["Major","Communications"], ["Year","Sophomore"], ["Joined","Fall 2024"], ["Focus","Recruitment"]] },
    ],
    ctaHeading: "Come build something beyond the car.",
    ctaBody: "Business, marketing, finance, communications — if you're driven and want to be part of something real, apply.",
  },
};

const teamOrder = ["aerodynamics","frame","drivetrain","powertrain","vehicle-dynamics","ergonomics","systems","business"];

function getAdjacent(slug: string) {
  const i = teamOrder.indexOf(slug);
  return {
    prev: teamOrder[i > 0 ? i - 1 : teamOrder.length - 1],
    next: teamOrder[i < teamOrder.length - 1 ? i + 1 : 0],
  };
}

/* ─── Bubble member component ─────────────────────────── */
function BubbleRoster({ members }: { members: BubbleMember[] }) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  function toggle(i: number) {
    setActiveIdx(prev => (prev === i ? null : i));
  }

  const active = activeIdx !== null ? members[activeIdx] : null;

  return (
    <div>
      {/* Bubbles row */}
      <div className="flex justify-center gap-6 sm:gap-10 flex-wrap pb-8 relative">
        <div className="absolute inset-0 rounded-2xl"
          style={{ background: "radial-gradient(ellipse at center, rgba(200,55,45,0.08), transparent 65%)", pointerEvents: "none" }} />
        {members.map((m, i) => {
          const isActive = activeIdx === i;
          return (
            <button
              key={m.name}
              onClick={() => toggle(i)}
              aria-label={m.name}
              style={{
                position: "relative",
                zIndex: 1,
                width: 180,
                height: 180,
                borderRadius: "50%",
                border: isActive
                  ? "3px solid #c8372d"
                  : "3px solid rgba(255,255,255,0.1)",
                overflow: "hidden",
                background: "#1a1a1f",
                cursor: "pointer",
                flexShrink: 0,
                boxShadow: isActive
                  ? "0 0 0 5px #c8372d, 0 0 0 9px rgba(200,55,45,0.2), 0 30px 60px rgba(0,0,0,0.6)"
                  : "0 20px 50px rgba(0,0,0,0.5)",
                transition: "transform 0.4s cubic-bezier(.2,.9,.3,1.2), border-color 0.3s, box-shadow 0.3s",
                transform: isActive ? "translateY(-8px) scale(1.08)" : undefined,
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-10px) scale(1.06)";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "#c8372d";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 0 4px rgba(200,55,45,0.2), 0 40px 80px rgba(0,0,0,0.6)";
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  (e.currentTarget as HTMLButtonElement).style.transform = "";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.1)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 20px 50px rgba(0,0,0,0.5)";
                }
              }}
            >
              {/* Photo */}
              <img
                src={m.img}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block",
                  filter: "saturate(0.85)", transition: "transform 0.5s ease, filter 0.3s ease" }}
              />
              {/* Gradient overlay on hover handled via group */}
              <div style={{
                position: "absolute", inset: 0, borderRadius: "50%",
                background: "linear-gradient(180deg, transparent 45%, rgba(0,0,0,0.75))",
                opacity: isActive ? 0 : undefined,
                transition: "opacity 0.3s",
              }} className="hover-overlay" />
              {/* Name label */}
              <div style={{
                position: "absolute", bottom: 16, left: 0, right: 0,
                textAlign: "center", pointerEvents: "none",
                opacity: isActive ? 0 : undefined,
                transition: "opacity 0.3s",
              }} className="b-label">
                <span style={{ display: "block", fontFamily: "var(--font-inter-tight), sans-serif",
                  fontWeight: 700, fontSize: 15, color: "#fff", lineHeight: 1.1 }}>{m.name}</span>
                <span style={{ display: "block", fontFamily: "var(--font-jetbrains), monospace",
                  fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ff8a7a", marginTop: 3 }}>{m.role}</span>
              </div>
              {/* Lead badge */}
              {m.isLead && (
                <div style={{
                  position: "absolute", top: 10, right: 12,
                  fontFamily: "var(--font-jetbrains), monospace", fontSize: 9, letterSpacing: "0.2em", fontWeight: 700,
                  padding: "3px 8px", background: "#e3b53d", color: "#000", borderRadius: 3,
                }}>LEAD</div>
              )}
            </button>
          );
        })}
      </div>

      {/* Expanded detail panel */}
      <AnimatePresence>
        {active && (
          <motion.div
            key={activeIdx}
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 24 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
            style={{ overflow: "hidden", maxWidth: 860, margin: "24px auto 0" }}
          >
            <div style={{
              border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20,
              background: "#0e0e10", padding: "36px 40px",
              display: "grid", gridTemplateColumns: "auto 1fr", gap: "20px 36px",
              position: "relative",
            }}>
              {/* Arrow up */}
              <div style={{
                position: "absolute", top: -8, left: "50%", transform: "translateX(-50%) rotate(45deg)",
                width: 16, height: 16, background: "#0e0e10",
                borderLeft: "1px solid rgba(255,255,255,0.1)", borderTop: "1px solid rgba(255,255,255,0.1)",
              }} />
              {/* Close */}
              <button
                onClick={() => setActiveIdx(null)}
                style={{
                  position: "absolute", top: 16, right: 16,
                  width: 32, height: 32, borderRadius: "50%",
                  border: "1px solid rgba(255,255,255,0.1)", background: "transparent",
                  color: "#9a9a9a", cursor: "pointer", fontSize: 18, lineHeight: 1,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s",
                }}
              >
                <X size={14} />
              </button>
              {/* Role eyebrow */}
              <div style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: 10,
                fontFamily: "var(--font-jetbrains), monospace", fontSize: 11, letterSpacing: "0.22em",
                color: "#ff8a7a", textTransform: "uppercase", marginBottom: -8 }}>
                <span style={{ flexShrink: 0, width: 20, height: 1, background: "#c8372d", display: "inline-block" }} />
                {active.role}
              </div>
              {/* Name col */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 200 }}>
                <h3 style={{ fontFamily: "var(--font-inter-tight), sans-serif", fontWeight: 800,
                  fontSize: 32, lineHeight: 1, margin: 0, letterSpacing: "-0.015em", color: "#ededed" }}>{active.name}</h3>
                <span style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: 13, color: "#9a9a9a" }}>{active.handle}</span>
              </div>
              {/* Body */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <p style={{ fontSize: 16, lineHeight: 1.55, color: "#ededed", margin: 0,
                  paddingLeft: 16, borderLeft: "2px solid #c8372d", fontStyle: "italic" }}>{active.quote}</p>
                <p style={{ fontSize: 14.5, lineHeight: 1.65, color: "#9a9a9a", margin: 0 }}>{active.bio}</p>
              </div>
              {/* Meta */}
              <div style={{ gridColumn: "1 / -1",
                display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px 20px",
                paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                {active.meta.map(([k, v]) => (
                  <span key={k} style={{ fontFamily: "var(--font-jetbrains), monospace",
                    fontSize: 10, letterSpacing: "0.18em", color: "#5f5f5f", textTransform: "uppercase" }}>
                    {k}<b style={{ display: "block", fontFamily: "var(--font-inter-tight), sans-serif",
                      fontWeight: 600, fontSize: 14, letterSpacing: 0, textTransform: "none",
                      color: "#ededed", marginTop: 4 }}>{v}</b>
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <p style={{ textAlign: "center", marginTop: 36,
        fontFamily: "var(--font-rajdhani), sans-serif", fontSize: 17, color: "#5f5f5f" }}>
        & more on the team —{" "}
        <span style={{ color: "#ff8a7a", textDecoration: "underline", textUnderlineOffset: 3, cursor: "pointer" }}>
          see the full roster ↗
        </span>
      </p>
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
      {/* Polaroid 1 — fans up-left */}
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
      {/* Polaroid 2 — fans right */}
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
      {/* Polaroid 3 — fans down-center */}
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
    const lenis = (window as Window & { __lenis?: { scrollTo: (t: number) => void } }).__lenis;
    if (lenis) lenis.scrollTo(0); else window.scrollTo(0, 0);
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
          HERO — Scrapbook / Zine
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
                  {String(team.index).padStart(2, "0")} / 08
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
                  href="https://docs.google.com/forms/d/e/1FAIpQLScz1sdeI-fGvj-IhghyPXXLrBP1jk_dhaq9NP0hriJ1DS57uw/viewform"
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
          WHAT WE DO — Card grid
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
              p.s. — it&apos;s 60% computer, 40% in the shop. we love both.
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
          SKILLS & TOOLS — Two-col split
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
          MEET THE TEAM — Bubble portraits
         ══════════════════════════════════════ */}
      <section style={{ padding: "100px 0 120px", borderTop: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 32px" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end",
              marginBottom: 48, flexWrap: "wrap", gap: 16 }}>
            <h2 style={{ fontFamily: "'Ethnocentric', sans-serif",
              fontSize: "clamp(40px, 5vw, 64px)", margin: 0 }}>
              Meet the team.
            </h2>
            <span style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: 11,
              letterSpacing: "0.22em", textTransform: "uppercase", color: "#9a9a9a", maxWidth: 260, textAlign: "right" }}>
              {team.members.length} featured members
            </span>
          </motion.div>

          <BubbleRoster members={team.members} />
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
                href="https://docs.google.com/forms/d/e/1FAIpQLScz1sdeI-fGvj-IhghyPXXLrBP1jk_dhaq9NP0hriJ1DS57uw/viewform"
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
          TEAM NAV — Previous / Next
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
