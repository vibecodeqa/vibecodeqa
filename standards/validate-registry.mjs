#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const registry = JSON.parse(readFileSync(join(here, 'registry.json'), 'utf8'));
const compositions = JSON.parse(readFileSync(join(here, 'compositions.json'), 'utf8'));
const references = JSON.parse(readFileSync(join(here, 'references.json'), 'utf8'));

const errors = [];
const idPattern = /^[a-z0-9-]+$/;
const maturityRank = new Map([
  ['backlog', 0],
  ['draft-charter', 1],
  ['candidate-rubric', 2],
  ['authored-rubric', 3]
]);
const standardIds = new Set(registry.standards.map((standard) => standard.id));
const standardsById = new Map(registry.standards.map((standard) => [standard.id, standard]));
const stackItemIds = new Set(compositions.stackItems.map((item) => item.id));
const compositionIds = new Set(compositions.composedStandards.map((standard) => standard.id));
const referenceIds = new Set(references.categories.flatMap((category) => category.references).map((reference) => reference.id));

function fail(message) {
  errors.push(message);
}

function requireId(id, context) {
  if (!idPattern.test(id)) fail(`${context}: invalid id "${id}"`);
}

function checkRefs(values, context) {
  for (const id of values || []) {
    if (!standardIds.has(id)) fail(`${context}: unknown standard id "${id}"`);
  }
}

function checkStackItemRefs(values, context) {
  for (const id of values || []) {
    if (!stackItemIds.has(id) && !standardIds.has(id)) fail(`${context}: unknown stack item or standard id "${id}"`);
  }
}

function normalizeUrl(url) {
  if (url === null || url === undefined) return url;
  return url.replace(/^https:\/\/vibecodeqa\.online/, '');
}

function sameSet(left, right) {
  return JSON.stringify([...(left || [])].sort()) === JSON.stringify([...(right || [])].sort());
}

