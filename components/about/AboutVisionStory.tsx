"use client";

import { memo, useEffect, useRef, useState } from "react";
import { visionStateLabels, visualTemplates } from "./aboutVisionVisuals";

const CARD_TRANSITION_MS = 700;
const ACTIVATION_HYSTERESIS_PX = 56;

const chapters = [
  {
    number: "01",
    tag: "FOUNDATION",
    eyebrow: "Why DSE Exists",
    heading: "Make Digital Work Easier To Trust",
    description:
      "Many businesses face unclear scope, inflated pricing, generic packages and work that creates dependency. DSE exists to offer a clearer, more direct alternative."
  },
  {
    number: "02",
    tag: "DIAGNOSIS",
    eyebrow: "Start With The Business",
    heading: "Understand The Problem Before Choosing The Tool",
    description:
      "Learn what the business sells, whom it serves, what blocks growth and which customer action matters before recommending websites, SEO, social content or automation."
  },
  {
    number: "03",
    tag: "EVIDENCE",
    eyebrow: "Replace Assumptions With Evidence",
    heading: "Let Useful Data Guide The Direction",
    description:
      "Use available customer, search, content, enquiry and operational signals to identify real patterns and improve the quality of decisions."
  },
  {
    number: "04",
    tag: "CLARITY",
    eyebrow: "Invest With Clarity",
    heading: "Test Feasibility And Make The Cost Visible",
    description:
      "Review demand, competition, delivery capability and expected investment range. Separate essentials from scaling options to build budgets around real requirements."
  },
  {
    number: "05",
    tag: "PLANNING",
    eyebrow: "Build The Future Roadmap",
    heading: ["Prepare For Roadblocks", "Before They Slow Growth."] as const,
    description:
      "Map likely roadblocks, required certifications and approvals, decision deadlines, and scheduled stakeholder meetings before launch. Build short-, medium- and long-term checkpoints so the business can move forward with fewer avoidable delays."
  },
  {
    number: "06",
    tag: "EFFICIENCY",
    eyebrow: "Remove Repetitive Work",
    heading: "Automate What Does Not Need Constant Attention",
    description:
      "Simplify or automate repeated tasks to reduce cost, delays and manual errors while retaining human review where judgement matters."
  },
  {
    number: "07",
    tag: "EXECUTION",
    eyebrow: "Connected Execution",
    heading: "Move Every Workstream Forward As One System",
    description:
      "Break the project into focused parts, coordinating research, content, design, development and lead paths in parallel where dependencies allow."
  },
  {
    number: "08",
    tag: "OWNERSHIP",
    eyebrow: "Ownership And Growth",
    heading: "Build A System The Client Can Own And Improve",
    description:
      "Deliver practical documentation, clear controls and measured indicators to help the business improve and run over time without unnecessary agency dependency."
  }
] as const;

function getCardState(step: number, activeStep: number) {
  const difference = step - activeStep;

  if (difference === 0) return "active";
  if (difference === 1) return "next-1";
  if (difference === 2) return "next-2";
  if (difference === 3) return "next-3";
  if (difference === -1) return "prev";
  if (difference < -1) return "past";
  return "future";
}

const VisionVisual = memo(function VisionVisual({ step, active = false }: { step: number; active?: boolean }) {
  const stateClass = active ? "active" : "";

  return (
    <div className={`dse-vision-story__card ${stateClass}`.trim()}>
      <div className="dse-vision-story__card-header">
        <span className="dse-vision-story__status-dot" />
        <span>{visionStateLabels[step]}</span>
      </div>
      <div
        className="dse-vision-story__canvas"
        dangerouslySetInnerHTML={{ __html: visualTemplates[step] }}
      />
    </div>
  );
});

