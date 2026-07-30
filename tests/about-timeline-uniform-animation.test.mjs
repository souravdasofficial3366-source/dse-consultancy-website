import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const approvedHeadingPairs = [
  ["Make Digital Work", "Easier To Trust"],
  ["Understand The Problem", "Before Choosing The Tool"],
  ["Let Useful Data", "Guide The Direction"],
  ["Test Feasibility", "And Make The Cost Visible"],
  ["Prepare For Roadblocks", "Before They Slow Growth."],
  ["Automate What Does Not", "Need Constant Attention"],
  ["Move Every Workstream", "Forward As One System"],
  ["Build A System The Client", "Can Own And Improve"]
];

test("all eight About timeline titles use the approved two-line desktop pairs", async () => {
  let chapters;

  try {
    ({ chapters } = await import("../components/about/aboutVisionChapters.ts"));
  } catch (error) {
    if (error?.code === "ERR_MODULE_NOT_FOUND") {
      assert.fail("the importable About timeline chapter data module must exist");
    }
    throw error;
  }

  assert.equal(chapters.length, 8);
  assert.deepEqual(chapters.map((chapter) => [...chapter.heading]), approvedHeadingPairs);
  assert.ok(chapters.every((chapter) => chapter.heading.length === 2));
});

const activeMotionClasses = [
  "phase-a",
  "phase-b",
  "phase-a-pulse",
  "phase-a-x-1",
  "phase-a-x-2",
  "phase-b-lines",
  "phase-b-pulse",
  "phase-b-center",
  "anim-radar-sweep",
  "anim-spotlight-1",
  "anim-spotlight-2",
  "anim-spotlight-3",
  "anim-spotlight-4",
  "anim-ripple-1",
  "anim-ripple-2",
  "anim-ripple-3",
  "anim-ripple-4",
  "anim-path-draw",
  "anim-evidence-flow",
  "anim-label-fade",
  "anim-needle",
  "anim-check-1",
  "anim-check-2",
  "anim-check-3",
  "anim-layer-1",
  "anim-layer-2",
  "anim-layer-3",
  "anim-donut-fill",
  "anim-bridge-pillar-1",
  "anim-bridge-pillar-2",
  "anim-bridge-pillar-3",
  "anim-bridge-pillar-4",
  "anim-bridge-deck",
  "anim-bridge-user",
  "anim-roadblock-obstacle",
  "anim-noti-1",
  "anim-noti-2",
  "anim-noti-3",
  "anim-noti-4",
  "anim-noti-5",
  "anim-noti-6",
  "arch-left",
  "arch-right",
  "keystone",
  "anim-laser-flow",
  "anim-backend-engine",
  "anim-engine-flow",
  "anim-owner-cockpit",
  "anim-cockpit-owner",
  "anim-owner-control",
  "anim-simple-guide"
];

const requiredKeyframes = [
  "phase-a-fade",
  "phase-b-fade",
  "stall-pulse",
  "draw-x-1",
  "draw-x-2",
  "sector-lines-seq",
  "flow-both-ways",
  "center-dse-pop",
  "radar-sweep",
  "spotlight-1",
  "spotlight-2",
  "spotlight-3",
  "spotlight-4",
  "ripple-wave",
  "path-draw",
  "evidence-flow",
  "label-fade",
  "needle-loop",
  "check-draw-loop-1",
  "check-draw-loop-2",
  "check-draw-loop-3",
  "layer-rise-loop-1",
  "layer-rise-loop-2",
  "layer-rise-loop-3",
  "donut-pop-loop",
  "pillar-seq-1",
  "pillar-seq-2",
  "pillar-seq-3",
  "pillar-seq-4",
  "deck-seq",
  "user-seq",
  "roadblock-fade",
  "noti-1-seq",
  "noti-2-seq",
  "noti-3-seq",
  "noti-4-seq",
  "noti-5-seq",
  "noti-6-seq",
  "arch-left-seq",
  "arch-right-seq",
  "keystone-seq",
  "laser-seq",
  "backend-engine-cockpit",
  "cockpit-engine-flow",
  "owner-cockpit-rise",
  "cockpit-owner-enter",
  "cockpit-controls-reveal"
];

test("every About SVG motion class runs only under the active timeline card", async () => {
  const css = await read("app/globals.css");

  for (const className of activeMotionClasses) {
    assert.match(
      css,
      new RegExp(
        `\\.dse-vision-story__card\\.active\\s+\\.${escapeRegExp(className)}(?:\\s*,|\\s*\\{)`
      ),
      `${className} must have an active-card-scoped motion rule`
    );
  }

  for (const keyframe of requiredKeyframes) {
    assert.match(css, new RegExp(`@keyframes\\s+${escapeRegExp(keyframe)}\\b`));
  }
});

test("About SVG motion has a complete reduced-motion final state", async () => {
  const css = await read("app/globals.css");
  const reducedMotion =
    css
      .match(/@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{([\s\S]*?)\n\}/g)
      ?.join("\n") ?? "";

  assert.match(reducedMotion, /\.dse-vision-story__canvas \[class\*="anim-"\]/);
  assert.match(reducedMotion, /animation:\s*none\s*!important/);
  assert.match(reducedMotion, /stroke-dashoffset:\s*0\s*!important/);
  assert.match(reducedMotion, /\.phase-a\s*\{[^}]*display:\s*none/);
  assert.match(reducedMotion, /\.phase-b\s*\{[^}]*opacity:\s*1\s*!important/);
});

test("About timeline titles keep the two-line desktop rhythm and release wrapping on smaller screens", async () => {
  const css = await read("app/globals.css");

  assert.match(
    css,
    /\.dse-vision-story__chapter-copy h3\s*\{[^}]*font-size:\s*clamp\(3rem,\s*3\.7vw,\s*3\.5rem\)/
  );
  assert.match(
    css,
    /\.dse-vision-story__heading-line\s*\{[^}]*display:\s*block;[^}]*white-space:\s*nowrap/
  );
  assert.match(
    css,
    /@media\s*\(max-width:\s*900px\)[\s\S]*?\.dse-vision-story__heading-line\s*\{[^}]*white-space:\s*normal/
  );
});
