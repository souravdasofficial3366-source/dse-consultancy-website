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