export function AboutVisionStory() {
  const [activeStep, setActiveStep] = useState(1);
  const [exitingStep, setExitingStep] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [railInsets, setRailInsets] = useState({ start: "10%", end: "10%" });
  const chapterRefs = useRef<(HTMLElement | null)[]>([]);
  const chaptersRailRef = useRef<HTMLDivElement | null>(null);
  const currentStepRef = useRef(1);
  const transitionTimerRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const updateJourneyState = () => {
      frameRef.current = null;
      const chaptersInDom = chapterRefs.current.filter(Boolean) as HTMLElement[];
      if (!chaptersInDom.length) return;

      const viewportCenter = window.innerHeight / 2;
      const centers = chaptersInDom.map((element) => {
        const rect = element.getBoundingClientRect();
        return rect.top + rect.height / 2;
      });
      const currentIndex = currentStepRef.current - 1;
      const currentDistance = Math.abs(centers[currentIndex] - viewportCenter);
      const nearestIndex = centers.reduce(
        (bestIndex, center, index) =>
          Math.abs(center - viewportCenter) < Math.abs(centers[bestIndex] - viewportCenter)
            ? index
            : bestIndex,
        0
      );
      const nearestDistance = Math.abs(centers[nearestIndex] - viewportCenter);

      if (
        nearestIndex !== currentIndex &&
        nearestDistance + ACTIVATION_HYSTERESIS_PX < currentDistance
      ) {
        const nextStep = nearestIndex + 1;
        setExitingStep(currentStepRef.current);
        setActiveStep(nextStep);
        currentStepRef.current = nextStep;

        if (transitionTimerRef.current !== null) {
          window.clearTimeout(transitionTimerRef.current);
        }

        transitionTimerRef.current = window.setTimeout(() => setExitingStep(null), CARD_TRANSITION_MS);
      }

      const firstCenter = centers[0];
      const lastCenter = centers[centers.length - 1];
      const railRect = chaptersRailRef.current?.getBoundingClientRect();
      if (railRect) {
        const start = Math.max(0, firstCenter - railRect.top);
        const end = Math.max(0, railRect.bottom - lastCenter);
        setRailInsets((previous) => {
          const next = { start: `${start}px`, end: `${end}px` };
          return previous.start === next.start && previous.end === next.end ? previous : next;
        });
      }
      const span = Math.max(lastCenter - firstCenter, 1);
      const nextProgress = Math.max(0, Math.min(100, ((viewportCenter - firstCenter) / span) * 100));
      setProgress(nextProgress);
    };

    const scheduleJourneyUpdate = () => {
      if (frameRef.current === null) {
        frameRef.current = window.requestAnimationFrame(updateJourneyState);
      }
    };

    // Measure immediately after refs mount so restored navigation/scroll positions
    // do not briefly leave chapter one active while the timeline is elsewhere.
    updateJourneyState();
    scheduleJourneyUpdate();
    window.addEventListener("scroll", scheduleJourneyUpdate, { passive: true });
    window.addEventListener("resize", scheduleJourneyUpdate);

    return () => {
      window.removeEventListener("scroll", scheduleJourneyUpdate);
      window.removeEventListener("resize", scheduleJourneyUpdate);
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
      if (transitionTimerRef.current !== null) {
        window.clearTimeout(transitionTimerRef.current);
      }
    };
  }, []);

  return (
    <section className="dse-vision-story" aria-label="How DSE works">
      <div className="dse-vision-story__grid-overlay" aria-hidden="true" />
      <header className="container dse-vision-story__intro">
        <span className="consultancy-home-kicker">Our Operating Philosophy</span>
        <h2>How We Turn Complexity Into Practical Growth.</h2>
        <p>
          DSE was built around a simple belief: digital work should help owners make clearer
          decisions, spend with purpose and run their business with less friction.
        </p>
      </header>

      <div className="container dse-vision-story__journey">
        <div className="dse-vision-story__desktop" aria-hidden="true">
          <div className="dse-vision-story__visual-stack">
            {chapters.map((chapter, index) => {
              const step = index + 1;
              return (
                <div
                  className={`dse-vision-story__stack-position ${getCardState(step, activeStep)}`}
                  key={chapter.number}
                >
                  <VisionVisual step={step} active={step === activeStep || step === exitingStep} />
                </div>
              );
            })}
          </div>
        </div>

        <div className="dse-vision-story__chapters" ref={chaptersRailRef}>
          <div
            className="dse-vision-story__rail"
            aria-hidden="true"
            style={{ top: railInsets.start, bottom: railInsets.end }}
          >
            <span style={{ height: `${progress}%` }} />
          </div>

          {chapters.map((chapter, index) => {
            const step = index + 1;
            const isActive = step === activeStep;

            return (
              <article
                className={`dse-vision-story__chapter ${isActive ? "active" : ""}`}
                data-step={step}
                id={`dse-vision-chapter-${step}`}
                key={chapter.number}
                ref={(element) => {
                  chapterRefs.current[index] = element;
                }}
              >
                <div className="dse-vision-story__mobile" aria-hidden="true">
                  <VisionVisual step={step} active={isActive} />
                </div>
                <div className="dse-vision-story__chapter-copy">
                  <span className="dse-vision-story__number">{chapter.number}</span>
                  <span className="dse-vision-story__tag">{chapter.tag}</span>
                  <span className="dse-vision-story__eyebrow">{chapter.eyebrow}</span>
                  <h3>
                    {Array.isArray(chapter.heading)
                      ? chapter.heading.map((line) => (
                          <span className="dse-vision-story__heading-line" key={line}>
                            {line}
                          </span>
                        ))
                      : chapter.heading}
                  </h3>
                  <p>{chapter.description}</p>
                </div>
                <span className="dse-vision-story__dot" aria-hidden="true" />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