function localDocsPath(url) {
  const normalized = normalizeUrl(url);
  if (!normalized?.startsWith('/docs/standards/')) return null;
  const path = normalized.replace(/^\/docs\/standards\//, '').replace(/\/$/, '');
  return join(here, '..', 'docs/docs/standards', path ? `${path}.md` : 'index.md');
}

function standardEditionPath(url) {
  const normalized = normalizeUrl(url);
  const match = normalized?.match(/^\/standards\/([^/]+)\/(v\d+)\/$/);
  if (!match) return null;
  return join(here, match[1], 'docs', match[2], 'index.md');
}

function checkDocsUrl(url, context) {
  const path = localDocsPath(url);
  if (path && !existsSync(path)) fail(`${context}: docsUrl target does not exist at ${path}`);
}

function checkStandardUrl(url, context) {
  const path = standardEditionPath(url);
  if (path && !existsSync(path)) fail(`${context}: standardUrl target does not exist at ${path}`);
}

function walkPredicate(predicate, context) {
  if (!predicate || typeof predicate !== 'object') {
    fail(`${context}: detect predicate must be an object`);
    return;
  }
  if (predicate.all) predicate.all.forEach((child, index) => walkPredicate(child, `${context}.all[${index}]`));
  if (predicate.any) predicate.any.forEach((child, index) => walkPredicate(child, `${context}.any[${index}]`));
  if (predicate.not) walkPredicate(predicate.not, `${context}.not`);
  if (predicate.matched && !standardIds.has(predicate.matched)) {
    fail(`${context}: matched references unknown standard id "${predicate.matched}"`);
  }
}

if (registry.$schema !== './registry.schema.json') {
  fail(`registry $schema must be ./registry.schema.json, got ${registry.$schema}`);
}
if (!existsSync(join(here, 'registry.schema.json'))) {
  fail('registry.schema.json is missing');
}

for (const standard of registry.standards) {
  requireId(standard.id, standard.id);
  if ((standard.aliases || []).includes(standard.id)) fail(`${standard.id}: aliases must not include canonical id`);
  for (const alias of standard.aliases || []) requireId(alias, `${standard.id}.aliases`);
  if (standard.status === 'published') {
    if (!standard.standardUrl || !standard.standardUrl.endsWith('/v1/')) {
      fail(`${standard.id}: published standard must have a versioned standardUrl`);
    }
    const latest = (standard.editions || []).filter((edition) => edition.status === 'latest');
    if (latest.length !== 1) fail(`${standard.id}: published standard must have exactly one latest edition`);
  } else if (standard.standardUrl !== null) {
    fail(`${standard.id}: planned standard must use standardUrl: null`);
  }
  if (standard.url && /^https:\/\/vibecodeqa\.online\/standards\/[^/]+\/?$/.test(standard.url)) {
    fail(`${standard.id}: url points at an unversioned standards route`);
  }
  // Maturity is the finer-grained answer to "how close is this to a rubric". It must never
  // disagree with status, and every non-authored state must say what blocks it by name.
  if (!maturityRank.has(standard.maturity)) {
    fail(`${standard.id}: maturity must be one of ${[...maturityRank.keys()].join(', ')}, got ${JSON.stringify(standard.maturity)}`);
  } else if (standard.status === 'published' && standard.maturity !== 'authored-rubric') {
    fail(`${standard.id}: published standard must be maturity authored-rubric, got ${standard.maturity}`);
  } else if (standard.status !== 'published' && standard.maturity === 'authored-rubric') {
    fail(`${standard.id}: maturity authored-rubric requires registry status published`);
  }
  if (standard.maturity === 'authored-rubric') {
    if (standard.maturityNote !== null) {
      fail(`${standard.id}: authored standards use maturityNote: null; the rubric is the answer`);
    }
  } else if (typeof standard.maturityNote !== 'string' || standard.maturityNote.trim().length < 40) {
    fail(`${standard.id}: maturityNote must state the reason and the concrete blocker for ${standard.maturity}`);
  }
  checkDocsUrl(standard.docsUrl, `${standard.id}.docsUrl`);
  checkStandardUrl(standard.standardUrl, `${standard.id}.standardUrl`);
  checkRefs(standard.recommends, `${standard.id}.recommends`);
  checkRefs(standard.optionalLayers, `${standard.id}.optionalLayers`);
  checkRefs(standard.coveredLayers, `${standard.id}.coveredLayers`);
  checkRefs(standard.composes, `${standard.id}.composes`);
  walkPredicate(standard.detect, `${standard.id}.detect`);
  for (const edition of standard.editions || []) {
    if (!edition.lifecycle) fail(`${standard.id}.${edition.version}: edition lifecycle is required`);
    if (edition.lifecycle?.deprecated && !edition.lifecycle.supersededBy && edition.status !== 'retired') {
      fail(`${standard.id}.${edition.version}: deprecated latest editions must name supersededBy or be retired`);
    }
    if (edition.lifecycle?.supersededBy && !/^v\d+$/.test(edition.lifecycle.supersededBy)) {
      fail(`${standard.id}.${edition.version}: supersededBy must be an edition id such as v2`);
    }
  }
}

for (const composed of compositions.composedStandards) {
  if (!standardIds.has(composed.id)) fail(`compositions: ${composed.id} is missing from registry`);
  requireId(composed.id, `compositions.${composed.id}`);
  for (const alias of composed.aliases || []) requireId(alias, `${composed.id}.aliases`);
  checkStackItemRefs(composed.stackItems, `${composed.id}.stackItems`);
  checkStackItemRefs(composed.optionalStackItems, `${composed.id}.optionalStackItems`);
  checkDocsUrl(composed.docsUrl, `${composed.id}.docsUrl`);
  checkStandardUrl(composed.standardUrl, `${composed.id}.standardUrl`);

  const standard = standardsById.get(composed.id);
  if (!standard) continue;
  const expectedStatus = standard.status === 'published' ? 'authored' : 'planned';
  if (composed.status !== expectedStatus) {
    fail(`${composed.id}: composition status ${composed.status} disagrees with registry status ${standard.status}`);
  }
  if (!sameSet(composed.aliases, standard.aliases)) {
    fail(`${composed.id}: aliases disagree between compositions and registry`);
  }
  if (normalizeUrl(composed.docsUrl) !== normalizeUrl(standard.docsUrl)) {
    fail(`${composed.id}: docsUrl disagrees between compositions and registry`);
  }
  if (normalizeUrl(composed.standardUrl) !== normalizeUrl(standard.standardUrl)) {
    fail(`${composed.id}: standardUrl disagrees between compositions and registry`);
  }
  const latest = (standard.editions || []).find((edition) => edition.status === 'latest')?.version ?? null;
  if (composed.latestEdition !== latest) {
    fail(`${composed.id}: latestEdition disagrees with registry editions`);
  }
}
for (const standard of registry.standards) {
  if (standard.status === 'published' && !compositionIds.has(standard.id)) {
    fail(`registry: published standard ${standard.id} is missing from compositions`);
  }
}

for (const item of compositions.stackItems) {
  requireId(item.id, `stackItems.${item.id}`);
  checkDocsUrl(item.docsUrl, `${item.id}.docsUrl`);
  // Catalog surfaces render this title verbatim. Without it the generator would have to
  // guess a display name, which is how nav and index labels drifted apart before.
  if (typeof item.title !== 'string' || !item.title.trim()) {
    fail(`${item.id}: stack item must declare a title`);
  }
  const sharedStandard = standardsById.get(item.id);
  if (sharedStandard && sharedStandard.title !== item.title) {
    fail(`${item.id}: title disagrees between registry ("${sharedStandard.title}") and compositions ("${item.title}")`);
  }
  for (const reference of item.references || []) {
    if (!referenceIds.has(reference)) fail(`${item.id}.references: unknown reference id "${reference}"`);
  }
}

for (const standard of registry.standards) {
  if (typeof standard.title !== 'string' || !standard.title.trim()) {
    fail(`${standard.id}: standard must declare a title`);
  }
}

// Reverse direction: a catalog page added by hand, without metadata behind it, is
// invisible to every generated surface. Fail instead of silently dropping it.
function checkCatalogPagesAreBacked(section, backingUrls) {
  const dir = join(here, '..', 'docs/docs/standards', section);
  if (!existsSync(dir)) return;
  const backed = new Set([...backingUrls].filter(Boolean).map((url) => normalizeUrl(url).replace(`/docs/standards/${section}/`, '').replace(/\/$/, '')));
  for (const file of readdirSync(dir).filter((name) => name.endsWith('.md') && name !== 'index.md')) {
    const slug = file.replace(/\.md$/, '');
    if (!backed.has(slug)) {
      fail(`docs/docs/standards/${section}/${file}: catalog page has no metadata entry in compositions.json`);
    }
  }
}

checkCatalogPagesAreBacked('items', compositions.stackItems.map((item) => item.docsUrl));
checkCatalogPagesAreBacked(
  'stacks',
  compositions.composedStandards
    .map((standard) => standard.docsUrl)
    .filter((url) => normalizeUrl(url)?.startsWith('/docs/standards/stacks/'))
);

// --- Reference implementation inventory and score evidence ----------------------------
//
// A reference repo score is a trust signal, so it carries a provenance record (report,
// assessed commit, CI run, verification date) instead of a bare number. Every catalog
// surface renders that record; the drift guard below stops a hand-written page from
// quoting a different score behind the generator's back.

const refReposWithEvidence = [];

for (const refRepo of compositions.referenceImplementations || []) {
  requireId(refRepo.id, `referenceImplementations.${refRepo.id}`);
  for (const id of refRepo.standards || []) {
    if (!standardIds.has(id) && !compositionIds.has(id)) {
      fail(`${refRepo.id}: unknown demonstrated standard "${id}"`);
    }
  }
  if (refRepo.demonstratesPrimary !== null && refRepo.demonstratesPrimary !== undefined) {
    if (!standardIds.has(refRepo.demonstratesPrimary) && !compositionIds.has(refRepo.demonstratesPrimary)) {
      fail(`${refRepo.id}: unknown demonstratesPrimary standard "${refRepo.demonstratesPrimary}"`);
    }
    if (!(refRepo.standards || []).includes(refRepo.demonstratesPrimary)) {
      fail(`${refRepo.id}: demonstratesPrimary "${refRepo.demonstratesPrimary}" is not listed in standards`);
    }
  }

  const evidence = refRepo.evidence ?? null;
  if (refRepo.status === 'candidate') {
    if (evidence) fail(`${refRepo.id}: candidate repos have nothing to cite yet, so evidence must be null`);
    continue;
  }
  if (!evidence) {
    fail(`${refRepo.id}: ${refRepo.status} repos must carry score evidence (report, commit, CI run)`);
    continue;
  }
  if (!evidence.reportUrl?.startsWith(`${refRepo.url}/`)) {
    fail(`${refRepo.id}: evidence.reportUrl must live inside ${refRepo.url}`);
  }
  if (!Number.isInteger(evidence.score) || evidence.score < 0 || evidence.score > 100) {
    fail(`${refRepo.id}: evidence.score must be an integer 0-100`);
  }
  if (evidence.grade !== null && !/^[A-F]$/.test(evidence.grade ?? '')) {
    fail(`${refRepo.id}: evidence.grade must be a single letter grade or null`);
  }
  if (!/^[0-9a-f]{40}$/.test(evidence.assessedCommit ?? '')) {
    fail(`${refRepo.id}: evidence.assessedCommit must be a full 40-character SHA`);
  }
  for (const field of ['assessedAt', 'ciRunAt', 'verifiedAt']) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(evidence[field] ?? '')) {
      fail(`${refRepo.id}: evidence.${field} must be a YYYY-MM-DD date`);
    }
  }
  if (!evidence.ciRunUrl?.startsWith(`${refRepo.url}/actions/runs/`)) {
    fail(`${refRepo.id}: evidence.ciRunUrl must be a run URL inside ${refRepo.url}`);
  }
  if (!evidence.ciConclusion) fail(`${refRepo.id}: evidence.ciConclusion is required`);
  if (evidence.independentAssessmentUrl === undefined) {
    fail(`${refRepo.id}: evidence.independentAssessmentUrl is required (use null while the score is self-reported)`);
  }
  refReposWithEvidence.push(refRepo);
}

