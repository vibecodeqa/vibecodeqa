#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

const [, , siteDirArg, baseUrlArg, ...flags] = process.argv;

if (!siteDirArg || !baseUrlArg) {
  console.error("Usage: node scripts/generate-sitemap.mjs <site-dir> <base-url> [--check]");
  process.exit(2);
}

const siteDir = path.resolve(siteDirArg);
const baseUrl = normalizeBaseUrl(baseUrlArg);
const checkOnly = flags.includes("--check");
const sitemapPath = path.join(siteDir, "sitemap.xml");
const robotsPath = path.join(siteDir, "robots.txt");

if (!existsSync(siteDir)) {
  console.error(`Site directory does not exist: ${siteDir}`);
  process.exit(2);
}

const htmlFiles = walk(siteDir)
  .filter((file) => file.endsWith(".html"))
  .filter((file) => path.basename(file) !== "404.html")
  .sort((a, b) => a.localeCompare(b));

const urls = Array.from(
  new Set(
    htmlFiles
      .map((file) => canonicalUrlForFile(file, siteDir, baseUrl))
      .filter(Boolean),
  ),
).sort((a, b) => a.localeCompare(b));

const sitemap = renderSitemap(urls);
const robots = `User-agent: *\nAllow: /\n\nSitemap: ${baseUrl}/sitemap.xml\n`;

if (checkOnly) {
  assertFileMatches(sitemapPath, sitemap);
  assertFileMatches(robotsPath, robots);
  console.log(`Sitemap check passed: ${urls.length} URLs`);
} else {
  mkdirSync(siteDir, { recursive: true });
  writeFileSync(sitemapPath, sitemap);
  writeFileSync(robotsPath, robots);
  console.log(`Generated sitemap.xml with ${urls.length} URLs`);
}

function walk(root) {
  const entries = readdirSync(root, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name.startsWith(".")) {
      continue;
    }

    const fullPath = path.join(root, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(fullPath));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

function canonicalUrlForFile(file, root, base) {
  const html = readFileSync(file, "utf8");
  const canonical = getCanonicalHref(html);

  if (canonical) {
    return normalizeCanonical(canonical, base);
  }

  const relative = path.relative(root, file).split(path.sep).join("/");
  let urlPath;

  if (relative === "index.html") {
    urlPath = "/";
  } else if (relative.endsWith("/index.html")) {
    urlPath = `/${relative.slice(0, -"index.html".length)}`;
  } else {
    urlPath = `/${relative}`;
  }

  return `${base}${urlPath === "/" ? "" : urlPath}`;
}

function getCanonicalHref(html) {
  const links = html.matchAll(/<link\b[^>]*>/gi);
  for (const [tag] of links) {
    if (!/\brel=["']canonical["']/i.test(tag)) {
      continue;
    }

    const href = tag.match(/\bhref=["']([^"']+)["']/i);
    if (href?.[1]) {
      return href[1];
    }
  }

  return null;
}

function normalizeCanonical(href, base) {
  if (href.startsWith("/")) {
    return `${base}${href}`;
  }

  let parsed;
  try {
    parsed = new URL(href);
  } catch {
    return null;
  }

  if (`${parsed.protocol}//${parsed.host}` !== base) {
    return null;
  }

  return parsed.href;
}

function normalizeBaseUrl(value) {
  const parsed = new URL(value);
  return parsed.href.replace(/\/+$/, "");
}

function renderSitemap(urls) {
  const body = urls.map((url) => `  <url>\n    <loc>${escapeXml(url)}</loc>\n  </url>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function assertFileMatches(file, expected) {
  if (!existsSync(file)) {
    console.error(`Missing generated file: ${file}`);
    process.exit(1);
  }

  const actual = readFileSync(file, "utf8");
  if (actual !== expected) {
    console.error(`Generated file is stale: ${path.relative(process.cwd(), file)}`);
    console.error(`Run: node scripts/generate-sitemap.mjs ${path.relative(process.cwd(), siteDir)} ${baseUrl}`);
    process.exit(1);
  }

  const stats = statSync(file);
  if (!stats.isFile()) {
    console.error(`Generated path is not a file: ${file}`);
    process.exit(1);
  }
}
