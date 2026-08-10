#!/usr/bin/env node
// Forced-failure tests for the link checker's retry and tolerance policy (#46).
//
// A single transient timeout used to fail the whole site deploy — roughly one link-check
// execution in six died for a reason no commit could have caused. The fix must hold two things
// at once, and reading the code proves neither, so this drives the real script against a local
// server that misbehaves on demand:
//
//   1. a flaky host cannot fail a deploy
//   2. a genuinely broken reference still does
//
// The checker is run as a subprocess against a fixture registry, using the documented test
// seams (VCQA_REFERENCES_FILE, VCQA_LINK_TIMEOUT_MS, VCQA_LINK_RETRY_DELAY_MS).
//
//   node standards/test-reference-links.mjs
//
// Dependency-free. Node 18+.

import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const VALIDATOR = join(HERE, 'validate-references.mjs');
const workDir = mkdtempSync(join(tmpdir(), 'vcqa-links-'));

const failures = [];
let checks = 0;
function check(name, condition, detail = '') {
  checks += 1;
  if (!condition) failures.push(`${name}${detail ? `\n      ${detail}` : ''}`);
}

// A server whose behaviour is chosen by path:
//   /ok        200
//   /gone      404                       — a genuine registry defect
//   /moved     301 to /ok                — an unexpected redirect
//   /hang      accepts, never answers    — the transient class, forced deterministically
//   /flaky     hangs once, then 200      — proves the retry actually retries
const flakyHits = new Map();
const server = createServer((req, res) => {
  const path = req.url;
  if (path === '/ok') return res.writeHead(200).end();
  if (path === '/gone') return res.writeHead(404).end();
  if (path === '/moved') return res.writeHead(301, { location: '/ok' }).end();
  if (path === '/hang') return; // hold the socket open until the client times out
  if (path.startsWith('/flaky')) {
    const seen = (flakyHits.get(path) ?? 0) + 1;
    flakyHits.set(path, seen);
    if (seen === 1) return; // first attempt hangs, like the observed incidents
    return res.writeHead(200).end();
  }
  return res.writeHead(500).end();
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}`;

function fixture(name, paths) {
  const file = join(workDir, `${name}.json`);
  writeFileSync(file, JSON.stringify({
    version: 1,
    lastReviewed: '2026-08-11',
    purpose: 'fixture',
    categories: [{
      id: 'fixture',
      title: 'Fixture',
      description: 'fixture',
      references: paths.map((path, index) => ({
        id: `ref-${index}`,
        title: `ref ${index}`,
        publisher: 'fixture',
        url: `${base}${path}`,
        topics: ['fixture'],
        useFor: ['fixture']
      }))
    }]
  }));
  return file;
}

// spawn, not spawnSync: the fixture server lives in *this* process, so a synchronous child
// would block the event loop and every request would time out — including the ones meant to
// succeed. (It did, on the first run of this file.)
function runCheck(name, paths, args = ['--links']) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [VALIDATOR, ...args], {
      env: {
        ...process.env,
        VCQA_REFERENCES_FILE: fixture(name, paths),
        VCQA_LINK_TIMEOUT_MS: '400',
        VCQA_LINK_RETRY_DELAY_MS: '10'
      }
    });
    let out = '';
    child.stdout.on('data', (chunk) => { out += chunk; });
    child.stderr.on('data', (chunk) => { out += chunk; });
    child.on('close', (status) => resolve({ status, out }));
  });
}

function runValidator(args = []) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [VALIDATOR, ...args]);
    let out = '';
    child.stdout.on('data', (chunk) => { out += chunk; });
    child.stderr.on('data', (chunk) => { out += chunk; });
    child.on('close', (status) => resolve({ status, out }));
  });
}

// ── a flaky host cannot fail a deploy ─────────────────────────────────────────────────────
{
  const { status, out } = await runCheck('transient', ['/ok', '/hang']);
  check('#46: an unreachable host does not fail the run', status === 0, out.trim());
  check('#46: the unreachable host is reported, not swallowed',
    /could not be reached/.test(out) && /\/hang/.test(out), out.trim());
}
{
  const { status, out } = await runCheck('flaky', ['/ok', '/flaky-a']);
  check('#46: a host that fails once and then answers is retried and passes',
    status === 0, out.trim());
  check('#46: a successful retry produces no warning',
    !/could not be reached/.test(out), out.trim());
}

// ── genuine breakage still fails ──────────────────────────────────────────────────────────
{
  const { status, out } = await runCheck('broken', ['/ok', '/gone']);
  check('#46: a 404 reference still fails the run', status === 1, out.trim());
  check('#46: the 404 is named', /returned 404/.test(out), out.trim());
}
{
  const { status, out } = await runCheck('redirect', ['/moved']);
  check('#46: an unexpected redirect still fails the run', status === 1, out.trim());
  check('#46: the redirect is named', /unexpected redirect/.test(out), out.trim());
}
{
  // A 404 is never retried: it will still be a 404 in twelve seconds.
  const { status, out } = await runCheck('strict-404', ['/gone'], ['--links-strict']);
  check('#46: --links-strict still fails on definitive breakage', status === 1, out.trim());
}

// ── tolerance is capped, so an outage cannot masquerade as a flake ────────────────────────
{
  const { status, out } = await runCheck('outage', ['/hang', '/hang', '/hang', '/hang', '/ok']);
  check('#46: more unreachable hosts than the tolerance fails the run', status === 1, out.trim());
  check('#46: the outage is described as an outage, not as broken links',
    /That is an outage, not a flake/.test(out), out.trim());
}
{
  const { status, out } = await runCheck('strict-transient', ['/hang'], ['--links-strict']);
  check('#46: --links-strict fails on a host it could not reach', status === 1, out.trim());
}

// ── the structural check is unaffected by any of this ─────────────────────────────────────
{
  const result = await runValidator();
  check("#46: the offline structural check still passes on the real registry",
    result.status === 0 && /Reference validation passed/.test(result.out),
    result.out.trim());
}

server.close();
rmSync(workDir, { recursive: true, force: true });

if (failures.length) {
  console.error(`Reference link policy tests: ${failures.length} of ${checks} failed\n`);
  console.error(failures.map((failure) => `  - ${failure}`).join('\n'));
  process.exit(1);
}

console.log(`Reference link policy tests passed (${checks} checks)`);
