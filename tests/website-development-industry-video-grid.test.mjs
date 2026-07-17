import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";

const names = [
  "pre-schooling",
  "doctors-clinics",
  "education",
  "transport-logistics",
  "real-estate",
  "ecommerce"
];

const [page, component, data] = await Promise.all([
  readFile("app/(landing-pages)/website-development/page.tsx", "utf8"),
  readFile("components/landing/IndustryVideoGrid.tsx", "utf8").catch(() => ""),
  readFile("data/site.ts", "utf8")
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

test("six local industry video loops and posters stay inside the media budget", async () => {
  let totalVideoBytes = 0;

  for (const name of names) {
    const video = await stat(`public/videos/industries/${name}.mp4`);
    const poster = await stat(`public/videos/industries/${name}-poster.jpg`);

    assert.ok(video.size <= 3 * 1024 * 1024, `${name}.mp4 exceeds 3 MB`);
    assert.ok(poster.size <= 150 * 1024, `${name}-poster.jpg exceeds 150 KB`);
    totalVideoBytes += video.size;
  }

  assert.ok(totalVideoBytes <= 18 * 1024 * 1024, "combined videos exceed 18 MB");
});

test("industry data maps every business to local video and poster media", () => {
  for (const name of names) {
    assert.match(data, new RegExp(`/videos/industries/${name}\\.mp4`));
    assert.match(data, new RegExp(`/videos/industries/${name}-poster\\.jpg`));
  }
});

test("the page delegates the six cards to the video grid", () => {
  assert.match(page, /<IndustryVideoGrid cards={industryCards} \/>/);
  assert.doesNotMatch(page, /industryCards\.map/);
});

test("the gallery renders rows of three accessible looping videos", () => {
  assert.match(component, /cards\.slice\(rowIndex \* 3, rowIndex \* 3 \+ 3\)/);
  assert.match(component, /<video/);
  assert.match(component, /muted/);
  assert.match(component, /loop/);
  assert.match(component, /playsInline/);
  assert.match(component, /preload="metadata"/);
  assert.match(component, /poster={card\.poster}/);
  assert.match(component, /IntersectionObserver/);
  assert.match(component, /prefers-reduced-motion/);
});

test("the gallery observes and syncs each video independently when cards change", () => {
  assert.match(component, /entries\.forEach\(\(entry\) =>/);
  assert.match(component, /entry\.target as HTMLVideoElement/);
  assert.match(component, /observer\.observe\(video\)/);
  assert.match(component, /visibleVideos\.has\(video\)/);
  assert.match(component, /\}, \[cards\]\);/);
});

test("desktop industry rows expand one card without affecting the other row", () => {
  assert.match(css, /@media \(min-width: 1100px\)[\s\S]*?\.industry-video-row\s*\{[\s\S]*?display:\s*flex/);
  assert.match(css, /flex-grow:\s*1\.64/);
  assert.match(css, /flex-grow:\s*\.68/);
});

test("desktop keyboard focus expands independently of pointer capabilities", () => {
  const focusSizing = mediaRule("(min-width: 1100px) and (prefers-reduced-motion: no-preference)");

  assert.match(focusSizing, /\.industry-video-row:has\(\.industry-video-card:focus-within\)/);
  assert.match(focusSizing, /flex-grow:\s*\.68/);
  assert.match(focusSizing, /flex-grow:\s*1\.64/);
  assert.doesNotMatch(focusSizing, /hover:\s*hover|pointer:\s*fine|:hover/);
});

test("desktop hover expansion stays fine-pointer-only and opts out of reduced motion", () => {
  const hoverSizing = mediaRule("(min-width: 1100px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");

  assert.match(hoverSizing, /\.industry-video-row:has\(\.industry-video-card:hover\)/);
  assert.match(hoverSizing, /flex-grow:\s*\.68/);
  assert.match(hoverSizing, /flex-grow:\s*1\.64/);
});

test("keyboard focus suppresses hover sizing when both states exist in a row", () => {
  const hoverSizing = mediaRule("(min-width: 1100px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");

  assert.match(
    hoverSizing,
    /\.industry-video-row:has\(\.industry-video-card:hover\):not\(:has\(\.industry-video-card:focus-within\)\) \.industry-video-card/
  );
  assert.match(
    hoverSizing,
    /\.industry-video-row:has\(\.industry-video-card:hover\):not\(:has\(\.industry-video-card:focus-within\)\)[\s\S]*?\.industry-video-card:hover/
  );
});

test("reduced motion cannot apply either desktop sizing rule", () => {
  const focusSizing = mediaRule("(min-width: 1100px) and (prefers-reduced-motion: no-preference)");
  const hoverSizing = mediaRule("(min-width: 1100px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
  const reducedMotion = mediaRule("(prefers-reduced-motion: reduce)");
  const cssWithoutOptInSizing = css.replace(focusSizing, "").replace(hoverSizing, "");

  assert.doesNotMatch(reducedMotion, /flex-grow:\s*(?:\.68|1\.64)/);
  assert.doesNotMatch(cssWithoutOptInSizing, /flex-grow:\s*(?:\.68|1\.64)/);
});

test("industry video cards have tablet and reduced-motion fallbacks", () => {
  assert.match(css, /@media \(min-width: 700px\) and \(max-width: 1099px\)[\s\S]*?grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(css, /prefers-reduced-motion: reduce[\s\S]*?\.industry-video-card/);
});

test("general mobile cards preserve their four-three proportion", () => {
  const mobile = mediaRule("(max-width: 699px)");

  assert.match(mobile, /\.industry-video-card\s*\{[\s\S]*?min-height:\s*0/);
  assert.match(mobile, /aspect-ratio:\s*4\s*\/\s*3/);
  assert.doesNotMatch(mobile, /min-height:\s*330px/);
});

test("very narrow mobile cards keep enough height for long copy", () => {
  const narrowMobile = mediaRule("(max-width: 340px)");

  assert.match(narrowMobile, /\.industry-video-card\s*\{[\s\S]*?min-height:\s*330px/);
});

test("compressed desktop neighbours retain a legible minimum width", () => {
  const desktop = mediaRule("(min-width: 1100px)");

  assert.match(desktop, /\.industry-video-card\s*\{[\s\S]*?min-width:\s*210px/);
});
