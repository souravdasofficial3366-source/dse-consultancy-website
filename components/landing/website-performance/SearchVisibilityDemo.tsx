import { useEffect, useState } from "react";
import type { PerformanceDemoProps } from "../WebsitePerformanceStory";

const PHASE_COUNT = 5;
const FINAL_PHASE = 4;
const PHASE_DURATION = 1050;

export function SearchVisibilityDemo({ active, reducedMotion }: PerformanceDemoProps) {
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
      className="wd-performance-demo wd-search-demo"
      data-active={active}
      data-phase={phase}
      data-reduced-motion={reducedMotion}
    >
      <div className="wd-demo-window">
        <div className="wd-demo-toolbar"><i /><i /><i /></div>
        <div className="wd-search-query"><span className="material-symbols-outlined">search</span><b>website developer near me</b></div>
        <div className="wd-search-result is-dse-result"><small>Sponsored-free local result</small><strong>DSE Consultancy Services</strong><span>Fast, mobile-first business websites in Kolkata</span></div>
        <div className="wd-search-preview"><span>DSE</span><strong>Build Trust. Create Enquiries.</strong><i /></div>
      </div>
    </div>
  );
}
