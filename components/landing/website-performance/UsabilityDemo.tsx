import { useEffect, useState } from "react";
import type { PerformanceDemoProps } from "../WebsitePerformanceStory";

const checks = ["Mobile responsive", "Clear navigation", "Readable content", "Visible contact action"];
const PHASE_COUNT = 7;
const FINAL_PHASE = 6;
const PHASE_DURATION = 900;
const COMPACT_PHASE_DURATION = 600;

export function UsabilityDemo({ active, compact = false, reducedMotion }: PerformanceDemoProps) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const canAnimate = active && !reducedMotion;
    if (!canAnimate) {
      setPhase(reducedMotion ? FINAL_PHASE : 0);
      return;
    }

    setPhase(0);
    const phaseDuration = compact ? COMPACT_PHASE_DURATION : PHASE_DURATION;
    const interval = window.setInterval(
      () => setPhase((current) => (current + 1) % PHASE_COUNT),
      phaseDuration
    );

    return () => window.clearInterval(interval);
  }, [active, compact, reducedMotion]);

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
        <span className="wd-usability-cursor material-symbols-outlined">arrow_selector_tool</span>
      </div>
      <ul className="wd-usability-checks">
        {checks.map((check) => <li key={check}><span className="material-symbols-outlined">check_circle</span>{check}</li>)}
      </ul>
      <div className="wd-usability-completion"><i><span /></i><b>Experience check complete</b></div>
    </div>
  );
}