// --- Authored charter bar --------------------------------------------------------------
//
// An authored charter page is the entry point for a standard and must stand on its own.
// The section list is the bar documented in docs/docs/standards/authoring.md; it applies
// only to charters whose standard is authored (registry status `published`), so planned
// charters are untouched.
const requiredCharterSections = [
  'Full rubric',
  'Reference implementation',
  'Reference template map',
  'What this teaches',
  'Decision matrix',
  'Scope',
  'Not in scope',
  'Upstream references',
  'Composes',
  'VCQA-owned rule surface',
  'Detection signals',
  'Combination-born guidelines',
  'Rule highlights',
  'Limitations',
  'Anti-patterns',
  'Benefits',
  'Maintenance',
  'Independent Assessment'
];

const authoredCharterSlugs = new Set(
  compositions.composedStandards
    .filter((standard) => standard.status === 'authored')
    .map((standard) => normalizeUrl(standard.docsUrl))
    .filter((url) => url?.startsWith('/docs/standards/stacks/'))
    .map((url) => url.replace('/docs/standards/stacks/', '').replace(/\/$/, ''))
);

for (const slug of [...authoredCharterSlugs].sort()) {
  const path = join(here, '..', 'docs/docs/standards/stacks', `${slug}.md`);
  if (!existsSync(path)) continue;
  const text = readFileSync(path, 'utf8');
  const headings = new Set(
    text.split('\n')
      .filter((line) => line.startsWith('## '))
      .map((line) => line.slice(3).trim())
  );
  const missing = requiredCharterSections.filter((section) => !headings.has(section));
  if (missing.length) {
    fail(`docs/docs/standards/stacks/${slug}.md: authored charter is missing required section(s): ${missing.map((s) => `"## ${s}"`).join(', ')}. See docs/docs/standards/authoring.md.`);
  }
  for (const block of ['reference-evidence', 'charter-maintenance']) {
    if (!text.includes(`<!-- BEGIN GENERATED:${block} -->`)) {
      fail(`docs/docs/standards/stacks/${slug}.md: authored charter must carry the generated ${block} block.`);
    }
  }
}

