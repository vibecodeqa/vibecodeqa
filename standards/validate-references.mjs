#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
// Test-only seams (see test-reference-links.mjs): point the checker at a fixture registry and
// collapse the retry timings, so the retry/tolerance policy can be exercised against a local
// server in seconds instead of being asserted by reading the code. Unset in CI and in normal use.
const referencesFile = process.env.VCQA_REFERENCES_FILE || join(here, 'references.json');
const references = JSON.parse(readFileSync(referencesFile, 'utf8'));
const registry = JSON.parse(readFileSync(join(here, 'registry.json'), 'utf8'));
const compositions = JSON.parse(readFileSync(join(here, 'compositions.json'), 'utf8'));
const checkLinks = process.argv.includes('--links');
// `--links-strict` restores the old behaviour: a URL we could not reach is a failure, full
// stop. Use it when you are deliberately auditing link health rather than shipping a commit.
const strictLinks = process.argv.includes('--links-strict');

// Retry and tolerance policy for the link check (#46).
//
// 98 third-party requests sit on the deploy's critical path, and roughly one execution in six
// used to fail for a reason no commit could have caused — twice blocking a commit that changed
// no reference URL at all. A deploy must not be hostage to someone else's network.
//
// The split is between "the registry is wrong" and "we could not ask":
//   * A definitive answer — 4xx/5xx, an unexpected redirect, a dead name (ENOTFOUND), a
//     refused connection, a bad certificate — is a registry defect and still fails the build.
//     Both genuine failures on record (#45's stale MCP docs redirect) are in this class.
//   * A connection that timed out or was reset is not an answer at all. It is retried, and if
//     it still will not answer, it is reported as a warning and the deploy proceeds.
//
// Tolerance is capped: past MAX_UNREACHABLE, this is a network outage rather than a flake, and
// claiming "link check passed" would be a lie, so the run fails. The observed incidents hit
// two URLs; a dead host family would hit far more.
const ATTEMPTS = 3;
const RETRY_DELAYS_MS = process.env.VCQA_LINK_RETRY_DELAY_MS
  ? [Number(process.env.VCQA_LINK_RETRY_DELAY_MS)]
  : [3000, 12000]; // the observed outage window lasted at least 50s
const RETRY_BUDGET = 30; // bounds the worst case when the whole runner has no network
const MAX_UNREACHABLE = 3;
const REQUEST_TIMEOUT_MS = Number(process.env.VCQA_LINK_TIMEOUT_MS) || 15000;

// Error codes that mean "no answer", as opposed to "an answer we did not like".
const TRANSIENT_CODES = new Set([
  'ETIMEDOUT', 'ECONNRESET', 'EPIPE', 'EAI_AGAIN', 'ENETUNREACH', 'ENETDOWN', 'EHOSTUNREACH',
  'UND_ERR_CONNECT_TIMEOUT', 'UND_ERR_HEADERS_TIMEOUT', 'UND_ERR_BODY_TIMEOUT', 'UND_ERR_SOCKET'
]);

let retriesUsed = 0;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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

// The https rule is absolute for the real registry. A fixture registry (test seam only) may
// use a plain-http loopback URL, because the alternative is a self-signed certificate and
// NODE_TLS_REJECT_UNAUTHORIZED=0, which would weaken the check far more than this does.
function isFixtureUrl(url) {
  return Boolean(process.env.VCQA_REFERENCES_FILE) && /^http:\/\/127\.0\.0\.1(:\d+)?\//.test(url ?? '');
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

    if (!reference.url?.startsWith('https://') && !isFixtureUrl(reference.url)) {
      fail(`${context}: url must be https`);
    }
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

let unreachable = [];
if (checkLinks || strictLinks) {
  const linkResult = await checkReferenceLinks();
  errors.push(...linkResult.failures);
  unreachable = linkResult.unreachable;
}

if (unreachable.length) {
  // Not an error, and not silence either. These are printed every run and annotated in the
  // GitHub UI, so a URL that is "transiently" unreachable on every deploy is visible rather
  // than absorbed.
  const annotate = process.env.GITHUB_ACTIONS === 'true';
  console.warn(
    `\n${unreachable.length} reference(s) could not be reached after ${ATTEMPTS} attempts. ` +
      'The network, not the registry, failed; these are not treated as broken links. ' +
      'Re-run with --links-strict to fail on them.'
  );
  for (const item of unreachable) {
    const line = `${item.context}: ${item.url} — ${item.error}`;
    console.warn(annotate ? `::warning title=Reference unreachable::${line}` : `  ! ${line}`);
  }
  console.warn('');
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}

if (!checkLinks && !strictLinks) {
  console.log('Reference validation passed');
} else if (unreachable.length) {
  console.log(`Reference validation and link check passed (${unreachable.length} host(s) unreachable, tolerated)`);
} else {
  console.log('Reference validation and link check passed');
}

function isTransientError(error) {
  if (error?.name === 'TimeoutError' || error?.name === 'AbortError') return true;
  for (let cause = error; cause; cause = cause.cause) {
    if (cause.code && TRANSIENT_CODES.has(cause.code)) return true;
  }
  return false;
}

// `TypeError: fetch failed` on its own says nothing. Surface the cause, so the next incident
// can be diagnosed from the log instead of re-run until it goes away.
function describeError(error) {
  const codes = [];
  for (let cause = error; cause; cause = cause.cause) {
    if (cause.code && !codes.includes(cause.code)) codes.push(cause.code);
  }
  return codes.length ? `${error.message} (${codes.join(' / ')})` : error.message;
}

async function checkReferenceLinks() {
  const all = references.categories.flatMap((category) =>
    category.references.map((reference) => ({ category: category.id, ...reference }))
  );
  const results = await mapLimit(all, 8, checkOneLink);
  const failures = [];
  const unreachable = [];

  for (const result of results) {
    const context = `${result.category}.${result.id}`;
    if (result.error) {
      if (result.transient && !strictLinks) {
        unreachable.push({ context, url: result.url, error: result.error });
      } else {
        failures.push(`${context}: ${result.error}`);
      }
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

  if (unreachable.length > MAX_UNREACHABLE) {
    failures.push(
      `${unreachable.length} references were unreachable (tolerance is ${MAX_UNREACHABLE}). ` +
        'That is an outage, not a flake, so link health has not been verified: ' +
        unreachable.map((item) => `${item.context} (${item.error})`).join('; ')
    );
    return { failures, unreachable: [] };
  }

  return { failures, unreachable };
}

async function checkOneLink(reference) {
  let lastError = null;
  for (let attempt = 1; attempt <= ATTEMPTS; attempt += 1) {
    try {
      return await followRedirects(reference);
    } catch (error) {
      lastError = error;
      // Only "no answer" is worth asking again. A 404 will still be a 404 in twelve seconds.
      if (!isTransientError(error) || attempt === ATTEMPTS || retriesUsed >= RETRY_BUDGET) break;
      retriesUsed += 1;
      await sleep(RETRY_DELAYS_MS[attempt - 1] ?? RETRY_DELAYS_MS.at(-1));
    }
  }
  return { ...reference, error: describeError(lastError), transient: isTransientError(lastError) };
}

async function followRedirects(reference) {
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

  // A redirect loop is a property of the target, not of the network: never retried, always fatal.
  return { ...reference, error: `too many redirects from ${reference.url}`, transient: false };
}

async function request(url, method) {
  const response = await fetch(url, {
    method,
    redirect: 'manual',
    headers: {
      'user-agent': 'vcqa-reference-check/1.0',
      'accept-language': 'en-US,en;q=0.9'
    },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
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
