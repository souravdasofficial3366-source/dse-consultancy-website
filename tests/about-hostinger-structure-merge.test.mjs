import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(path, "utf8").catch(() => "");

test("the About story media mark exposes three local, focusable DSE panels", async () => {
  const component = await read("components/about/AboutStoryVideoMark.tsx");

  for (const [letter, video] of [
    ["D", "/videos/connected_discovery_navigation.mp4"],
    ["S", "/videos/connected_trust_seminar_audience.mp4"],
    ["E", "/videos/connected_action_meeting.mp4"]
  ]) {
    assert.match(component, new RegExp(`letter: "${letter}"`));
    assert.match(component, new RegExp(video.replaceAll("/", "\\/")));
  }

  assert.match(component, /tabIndex={0}/);
  assert.match(component, /aria-label={panel\.label}/);
  assert.match(component, /preload="metadata"/);
});

test("the About story media pauses offscreen and when reduced motion is requested", async () => {
  const component = await read("components/about/AboutStoryVideoMark.tsx");

  assert.match(component, /new IntersectionObserver/);
  assert.match(component, /prefers-reduced-motion: reduce/);
  assert.match(component, /video\.play\(\)/);
  assert.match(component, /video\.pause\(\)/);
  assert.match(component, /observer\.disconnect\(\)/);
  assert.match(component, /removeEventListener/);
});
