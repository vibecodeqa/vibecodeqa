#!/usr/bin/env node
// Enforces the shared rule contract (docs/docs/standards/rule-contract.md).
//
// The meta-pages that *define* the contract are checked by name, because there are three of
// them and they never multiply. The rubrics that must *carry* it are derived from the
// registry, because they do multiply: this list was hand-extended four times and fell behind
// every time, so of the eight published rubrics only `testing` was ever checked while six
// others quietly failed the contract with a green deploy (#50).
//
// The point of deriving is the default. Publish a new standard and it is enforced without
// anyone remembering to edit this file; a rubric that is not ready must be named in
// `pendingRuleContract` below, out loud, with a reason.
//
//   node standards/validate-rule-contract.mjs

import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, '..');
const registry = JSON.parse(readFileSync(join(here, 'registry.json'), 'utf8'));

// Pages that define the contract. Named individually on purpose: they are the source text.
const metaChecks = [
  ['docs/docs/standards/rule-contract.md', '`blocker`'],
  ['docs/docs/standards/rule-contract.md', '`high`'],
  ['docs/docs/standards/rule-contract.md', '`medium`'],
  ['docs/docs/standards/rule-contract.md', '`low`'],
  ['docs/docs/standards/rule-contract.md', '`evidence-only`'],
  ['docs/docs/standards/rule-contract.md', 'acceptedException:'],
  ['docs/docs/standards/rule-contract.md', 'owner:'],
  ['docs/docs/standards/rule-contract.md', 'scope:'],
  ['docs/docs/standards/rule-contract.md', 'environmentOrTenant:'],
  ['docs/docs/standards/rule-contract.md', 'compensatingControls:'],
  ['docs/docs/standards/rule-contract.md', 'expiryOrReviewDate:'],
  ['docs/docs/standards/rule-contract.md', 'approvalTrail:'],
  ['docs/docs/standards/authoring.md', '[rule contract](rule-contract.md)'],
  ['docs/docs/standards/authoring.md', '**Severity:**'],
  ['docs/docs/standards/authoring.md', '**Evidence:**'],
  ['docs/docs/standards/authoring.md', '**Exception:**'],
  ['docs/docs/standards/assessment.md', '[rule contract](rule-contract.md)']
];

// Exemplar rule pages: proof that the contract is expressible per rule, not only as an index
// table. Both compliant rubrics are represented so neither exemplar can rot unnoticed.
const exemplarRulePages = [
  ['standards/testing/docs/v1/ci-and-evidence.md', '**Severity.**'],
  ['standards/testing/docs/v1/ci-and-evidence.md', '**Evidence.**'],
  ['standards/flutter-firebase-app/docs/v1/firestore-rules-and-indexes.md', '**Severity.**'],
  ['standards/flutter-firebase-app/docs/v1/firestore-rules-and-indexes.md', '**Evidence.**']
];

// Published rubrics that do not carry the contract yet. Shrink this list; do not grow it.
// Each entry is a rubric whose index has no `## Severity and evidence defaults` table, so a
// judge cannot tell whether a rule is a blocker or a nit. Writing those tables is content
// work tracked separately — see #50. A standard published from here on is enforced by
// default and must not be added to this set to make CI green.
const pendingRuleContract = new Map([
  ['react-spa', 'no severity or exception information on any of its 12 rule pages'],
  ['cloudflare-worker-mcp-server', 'two rule pages carry severity; the index has no defaults table'],
  ['cloudflare-d1-app', 'no severity or exception information on any of its 6 rule pages'],
  ['security', 'no severity or exception information on any of its 7 rule pages'],
  ['typescript', 'no severity or exception information on any of its 9 rule pages'],
  ['tenant-deployed-cloudflare-saas', 'no severity or exception information on any of its 7 rule pages']
]);

// A published standard's rubric lives at standards/<id>/docs/<edition>/index.md, which is
// exactly what its versioned standardUrl spells out. Deriving from the URL rather than from a
// disk glob keeps work-in-progress rubric directories (and any future scratch dir) out of the
// bar, and dedupes recipes that alias another standard's rubric — `react-spa-on-cloudflare-pages`
// points at `cloudflare-pages-fullstack/v1`, so it must not be checked or reported twice.
function rubricIndexPath(standardUrl) {
  const match = standardUrl?.replace(/^https:\/\/vibecodeqa\.online/, '')
    .match(/^\/standards\/([^/]+)\/(v\d+)\/$/);
  if (!match) return null;
  return join(here, match[1], 'docs', match[2], 'index.md');
}

const rubrics = new Map(); // resolved path -> standard ids that publish it
for (const standard of registry.standards) {
  if (standard.status !== 'published') continue;
  if (standard.repo !== 'vibecodeqa/vibecodeqa') continue;
  const path = rubricIndexPath(standard.standardUrl);
  if (!path) continue;
  if (!rubrics.has(path)) rubrics.set(path, []);
  rubrics.get(path).push(standard.id);
}

const failures = [];

function contentOf(file) {
  const path = join(repoRoot, file);
  if (!existsSync(path)) {
    failures.push(`${file} is missing`);
    return null;
  }
  return readFileSync(path, 'utf8');
}

for (const [file, text] of [...metaChecks, ...exemplarRulePages]) {
  const content = contentOf(file);
  if (content !== null && !content.includes(text)) {
    failures.push(`${file} must contain ${text}`);
  }
}

let enforced = 0;
let exempt = 0;
for (const [path, ids] of [...rubrics].sort()) {
  const file = relative(repoRoot, path);
  const pending = ids.filter((id) => pendingRuleContract.has(id));
  if (pending.length === ids.length) {
    exempt += 1;
    continue;
  }
  enforced += 1;
  const owner = ids.join(', ');
  if (!existsSync(path)) {
    failures.push(`${file} is missing, but ${owner} publishes it as a rubric`);
    continue;
  }
  const content = readFileSync(path, 'utf8');
  if (!content.includes('## Severity and evidence defaults')) {
    failures.push(
      `${file} (${owner}) must carry a "## Severity and evidence defaults" section. ` +
        'See docs/docs/standards/rule-contract.md.'
    );
  }
  if (!content.includes('acceptedException')) {
    failures.push(
      `${file} (${owner}) must reference the shared acceptedException template. ` +
        'See docs/docs/standards/rule-contract.md.'
    );
  }
}

// An exemption for a standard that is no longer published is a stale line pretending to be a
// decision. Fail on it, so the set can only shrink.
for (const id of pendingRuleContract.keys()) {
  const standard = registry.standards.find((entry) => entry.id === id);
  if (!standard) {
    failures.push(`pendingRuleContract names "${id}", which is not in the registry — remove it`);
  } else if (standard.status !== 'published') {
    failures.push(`pendingRuleContract names "${id}", which is not published — remove it`);
  }
}

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join('\n'));
  process.exit(1);
}

console.log(
  `Rule contract validation passed (${enforced} rubric(s) enforced, ${exempt} awaiting the contract)`
);
