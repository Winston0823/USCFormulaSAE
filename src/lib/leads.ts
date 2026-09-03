// 2026 team leads roster.
//
// Note: the subteam pages in src/app/teams/[slug]/page.tsx already carry most
// of these people as `isLead: true` members, so the names are duplicated here.
// Deriving one from the other would mean restructuring that file, and it still
// would not cover the team-wide roles or the emails, so the two lists are kept
// separate for now. If a name changes, change it in both places.

export interface Lead {
  /** Full legal name, e.g. "Kenjiro Otake". */
  name: string;
  /** Preferred name, only when it differs from the first name. */
  preferred?: string;
  email: string;
  /** Qualifier shown after the name, e.g. "Fall" / "Spring". */
  term?: string;
  /** Square headshot in /public/leads. Falls back to initials when absent. */
  photo?: string;
}

export interface LeadGroup {
  /** Role title, e.g. "Aerodynamics Co-Leads". */
  role: string;
  people: Lead[];
  /** Subteam route slug. Omitted for team-wide roles. */
  slug?: string;
  /** Extra context shown under the role title. */
  note?: string;
}

/** Team-wide roles. These sit above the subteams and have no slug of their own. */
export const leadership: LeadGroup[] = [
  {
    role: "Chief Engineer",
    people: [{ name: "Kenjiro Otake", preferred: "Kenji", email: "kenjiroo@usc.edu", photo: "/leads/kenjiro-otake.webp" }],
  },
  {
    role: "Project Manager",
    people: [{ name: "Manuela Londono", email: "mlondono@usc.edu", photo: "/leads/manuela-londono.webp" }],
  },
];

/** Subteam leads, in the order they are presented on the leads page. */
export const subteamLeads: LeadGroup[] = [
  {
    role: "Business Lead",
    slug: "business",
    people: [{ name: "Marissa Jing", email: "jingmari@usc.edu", photo: "/leads/marissa-jing.webp" }],
  },
  {
    role: "Ergonomics Lead",
    slug: "ergonomics",
    people: [{ name: "Katarina Aryawan", preferred: "Kayla", email: "aryawan@usc.edu", photo: "/leads/katarina-aryawan.webp" }],
  },
  {
    role: "Drivetrain Lead",
    slug: "drivetrain",
    people: [{ name: "Warren Dao", email: "wdao@usc.edu", photo: "/leads/warren-dao.webp" }],
  },
  {
    role: "Frame Lead",
    slug: "frame",
    people: [{ name: "Samantha Barrera", preferred: "Sam", email: "srbarrer@usc.edu", photo: "/leads/samantha-barrera.webp" }],
  },
  {
    role: "Vehicle Dynamics Lead",
    slug: "vehicle-dynamics",
    people: [{ name: "Javier de la Torre", preferred: "Javi", email: "javiered@usc.edu", photo: "/leads/javier-de-la-torre.webp" }],
  },
  {
    role: "Aerodynamics Co-Leads",
    slug: "aerodynamics",
    people: [
      { name: "Juan Morales-Lopez", email: "juandmor@usc.edu", photo: "/leads/juan-morales-lopez.webp", term: "Fall" },
      { name: "Zane Zacharia", email: "zzachari@usc.edu", photo: "/leads/zane-zacharia.webp", term: "Spring" },
    ],
  },
  {
    role: "Systems-Electrical Co-Leads",
    slug: "electrical",
    people: [
      { name: "Nick Costanzo", email: "ncostanz@usc.edu", photo: "/leads/nick-costanzo.webp" },
      { name: "Armando Solis Jr.", email: "solisarm@usc.edu", photo: "/leads/armando-solis.webp" },
      { name: "Tianze Li", preferred: "Tim Li", email: "tianze@usc.edu", photo: "/leads/tianze-li.webp" },
    ],
  },
  {
    role: "Systems-Comms Co-Leads",
    slug: "communications",
    people: [
      { name: "Tim Hutapea", email: "thutapea@usc.edu", photo: "/leads/tim-hutapea.webp" },
      { name: "Andy Zhang", email: "andyz@usc.edu", photo: "/leads/andy-zhang.webp" },
    ],
  },
  {
    role: "Powertrain Co-Leads",
    slug: "powertrain",
    note: "Under Kenji's direct supervision",
    people: [
      { name: "Shreya Nair", email: "shreyana@usc.edu", photo: "/leads/shreya-nair.webp" },
      { name: "Brenton Hong", email: "brenton@usc.edu", photo: "/leads/brenton-hong.webp" },
      { name: "Brady Stark", email: "bsstark@usc.edu", photo: "/leads/brady-stark.webp" },
    ],
  },
];

/** "Katarina \"Kayla\" Aryawan", or just the name when they match. */
export function displayName(lead: Lead): string {
  return lead.preferred ? `${lead.name.split(" ")[0]} "${lead.preferred}" ${lead.name.split(" ").slice(1).join(" ")}` : lead.name;
}

/** Initials for the medallion that stands in for a portrait. */
export function initials(lead: Lead): string {
  // Drop generational suffixes and any token with no letters, so "Armando
  // Solis Jr." gives AS rather than picking up the leftover ".".
  const parts = lead.name
    .split(/\s+/)
    .filter((t) => !/^(jr|sr|ii|iii|iv)\.?$/i.test(t))
    .filter((t) => /\p{L}/u.test(t));
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}
