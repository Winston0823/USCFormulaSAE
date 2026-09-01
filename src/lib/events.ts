export type EventMedia =
  | { type: "image"; src: string; alt: string }
  | { type: "video"; src: string; poster?: string; alt: string };

export interface EventData {
  title: string;
  date: string;
  location: string;
  description: string;
  /** Every event ships with one image or video - we don't list events without media. */
  media: EventMedia;
  tag: string;
}

export const events: EventData[] = [
  {
    title: "FSAE Electric Michigan 2026",
    date: "June 2026",
    location: "Brooklyn, Michigan",
    tag: "COMPETITION",
    description:
      "Our team competes in the Formula SAE Electric competition, designing, manufacturing, and testing a fully functioning electric race car against top university teams from around the world.",
    media: {
      type: "video",
      src: "/michigan-2026.mp4",
      poster: "/michigan-2026-poster.jpg",
      alt: "USC Formula Electric's car on track at FSAE Electric Michigan 2026",
    },
  },
];
