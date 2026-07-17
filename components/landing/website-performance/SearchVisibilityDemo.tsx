import type { PerformanceDemoProps } from "../WebsitePerformanceStory";

export function SearchVisibilityDemo({ active, reducedMotion }: PerformanceDemoProps) {
  return (
    <div
      aria-hidden="true"
      className="wd-performance-demo wd-search-demo"
      data-active={active}
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
