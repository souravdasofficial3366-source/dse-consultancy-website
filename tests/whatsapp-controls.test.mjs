import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const [layout, css] = await Promise.all([
  readFile("components/layout/LayoutParts.tsx", "utf8"),
  readFile("app/globals.css", "utf8")
]);

test("header WhatsApp keeps its configured destination and green asset", () => {
  assert.match(layout, /className="icon-button whatsapp-header-btn"/);
  assert.match(layout, /href={`https:\/\/wa\.me\/\${siteConfig\.whatsapp}`}/);
  assert.match(layout, /src="\/icons\/whatsapp-green\.svg"/);
  assert.match(
    css,
    /\.whatsapp-header-btn\s*\{[^}]*border-color:\s*#25d366/
  );
  assert.match(
    css,
    /\.whatsapp-header-btn:is\(:hover,\s*:focus-visible\)\s*\{[^}]*background:\s*#25d366/
  );
  assert.match(
    css,
    /\.whatsapp-header-btn:is\(:hover,\s*:focus-visible\) img\s*\{[^}]*filter:\s*brightness\(0\)/
  );
});

test("footer WhatsApp matches orange neighbours and turns dark on interaction", () => {
  assert.match(layout, /className="footer-whatsapp-link"/);
  assert.match(layout, /src="\/icons\/whatsapp-orange\.svg"/);
  assert.match(
    css,
    /\.footer-whatsapp-link:is\(:hover,\s*:focus-visible\) img\s*\{[^}]*filter:\s*brightness\(0\)/
  );
});

test("the floating WhatsApp control remains the existing green control", () => {
  assert.match(layout, /className="whatsapp-fab"/);
  assert.match(css, /\.whatsapp-fab\s*\{[^}]*background:\s*#25d366/);
});
