#!/usr/bin/env node
/**
 * brand/build.mjs — keep the served brand assets in sync with brand/.
 *
 * `brand/` is the single source of truth for VibeCode QA's visual identity.
 * The site serves some of those assets from the repo root because 17 HTML
 * pages link `/favicon.svg` and index.html points Open Graph at
 * `/og-image.png`. Those root files are COPIES, and this script owns them.
 *
 *   node brand/build.mjs           regenerate the root copies
 *   node brand/build.mjs --check   fail if a copy is stale or an export is
 *                                  missing / the wrong size (no native tools
 *                                  needed — safe to run in CI)
 *   node brand/build.mjs --render  re-render the PNG exports from source
 *                                  (needs rsvg-convert and sips; macOS/local)
 *
 * --check deliberately does NOT render. Rendering needs librsvg and sips,
 * which the deploy runner does not have; the exports are committed artifacts
 * and --check verifies the committed bytes instead.
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const brandDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(brandDir, "..");

/** Root files that are copies of a brand/ source. The root file is generated. */
const COPIES = [
  { from: "brand/favicon.svg", to: "favicon.svg" },
  { from: "brand/og/og-image.svg", to: "og-image.svg" },
  { from: "brand/og/og-image.png", to: "og-image.png" },
];

/** Committed PNG exports and the exact pixel size each one must have. */
const EXPORTS = [
  { file: "brand/og/og-image.png", width: 1200, height: 630 },
  { file: "brand/logo/icon-512.png", width: 512, height: 512 },
  { file: "brand/logo/icon-avatar-512.png", width: 512, height: 512 },
  { file: "brand/logo/icon-256.png", width: 256, height: 256 },
  { file: "brand/logo/icon-128.png", width: 128, height: 128 },
  { file: "brand/logo/icon-64.png", width: 64, height: 64 },
  { file: "brand/logo/icon-32.png", width: 32, height: 32 },
];

/** How each rendered export is produced. Ordered: sources before derivatives. */
const RENDERS = [
  { tool: "rsvg", from: "brand/og/og-image.svg", to: "brand/og/og-image.png", width: 1200, height: 630, background: "#09090b" },
  { tool: "rsvg", from: "brand/logo/icon-avatar.svg", to: "brand/logo/icon-avatar-512.png", width: 512, height: 512 },
  { tool: "sips", from: "brand/logo/icon-512.png", to: "brand/logo/icon-256.png", size: 256 },
  { tool: "sips", from: "brand/logo/icon-512.png", to: "brand/logo/icon-128.png", size: 128 },
  { tool: "sips", from: "brand/logo/icon-512.png", to: "brand/logo/icon-64.png", size: 64 },
  { tool: "sips", from: "brand/logo/icon-512.png", to: "brand/logo/icon-32.png", size: 32 },
];

const mode = process.argv.includes("--check")
  ? "check"
  : process.argv.includes("--render")
    ? "render"
    : "copy";

const failures = [];
const abs = (relative) => path.join(repoRoot, relative);

if (mode === "render") {
  render();
}

if (mode === "check") {
  checkCopies();
  checkExports();
} else {
  writeCopies();
}

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`✗ ${failure}`);
  }
  console.error(`\n${failures.length} brand asset problem(s). Run: node brand/build.mjs`);
  process.exit(1);
}

console.log(
  mode === "check"
    ? `Brand check passed: ${COPIES.length} copies in sync, ${EXPORTS.length} exports present at the declared size.`
    : `Brand assets written: ${COPIES.length} root copies regenerated from brand/.`,
);

function writeCopies() {
  for (const { from, to } of COPIES) {
    if (!existsSync(abs(from))) {
      failures.push(`missing brand source: ${from}`);
      continue;
    }
    writeFileSync(abs(to), readFileSync(abs(from)));
    console.log(`  ${to} <- ${from}`);
  }
}

function checkCopies() {
  for (const { from, to } of COPIES) {
    if (!existsSync(abs(from))) {
      failures.push(`missing brand source: ${from}`);
      continue;
    }
    if (!existsSync(abs(to))) {
      failures.push(`missing generated copy: ${to} (source ${from})`);
      continue;
    }
    if (!readFileSync(abs(from)).equals(readFileSync(abs(to)))) {
      failures.push(`${to} has drifted from its source ${from} — edit the source, not the copy`);
    }
  }
}

function checkExports() {
  for (const { file, width, height } of EXPORTS) {
    if (!existsSync(abs(file))) {
      failures.push(`missing export: ${file}`);
      continue;
    }
    const actual = pngSize(readFileSync(abs(file)));
    if (!actual) {
      failures.push(`${file} is not a readable PNG`);
      continue;
    }
    if (actual.width !== width || actual.height !== height) {
      failures.push(`${file} is ${actual.width}x${actual.height}, expected ${width}x${height}`);
    }
  }
}

/** Read width/height straight out of the PNG IHDR chunk — no dependencies. */
function pngSize(buffer) {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (buffer.length < 24 || !buffer.subarray(0, 8).equals(signature)) {
    return null;
  }
  if (buffer.toString("ascii", 12, 16) !== "IHDR") {
    return null;
  }
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

function render() {
  requireTool("rsvg-convert", "brew install librsvg");
  requireTool("sips", "sips ships with macOS; on Linux render the exports another way");

  for (const job of RENDERS) {
    if (job.tool === "rsvg") {
      const args = ["-w", String(job.width), "-h", String(job.height)];
      if (job.background) {
        args.push("-b", job.background);
      }
      args.push("-o", abs(job.to), abs(job.from));
      execFileSync("rsvg-convert", args, { stdio: "inherit", cwd: path.dirname(abs(job.from)) });
    } else {
      execFileSync(
        "sips",
        ["-s", "format", "png", "-z", String(job.size), String(job.size), abs(job.from), "--out", abs(job.to)],
        { stdio: "ignore" },
      );
    }
    console.log(`  rendered ${job.to} <- ${job.from}`);
  }
}

function requireTool(binary, hint) {
  try {
    execFileSync("which", [binary], { stdio: "ignore" });
  } catch {
    console.error(`✗ --render needs \`${binary}\`, which is not on PATH. ${hint}`);
    process.exit(2);
  }
}
