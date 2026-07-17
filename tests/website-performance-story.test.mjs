import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const [page, story, searchDemo, usabilityDemo, enquiryDemo, css] = await Promise.all([
  readFile("app/(landing-pages)/website-development/page.tsx", "utf8"),
  readFile("components/landing/WebsitePerformanceStory.tsx", "utf8").catch(() => ""),
  readFile("components/landing/website-performance/SearchVisibilityDemo.tsx", "utf8").catch(() => ""),
  readFile("components/landing/website-performance/UsabilityDemo.tsx", "utf8").catch(() => ""),
  readFile("components/landing/website-performance/EnquiryPipelineDemo.tsx", "utf8").catch(() => ""),
  readFile("app/globals.css", "utf8")
]);

function blockAt(source, markerIndex) {
  const openIndex = source.indexOf("{", markerIndex);
  assert.notEqual(openIndex, -1, "missing opening brace");

  let depth = 0;
  for (let index = openIndex; index < source.length; index += 1) {
    if (source[index] === "{") depth += 1;
    if (source[index] === "}") depth -= 1;
    if (depth === 0) return source.slice(openIndex + 1, index);
  }

  assert.fail("missing closing brace");
}

function ruleBlock(source, selector) {
  const markerIndex = source.indexOf(selector);
  assert.notEqual(markerIndex, -1, `missing selector: ${selector}`);
  return blockAt(source, markerIndex);
}

function ruleBlocks(source, selector) {
  const blocks = [];
  let markerIndex = source.indexOf(selector);

  while (markerIndex !== -1) {
    blocks.push(blockAt(source, markerIndex));
    markerIndex = source.indexOf(selector, markerIndex + selector.length);
  }

  assert.ok(blocks.length > 0, `missing selector: ${selector}`);
  return blocks;
}

function mediaBlock(query, requiredSelector) {
  let markerIndex = css.indexOf(query);

  while (markerIndex !== -1) {
    const block = blockAt(css, markerIndex);
    if (block.includes(requiredSelector)) return block;
    markerIndex = css.indexOf(query, markerIndex + query.length);
  }

  assert.fail(`missing media block ${query} containing ${requiredSelector}`);
}

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

