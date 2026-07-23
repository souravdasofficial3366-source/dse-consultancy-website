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
