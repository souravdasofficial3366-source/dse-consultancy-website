"use client";

import { useRef } from "react";
import { usePathname } from "next/navigation";
import { getMobileCtaForPathname } from "@/components/layout/HeaderNavigation";
import { siteNavigation } from "@/data/site";

export function MobileNavigation() {
  const menuRef = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();
  const cta = getMobileCtaForPathname(pathname);

  function closeMenu() {
    menuRef.current?.removeAttribute("open");
  }

  return (
    <details className="mobile-menu" ref={menuRef}>
      <summary aria-label="Open landing page navigation">
        <span aria-hidden="true" className="material-symbols-outlined">menu</span>
      </summary>
      <nav aria-label="Mobile landing page navigation" className="mobile-menu-panel">
        {siteNavigation
          .filter((item) => item.href !== "/")
          .map((item) => (
            <a href={item.href} key={item.href} onClick={closeMenu}>
              {item.label}
            </a>
          ))}
        <a className="mobile-menu-cta" href={cta.href} onClick={closeMenu}>
          {cta.label}
        </a>
      </nav>
    </details>
  );
}
