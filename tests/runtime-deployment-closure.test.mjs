import assert from "node:assert/strict";
import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync
} from "node:fs";
import { dirname, extname, isAbsolute, join, relative, resolve, sep } from "node:path";
import test from "node:test";

const sourceRoot = resolve(process.env.DSE_SOURCE_ROOT || process.cwd());

const requiredRuntimePaths = [
  "/fonts/AnekTelugu-Regular.ttf",
  "/videos/banner_section_Hero_video.mp4",
  "/videos/growth_visibility_assistant_search.mp4",
  "/videos/growth_social_proof_scroll.mp4",
  "/videos/growth_business_call.mp4",
  "/videos/connected_discovery_navigation.mp4",
  "/videos/connected_trust_seminar_audience.mp4",
  "/videos/connected_action_meeting.mp4",
  "/branding/dse-consultancy-logo-orange.png"
];

const requiredPageFiles = [
  "app/(website-pages)/blog/page.tsx",
  "app/(website-pages)/blog/[slug]/page.tsx",
  "app/(website-pages)/privacy-policy/page.tsx",
  "app/(website-pages)/terms-and-conditions/page.tsx"
];

const shellFiles = [
  "components/layout/LayoutParts.tsx",
  "components/layout/MobileNavigation.tsx",
  "components/layout/HeaderNavigation.tsx"
];

function absolute(relativePath) {
  return join(sourceRoot, relativePath);
}

function read(relativePath) {
  return readFileSync(absolute(relativePath), "utf8");
}

function walk(relativeRoot) {
  const root = absolute(relativeRoot);
  if (!existsSync(root)) {
    return [];
  }

  return readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const relativePath = join(relativeRoot, entry.name);
    return entry.isDirectory() ? walk(relativePath) : [relativePath];
  });
}

function sourceFiles() {
  const extensions = new Set([".css", ".js", ".jsx", ".mjs", ".ts", ".tsx"]);
  return ["app", "components", "data", "lib"]
    .flatMap(walk)
    .filter((file) => extensions.has(extname(file)));
}

function localRuntimePaths(source) {
  const paths = new Set();
  const matcher =
    /(?:["'`]|\()(?<path>\/[^"'`()\s?#]+\.(?:avif|gif|ico|jpe?g|mp4|otf|png|svg|ttf|webm|webp|woff2?))(?:[?#][^"'`()\s]*)?(?:["'`]|\))/gi;

  for (const match of source.matchAll(matcher)) {
    paths.add(match.groups.path);
  }

  return [...paths];
}

function resolvePublicRuntimePath(runtimePath) {
  const publicRoot = resolve(sourceRoot, "public");
  const target = resolve(publicRoot, runtimePath.replace(/^\/+/, ""));
  const relativeTarget = relative(publicRoot, target);

  if (
    relativeTarget === ".." ||
    relativeTarget.startsWith(`..${sep}`) ||
    isAbsolute(relativeTarget)
  ) {
    return null;
  }

  return target;
}

test("runtime scanning covers current and future image, icon, video and font formats", () => {
  const found = localRuntimePaths(`
    url("/images/preview.webp")
    href="/favicon.ico"
    src="/fonts/BrandDisplay.otf"
    src="/images/existing.png"
  `);

  assert.deepEqual(
    found.sort(),
    [
      "/favicon.ico",
      "/fonts/BrandDisplay.otf",
      "/images/existing.png",
      "/images/preview.webp"
    ]
  );
});

test("runtime asset resolution cannot escape the public root", () => {
  assert.equal(resolvePublicRuntimePath("/../escape.webp"), null);
  assert.equal(resolvePublicRuntimePath("/images/../../escape.ico"), null);

  const validTarget = resolvePublicRuntimePath("/images/preview.webp");
  assert.ok(validTarget?.startsWith(`${resolve(sourceRoot, "public")}/`));
  assert.equal(validTarget, resolve(sourceRoot, "public/images/preview.webp"));
});

