import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const [home, footer, story, storyVisuals, about, social, css] = await Promise.all([
  readFile("app/(landing-pages)/page.tsx", "utf8"),
  readFile("components/layout/LayoutParts.tsx", "utf8"),
  readFile("components/about/AboutVisionStory.tsx", "utf8"),
  readFile("components/about/aboutVisionVisuals.ts", "utf8"),
  readFile("app/(website-pages)/about-us/page.tsx", "utf8"),
  readFile("app/(landing-pages)/social-media-management-plus-seo/page.tsx", "utf8"),
  readFile("app/globals.css", "utf8")
]);

test("the Home closing copy is unique while the footer remains unchanged", () => {
  assert.match(home, /Built Around Better Enquiries/);
  assert.match(home, /Turn Digital Attention Into/);
  assert.match(home, /Real Business Opportunities\./);
  assert.match(home, /Plan Your Digital Growth/);
  assert.doesNotMatch(home, /Let&apos;s Build The Digital Presence/);
  assert.match(footer, /export function Footer\(\)/);
  assert.match(footer, /className="site-footer"/);
  assert.match(footer, /<InteractiveFooter>/);
});

test("the About planning chapter uses the approved two-line title and is mounted", () => {
  assert.match(story, /Prepare For Roadblocks/);
  assert.match(story, /Before They Slow Growth\./);
  assert.doesNotMatch(story, /Plan Ahead For The Roadblocks That Come Next/);
  assert.match(about, /<AboutVisionStory \/>/);
});

test("the About story keeps its committed visual runtime dependency", () => {
  assert.match(
    story,
    /import \{ visionStateLabels, visualTemplates \} from "\.\/aboutVisionVisuals";/
  );
  assert.match(storyVisuals, /export const visualTemplates:/);
  assert.match(storyVisuals, /export const visionStateLabels:/);
});

test("the About story has a complete dark desktop timeline composition", () => {
  assert.match(
    css,
    /\.dse-vision-story\s*\{[^}]*position:\s*relative[^}]*overflow:\s*clip[^}]*background:\s*#09080e[^}]*color:\s*#fff9f5/
  );
  assert.match(
    css,
    /\.dse-vision-story__grid-overlay\s*\{[^}]*linear-gradient[^}]*background-size:/
  );
  assert.match(
    css,
    /\.dse-vision-story__journey\s*\{[^}]*display:\s*grid[^}]*grid-template-columns:\s*minmax\(0,\s*[^)]+\)\s+minmax\(0,\s*[^)]+\)/
  );
  assert.match(
    css,
    /\.dse-vision-story__desktop\s*\{[^}]*position:\s*sticky[^}]*top:/
  );
  assert.match(
    css,
    /\.dse-vision-story__visual-stack\s*\{[^}]*position:\s*relative[^}]*min-height:/
  );
  assert.match(
    css,
    /\.dse-vision-story__stack-position\s*\{[^}]*position:\s*absolute[^}]*transition:/
  );
});

test("the About story styles timeline states, rail, dots and large two-line chapter type", () => {
  assert.match(
    css,
    /\.dse-vision-story__stack-position\.active\s*\{[^}]*opacity:\s*1[^}]*transform:\s*translate3d\(0,\s*0,\s*0\)\s*scale\(1\)/
  );
  assert.match(css, /\.dse-vision-story__stack-position\.next-1\s*\{[^}]*opacity:/);
  assert.match(
    css,
    /\.dse-vision-story__stack-position:is\(\.prev,\s*\.past\)\s*\{[^}]*opacity:\s*0/
  );
  assert.match(
    css,
    /\.dse-vision-story__rail\s*\{[^}]*position:\s*absolute[^}]*background:/
  );
  assert.match(
    css,
    /\.dse-vision-story__rail > span\s*\{[^}]*background:\s*#fe6807/
  );
  assert.match(
    css,
    /\.dse-vision-story__dot\s*\{[^}]*position:\s*absolute[^}]*border-radius:\s*50%/
  );
  assert.match(
    css,
    /\.dse-vision-story__chapter-copy h3\s*\{[^}]*color:\s*#fff9f5[^}]*font-size:\s*clamp\([^}]*line-height:/
  );
  assert.match(
    css,
    /\.dse-vision-story__heading-line\s*\{[^}]*display:\s*block[^}]*white-space:\s*nowrap/
  );
});

test("the About story has mobile and reduced-motion fallbacks", () => {
  assert.match(css, /\.dse-vision-story__mobile\s*\{[^}]*display:\s*none/);
  assert.match(
    css,
    /@media \(max-width:\s*900px\)\s*\{[\s\S]*?\.dse-vision-story__desktop\s*\{[^}]*display:\s*none[\s\S]*?\.dse-vision-story__mobile\s*\{[^}]*display:\s*block/
  );
  assert.match(
    css,
    /@media \(max-width:\s*900px\)\s*\{[\s\S]*?\.dse-vision-story__journey\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)/
  );
  assert.match(
    css,
    /@media \(max-width:\s*900px\)\s*\{[\s\S]*?\.dse-vision-story__heading-line\s*\{[^}]*white-space:\s*normal/
  );
  assert.match(
    css,
    /@media \(prefers-reduced-motion:\s*reduce\)\s*\{[\s\S]*?\.dse-vision-story__stack-position[\s\S]*?transition:\s*none/
  );
});

test("all three growth cards keep stable visual class names", () => {
  ["visibility", "social-proof", "business-call"].forEach((name) => {
    assert.ok(social.includes(`visual: "${name}"`));
  });
  assert.match(social, /social-growth-card-\${card\.visual}/);
});

test("the cards use three distinct approved overlays with unchanged alpha", () => {
  assert.match(
    css,
    /\.social-growth-card-visibility::after\s*\{[^}]*rgba\(254,\s*104,\s*7,\s*0\.56\)/
  );
  assert.match(
    css,
    /\.social-growth-card-social-proof::after\s*\{[^}]*rgba\(235,\s*38,\s*151,\s*0\.56\)/
  );
  assert.match(
    css,
    /\.social-growth-card-business-call::after\s*\{[^}]*rgba\(126,\s*34,\s*206,\s*0\.56\)/
  );
  assert.match(css, /\.social-growth-card:hover::after,[\s\S]*?opacity:\s*1/);
  assert.match(css, /opacity 420ms ease/);
});
