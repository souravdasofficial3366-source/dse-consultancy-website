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

export function WebsitePerformanceStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [inView, setInView] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateReducedMotion = () => setReducedMotion(mediaQuery.matches);

    updateReducedMotion();
    mediaQuery.addEventListener("change", updateReducedMotion);

    return () => mediaQuery.removeEventListener("change", updateReducedMotion);
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
    const visibleCards = new Set<number>();
    const cardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = cardRefs.current.indexOf(entry.target as HTMLElement);
          if (index === -1) return;

          if (entry.isIntersecting) {
            visibleCards.add(index);
          } else {
            visibleCards.delete(index);
          }
        });

        const viewportCenter = window.innerHeight / 2;
        const closestIndex = [...visibleCards]
          .map((index) => {
            const card = cardRefs.current[index];
            if (!card) return null;

            const { top, height } = card.getBoundingClientRect();
            return { index, distance: Math.abs(top + height / 2 - viewportCenter) };
          })
          .filter((card): card is { index: number; distance: number } => card !== null)
          .sort((first, second) => first.distance - second.distance)[0]?.index;

        if (closestIndex !== undefined) setActiveIndex(closestIndex);
      },
      { threshold: [0.35, 0.55, 0.75] }
    );

    cardRefs.current.forEach((card) => {
      if (card) cardObserver.observe(card);
    });

    return () => cardObserver.disconnect();
  }, []);

  return (
    <section className="section dark wd-performance-story" id="results" ref={sectionRef}>
      <div className="container wd-performance-story-intro">
        <span className="eyebrow">Website Performance, Explained</span>
        <h2>Turn Local Searches Into Real Business Leads</h2>
        <p>A clear website helps customers discover, understand, and contact your business.</p>
      </div>
      <div className="container wd-performance-stack">
        {cards.map(({ Demo, ...card }, index) => (
          <article
            className="wd-performance-card"
            data-active={activeIndex === index}
            data-phase={index}
            key={card.number}
            ref={(cardElement) => { cardRefs.current[index] = cardElement; }}
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
    </section>
  );
}
