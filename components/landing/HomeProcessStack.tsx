"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef } from "react";

export type HomeProcessStep = {
  number: string;
  title: string;
  description: string;
  video: string;
  poster: string;
  tags: readonly [string, string, string];
};

type HomeProcessStackProps = {
  steps: readonly HomeProcessStep[];
};

type ProcessCardStyle = CSSProperties & {
  "--process-index": number;
  "--process-offset": string;
  "--process-tablet-offset": string;
};

export function HomeProcessStack({ steps }: HomeProcessStackProps) {
  const stackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stack = stackRef.current;
    if (!stack) return;

    const videos = Array.from(stack.querySelectorAll<HTMLVideoElement>("video"));
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

          if (entry.isIntersecting) visibleVideos.add(video);
          else visibleVideos.delete(video);

          syncPlayback(video);
        });
      },
      { rootMargin: "18% 0px 18% 0px", threshold: 0.18 }
    );

    const handleMotionChange = () => videos.forEach(syncPlayback);

    videos.forEach((video) => observer.observe(video));
    motion.addEventListener("change", handleMotionChange);

    return () => {
      observer.disconnect();
      motion.removeEventListener("change", handleMotionChange);
      visibleVideos.clear();
      videos.forEach((video) => video.pause());
    };
  }, [steps]);

  return (
    <div className="consultancy-process-stack" ref={stackRef}>
      {steps.map((step, index) => {
        const style: ProcessCardStyle = {
          "--process-index": index,
          "--process-offset": `${index * 48}px`,
          "--process-tablet-offset": `${index * 36}px`
        };

        return (
          <article className="consultancy-process-stack-card" key={step.number} style={style}>
            <video
              aria-hidden="true"
              loop
              muted
              playsInline
              poster={step.poster}
              preload="metadata"
              src={step.video}
            />
            <span aria-hidden="true" className="consultancy-process-stack-scrim" />
            <div className="consultancy-process-stack-inner">
              <header className="consultancy-process-stack-header">
                <span>{step.number}</span>
                <h3>{step.title}</h3>
              </header>
              <div className="consultancy-process-stack-content">
                <p>{step.description}</p>
                <ul aria-label={`${step.title} outcomes`}>
                  {step.tags.map((tag) => <li key={tag}>{tag}</li>)}
                </ul>
                <span aria-hidden="true" className="consultancy-process-stack-progress">
                  <b>{step.number}</b>
                  <small>of 04</small>
                </span>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