// --- Planned charter maturity bar -------------------------------------------------------
//
// A planned charter's maturity is a claim about what the page carries, so the page has to
// carry it. Otherwise `candidate-rubric` becomes a label an author grants themselves, which
// is the same problem the flat "planned" status had. Sections are cumulative: the bar for a
// state includes the bar for every state below it.
const plannedCharterSections = {
  backlog: [],
  'draft-charter': [
    'Scope',
    'Not in scope',
    'Composes',
    'VCQA-owned rule surface',
    'Detection signals',
    'Combination-born guidelines'
  ],
  'candidate-rubric': [
    'Teaching focus',
    'Upstream references',
    'Candidate rules',
    'Severity and evidence',
    'Exception policy',
    'Anti-patterns',
    'Promotion criteria',
    'Review cadence'
  ]
};

const plannedCharterPages = new Map(
  compositions.composedStandards
    .filter((standard) => standard.status === 'planned')
    .map((standard) => [standard.id, normalizeUrl(standard.docsUrl)])
    .filter(([, url]) => url?.startsWith('/docs/standards/stacks/'))
);

for (const [id, url] of [...plannedCharterPages].sort()) {
  const slug = url.replace('/docs/standards/stacks/', '').replace(/\/$/, '');
  const path = join(here, '..', 'docs/docs/standards/stacks', `${slug}.md`);
  if (!existsSync(path)) continue;
  const text = readFileSync(path, 'utf8');
  const headings = new Set(
    text.split('\n')
      .filter((line) => line.startsWith('## '))
      .map((line) => line.slice(3).trim())
  );
  const maturity = standardsById.get(id)?.maturity ?? 'backlog';
  const rank = maturityRank.get(maturity) ?? 0;
  const required = Object.entries(plannedCharterSections)
    .filter(([state]) => (maturityRank.get(state) ?? 0) <= rank)
    .flatMap(([, sections]) => sections);
  const missing = required.filter((section) => !headings.has(section));
  if (missing.length) {
    fail(`docs/docs/standards/stacks/${slug}.md: charter claims maturity ${maturity} but is missing ${missing.map((s) => `"## ${s}"`).join(', ')}. Lower the maturity in registry.json or write the section. See docs/docs/standards/authoring.md#planned-charter-maturity-states.`);
  }
  if (!text.includes('<!-- BEGIN GENERATED:charter-status -->')) {
    fail(`docs/docs/standards/stacks/${slug}.md: planned charter must carry the generated charter-status block.`);
  }
  if (/^\*\*Status:\*\*/m.test(text)) {
    fail(`docs/docs/standards/stacks/${slug}.md: hand-written status line found; maturity comes from the generated charter-status block.`);
  }
}

