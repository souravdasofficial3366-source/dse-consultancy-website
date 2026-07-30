import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const [homePage, css] = await Promise.all([
  readFile("app/(landing-pages)/page.tsx", "utf8"),
  readFile("app/globals.css", "utf8")
]);

function blockAt(source, markerIndex) {
  const openIndex = source.indexOf("{", markerIndex);
  assert.notEqual(openIndex, -1, "missing opening brace");

  let depth = 0;
  for (let index = openIndex; index < source.length; index += 1) {
    if (source[index] === "{") depth += 1;
    if (source[index] === "}") depth -= 1;
    if (depth === 0) return source.slice(openIndex + 1, index);
  }

  assert.fail("missing closing brace");
}

function ruleBlock(source, selector) {
  const markerIndex = source.indexOf(selector);
  assert.notEqual(markerIndex, -1, `missing selector: ${selector}`);
  return blockAt(source, markerIndex);
}

function mediaBlock(query, requiredSelector) {
  let markerIndex = css.indexOf(query);

  while (markerIndex !== -1) {
    const block = blockAt(css, markerIndex);
    if (block.includes(requiredSelector)) return block;
    markerIndex = css.indexOf(query, markerIndex + query.length);
  }

  assert.fail(`missing media block ${query} containing ${requiredSelector}`);
}

test("homepage split-copy audit keeps both shared headings and the system section in scope", () => {
  assert.equal((homePage.match(/consultancy-home-heading split/g) ?? []).length, 2);
  assert.match(homePage, /className="consultancy-home-system-copy"/);
});

test("homepage split headings stay balanced while the system gets its approved wide desktop ratio", () => {
  const homepageSplit = ruleBlock(css, ".consultancy-home .consultancy-home-heading.split {");
  const systemWide = ruleBlock(css, ".consultancy-home .consultancy-home-system-copy {");
  const systemSectionStart = css.indexOf(".consultancy-home-system {");
  const systemBaseStart = css.indexOf(".consultancy-home-system-copy {", systemSectionStart);
  const systemBase = blockAt(css, systemBaseStart);
  const balancedColumns = /grid-template-columns:\s*minmax\(0,\s*1\.4fr\)\s+minmax\(420px,\s*1fr\)/;

  assert.match(homepageSplit, balancedColumns);
  assert.match(homepageSplit, /gap:\s*clamp\(24px,\s*3vw,\s*44px\)/);
  assert.match(
    systemWide,
    /grid-template-columns:\s*minmax\(0,\s*2\.1fr\)\s+minmax\(380px,\s*1fr\)/
  );
  assert.match(systemBase, /gap:\s*clamp\(24px,\s*3vw,\s*44px\)/);
});

test("split-copy layouts retain the existing tablet and mobile stack", () => {
  const responsive = mediaBlock("@media (max-width: 960px)", ".consultancy-home-system-copy");

  assert.match(responsive, /\.consultancy-home-heading\.split\s*\{\s*grid-template-columns:\s*1fr/);
  assert.match(
    responsive,
    /\.consultancy-home \.consultancy-home-heading\.split\s*\{\s*grid-template-columns:\s*1fr/
  );
  assert.match(responsive, /\.consultancy-home-system-copy\s*\{\s*grid-template-columns:\s*1fr/);
  assert.match(responsive, /\.consultancy-home-system-intro\s*\{\s*max-width:\s*720px/);
});
