"use client";

import { useRef } from "react";
import { landingNavigation } from "@/data/site";

export function MobileNavigation() {
  const menuRef = useRef<HTMLDetailsElement>(null);

  function closeMenu() {
    menuRef.current?.removeAttribute("open");
  }

  return (
    <details className="mobile-menu" ref={menuRef}>
      <summary aria-label="Open landing page navigation">
        <span aria-hidden="true" className="material-symbols-outlined">menu</span>
      </summary>
      <nav aria-label="Mobile landing page navigation" className="mobile-menu-panel">
        {landingNavigation.map((item) => (
          <a href={item.href} key={item.href} onClick={closeMenu}>
            {item.label}
          </a>
        ))}
        <a className="mobile-menu-cta" href="/#lead-form" onClick={closeMenu}>
          Get Started
        </a>
      </nav>
    </details>
  );
}