test("story scopes horizontal progress measurement to the visible eligible section", () => {
  assert.match(story, /IntersectionObserver/);
  assert.match(story, /prefers-reduced-motion/);
  assert.match(story, /observer\.disconnect\(\)/);
  assert.match(story, /requestAnimationFrame\(updateProgress\)/);
  assert.match(story, /window\.addEventListener\("scroll", onScroll, \{ passive: true \}\)/);
  assert.match(story, /window\.removeEventListener\("scroll", onScroll\)/);
  assert.match(story, /cancelAnimationFrame\(frameId\)/);
  assert.match(story, /mediaQuery\.removeEventListener\("change", updateReducedMotion\)/);
  assert.match(story, /horizontalQuery\.removeEventListener\("change", updateHorizontalMode\)/);
  assert.doesNotMatch(story, /preventDefault|addEventListener\(["']wheel/);
  assert.match(story, /data-active=\{activeIndex === index\}/);
});

test("vertical fallback selects only the card at the viewport centre and cleans its observer", () => {
  assert.match(story, /const cardRefs = useRef<Array<HTMLElement \| null>>\(\[\]\);/);
  assert.match(story, /if \(horizontalMode \|\| reducedMotion\) return;/);
  assert.match(story, /const centre = window\.innerHeight \/ 2;/);
  assert.match(story, /top <= centre && bottom >= centre/);
  assert.match(story, /setActiveIndex\(nextIndex === -1 \? null : nextIndex\);/);
  assert.match(story, /rootMargin: "-45% 0px -45% 0px"/);
  assert.match(story, /cardElements\.forEach\(\(card\) => observer\.observe\(card\)\);/);
  assert.match(story, /window\.addEventListener\("scroll", onVerticalScroll, \{ passive: true \}\);/);
  assert.match(story, /window\.removeEventListener\("scroll", onVerticalScroll\);/);
  assert.match(story, /cancelAnimationFrame\(frameId\)/);
  assert.match(story, /observer\.disconnect\(\);/);
  assert.match(story, /ref=\{\(cardElement\) => \{\s*cardRefs\.current\[index\] = cardElement;\s*\}\}/);
  assert.match(story, /<Demo active=\{activeIndex === index\} compact=\{!horizontalMode\} reducedMotion=\{reducedMotion\} \/>/);
});

test("horizontal progress clamps to the full two-stage translation and selects thirds", () => {
  assert.match(story, /const STICKY_TOP = 88;/);
  assert.match(story, /const pinStartRef = useRef<HTMLSpanElement>\(null\);/);
  assert.match(story, /const stackRef = useRef<HTMLDivElement>\(null\);/);
  assert.match(story, /const sectionTop = window\.scrollY \+ section\.getBoundingClientRect\(\)\.top;/);
  assert.match(story, /const start = window\.scrollY \+ pinStart\.getBoundingClientRect\(\)\.top - STICKY_TOP;/);
  assert.match(story, /const end = sectionTop\s*\+\s*section\.offsetHeight\s*-\s*paddingBottom\s*-\s*stack\.offsetHeight\s*-\s*STICKY_TOP;/);
  assert.match(story, /const distance = Math\.max\(end - start, 1\);/);
  assert.match(story, /const progress = Math\.min\(Math\.max\(\(window\.scrollY - start\) \/ distance, 0\), 1\);/);
  assert.match(story, /const nextIndex = Math\.min\(2, Math\.floor\(progress \* 3\)\);/);
  assert.match(story, /section\.style\.setProperty\("--wd-performance-progress", String\(progress\)\)/);
  assert.match(story, /className="wd-performance-pin-start"/);
  assert.match(story, /className="wd-performance-track"/);
  assert.match(story, /className="wd-performance-progress"/);
  assert.match(story, /<Demo active=\{activeIndex === index\} compact=\{!horizontalMode\} reducedMotion=\{reducedMotion\} \/>/);

  const indices = [0, .2, 1 / 3, .65, 2 / 3, .99, 1]
    .map((progress) => Math.min(2, Math.floor(progress * 3)));
  assert.deepEqual(indices, [0, 0, 1, 1, 2, 2, 2]);
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
    assert.match(source, /window\.setInterval\([\s\S]*?phaseDuration/);
    assert.match(source, /window\.clearInterval\(interval\)/);
    assert.match(source, /data-phase=\{phase\}/);
  });
});

test("compact fallback cards use a separate shorter deterministic timing policy", () => {
  const contracts = [
    { source: searchDemo, duration: 1050, compactDuration: 700 },
    { source: usabilityDemo, duration: 900, compactDuration: 600 },
    { source: enquiryDemo, duration: 950, compactDuration: 650 }
  ];

  assert.match(story, /compact\?: boolean;/);
  contracts.forEach(({ source, duration, compactDuration }) => {
    assert.match(source, new RegExp(`const PHASE_DURATION = ${duration};`));
    assert.match(source, new RegExp(`const COMPACT_PHASE_DURATION = ${compactDuration};`));
    assert.match(source, /\{ active, compact = false, reducedMotion \}: PerformanceDemoProps/);
    assert.match(source, /const phaseDuration = compact \? COMPACT_PHASE_DURATION : PHASE_DURATION;/);
    assert.match(source, /\}, \[active, compact, reducedMotion\]\);/);
  });
});

