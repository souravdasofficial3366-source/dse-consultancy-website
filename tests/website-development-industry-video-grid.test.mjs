import assert from "node:assert/strict";
import { stat } from "node:fs/promises";
import test from "node:test";

const names = [
  "pre-schooling",
  "doctors-clinics",
  "education",
  "transport-logistics",
  "real-estate",
  "ecommerce"
];

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
