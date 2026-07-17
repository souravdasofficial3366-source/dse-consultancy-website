import type { PerformanceDemoProps } from "../WebsitePerformanceStory";

const stages = ["New enquiry", "Contacted", "Follow-up ready"];

export function EnquiryPipelineDemo({ active, reducedMotion }: PerformanceDemoProps) {
  return (
    <div
      aria-hidden="true"
      className="wd-performance-demo wd-enquiry-demo"
      data-active={active}
      data-reduced-motion={reducedMotion}
    >
      <div className="wd-enquiry-message"><strong>New website enquiry</strong><span>Rahul, local business owner</span></div>
      <div className="wd-enquiry-contact"><span className="material-symbols-outlined">person</span><b>Rahul S.</b><small>Requested a callback</small></div>
      <ol className="wd-enquiry-pipeline">
        {stages.map((stage, index) => <li key={stage}><b>{index + 1}</b>{stage}</li>)}
      </ol>
      <div className="wd-enquiry-counters"><span><b>12</b>Calls</span><span><b>18</b>WhatsApp</span><span><b>8</b>Forms</span></div>
    </div>
  );
}
