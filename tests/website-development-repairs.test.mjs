import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const [page, layout, css, footer] = await Promise.all([
  readFile("app/(landing-pages)/website-development/page.tsx", "utf8"),
  readFile("components/layout/LayoutParts.tsx", "utf8"),
  readFile("app/globals.css", "utf8"),
  readFile("components/layout/InteractiveFooter.tsx", "utf8").catch(() => "")
]);

function extractCssBlocks(source, marker) {
  const blocks = [];
  let fromIndex = 0;

  while (fromIndex < source.length) {
    const markerIndex = source.indexOf(marker, fromIndex);
    if (markerIndex === -1) break;

    const openBrace = source.indexOf("{", markerIndex);
    assert.notEqual(openBrace, -1, `Missing opening brace after: ${marker}`);

    let depth = 0;
    let closingBrace = -1;
    for (let index = openBrace; index < source.length; index += 1) {
      if (source[index] === "{") depth += 1;
      if (source[index] === "}") depth -= 1;
      if (depth === 0) {
        closingBrace = index;
        break;
      }
    }

    assert.notEqual(closingBrace, -1, `Missing closing brace after: ${marker}`);
    blocks.push({
      start: markerIndex,
      text: source.slice(markerIndex, closingBrace + 1)
    });
    fromIndex = closingBrace + 1;
  }

  return blocks;
}

test("comparison accent is owned by the first cell", () => {
  assert.match(css, /comparison tbody tr > td:first-child::before/);
  assert.doesNotMatch(css, /comparison tbody tr::before/);
});

test("results mount the dedicated performance story without obsolete artwork", () => {
  assert.match(page, /<WebsitePerformanceStory\s*\/>/);
  assert.doesNotMatch(page, /wd-video-placeholder|score-ring|proof-panel/);
});

test("performance story cannot widen the mobile layout", () => {
  assert.match(css, /\.wd-performance-story\s*\{[^}]*overflow:\s*(?:clip|hidden)/);
  assert.match(css, /@media \(max-width: 767px\)[\s\S]*?\.wd-performance-card\s*\{[^}]*position:\s*relative/);
});

test("featured badge can extend beyond the pricing card", () => {
  assert.match(css, /website-development-page \.price-card[\s\S]*overflow:\s*visible/);
});

test("support icon and interactive footer are present", () => {
  assert.match(page, />edit_note<\/span>/);
  assert.match(layout, /<InteractiveFooter>/);
  assert.match(footer, /aria-hidden="true"/);
});

test("the committed layout mounts InteractiveFooter around the existing footer content", () => {
  assert.match(layout, /import \{ InteractiveFooter \} from "@\/components\/layout\/InteractiveFooter"/);
  assert.match(layout, /<footer className="site-footer">\s*<InteractiveFooter>\s*<div className="container">/);
  assert.match(layout, /<\/div>\s*<\/InteractiveFooter>\s*<\/footer>/);
});

test("the footer includes its complete positioning, pixel, content, and touch foundation", () => {
  assert.match(css, /\/\* Shared mouse-reactive footer \*\//);
  assert.match(css, /\.interactive-footer\s*\{[^}]*position:\s*relative[^}]*isolation:\s*isolate/);
  assert.match(css, /\.interactive-footer-pixels\s*\{[^}]*position:\s*absolute[^}]*z-index:\s*-1[^}]*pointer-events:\s*none/);
  assert.match(css, /\.interactive-footer-content\s*\{[^}]*position:\s*relative[^}]*z-index:\s*1/);
  assert.match(css, /@media \(hover:\s*none\), \(pointer:\s*coarse\)[\s\S]*animation:\s*interactive-footer-touch/);
  assert.match(css, /@keyframes interactive-footer-touch/);
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

test("the bounded footer reduced-motion rule wins the pixel cascade without duplication", () => {
  const normalPixelRule = css.lastIndexOf('.interactive-footer[data-pointer-active="false"]');
  const footerReducedMotionBlocks = extractCssBlocks(
    css,
    "@media (prefers-reduced-motion: reduce)"
  ).filter(({ text }) =>
    text.includes('.interactive-footer[data-pointer-active="true"]::before')
  );

  assert.equal(footerReducedMotionBlocks.length, 1, "footer reduced-motion declarations must not be duplicated");
  const footerReducedMotion = footerReducedMotionBlocks[0];

  assert.ok(footerReducedMotion.start > normalPixelRule, "reduced-motion override must follow normal pixel response");
  assert.match(footerReducedMotion.text, /\.interactive-footer\[data-pointer-active="true"\]::before\s*\{[^}]*opacity:\s*\.08/);
  assert.match(footerReducedMotion.text, /\.interactive-footer-pixels > span\s*\{[^}]*animation:\s*none\s*!important[^}]*opacity:\s*\.1[^}]*transform:\s*none[^}]*transition:\s*none/);
});
