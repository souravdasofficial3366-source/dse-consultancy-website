"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { siteNavigation } from "@/data/site";

export function getMobileCtaForPathname(pathname: string | null) {
  if (pathname === "/social-media-management-plus-seo") {
    return {
      label: "Get Free Audit",
      href: "/social-media-management-plus-seo#audit"
    };
  }

  if (pathname === "/website-development") {
    return {
      label: "Get A Website",
      href: "/website-development#lead-form"
    };
  }

  return {
    label: "Contact Us",
    href: "/contact-us#contact-form"
  };
}

export function HeaderBrandLink({ children }: { children: ReactNode }) {
  return (
    <Link aria-label="DSE Consultancy home" className="brand brand-logo" href="/">
      {children}
    </Link>
  );
}

export function HeaderNavLinks() {
  return (
    <nav aria-label="Primary website navigation" className="nav-links">
      {siteNavigation
        .filter((item) => item.href !== "/")
        .map((item) => (
          <Link href={item.href} key={item.href}>
            {item.label}
          </Link>
        ))}
    </nav>
  );
}
