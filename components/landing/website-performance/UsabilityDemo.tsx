import type { PerformanceDemoProps } from "../WebsitePerformanceStory";

const checks = ["Fast loading", "Clear content", "Easy navigation", "Visible actions"];

export function UsabilityDemo({ active, reducedMotion }: PerformanceDemoProps) {
  return (
    <div
      aria-hidden="true"
      className="wd-performance-demo wd-usability-demo"
      data-active={active}
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
