"use client";

import { useEffect, useRef } from "react";

const INTERACTIVE_SELECTOR =
  ".consultancy-home-actions a, button, input, select, textarea, [role='button']";

export function CursorExploreCta() {
  const ctaRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const cta = ctaRef.current;
    const hero = cta?.closest<HTMLElement>(".consultancy-home-hero");

    if (!cta || !hero) return;

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const returnToRest = () => {
      cta.removeAttribute("data-tracking");
      hero.removeAttribute("data-explore-tracking");
      cta.style.removeProperty("left");
      cta.style.removeProperty("top");
    };

    const followPointer = (event: PointerEvent) => {
      if (!finePointer.matches || reducedMotion.matches) return;

      const target = event.target as Element | null;
      if (target?.closest(INTERACTIVE_SELECTOR) && !target.closest(".consultancy-cursor-cta")) {
        returnToRest();
        return;
      }

      if (target?.closest(".consultancy-cursor-cta")) return;

      const bounds = hero.getBoundingClientRect();
      const radius = 62;
      const x = Math.min(Math.max(event.clientX - bounds.left, radius), bounds.width - radius);
      const y = Math.min(Math.max(event.clientY - bounds.top, radius), bounds.height - radius);

      cta.dataset.tracking = "true";
      hero.dataset.exploreTracking = "true";
      cta.style.left = `${x}px`;
      cta.style.top = `${y}px`;
    };

    const followClick = (event: MouseEvent) => {
      if (!finePointer.matches || reducedMotion.matches || !cta.dataset.tracking) return;

      const target = event.target as Element | null;
      if (target?.closest(INTERACTIVE_SELECTOR)) return;

      event.preventDefault();
      document.querySelector("#services")?.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.pushState(null, "", "#services");
      returnToRest();
    };

    hero.addEventListener("pointermove", followPointer);
    hero.addEventListener("pointerleave", returnToRest);
    hero.addEventListener("click", followClick);
    finePointer.addEventListener("change", returnToRest);
    reducedMotion.addEventListener("change", returnToRest);

    return () => {
      hero.removeEventListener("pointermove", followPointer);
      hero.removeEventListener("pointerleave", returnToRest);
      hero.removeEventListener("click", followClick);
      finePointer.removeEventListener("change", returnToRest);
      reducedMotion.removeEventListener("change", returnToRest);
    };
  }, []);

  return (
    <a
      aria-label="Scroll to explore DSE Consultancy services"
      className="consultancy-cursor-cta"
      href="#services"
      ref={ctaRef}
    >
      <span className="consultancy-cursor-cta-motion">
        <svg aria-hidden="true" className="consultancy-cursor-cta-ring" viewBox="0 0 120 120">
          <defs>
            <path
              d="M 60,60 m -43,0 a 43,43 0 1,1 86,0 a 43,43 0 1,1 -86,0"
              id="dse-explore-circle"
            />
          </defs>
          <text>
            <textPath href="#dse-explore-circle" startOffset="2%">
              Scroll To Explore • Scroll To Explore •
            </textPath>
          </text>
        </svg>
        <span className="consultancy-cursor-cta-core" aria-hidden="true">↘</span>
      </span>
    </a>
  );
}
