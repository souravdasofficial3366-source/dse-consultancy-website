import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const [page, component] = await Promise.all([
  readFile("app/(landing-pages)/page.tsx", "utf8"),
  readFile("components/landing/HomeProcessStack.tsx", "utf8").catch(() => "")
]);
const css = await readFile("app/globals.css", "utf8");

function mediaRule(query) {
  const start = css.indexOf(`@media ${query}`);
  assert.notEqual(start, -1, `missing @media ${query}`);

  const openingBrace = css.indexOf("{", start);
  let depth = 0;

  for (let index = openingBrace; index < css.length; index += 1) {
    if (css[index] === "{") depth += 1;
    if (css[index] === "}") depth -= 1;
    if (depth === 0) return css.slice(start, index + 1);
  }

  assert.fail(`unterminated @media ${query}`);
}

const phases = ["Discover", "Design", "Build", "Improve"];
const descriptions = [
  "We understand the business, audience, location, services and the action customers should take.",
  "We shape the message, visual direction, page structure and channel plan around that customer journey.",
  "We create, connect and test the website, search, content and enquiry touchpoints.",
  "We review useful signals and refine the system as the business, content and customer needs evolve."
];

test("the homepage delegates the four approved process steps to HomeProcessStack", () => {
  assert.match(page, /import \{ HomeProcessStack/);
  assert.match(page, /<HomeProcessStack steps={processSteps} \/>/);
  assert.doesNotMatch(page, /className="consultancy-process-line"/);

  phases.forEach((phase) => assert.match(page, new RegExp(`title: "${phase}"`)));
  descriptions.forEach((description) => assert.ok(page.includes(description)));
});

test("the process stack renders semantic poster-backed videos and three tags per card", () => {
  assert.match(component, /export type HomeProcessStep/);
  assert.match(component, /steps\.map\(\(step, index\) =>/);
  assert.match(component, /<article/);
  assert.match(component, /<h3>{step\.title}<\/h3>/);
  assert.match(component, /aria-hidden="true"/);
  assert.match(component, /muted/);
  assert.match(component, /loop/);
  assert.match(component, /playsInline/);
  assert.match(component, /preload="metadata"/);
  assert.match(component, /poster={step\.poster}/);
  assert.match(component, /step\.tags\.map/);
});

test("the stack synchronizes playback with visibility and reduced-motion state", () => {
  assert.match(component, /IntersectionObserver/);
  assert.match(component, /prefers-reduced-motion: reduce/);
  assert.match(component, /visibleVideos\.has\(video\)/);
  assert.match(component, /void video\.play\(\)\.catch/);
  assert.match(component, /video\.pause\(\)/);
  assert.match(component, /observer\.disconnect\(\)/);
  assert.match(component, /motion\.removeEventListener/);
});

test("desktop process cards use native sticky stacking with indexed offsets", () => {
  const desktop = mediaRule("(min-width: 1200px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)");

  assert.match(desktop, /\.consultancy-process-stack-card\s*\{[^}]*position:\s*sticky/);
  assert.match(desktop, /top:\s*calc\(var\(--process-sticky-top\) \+ var\(--process-offset\)\)/);
  assert.match(desktop, /z-index:\s*calc\(var\(--process-index\) \+ 1\)/);
});

test("tablet process cards use a shallower sticky offset", () => {
  const tablet = mediaRule("(min-width: 768px) and (max-width: 1199px) and (min-height: 760px) and (prefers-reduced-motion: no-preference)");

  assert.match(tablet, /--process-sticky-top:\s*82px/);
  assert.match(tablet, /top:\s*calc\(var\(--process-sticky-top\) \+ var\(--process-tablet-offset\)\)/);
  assert.match(tablet, /position:\s*sticky/);
});

test("sticky overlap keeps each previous phase label in its exposed strip", () => {
  const desktop = mediaRule("(min-width: 1200px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)");
  const tablet = mediaRule("(min-width: 768px) and (max-width: 1199px) and (min-height: 760px) and (prefers-reduced-motion: no-preference)");

  assert.match(desktop, /--process-header-strip:\s*48px/);
  assert.match(tablet, /--process-header-strip:\s*36px/);
  assert.match(css, /\.consultancy-process-stack-header\s*\{[^}]*position:\s*absolute[^}]*top:\s*0[^}]*min-height:\s*var\(--process-header-strip\)[^}]*padding:\s*0/);
  assert.match(css, /\.consultancy-process-stack-header h3\s*\{[^}]*font-size:\s*clamp\(\.8rem, 1\.35vw, 1\.25rem\)/);
});

test("mobile, short-height, and reduced-motion modes disable sticky positioning", () => {
  const mobile = mediaRule("(max-width: 767px)");
  const shortHeight = mediaRule("(min-width: 768px) and (max-height: 759px)");
  const reducedMotion = mediaRule("(prefers-reduced-motion: reduce)");

  [mobile, shortHeight, reducedMotion].forEach((rule) => {
    assert.match(rule, /\.consultancy-process-stack-card\s*\{[^}]*position:\s*relative/);
    assert.match(rule, /top:\s*auto/);
  });

  assert.match(shortHeight, /\.consultancy-process-stack-inner\s*\{[^}]*grid-template-rows:\s*auto 1fr/);
  assert.match(shortHeight, /\.consultancy-process-stack-header\s*\{[^}]*position:\s*relative[^}]*min-height:\s*48px[^}]*padding:\s*0 72px 0 0/);

  const shortHeightStart = css.indexOf("@media (min-width: 768px) and (max-height: 759px)");
  const reducedMotionStart = css.indexOf("@media (prefers-reduced-motion: reduce)", shortHeightStart);
  const finalReducedMotion = css.slice(reducedMotionStart, css.indexOf("\n}\n", reducedMotionStart) + 3);

  [finalReducedMotion].forEach((rule) => {
    assert.match(rule, /\.consultancy-process-stack-inner\s*\{[^}]*grid-template-rows:\s*auto 1fr/);
    assert.match(rule, /\.consultancy-process-stack-header\s*\{[^}]*position:\s*relative[^}]*min-height:\s*48px[^}]*padding:\s*0 72px 0 0/);
  });
});

test("process card copy remains layered over full-bleed media", () => {
  assert.match(css, /\.consultancy-process-stack-card > video\s*\{[^}]*object-fit:\s*cover/);
  assert.match(css, /\.consultancy-process-stack-scrim\s*\{[^}]*linear-gradient/);
  assert.match(css, /\.consultancy-process-stack-inner\s*\{[^}]*z-index:\s*2/);
});
