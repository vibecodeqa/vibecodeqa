#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const registry = JSON.parse(readFileSync(join(here, 'registry.json'), 'utf8'));
const compositions = JSON.parse(readFileSync(join(here, 'compositions.json'), 'utf8'));

const errors = [];
const idPattern = /^[a-z0-9-]+$/;
const standardIds = new Set(registry.standards.map((standard) => standard.id));
const compositionIds = new Set(compositions.composedStandards.map((standard) => standard.id));

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
  } else if (standard.standardUrl !== null) {
    fail(`${standard.id}: planned standard must use standardUrl: null`);
  }
  if (standard.url && /^https:\/\/vibecodeqa\.online\/standards\/[^/]+\/?$/.test(standard.url)) {
    fail(`${standard.id}: url points at an unversioned standards route`);
  }
  checkRefs(standard.recommends, `${standard.id}.recommends`);
  checkRefs(standard.optionalLayers, `${standard.id}.optionalLayers`);
  checkRefs(standard.coveredLayers, `${standard.id}.coveredLayers`);
  checkRefs(standard.composes, `${standard.id}.composes`);
  walkPredicate(standard.detect, `${standard.id}.detect`);
}

for (const composed of compositions.composedStandards) {
  if (!standardIds.has(composed.id)) fail(`compositions: ${composed.id} is missing from registry`);
}
for (const standard of registry.standards) {
  if (standard.status === 'published' && !compositionIds.has(standard.id)) {
    fail(`registry: published standard ${standard.id} is missing from compositions`);
  }
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log('Registry validation passed');
