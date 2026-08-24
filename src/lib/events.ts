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
];
