import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const [page, layout, css, footer] = await Promise.all([
  readFile("app/(landing-pages)/website-development/page.tsx", "utf8"),
  readFile("components/layout/LayoutParts.tsx", "utf8"),
  readFile("app/globals.css", "utf8"),
  readFile("components/layout/InteractiveFooter.tsx", "utf8").catch(() => "")
]);

test("comparison accent is owned by the first cell", () => {
  assert.match(css, /comparison tbody tr > td:first-child::before/);
  assert.doesNotMatch(css, /comparison tbody tr::before/);
});

test("results use a stable video placeholder and looping score animation", () => {
  assert.match(page, /className="wd-video-placeholder"/);
  assert.doesNotMatch(page, /<InteractiveWebsiteJourney \/>/);
  assert.match(css, /animation:\s*wd-score-loop[^;]*infinite/);
});

test("results placeholder cannot widen the mobile layout", () => {
  assert.match(css, /website-development-page \.proof-panel\s*\{[^}]*min-width:\s*0/);
  assert.match(css, /@media \(max-width: 640px\)[\s\S]*?\.wd-video-placeholder\s*\{[^}]*aspect-ratio:\s*4\s*\/\s*3[^}]*min-height:\s*0/);
});

test("featured badge can extend beyond the pricing card", () => {
  assert.match(css, /website-development-page \.price-card[\s\S]*overflow:\s*visible/);
});

test("support icon and interactive footer are present", () => {
  assert.match(page, />edit_note<\/span>/);
  assert.match(layout, /<InteractiveFooter>/);
  assert.match(footer, /aria-hidden="true"/);
});

test("footer exposes a fast restrained cursor spotlight", () => {
  assert.match(footer, /--footer-pointer-x/);
  assert.match(footer, /--footer-pointer-y/);
  assert.match(footer, /pointerActive/);
  assert.match(footer, /ref={rootRef}/);
  assert.match(footer, /distance \* 3\.1/);
  assert.match(css, /\.interactive-footer::before/);
  assert.match(css, /width:\s*clamp\(280px,[^;]*360px\)/);
  assert.match(css, /opacity:\s*\.2/);
  assert.match(css, /pointer-events:\s*none/);
});

test("footer spotlight responds and settles within the restrained timing budget", () => {
  assert.match(css, /left\s*100ms\s*linear/);
  assert.match(css, /top\s*100ms\s*linear/);
  assert.match(css, /opacity\s*260ms\s*ease/);
  assert.match(css, /data-pointer-active="false"[\s\S]*transition-duration:\s*260ms/);
  assert.match(css, /prefers-reduced-motion:\s*reduce[\s\S]*interactive-footer::before[\s\S]*opacity:\s*\.08[\s\S]*transition:\s*none/);
});
