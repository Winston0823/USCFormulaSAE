export interface EventData {
  title: string;
  date: string;
  location: string;
  description: string;
  /** Empty array = no photos yet; the carousel renders a designed placeholder card. */
  images: string[];
  tag: string;
}

export const events: EventData[] = [
  {
    title: "Fall Kickoff & Recruitment",
    date: "September 2024",
    location: "USC Campus, Los Angeles",
    tag: "RECRUITMENT",
    description:
      "We welcome new members of all majors and experience levels. Kickoff includes team introductions, subteam overviews, and hands-on demos to get everyone excited for the build season ahead.",
    images: [],
  },
  {
    title: "Spring Build Season",
    date: "January to May 2025",
    location: "USC Workshop",
    tag: "BUILD",
    description:
      "Our most intensive period. All eight subteams converge in the workshop to fabricate, assemble, and test every component of the car before competition season.",
    images: ["/collab-on-car.jpg", "/frame.jpg", "/powertrain.jpg", "/drivetrain.jpg"],
  },
  {
    title: "FSAE Electric Michigan 2025",
    date: "June 2025",
    location: "Brooklyn, Michigan",
    tag: "COMPETITION",
    description:
      "Our team competes in the Formula SAE Electric competition, designing, manufacturing, and testing a fully functioning electric race car against top university teams from around the world.",
    images: [
      "/competition-2025-1.jpg",
      "/competition-2025-2.jpg",
      "/competition-2025-3.jpg",
      "/competition-2025-4.jpg",
      "/competition-2025-5.jpg",
    ],
  },
  {
    title: "AME Awards Car Unveiling",
    date: "Spring 2024",
    location: "USC Campus, Los Angeles",
    tag: "MILESTONE",
    description:
      "A historic milestone. The first time in team history we unveiled our car at the AME Awards ceremony, showcasing months of engineering work to faculty, sponsors, and fellow students.",
    images: [],
  },
];
