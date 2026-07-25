#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const references = JSON.parse(readFileSync(join(here, 'references.json'), 'utf8'));
const registry = JSON.parse(readFileSync(join(here, 'registry.json'), 'utf8'));
const compositions = JSON.parse(readFileSync(join(here, 'compositions.json'), 'utf8'));
const checkLinks = process.argv.includes('--links');

const errors = [];
const idPattern = /^[a-z0-9-]+$/;
const controlledIds = new Set([
  ...registry.standards.map((standard) => standard.id),
  ...compositions.stackItems.map((item) => item.id),
  ...compositions.composedStandards.map((standard) => standard.id)
]);

function fail(message) {
  errors.push(message);
}

function requireId(id, context) {
  if (!idPattern.test(id)) fail(`${context}: invalid id "${id}"`);
}

const seenCategoryIds = new Set();
const seenReferenceIds = new Set();
for (const category of references.categories ?? []) {
  requireId(category.id, `category ${category.id}`);
  if (seenCategoryIds.has(category.id)) fail(`duplicate category id "${category.id}"`);
  seenCategoryIds.add(category.id);

  for (const reference of category.references ?? []) {
    const context = `${category.id}.${reference.id}`;
    requireId(reference.id, context);
    if (seenReferenceIds.has(reference.id)) fail(`duplicate reference id "${reference.id}"`);
    seenReferenceIds.add(reference.id);

    if (!reference.url?.startsWith('https://')) fail(`${context}: url must be https`);
    if (reference.url?.includes('/cli/v10/configuring-npm/package-json')) {
      fail(`${context}: npm package metadata must cite current v11 docs or document a versionPolicy`);
    }

    for (const id of reference.appliesTo ?? []) {
      if (!controlledIds.has(id)) fail(`${context}: appliesTo must use canonical VCQA id, got "${id}"`);
    }

    for (const topic of reference.topics ?? []) {
      requireId(topic, `${context}.topics`);
      if ((reference.appliesTo ?? []).includes(topic)) {
        fail(`${context}: topic "${topic}" is duplicated in appliesTo`);
      }
    }

    if (!(reference.appliesTo ?? []).length && !(reference.topics ?? []).length) {
      fail(`${context}: reference must have appliesTo or topics`);
    }
  }
}

if (checkLinks) {
  const linkErrors = await checkReferenceLinks();
  errors.push(...linkErrors);
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log(checkLinks ? 'Reference validation and link check passed' : 'Reference validation passed');

async function checkReferenceLinks() {
  const all = references.categories.flatMap((category) =>
    category.references.map((reference) => ({ category: category.id, ...reference }))
  );
  const results = await mapLimit(all, 8, checkOneLink);
  const failures = [];

  for (const result of results) {
    const context = `${result.category}.${result.id}`;
    if (result.error) {
      failures.push(`${context}: ${result.error}`);
      continue;
    }
    if (!isSuccessStatus(result.status)) {
      failures.push(`${context}: ${result.url} returned ${result.status}`);
    }
    if (result.finalUrl !== result.url) {
      if (result.expectedRedirectUrl !== result.finalUrl) {
        failures.push(`${context}: unexpected redirect ${result.url} -> ${result.finalUrl}`);
      }
    }
  }

  return failures;
}

async function checkOneLink(reference) {
  try {
    let url = reference.url;
    for (let redirects = 0; redirects < 6; redirects += 1) {
      let response = await request(url, 'HEAD');
      if (response.status === 403 || response.status === 405) {
        response = await request(url, 'GET');
      }

      if (isRedirectStatus(response.status) && response.location) {
        url = new URL(response.location, url).href;
        continue;
      }

      return { ...reference, status: response.status, finalUrl: url };
    }

    return { ...reference, error: `too many redirects from ${reference.url}` };
  } catch (error) {
    return { ...reference, error: error.message };
  }
}

async function request(url, method) {
  const response = await fetch(url, {
    method,
    redirect: 'manual',
    headers: {
      'user-agent': 'vcqa-reference-check/1.0'
    },
    signal: AbortSignal.timeout(15000)
  });
  return {
    status: response.status,
    location: response.headers.get('location')
  };
}

function isRedirectStatus(status) {
  return [301, 302, 303, 307, 308].includes(status);
}

function isSuccessStatus(status) {
  return status >= 200 && status < 300;
}

async function mapLimit(items, limit, mapper) {
  const results = [];
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await mapper(items[index]);
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}
