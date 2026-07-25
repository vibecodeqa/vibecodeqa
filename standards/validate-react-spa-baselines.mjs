#!/usr/bin/env node
import { readFileSync } from "node:fs";

const baseline = JSON.parse(readFileSync("standards/react-spa/baselines.json", "utf8"));
const registry = JSON.parse(readFileSync("standards/registry.json", "utf8"));
const failures = [];

const standard = registry.standards.find((entry) => entry.id === baseline.standard);
const edition = standard?.editions?.find((entry) => entry.version === baseline.edition);

if (!edition) {
  failures.push(`Missing ${baseline.standard}@${baseline.edition} in standards/registry.json`);
} else {
  for (const [name, expected] of Object.entries(baseline.registryTargets)) {
    if (edition.targets?.[name] !== expected) {
      failures.push(
        `registry target ${name} expected ${JSON.stringify(expected)}, got ${JSON.stringify(edition.targets?.[name])}`,
      );
    }
  }
}

mustContain("standards/react-spa/docs/v1/index.md", baseline.labels.full);
mustContain("standards/react-spa/docs/index.md", baseline.labels.short);
mustContain("standards/react-spa/README.md", baseline.labels.short);
mustContain("standards/react-spa/docs/v1/project-setup.md", "TypeScript on **6.x**");
mustContain("standards/react-spa/docs/v1/project-setup.md", "minimum Vite-supported runtime");
mustContain("standards/react-spa/docs/v1/project-setup.md", "`engines.node` present and compatible with `>=20.19`");
mustContain("standards/react-spa/docs/v1/project-setup.md", "22.12+ or 24 LTS");

mustNotContain("standards/react-spa/docs/v1/project-setup.md", "TypeScript 5.7");
mustNotContain("standards/react-spa/docs/v1/project-setup.md", "`engines.node` present and `>= 20`");
mustNotContain("standards/react-spa/docs/v1/project-setup.md", "Node 22+ pinned");

if (failures.length > 0) {
  console.error("React SPA baseline validation failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("React SPA baseline validation passed");

function mustContain(file, text) {
  const content = readFileSync(file, "utf8");
  if (!content.includes(text)) {
    failures.push(`${file} must contain: ${text}`);
  }
}

function mustNotContain(file, text) {
  const content = readFileSync(file, "utf8");
  if (content.includes(text)) {
    failures.push(`${file} must not contain: ${text}`);
  }
}
