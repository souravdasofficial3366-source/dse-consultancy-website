"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import { EnquiryPipelineDemo } from "./website-performance/EnquiryPipelineDemo";
import { SearchVisibilityDemo } from "./website-performance/SearchVisibilityDemo";
import { UsabilityDemo } from "./website-performance/UsabilityDemo";

export type PerformanceDemoProps = {
  active: boolean;
  compact?: boolean;
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
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [finePointer, setFinePointer] = useState(false);
  const [horizontalMode, setHorizontalMode] = useState(false);
  const [inView, setInView] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const horizontalQuery = window.matchMedia(
      "(min-width: 1200px) and (min-height: 760px), (min-width: 1024px) and (max-width: 1199px) and (min-height: 760px) and (orientation: landscape)"
    );
    const pointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const updateFinePointer = () => setFinePointer(pointerQuery.matches);
    const updateReducedMotion = () => setReducedMotion(mediaQuery.matches);
    const updateHorizontalMode = () => setHorizontalMode(horizontalQuery.matches);

    updateFinePointer();
    updateReducedMotion();
    updateHorizontalMode();
    pointerQuery.addEventListener("change", updateFinePointer);
    mediaQuery.addEventListener("change", updateReducedMotion);
    horizontalQuery.addEventListener("change", updateHorizontalMode);

    return () => {
      pointerQuery.removeEventListener("change", updateFinePointer);
      mediaQuery.removeEventListener("change", updateReducedMotion);
      horizontalQuery.removeEventListener("change", updateHorizontalMode);
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(([entry]) => {
      const isIntersecting = entry.isIntersecting;
      setInView(isIntersecting);
      if (!isIntersecting) setActiveIndex(null);
    }, { rootMargin: "20% 0px 20%" });

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (horizontalMode || reducedMotion || !inView) return;

    const cardElements = cardRefs.current.filter(
      (card): card is HTMLElement => card !== null
    );
    if (cardElements.length === 0) return;

    const selectCenteredCard = () => {
      const centre = window.innerHeight / 2;
      const nextIndex = cardElements.findIndex((card) => {
        const { top, bottom } = card.getBoundingClientRect();
        return top <= centre && bottom >= centre;
      });

      setActiveIndex(nextIndex === -1 ? null : nextIndex);
    };

    const observer = new IntersectionObserver(selectCenteredCard, {
      rootMargin: "-45% 0px -45% 0px"
    });
    let frameId = 0;

    const onVerticalScroll = () => {
      if (frameId !== 0) return;
      frameId = window.requestAnimationFrame(() => {
        frameId = 0;
        selectCenteredCard();
      });
    };

    cardElements.forEach((card) => observer.observe(card));
    window.addEventListener("scroll", onVerticalScroll, { passive: true });
    selectCenteredCard();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onVerticalScroll);
      if (frameId !== 0) window.cancelAnimationFrame(frameId);
    };
  }, [horizontalMode, inView, reducedMotion]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const demoElements = Array.from(
      section.querySelectorAll<HTMLElement>(".wd-performance-demo")
    );
    const resetParallax = (demo: HTMLElement) => {
      demo.style.removeProperty("--wd-demo-x");
      demo.style.removeProperty("--wd-demo-y");
      demo.style.removeProperty("--wd-demo-rotate-x");
      demo.style.removeProperty("--wd-demo-rotate-y");
    };

    if (!(horizontalMode && inView && finePointer && !reducedMotion)) {
      demoElements.forEach(resetParallax);
      return;
    }

    let frameId = 0;
    let pending: { demo: HTMLElement; x: number; y: number } | null = null;

    const applyParallax = () => {
      frameId = 0;
      if (!pending) return;

      const { demo, x, y } = pending;
      pending = null;
      demo.style.setProperty("--wd-demo-x", `${x * 8}px`);
      demo.style.setProperty("--wd-demo-y", `${y * 6}px`);
      demo.style.setProperty("--wd-demo-rotate-x", `${y * -2}deg`);
      demo.style.setProperty("--wd-demo-rotate-y", `${x * 2.5}deg`);
    };

    const onPointerMove = (event: PointerEvent) => {
      const demo = event.currentTarget as HTMLElement;
      const bounds = demo.getBoundingClientRect();
      const x = Math.min(Math.max(((event.clientX - bounds.left) / bounds.width) * 2 - 1, -1), 1);
      const y = Math.min(Math.max(((event.clientY - bounds.top) / bounds.height) * 2 - 1, -1), 1);
      pending = { demo, x, y };
      if (frameId === 0) frameId = window.requestAnimationFrame(applyParallax);
    };

    const onPointerLeave = (event: PointerEvent) => {
      const demo = event.currentTarget as HTMLElement;
      if (pending?.demo === demo) pending = null;
      resetParallax(demo);
    };

    demoElements.forEach((demo) => {
      demo.addEventListener("pointermove", onPointerMove);
      demo.addEventListener("pointerleave", onPointerLeave);
    });

    return () => {
      if (frameId !== 0) window.cancelAnimationFrame(frameId);
      pending = null;
      demoElements.forEach((demo) => {
        demo.removeEventListener("pointermove", onPointerMove);
        demo.removeEventListener("pointerleave", onPointerLeave);
        resetParallax(demo);
      });
    };
  }, [finePointer, horizontalMode, inView, reducedMotion]);

  useEffect(() => {
    const pinStart = pinStartRef.current;
    const section = sectionRef.current;
    const stack = stackRef.current;
    if (!pinStart || !section || !stack) return;

    if (!horizontalMode || reducedMotion) {
      section.style.setProperty("--wd-performance-progress", "0");
      if (reducedMotion) setActiveIndex(null);
      return;
    }

    if (!inView) {
      section.style.setProperty("--wd-performance-progress", "0");
      setActiveIndex(null);
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
          {cards.map(({ Demo, ...card }, index) => {
            const active = inView && activeIndex === index;

            return (
              <article
                className="wd-performance-card"
                data-active={active}
                data-phase={index}
                key={card.number}
                ref={(cardElement) => {
                  cardRefs.current[index] = cardElement;
                }}
              >
                <div className="wd-performance-card-copy">
                  <span className="wd-performance-number">{card.number}</span>
                  <span className="wd-performance-eyebrow">{card.eyebrow}</span>
                  <h3>{card.title}</h3>
                  <p>{card.body}</p>
                  <strong className="wd-performance-proof">{card.proof}</strong>
                </div>
                <Demo active={active} compact={!horizontalMode} reducedMotion={reducedMotion} />
              </article>
            );
          })}
        </div>
        <div aria-hidden="true" className="wd-performance-progress">
          <span />
        </div>
      </div>
    </section>
  );
}
