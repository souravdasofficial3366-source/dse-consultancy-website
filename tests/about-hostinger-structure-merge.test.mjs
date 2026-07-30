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

test("the About page merges the Hostinger upper structure with the Vercel lower structure", async () => {
  const [page, layout] = await Promise.all([
    read("app/(website-pages)/about-us/page.tsx"),
    read("components/layout/LayoutParts.tsx")
  ]);

  assert.match(page, /AboutStoryVideoMark/);
  assert.match(page, /About DSE Consultancy/);
  assert.match(page, /Digital Work/);
  assert.match(page, /Should Feel Clear,/);
  assert.match(page, /Connected And Useful\./);
  assert.match(page, /Our Point Of View/);
  assert.match(page, /A strong digital presence is not one website/);
  assert.match(page, /Built For Businesses/);
  assert.match(page, /That Need A Practical/);
  assert.match(page, /Digital Growth Partner\./);
  assert.match(page, /DSE Consultancy is a Kolkata-focused digital consultancy/);
  assert.match(page, /Our work begins with the business/);

  assert.ok(page.indexOf("<AboutStoryVideoMark />") < page.indexOf("<AboutVisionStory />"));
  assert.ok(page.indexOf("<AboutVisionStory />") < page.indexOf('id="faq"'));
  assert.match(page, /<FaqJsonLd items={aboutFaqs} \/>/);
  assert.match(page, /<FaqList items={aboutFaqs} \/>/);

  assert.doesNotMatch(page, /Specialist Thinking/);
  assert.doesNotMatch(page, /One Connected Delivery System/);
  assert.doesNotMatch(page, /Bring Us The Business Challenge/);
  assert.doesNotMatch(page, /<Header|<Footer|<WhatsAppFab|<MobileCallFab/);

  assert.match(layout, /export function Footer\(\)/);
  assert.match(layout, /className="footer-cta"/);
  assert.match(layout, /Let&apos;s Build the Digital Presence Your Business Deserves\./);
  assert.match(layout, /className="footer-grid"/);
});

test("the existing timeline remains eight chapters with the approved chapter five title", async () => {
  const timeline = await read("components/about/AboutVisionStory.tsx");

  assert.equal((timeline.match(/number: "0[1-8]"/g) ?? []).length, 8);
  assert.match(
    timeline,
    /heading: \["Prepare For Roadblocks", "Before They Slow Growth\."\] as const/
  );
  assert.doesNotMatch(timeline, /Plan Ahead For The Roadblocks That Come Next/);
});
