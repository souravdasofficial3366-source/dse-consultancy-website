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
