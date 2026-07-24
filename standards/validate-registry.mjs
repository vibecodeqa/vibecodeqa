#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const registry = JSON.parse(readFileSync(join(here, 'registry.json'), 'utf8'));
const compositions = JSON.parse(readFileSync(join(here, 'compositions.json'), 'utf8'));
const references = JSON.parse(readFileSync(join(here, 'references.json'), 'utf8'));

const errors = [];
const idPattern = /^[a-z0-9-]+$/;
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
  for (const reference of item.references || []) {
    if (!referenceIds.has(reference)) fail(`${item.id}.references: unknown reference id "${reference}"`);
  }
}

for (const refRepo of compositions.referenceImplementations || []) {
  requireId(refRepo.id, `referenceImplementations.${refRepo.id}`);
  for (const id of refRepo.standards || []) {
    if (!standardIds.has(id) && !compositionIds.has(id)) {
      fail(`${refRepo.id}: unknown demonstrated standard "${id}"`);
    }
  }
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log('Registry validation passed');
