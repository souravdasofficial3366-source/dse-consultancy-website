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
  assert.match(css, /\.industry-video-row:has\(\.industry-video-card:is\(:hover, :focus-within\)\)/);
  assert.match(css, /flex-grow:\s*1\.64/);
  assert.match(css, /flex-grow:\s*\.68/);
});

test("industry video cards have tablet, mobile, and reduced-motion fallbacks", () => {
  assert.match(css, /@media \(min-width: 700px\) and \(max-width: 1099px\)[\s\S]*?grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(css, /@media \(max-width: 699px\)[\s\S]*?grid-template-columns:\s*1fr/);
  assert.match(css, /prefers-reduced-motion: reduce[\s\S]*?\.industry-video-card/);
});
