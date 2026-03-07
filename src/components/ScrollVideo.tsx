"use client";

import { useRef, useEffect } from "react";
import { MotionValue, useMotionValueEvent } from "framer-motion";

interface Props {
  progress: MotionValue<number>;
}

export default function ScrollVideo({ progress }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
  }, []);

  useMotionValueEvent(progress, "change", (v) => {
    const video = videoRef.current;
    if (!video || !video.duration || isNaN(video.duration)) return;
    video.currentTime = v * video.duration;
  });

  return (
    <div className="fixed inset-0" style={{ zIndex: 5 }}>
      <video
        ref={videoRef}
        src="/TrackVideo.mp4"
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ willChange: "transform" }}
      />
      <div className="absolute inset-0 bg-black/60" />
    </div>
  );
}
