"use client";

import { useEffect, useRef, useState } from "react";

type CounterStat = {
  readonly value: number;
  readonly suffix: string;
  readonly label: string;
};

type CounterStatsProps = {
  stats: readonly CounterStat[];
};

const counterDurationMs = 5200;
const counterHoldMs = 900;
const counterStaggerMs = 420;

function easeOutCubic(progress: number) {
  return 1 - Math.pow(1 - progress, 3);
}

function formatCounterValue(value: number, target: number) {
  if (target < 10) return value.toFixed(2);
  return Math.round(value).toLocaleString("en-IN");
}

function CounterStatItem({
  index,
  isActive,
  stat,
}: {
  readonly index: number;
  readonly isActive: boolean;
  readonly stat: CounterStat;
}) {
  const animationFrameRef = useRef(0);
  const cycleStartedAtRef = useRef(0);
  const [displayValue, setDisplayValue] = useState(stat.value);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    cancelAnimationFrame(animationFrameRef.current);

    if (
      !isActive ||
      isPaused ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setDisplayValue(stat.value);
      return;
    }

    const cycleMs = counterDurationMs + counterHoldMs;
    cycleStartedAtRef.current =
      performance.now() - ((index * counterStaggerMs) % cycleMs);

    function updateCounter(now: number) {
      const elapsed = (now - cycleStartedAtRef.current) % cycleMs;

      if (elapsed > counterDurationMs) {
        setDisplayValue(stat.value);
      } else {
        const progress = Math.min(elapsed / counterDurationMs, 1);
        const easedProgress = easeOutCubic(progress);
        const nextValue = stat.value * easedProgress;
        setDisplayValue(stat.value < 10 ? Math.round(nextValue * 100) / 100 : Math.round(nextValue));
      }

      animationFrameRef.current = requestAnimationFrame(updateCounter);
    }

    animationFrameRef.current = requestAnimationFrame(updateCounter);

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [index, isActive, isPaused, stat.value]);

  function pauseCounter() {
    setIsPaused(true);
    setDisplayValue(stat.value);
  }

  function resumeCounter() {
    setIsPaused(false);
  }

  return (
    <div
      className="social-proof-counter"
      onBlur={resumeCounter}
      onFocus={pauseCounter}
      onMouseEnter={pauseCounter}
      onMouseLeave={resumeCounter}
      tabIndex={0}
    >
      <strong aria-label={`${stat.value}${stat.suffix} ${stat.label}`}>
        {formatCounterValue(displayValue, stat.value)}
        {stat.suffix}
      </strong>
      <span>{stat.label}</span>
    </div>
  );
}

export function CounterStats({ stats }: CounterStatsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="container social-proof-wrap" ref={containerRef}>
      <div className="social-proof-grid">
        <p>Businesses That Stay Invisible Online Miss India&apos;s Search and Social Audience.</p>
        {stats.map((stat, index) => (
          <CounterStatItem
            index={index}
            isActive={isActive}
            key={stat.label}
            stat={stat}
          />
        ))}
      </div>
      <p className="social-proof-source">
        Latest published figures from <a href="https://datareportal.com/reports/digital-2026-india" rel="noreferrer" target="_blank">Digital 2026: India</a>, reflecting October 2025 data. Platform figures are advertising audiences or user identities, not live user counts.
      </p>
    </div>
  );
}
