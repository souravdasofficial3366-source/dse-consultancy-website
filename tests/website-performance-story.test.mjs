import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const [page, story, searchDemo, usabilityDemo, enquiryDemo] = await Promise.all([
  readFile("app/(landing-pages)/website-development/page.tsx", "utf8"),
  readFile("components/landing/WebsitePerformanceStory.tsx", "utf8").catch(() => ""),
  readFile("components/landing/website-performance/SearchVisibilityDemo.tsx", "utf8").catch(() => ""),
  readFile("components/landing/website-performance/UsabilityDemo.tsx", "utf8").catch(() => ""),
  readFile("components/landing/website-performance/EnquiryPipelineDemo.tsx", "utf8").catch(() => "")
]);

test("website-development results section mounts the performance story", () => {
  assert.match(page, /import \{ WebsitePerformanceStory \}/);
  assert.match(page, /<WebsitePerformanceStory\s*\/>/);
  assert.doesNotMatch(page, /performanceStats|score-ring|wd-video-placeholder|proof-panel/);
});

test("story preserves the approved heading and three claim-safe cards", () => {
  const approved = [
    "Turn Local Searches Into Real Business Leads",
    "Built So Google And Local Customers Understand Your Business",
    "98 / 100 Google-readiness target",
    "Designed To Feel Clear On Every Screen",
    "95 / 100 usability target",
    "Give Every Interested Customer A Clear Next Step",
    "80 / 100 enquiry-path target"
  ];
  approved.forEach((copy) => assert.ok(story.includes(copy), `missing: ${copy}`));
  assert.doesNotMatch(story, /guaranteed|ranked on the first page|80% of the leads/i);
});

test("all three original DSE interface demos are present", () => {
  assert.match(story, /SearchVisibilityDemo/);
  assert.match(story, /UsabilityDemo/);
  assert.match(story, /EnquiryPipelineDemo/);
  assert.match(searchDemo, /SearchVisibilityDemo/);
  assert.match(usabilityDemo, /UsabilityDemo/);
  assert.match(enquiryDemo, /EnquiryPipelineDemo/);
  assert.match(`${searchDemo}${usabilityDemo}${enquiryDemo}`, /aria-hidden="true"/);
});

test("story cleans up observers and the motion listener without a document scroll listener", () => {
  assert.match(story, /IntersectionObserver/);
  assert.match(story, /prefers-reduced-motion/);
  assert.match(story, /observer\.disconnect\(\)/);
  assert.match(story, /cardObserver\.disconnect\(\)/);
  assert.match(story, /mediaQuery\.removeEventListener\("change", updateReducedMotion\)/);
  assert.doesNotMatch(story, /document\.addEventListener\(["']scroll/);
  assert.match(story, /data-active=\{activeIndex === index\}/);
});

test("story clears the selected card when no cards remain visible", () => {
  assert.match(story, /useState<number \| null>\(null\)/);
  assert.match(story, /if \(visibleCards\.size === 0\) \{\s*setActiveIndex\(null\);\s*return;\s*\}/);
  assert.match(story, /const isActive = inView && activeIndex !== null && activeIndex === index;/);
  assert.match(story, /<Demo active=\{isActive\} reducedMotion=\{reducedMotion\} \/>/);
});

test("each demo has its exact finite active-only loop and static final phase", () => {
  const contracts = [
    { source: searchDemo, phaseCount: 5, finalPhase: 4, duration: 1050 },
    { source: usabilityDemo, phaseCount: 6, finalPhase: 5, duration: 900 },
    { source: enquiryDemo, phaseCount: 7, finalPhase: 6, duration: 950 }
  ];

  contracts.forEach(({ source, phaseCount, finalPhase, duration }) => {
    assert.match(source, new RegExp(`const PHASE_COUNT = ${phaseCount};`));
    assert.match(source, new RegExp(`const FINAL_PHASE = ${finalPhase};`));
    assert.match(source, new RegExp(`const PHASE_DURATION = ${duration};`));
    assert.match(source, /const canAnimate = active && !reducedMotion;/);
    assert.match(source, /if \(!canAnimate\) \{\s*setPhase\(reducedMotion \? FINAL_PHASE : 0\);/);
    assert.match(source, /window\.setInterval\([\s\S]*?PHASE_DURATION/);
    assert.match(source, /window\.clearInterval\(interval\)/);
    assert.match(source, /data-phase=\{phase\}/);
  });
});
