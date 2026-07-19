"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

const touchpoints = [
  ["Website", "language"],
  ["Google", "search"],
  ["Social", "favorite"],
  ["Enquiries", "call"]
] as const;

export function HeroGrowthDashboard() {
  const panelRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [routeCount, setRouteCount] = useState(0);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.28 }
    );

    observer.observe(panel);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let frame = 0;
    const startedAt = performance.now();
    const duration = 900;

    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      setRouteCount(Math.round(progress * 3));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isVisible]);

  return (
    <div
      className={`consultancy-growth-panel${isVisible ? " is-visible" : ""}`}
      ref={panelRef}
      aria-label="DSE connected growth dashboard"
    >
      <span className="consultancy-growth-glow glow-one" />
      <span className="consultancy-growth-glow glow-two" />

      <article className="consultancy-progress-card">
        <div className="consultancy-progress-copy">
          <span>Connected Growth System</span>
          <strong>Every Touchpoint Working Together</strong>
        </div>
        <div className="consultancy-progress-ring" aria-label="Four of four customer touchpoints connected">
          <svg viewBox="0 0 120 120" aria-hidden="true">
            <circle className="ring-track" cx="60" cy="60" r="50" />
            <circle className="ring-value" cx="60" cy="60" r="50" />
          </svg>
          <span><b>4/4</b><small>Connected</small></span>
        </div>
      </article>

      <article className="consultancy-google-card">
        <div className="consultancy-google-card-top">
          <span className="consultancy-google-g" aria-hidden="true">G</span>
          <span className="consultancy-live-label"><i /> Live Workflow</span>
        </div>
        <span>Google Business Profile (GMB)</span>
        <strong>Get Verified Customer Calls Through Google</strong>
        <div className="consultancy-rating-stars" aria-label="Google Business Profile call workflow ready">
          <span aria-hidden="true">★★★★★</span>
          <small>Call-ready</small>
        </div>
      </article>

      <article className="consultancy-channel-card">
        <div className="consultancy-channel-head">
          <span>Customer Journey</span>
          <small>Connected</small>
        </div>
        <div className="consultancy-channel-list">
          {touchpoints.map(([label, icon], index) => (
            <span className="consultancy-channel-step" key={label} style={{ "--step-delay": `${index * 150}ms` } as CSSProperties}>
              <i className="material-symbols-outlined">{icon}</i>
              <b>{label}</b>
              <em><i /></em>
            </span>
          ))}
        </div>
      </article>

      <article className="consultancy-route-card">
        <span className="material-symbols-outlined" aria-hidden="true">north_east</span>
        <div>
          <strong>{routeCount}</strong>
          <span>Enquiry Routes</span>
          <small>Call · WhatsApp · Form</small>
        </div>
      </article>
    </div>
  );
}