test("performance story uses exact desktop and landscape-tablet horizontal pinning", () => {
  const desktop = mediaBlock(
    "@media (min-width: 1200px) and (min-height: 760px) and (prefers-reduced-motion: no-preference)",
    ".wd-performance-track"
  );
  const tablet = mediaBlock(
    "@media (min-width: 1024px) and (max-width: 1199px) and (min-height: 760px) and (orientation: landscape) and (prefers-reduced-motion: no-preference)",
    ".wd-performance-track"
  );
  const desktopStory = ruleBlock(desktop, ".wd-performance-story {");
  const desktopStack = ruleBlock(desktop, ".wd-performance-stack {");
  const desktopTrack = ruleBlock(desktop, ".wd-performance-track {");
  const desktopCard = ruleBlock(desktop, ".wd-performance-card {");
  const desktopProgress = ruleBlock(desktop, ".wd-performance-progress {");

  assert.match(desktopStory, /min-height:\s*300vh/);
  assert.match(desktopStack, /position:\s*sticky/);
  assert.match(desktopStack, /top:\s*88px/);
  assert.match(desktopStack, /height:\s*calc\(100svh - 104px\)/);
  assert.match(desktopStack, /overflow:\s*hidden/);
  assert.match(desktopTrack, /grid-template-columns:\s*repeat\(3,\s*100%\)/);
  assert.match(desktopTrack, /transform:\s*translate3d\(calc\(var\(--wd-performance-progress, 0\) \* -200%\), 0, 0\)/);
  assert.match(desktopCard, /height:\s*100%/);
  assert.match(desktopCard, /min-height:\s*0/);
  assert.match(desktopProgress, /display:\s*block/);
  assert.match(ruleBlock(css, ".wd-performance-progress span"), /transform:\s*scaleX\(var\(--wd-performance-progress, 0\)\)/);
  assert.match(tablet, /\.wd-performance-story\s*\{[^}]*min-height:\s*300vh/);
  assert.match(tablet, /\.wd-performance-track\s*\{[^}]*grid-template-columns:\s*repeat\(3,\s*100%\)[^}]*-200%/);

  const viewportHeight = 760;
  const stackTop = 88;
  const stackHeight = viewportHeight - 104;
  assert.ok(stackTop >= 80, "pinned track must clear the sticky header");
  assert.ok(stackTop + stackHeight <= viewportHeight, "pinned track must fit inside the viewport");
});

test("portrait mobile short-height and reduced-motion modes restore vertical flow", () => {
  const queries = [
    ["@media (max-width: 767px)", ".wd-performance-story"],
    ["@media (min-width: 768px) and (max-width: 1023px)", ".wd-performance-track"],
    ["@media (min-width: 1024px) and (max-width: 1199px) and (orientation: portrait)", ".wd-performance-track"],
    ["@media (min-width: 768px) and (max-height: 759px)", ".wd-performance-track"],
    ["@media (prefers-reduced-motion: reduce)", ".wd-search-query b"]
  ];

  queries.forEach(([query, requiredSelector]) => {
    const block = mediaBlock(query, requiredSelector);
    const storyRule = ruleBlock(block, ".wd-performance-story {");
    const stackRule = ruleBlock(block, ".wd-performance-stack {");
    const trackRule = ruleBlock(block, ".wd-performance-track {");
    assert.match(storyRule, /min-height:\s*auto/);
    assert.match(stackRule, /position:\s*relative/);
    assert.match(stackRule, /top:\s*auto/);
    assert.match(stackRule, /height:\s*auto/);
    assert.match(trackRule, /grid-template-columns:\s*minmax\(0,\s*1fr\)/);
    assert.match(trackRule, /transform:\s*none/);
  });
});

