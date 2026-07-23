import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const sourceRoot = path.resolve(process.env.DSE_SOURCE_ROOT || process.cwd());
const socialPagePath = path.join(
  sourceRoot,
  "app/(landing-pages)/social-media-management-plus-seo/page.tsx"
);
const toolCarouselPath = path.join(
  sourceRoot,
  "components/landing/ToolLogoCarousel.tsx"
);
const [socialPage, toolCarousel] = await Promise.all([
  readFile(socialPagePath, "utf8"),
  readFile(toolCarouselPath, "utf8")
]);
const componentImports = [
  ...socialPage.matchAll(/from "(@\/components\/[^"]+)"/g)
].map((match) => match[1]);
const logoAssets = [
  ...new Set(
    [socialPage, toolCarousel].flatMap((source) =>
      [...source.matchAll(/"(\/logos\/tools\/[^"]+\.svg)"/g)].map((match) => match[1])
    )
  )
].sort();

async function resolvesToSourceFile(importPath) {
  const relativePath = importPath.replace(/^@\//, "");
  const candidates = [
    `${relativePath}.ts`,
    `${relativePath}.tsx`,
    path.join(relativePath, "index.ts"),
    path.join(relativePath, "index.tsx")
  ];

  for (const candidate of candidates) {
    try {
      await access(path.join(sourceRoot, candidate));
      return true;
    } catch {
      // Try the next supported source-file shape.
    }
  }

  return false;
}

test("every local component imported by the SMM page resolves to source", async () => {
  assert.ok(componentImports.length > 0, "Expected the SMM page to import local components");

  const missing = [];
  for (const importPath of componentImports) {
    if (!(await resolvesToSourceFile(importPath))) {
      missing.push(importPath);
    }
  }

  assert.deepEqual(missing, []);
});

test("every tool logo referenced by the SMM page resolves to a public asset", async () => {
  assert.equal(logoAssets.length, 32);

  const missing = [];
  for (const assetPath of logoAssets) {
    try {
      await access(path.join(sourceRoot, "public", assetPath.replace(/^\//, "")));
    } catch {
      missing.push(assetPath);
    }
  }

  assert.deepEqual(missing, []);
});