// Drift guard. Scores used to be retyped into charter pages and landing tables; the live
// report moved and the pages did not. Any score claim on a non-generated surface must
// agree with the metadata. Assessment reports are excluded on purpose: they are dated,
// signed snapshots of what a page claimed on a given day, and rewriting them would
// falsify the record rather than fix drift.
const generatedBlock = /<!--\s*BEGIN GENERATED:[\s\S]*?END GENERATED:[^>]*-->/g;
const scanRoot = join(here, '..');
const skipDirs = new Set(['.git', 'node_modules', 'site', '_site']);
const skipPaths = ['docs/docs/standards/assessments'];

function surfaceFiles(dir, acc = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') && entry.name !== '.github') continue;
    const full = join(dir, entry.name);
    const rel = full.slice(scanRoot.length + 1);
    if (entry.isDirectory()) {
      if (skipDirs.has(entry.name)) continue;
      if (skipPaths.some((skip) => rel === skip || rel.startsWith(`${skip}/`))) continue;
      surfaceFiles(full, acc);
    } else if (/\.(md|html)$/.test(entry.name)) {
      acc.push({ rel, full });
    }
  }
  return acc;
}

for (const file of surfaceFiles(scanRoot)) {
  const text = readFileSync(file.full, 'utf8').replace(generatedBlock, '');
  for (const refRepo of refReposWithEvidence) {
    const expected = refRepo.evidence.score;
    const escaped = refRepo.evidence.reportUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const linked = new RegExp(`\\[([^\\]]*?)\\]\\(${escaped}\\)|<a href="${escaped}"[^>]*>([^<]*)</a>`, 'g');
    for (const match of text.matchAll(linked)) {
      const label = match[1] ?? match[2] ?? '';
      const claimed = label.match(/(\d{1,3})\/100/);
      if (claimed && Number(claimed[1]) !== expected) {
        fail(`${file.rel}: cites ${claimed[0]} for ${refRepo.id}, but metadata records ${expected}/100. Update compositions.json and regenerate; do not retype the score.`);
      }
    }
    for (const line of text.split('\n')) {
      if (!line.includes(refRepo.id)) continue;
      for (const claimed of line.matchAll(/(\d{1,3})\/100/g)) {
        if (Number(claimed[1]) !== expected) {
          fail(`${file.rel}: cites ${claimed[0]} next to ${refRepo.id}, but metadata records ${expected}/100. Update compositions.json and regenerate; do not retype the score.`);
        }
      }
    }
  }
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log('Registry validation passed');
