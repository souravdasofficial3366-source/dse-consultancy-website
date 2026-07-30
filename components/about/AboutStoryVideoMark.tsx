"use client";

import { useEffect, useRef } from "react";

const panels = [
  {
    letter: "D",
    label: "D — Discovery",
    video: "/videos/connected_discovery_navigation.mp4"
  },
  {
    letter: "S",
    label: "S — Strategy",
    video: "/videos/connected_trust_seminar_audience.mp4"
  },
  {
    letter: "E",
    label: "E — Execution",
    video: "/videos/connected_action_meeting.mp4"
  }
] as const;

export function AboutStoryVideoMark() {
  const markRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mark = markRef.current;
    if (!mark) return;

    const videos = Array.from(mark.querySelectorAll<HTMLVideoElement>("video"));
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;

    const syncPlayback = () => {
      videos.forEach((video) => {
        if (visible && !motion.matches) {
          void video.play().catch(() => undefined);
        } else {
          video.pause();
        }
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        syncPlayback();
      },
      { threshold: 0.2 }
    );
    const handleMotionChange = () => syncPlayback();

    observer.observe(mark);
    motion.addEventListener("change", handleMotionChange);

    return () => {
      observer.disconnect();
      motion.removeEventListener("change", handleMotionChange);
      visible = false;
      syncPlayback();
    };
  }, []);

  return (
    <div
      aria-label="DSE digital growth approach"
      className="dse-about-story-mark dse-about-story-video-mark"
      ref={markRef}
      role="group"
    >
      {panels.map((panel) => (
        <span
          aria-label={panel.label}
          className="dse-about-story-video-panel"
          key={panel.letter}
          role="img"
          tabIndex={0}
        >
          <video
            aria-hidden="true"
            loop
            muted
            playsInline
            preload="metadata"
            src={panel.video}
          />
          <span aria-hidden="true" className="dse-about-story-video-scrim" />
          <strong aria-hidden="true">{panel.letter}</strong>
        </span>
      ))}
    </div>
  );
}
