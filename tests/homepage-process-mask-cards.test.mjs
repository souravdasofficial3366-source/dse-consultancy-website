import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const [page, component] = await Promise.all([
  readFile("app/(landing-pages)/page.tsx", "utf8"),
  readFile("components/landing/HomeProcessStack.tsx", "utf8").catch(() => "")
]);

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
