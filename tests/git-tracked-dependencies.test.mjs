import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const trackedFiles = new Set(
  execFileSync("git", ["ls-files", "--cached"], { cwd: root, encoding: "utf8" })
    .split("\n")
    .filter(Boolean)
);
const sourceFiles = [...trackedFiles].filter((file) => /\.[cm]?[jt]sx?$/.test(file));
const resolvableExtensions = [
  "",
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".json",
  ".css",
  "/index.ts",
  "/index.tsx",
  "/index.js",
  "/index.jsx"
];
const importPattern = /(?:import|export)\s+(?:[^"']*?\s+from\s+)?["']([^"']+)["']|import\(\s*["']([^"']+)["']\s*\)|require\(\s*["']([^"']+)["']\s*\)/g;

function resolveLocalImport(importer, specifier) {
  if (specifier.startsWith("./.next/")) return null;
  if (specifier.startsWith("@/")) return specifier.slice(2);
  if (specifier.startsWith(".")) {
    return path.posix.normalize(path.posix.join(path.posix.dirname(importer), specifier));
  }
  return null;
}

test("every local source dependency used by committed code is tracked by Git", () => {
  const missing = [];

  for (const importer of sourceFiles) {
    const source = execFileSync("git", ["show", `:${importer}`], {
      cwd: root,
      encoding: "utf8"
    });

    for (const match of source.matchAll(importPattern)) {
      const specifier = match[1] ?? match[2] ?? match[3];
      const candidate = resolveLocalImport(importer, specifier);
      if (!candidate) continue;

      const resolved = resolvableExtensions
        .map((extension) => `${candidate}${extension}`)
        .find((file) => trackedFiles.has(file));

      if (!resolved) missing.push(`${importer} -> ${specifier}`);
    }
  }

  assert.deepEqual(missing, [], `untracked local dependencies:\n${missing.join("\n")}`);
});
