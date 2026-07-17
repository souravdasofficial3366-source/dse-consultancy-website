import { useEffect, useState } from "react";
import type { PerformanceDemoProps } from "../WebsitePerformanceStory";

const checks = ["Fast loading", "Clear content", "Easy navigation", "Visible actions"];
const PHASE_COUNT = 6;
const FINAL_PHASE = 5;
const PHASE_DURATION = 900;

export function UsabilityDemo({ active, reducedMotion }: PerformanceDemoProps) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const canAnimate = active && !reducedMotion;
    if (!canAnimate) {
      setPhase(reducedMotion ? FINAL_PHASE : 0);
      return;
    }

    setPhase(0);
    const interval = window.setInterval(
      () => setPhase((current) => (current + 1) % PHASE_COUNT),
      PHASE_DURATION
    );

    return () => window.clearInterval(interval);
  }, [active, reducedMotion]);

  return (
    <div
      aria-hidden="true"
      className="wd-performance-demo wd-usability-demo"
      data-active={active}
      data-phase={phase}
      data-reduced-motion={reducedMotion}
    >
      <div className="wd-usability-frames">
        <div className="wd-usability-frame wd-usability-desktop"><i /><b>Clear service details</b><span>Call now</span></div>
        <div className="wd-usability-frame wd-usability-mobile"><i /><b>Simple on mobile</b><span>WhatsApp</span></div>
      </div>
      <ul className="wd-usability-checks">
        {checks.map((check) => <li key={check}><span className="material-symbols-outlined">check_circle</span>{check}</li>)}
      </ul>
    </div>
  );
}
