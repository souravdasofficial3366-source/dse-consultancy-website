"use client";

import { useEffect, useMemo, useRef } from "react";

type IndustryVideoCard = {
  title: string;
  text: string;
  video: string;
  poster: string;
};

type IndustryVideoGridProps = {
  cards: IndustryVideoCard[];
};

export function IndustryVideoGrid({ cards }: IndustryVideoGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const rows = useMemo(
    () => Array.from({ length: Math.ceil(cards.length / 3) }, (_, rowIndex) =>
      cards.slice(rowIndex * 3, rowIndex * 3 + 3)
    ),
    [cards]
  );

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const videos = Array.from(grid.querySelectorAll<HTMLVideoElement>("video"));
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const visibleVideos = new Set<HTMLVideoElement>();

    const syncPlayback = (video: HTMLVideoElement) => {
      if (visibleVideos.has(video) && !motion.matches) {
        void video.play().catch(() => undefined);
      } else {
        video.pause();
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;

          if (entry.isIntersecting) {
            visibleVideos.add(video);
          } else {
            visibleVideos.delete(video);
          }

          syncPlayback(video);
        });
      },
      { threshold: 0.15 }
    );
    const handleMotionChange = () => videos.forEach(syncPlayback);

    videos.forEach((video) => observer.observe(video));
    motion.addEventListener("change", handleMotionChange);

    return () => {
      observer.disconnect();
      motion.removeEventListener("change", handleMotionChange);
      visibleVideos.clear();
      videos.forEach(syncPlayback);
    };
  }, [cards]);

  return (
    <div className="industry-video-grid" ref={gridRef}>
      {rows.map((row, rowIndex) => (
        <div className="industry-video-row" key={`industry-row-${rowIndex}`}>
          {row.map((card) => (
            <article className="industry-video-card" key={card.title}>
              <video
                aria-hidden="true"
                loop
                muted
                playsInline
                poster={card.poster}
                preload="metadata"
                src={card.video}
              />
              <div className="industry-video-scrim" />
              <div className="industry-content">
                <h3>{card.title}</h3>
                <p>{card.text}</p>
                <a className="secondary-button" href="#lead-form">
                  View package
                  <span aria-hidden="true" className="material-symbols-outlined">
                    arrow_forward
                  </span>
                </a>
              </div>
            </article>
          ))}
        </div>
      ))}
    </div>
  );
}
