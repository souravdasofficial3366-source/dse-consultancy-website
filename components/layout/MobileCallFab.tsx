import { hasConfiguredPhone, siteConfig } from "@/data/site";

export function MobileCallFab() {
  if (!hasConfiguredPhone()) {
    return null;
  }

  return (
    <a
      aria-label={`Call DSE Consultancy at ${siteConfig.phone}`}
      className="mobile-call-fab"
      href={`tel:${siteConfig.phone}`}
    >
      <span aria-hidden="true" className="material-symbols-outlined">call</span>
      <span>Call now</span>
    </a>
  );
}
