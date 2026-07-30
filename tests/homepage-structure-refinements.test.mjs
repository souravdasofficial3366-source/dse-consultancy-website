import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const [home, css] = await Promise.all([
  readFile("app/(landing-pages)/page.tsx", "utf8"),
  readFile("app/globals.css", "utf8")
]);

function cssBlock(marker) {
  const start = css.indexOf(marker);
  assert.notEqual(start, -1, `missing CSS marker: ${marker}`);
  const open = css.indexOf("{", start);
  let depth = 0;

  for (let index = open; index < css.length; index += 1) {
    if (css[index] === "{") depth += 1;
    if (css[index] === "}") depth -= 1;
    if (depth === 0) return css.slice(start, index + 1);
  }

  assert.fail(`unterminated CSS block: ${marker}`);
}

test("both hero actions render their arrows in dedicated circular hooks", () => {
  assert.equal(
    (home.match(/className="consultancy-home-button-arrow"/g) ?? []).length,
    2
  );
  assert.match(
    cssBlock(".consultancy-home-button-arrow {"),
    /width:\s*32px[\s\S]*height:\s*32px[\s\S]*border-radius:\s*50%/
  );
});

test("hero actions match the service-card CTA text-to-icon spacing", () => {
  const serviceCtaRules = css.match(/^\.consultancy-service-content b\s*\{[^}]*\}/gm) ?? [];
  const effectiveServiceCta = serviceCtaRules.at(-1) ?? "";
  const heroCta = cssBlock(".consultancy-home-button {");

  assert.match(effectiveServiceCta, /gap:\s*14px/);
  assert.match(heroCta, /gap:\s*14px/);
});

test("services remove only their bottom gap before Connected Advantage", () => {
  assert.match(
    cssBlock(".consultancy-home-services {"),
    /padding-bottom:\s*0/
  );
});

test("wide desktop gives both approved headings two controlled visual lines", () => {
  const desktop = cssBlock("@media (min-width: 1200px) {");

  assert.match(
    desktop,
    /\.consultancy-home-system-copy[\s\S]*grid-template-columns:\s*minmax\(0,\s*1\.75fr\)\s+minmax\(400px,\s*\.9fr\)/
  );
  assert.match(
    desktop,
    /\.consultancy-home-insights \.consultancy-home-heading\.split[\s\S]*grid-template-columns:\s*minmax\(0,\s*1fr\)\s+auto/
  );
  assert.match(
    desktop,
    /\.consultancy-home-system-copy h2 span[\s\S]*white-space:\s*nowrap/
  );
  assert.match(
    desktop,
    /\.consultancy-home-insights \.consultancy-home-heading h2 span[\s\S]*white-space:\s*nowrap/
  );
});

test("the Blaze homepage closing section keeps the approved bright CTA treatment", () => {
  const closing = cssBlock(
    '.consultancy-home[data-home-palette="blaze"] .consultancy-home-closing {'
  );

  assert.match(
    closing,
    /linear-gradient\(135deg,\s*#fe6807 0%,\s*#ff8124 58%,\s*#d739a4 100%\)/
  );
  assert.match(
    css,
    /\.consultancy-home\[data-home-palette="blaze"\] \.consultancy-home-closing :is\([\s\S]*?h2,[\s\S]*?\.consultancy-home-closing-inner > span[\s\S]*?\)\s*\{[^}]*color:\s*#09080e/
  );
  assert.match(
    css,
    /\.consultancy-home\[data-home-palette="blaze"\] \.consultancy-home-closing a\s*\{[^}]*border-radius:\s*999px[^}]*background:\s*#09080e[^}]*color:\s*#fff/
  );
  assert.equal(
    (
      css.match(
        /\.consultancy-home\[data-home-palette="blaze"\] \.consultancy-home-closing a\s*\{/g
      ) ?? []
    ).length,
    1,
    "a later duplicate Blaze CTA rule must not override the black pill"
  );
});