function resolveCodeImport(importer, specifier) {
  if (!specifier.startsWith("@/") && !specifier.startsWith(".")) {
    return null;
  }

  const base = specifier.startsWith("@/")
    ? absolute(specifier.slice(2))
    : resolve(dirname(absolute(importer)), specifier);
  const candidates = [
    base,
    ...[".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".css"].map((extension) => `${base}${extension}`),
    ...[".ts", ".tsx", ".js", ".jsx"].map((extension) => join(base, `index${extension}`))
  ];

  return candidates.find((candidate) => existsSync(candidate)) ?? base;
}

function appRoutes() {
  return walk("app")
    .filter((file) => /(?:^|\/)page\.(?:js|jsx|ts|tsx)$/.test(file))
    .map((file) => {
      const route = file
        .replace(/^app\//, "")
        .replace(/(?:^|\/)\([^/]+\)/g, "")
        .replace(/\/page\.(?:js|jsx|ts|tsx)$/, "")
        .replace(/^page\.(?:js|jsx|ts|tsx)$/, "")
        .replace(/\/+/g, "/");
      return route ? `/${route.replace(/^\//, "")}` : "/";
    });
}

function literalInternalLinks(relativePath) {
  const source = read(relativePath);
  return [...source.matchAll(/\bhref\s*=\s*["'](?<href>\/[^"']*)["']/g)]
    .map((match) => match.groups.href.split("#")[0])
    .filter(Boolean);
}

test("all local runtime paths referenced by source and CSS exist under public", () => {
  const missing = [];

  for (const file of sourceFiles()) {
    for (const runtimePath of localRuntimePaths(read(file))) {
      const target = resolvePublicRuntimePath(runtimePath);
      if (!target || !existsSync(target) || !statSync(target).isFile()) {
        missing.push(`${relative(sourceRoot, absolute(file))}: ${runtimePath}`);
      }
    }
  }

  assert.deepEqual(missing, [], `Missing local runtime assets:\n${missing.join("\n")}`);
});

test("the required font, seven videos, and orange logo are present", () => {
  const missing = requiredRuntimePaths.filter(
    (runtimePath) => !existsSync(absolute(join("public", runtimePath.replace(/^\//, ""))))
  );

  assert.deepEqual(missing, [], `Missing required runtime assets:\n${missing.join("\n")}`);
});

test("the current shell and footer copy survive a clean source root", () => {
  for (const file of shellFiles) {
    assert.ok(existsSync(absolute(file)), `Missing current shell file: ${file}`);
  }

  assert.match(
    read("components/layout/LayoutParts.tsx"),
    /Let&apos;s Build the Digital Presence Your Business Deserves\./
  );
  assert.match(
    read("components/layout/LayoutParts.tsx"),
    /\/branding\/dse-consultancy-logo-orange\.png/
  );
});

test("current shell imports resolve inside the source root", () => {
  const unresolved = [];

  for (const file of shellFiles) {
    if (!existsSync(absolute(file))) {
      unresolved.push(`${file}: file is missing`);
      continue;
    }

    const source = read(file);
    for (const match of source.matchAll(/(?:from\s+|import\s*)["'](?<specifier>[^"']+)["']/g)) {
      const resolved = resolveCodeImport(file, match.groups.specifier);
      if (resolved && !existsSync(resolved)) {
        unresolved.push(`${file}: ${match.groups.specifier}`);
      }
    }
  }

  assert.deepEqual(unresolved, [], `Unresolved shell imports:\n${unresolved.join("\n")}`);
});

test("blog and legal page files exist", () => {
  const missing = requiredPageFiles.filter((file) => !existsSync(absolute(file)));
  assert.deepEqual(missing, [], `Missing linked route pages:\n${missing.join("\n")}`);
});

test("Home, blog, and shell links resolve to static or approved dynamic routes", () => {
  const routes = new Set(appRoutes());
  const linkSources = [
    "app/(landing-pages)/page.tsx",
    "app/(website-pages)/blog/page.tsx",
    "app/(website-pages)/blog/[slug]/page.tsx",
    "components/layout/LayoutParts.tsx"
  ];
  const unresolved = [];

  for (const file of linkSources) {
    if (!existsSync(absolute(file))) {
      unresolved.push(`${file}: source file is missing`);
      continue;
    }

    for (const href of literalInternalLinks(file)) {
      if (!routes.has(href)) {
        unresolved.push(`${file}: ${href}`);
      }
    }
  }

  assert.ok(
    routes.has("/blog/[slug]"),
    "Missing approved dynamic article route: /blog/[slug]/page.tsx"
  );
  assert.deepEqual(unresolved, [], `Internal links without route targets:\n${unresolved.join("\n")}`);
});

test("sitemap covers primary, legal, blog, and every service-detail route", () => {
  const sitemapSource = read("app/sitemap.ts");
  const serviceSource = read("data/services.ts");
  const requiredStaticRoutes = [
    "/about-us",
    "/contact-us",
    "/services",
    "/website-development",
    "/social-media-management-plus-seo",
    "/blog",
    "/privacy-policy",
    "/terms-and-conditions"
  ];
  const serviceSlugs = [...serviceSource.matchAll(/\bslug:\s*"(?<slug>[^"]+)"/g)]
    .map((match) => match.groups.slug);

  assert.match(sitemapSource, /url:\s*siteConfig\.siteUrl\b/, "Sitemap is missing Home");
  for (const route of requiredStaticRoutes) {
    assert.match(sitemapSource, new RegExp(`["']${route.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']`));
  }
  assert.match(sitemapSource, /services\.map\(\(service\)\s*=>\s*`\/services\/\$\{service\.slug\}`\)/);
  assert.ok(serviceSlugs.length > 0, "No service-detail slugs were found");
  assert.ok(
    appRoutes().some((route) => /^\/services\/\[[^\]]+\]$/.test(route)),
    "Missing dynamic service-detail route target"
  );
});
