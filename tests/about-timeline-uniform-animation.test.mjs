import assert from "node:assert/strict";
import test from "node:test";

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
