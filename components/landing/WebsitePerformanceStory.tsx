"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import { EnquiryPipelineDemo } from "./website-performance/EnquiryPipelineDemo";
import { SearchVisibilityDemo } from "./website-performance/SearchVisibilityDemo";
import { UsabilityDemo } from "./website-performance/UsabilityDemo";

export type PerformanceDemoProps = {
  active: boolean;
  reducedMotion: boolean;
};

type PerformanceCard = {
  number: string;
  eyebrow: string;
  title: string;
  body: string;
  proof: string;
  Demo: ComponentType<PerformanceDemoProps>;
};

const cards: PerformanceCard[] = [
  {
    number: "01",
    eyebrow: "Search Visibility",
    title: "Built So Google And Local Customers Understand Your Business",
    body: "Clear service pages, location details, structured headings, and search-friendly technical foundations help the right people discover what you offer.",
    proof: "98 / 100 Google-readiness target",
    Demo: SearchVisibilityDemo
  },
  {
    number: "02",
    eyebrow: "UI And UX Readiness",
    title: "Designed To Feel Clear On Every Screen",
    body: "Mobile-first layouts, readable content, familiar navigation, and prominent actions help visitors understand the business without unnecessary friction.",
    proof: "95 / 100 usability target",
    Demo: UsabilityDemo
  },
  {
    number: "03",
    eyebrow: "Conversion Path",
    title: "Give Every Interested Customer A Clear Next Step",
    body: "Calls, WhatsApp, and enquiry forms connect attention to an organised follow-up path, making it easier for the business to respond promptly.",
    proof: "80 / 100 enquiry-path target",
    Demo: EnquiryPipelineDemo
  }
];

const STICKY_TOP = 88;

export function WebsitePerformanceStory() {
  const pinStartRef = useRef<HTMLSpanElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [horizontalMode, setHorizontalMode] = useState(false);
  const [inView, setInView] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const horizontalQuery = window.matchMedia(
      "(min-width: 1200px) and (min-height: 760px), (min-width: 1024px) and (max-width: 1199px) and (min-height: 760px) and (orientation: landscape)"
    );
    const updateReducedMotion = () => setReducedMotion(mediaQuery.matches);
    const updateHorizontalMode = () => setHorizontalMode(horizontalQuery.matches);

    updateReducedMotion();
    updateHorizontalMode();
    mediaQuery.addEventListener("change", updateReducedMotion);
    horizontalQuery.addEventListener("change", updateHorizontalMode);

    return () => {
      mediaQuery.removeEventListener("change", updateReducedMotion);
      horizontalQuery.removeEventListener("change", updateHorizontalMode);
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "20% 0px 20%" }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const pinStart = pinStartRef.current;
    const section = sectionRef.current;
    const stack = stackRef.current;
    if (!pinStart || !section || !stack) return;

    if (!inView || !horizontalMode || reducedMotion) {
      section.style.setProperty("--wd-performance-progress", "0");
      setActiveIndex(0);
      return;
    }

    let frameId = 0;

    const updateProgress = () => {
      frameId = 0;
      const sectionTop = window.scrollY + section.getBoundingClientRect().top;
      const start = window.scrollY + pinStart.getBoundingClientRect().top - STICKY_TOP;
      const paddingBottom = Number.parseFloat(window.getComputedStyle(section).paddingBottom) || 0;
      const end = sectionTop
        + section.offsetHeight
        - paddingBottom
        - stack.offsetHeight
        - STICKY_TOP;
      const distance = Math.max(end - start, 1);
      const progress = Math.min(Math.max((window.scrollY - start) / distance, 0), 1);
      const nextIndex = Math.min(2, Math.floor(progress * 3));

      section.style.setProperty("--wd-performance-progress", String(progress));
      setActiveIndex(nextIndex);
    };

    const onScroll = () => {
      if (frameId !== 0) return;
      frameId = window.requestAnimationFrame(updateProgress);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    updateProgress();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frameId !== 0) window.cancelAnimationFrame(frameId);
    };
  }, [horizontalMode, inView, reducedMotion]);

  return (
    <section
      className="section dark wd-performance-story"
      data-horizontal={horizontalMode && !reducedMotion}
      data-in-view={inView}
      id="results"
      ref={sectionRef}
    >
      <div className="container wd-performance-story-intro">
        <span className="eyebrow">Website Performance, Explained</span>
        <h2>Turn Local Searches Into Real Business Leads</h2>
        <p>A clear website helps customers discover, understand, and contact your business.</p>
      </div>
      <span aria-hidden="true" className="wd-performance-pin-start" ref={pinStartRef} />
      <div className="container wd-performance-stack" ref={stackRef}>
        <div className="wd-performance-track">
          {cards.map(({ Demo, ...card }, index) => (
            <article
              className="wd-performance-card"
              data-active={activeIndex === index}
              data-phase={index}
              key={card.number}
            >
              <div className="wd-performance-card-copy">
                <span className="wd-performance-number">{card.number}</span>
                <span className="wd-performance-eyebrow">{card.eyebrow}</span>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
                <strong className="wd-performance-proof">{card.proof}</strong>
              </div>
              <Demo active={inView && activeIndex === index} reducedMotion={reducedMotion} />
            </article>
          ))}
        </div>
        <div aria-hidden="true" className="wd-performance-progress">
          <span />
        </div>
      </div>
    </section>
  );
}