test("interface transitions cover every exact phase with complete reduced-motion states", () => {
  const phaseContracts = [
    ['.wd-search-demo[data-phase="0"] .wd-search-query b', /clip-path:\s*inset\(0 100% 0 0\)/],
    ['.wd-search-demo[data-phase="1"] .wd-search-query b', /clip-path:\s*inset\(0 0 0 0\)/],
    ['.wd-search-demo[data-phase="2"] .is-dse-result', /opacity:\s*1[^}]*transform:\s*translateY\(0\)/],
    ['.wd-search-demo[data-phase="3"] .is-dse-result', /border-color:\s*#fe6807[^}]*transform:\s*translateY\(-4px\)/],
    ['.wd-search-demo[data-phase="4"] .wd-search-preview', /opacity:\s*1[^}]*transform:\s*translateY\(0\) scale\(1\)/],
    ['.wd-usability-demo[data-phase="0"] .wd-usability-desktop', /opacity:\s*0[^}]*transform:\s*translateY\(24px\) scale\(\.96\)/],
    ['.wd-usability-demo[data-phase="1"] .wd-usability-desktop', /opacity:\s*1[^}]*transform:\s*translateY\(0\) scale\(1\)/],
    ['.wd-usability-demo[data-phase="2"] .wd-usability-mobile', /opacity:\s*1[^}]*transform:\s*translateY\(0\) scale\(1\)/],
    ['.wd-usability-demo[data-phase="3"] .wd-usability-checks li:nth-child(-n + 2)', /opacity:\s*1[^}]*transform:\s*translateX\(0\)/],
    ['.wd-usability-demo[data-phase="4"] .wd-usability-checks li:nth-child(-n + 3)', /opacity:\s*1[^}]*transform:\s*translateX\(0\)/],
    ['.wd-usability-demo[data-phase="5"] .wd-usability-checks li', /opacity:\s*1[^}]*transform:\s*translateX\(0\)/],
    ['.wd-enquiry-demo[data-phase="0"] .wd-enquiry-message', /opacity:\s*0[^}]*transform:\s*translateY\(18px\) scale\(\.96\)/],
    ['.wd-enquiry-demo[data-phase="1"] .wd-enquiry-message', /opacity:\s*1[^}]*transform:\s*translateY\(0\) scale\(1\)/],
    ['.wd-enquiry-demo[data-phase="2"] .wd-enquiry-contact', /opacity:\s*1[^}]*transform:\s*translateX\(0\)/],
    ['.wd-enquiry-demo[data-phase="3"] .wd-enquiry-pipeline li:nth-child(1)', /color:\s*#fff9f5[^}]*transform:\s*translateY\(0\)/],
    ['.wd-enquiry-demo[data-phase="4"] .wd-enquiry-pipeline li:nth-child(2)', /color:\s*#fff9f5[^}]*transform:\s*translateY\(0\)/],
    ['.wd-enquiry-demo[data-phase="5"] .wd-enquiry-pipeline li:nth-child(3)', /color:\s*#fff9f5[^}]*transform:\s*translateY\(0\)/],
    ['.wd-enquiry-demo[data-phase="6"] .wd-enquiry-counters', /opacity:\s*1[^}]*transform:\s*translateY\(0\)/]
  ];

  phaseContracts.forEach(([selector, contract]) => {
    assert.ok(
      ruleBlocks(css, selector).some((block) => contract.test(block)),
      `missing declarations for phase selector: ${selector}`
    );
  });

  const reducedMotion = mediaBlock("@media (prefers-reduced-motion: reduce)", ".wd-search-query b");
  assert.match(reducedMotion, /\.wd-performance-demo[\s\S]*?animation:\s*none/);
  assert.match(ruleBlock(reducedMotion, ".wd-search-query b"), /clip-path:\s*none/);
  assert.match(ruleBlock(reducedMotion, ".wd-search-result,"), /opacity:\s*1[^}]*transform:\s*none/);
});

test("will-change is limited to the visible track and active demos in horizontal modes", () => {
  assert.doesNotMatch(ruleBlock(css, ".wd-performance-demo {"), /will-change/);

  const desktop = mediaBlock(
    "@media (min-width: 1200px) and (min-height: 760px) and (prefers-reduced-motion: no-preference)",
    ".wd-performance-card[data-active=\"true\"] .wd-performance-demo"
  );
  const tablet = mediaBlock(
    "@media (min-width: 1024px) and (max-width: 1199px) and (min-height: 760px) and (orientation: landscape) and (prefers-reduced-motion: no-preference)",
    ".wd-performance-card[data-active=\"true\"] .wd-performance-demo"
  );

  assert.match(ruleBlock(desktop, '.wd-performance-story[data-in-view="true"] .wd-performance-track'), /will-change:\s*transform/);
  assert.match(ruleBlock(desktop, '.wd-performance-story[data-in-view="true"] .wd-performance-card[data-active="true"] .wd-performance-demo'), /will-change:\s*transform/);
  assert.match(ruleBlock(tablet, '.wd-performance-story[data-in-view="true"] .wd-performance-card[data-active="true"] .wd-performance-demo'), /will-change:\s*transform/);
});

test("performance interfaces protect narrow cards from horizontal overflow", () => {
  assert.match(css, /\.wd-performance-card\s*\{[^}]*min-width:\s*0[^}]*overflow:\s*hidden/);
  assert.match(css, /\.wd-performance-card-copy\s*\{[^}]*min-width:\s*0/);
  assert.match(css, /\.wd-performance-demo\s*\{[^}]*min-width:\s*0/);
  assert.match(css, /\.wd-search-query b\s*\{[^}]*overflow-wrap:\s*anywhere/);
  assert.match(css, /@media \(max-width: 767px\)[\s\S]*?\.wd-performance-card\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)/);
});
