#!/usr/bin/env node
// Fixture tests for the standards resolver and the signal-atom vocabulary.
//
// The resolver is the thing an AI judge asks "which standards apply here", so a detection
// bug is not cosmetic — it points the judge at the wrong rubric. Every case below is a
// regression that actually shipped:
//
//   #47 a VS Code extension resolved as `typescript-sdk`, because both of its own detect
//       branches were dead
//   #48 a Melos 7+ Flutter workspace resolved to nothing, because detection required a file
//       Melos had deleted
//   #49 a Firebase Functions package resolved as `typescript-sdk`, because declaring `main`
//       was the whole test
//
// Fixtures are written to a temp dir and thrown away. The resolver is run as a subprocess
// (it is a CLI with a top-level main), so this tests the shipped entry point.
//
//   node standards/test-resolve.mjs
//
// Dependency-free. Node 18+.

import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CONFIG_ATOMS, isKnownConfigAtom, unknownConfigAtoms } from './signal-atoms.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const RESOLVE = join(HERE, 'resolve.mjs');

const failures = [];
let checks = 0;

function check(name, condition, detail = '') {
  checks += 1;
  if (!condition) failures.push(`${name}${detail ? `\n      ${detail}` : ''}`);
}

function write(root, relPath, contents) {
  const full = join(root, relPath);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, typeof contents === 'string' ? contents : `${JSON.stringify(contents, null, 2)}\n`);
}

function resolveRepo(root) {
  const out = execFileSync(process.execPath, [RESOLVE, root, '--json'], { encoding: 'utf8' });
  return JSON.parse(out);
}

const slice = (result, label) => result.slices.find((s) => s.slice === label);
const ids = (list) => (list || []).map((std) => std.id);

const tempRoots = [];
function fixture(name, build) {
  const root = mkdtempSync(join(tmpdir(), `vcqa-resolve-${name}-`));
  tempRoots.push(root);
  build(root);
  return { root, result: resolveRepo(root) };
}
process.on('exit', () => {
  for (const root of tempRoots) rmSync(root, { recursive: true, force: true });
});

// ── the signal-atom vocabulary is closed in both directions ───────────────────────────────
check('signal-atoms: a made-up config atom is reported as unknown',
  unknownConfigAtoms({ any: [{ config: 'package.json:nope' }, { dep: 'react' }] }).length === 1);
check('signal-atoms: unknown atoms are found through nested all/any/not',
  unknownConfigAtoms({ all: [{ not: { any: [{ config: 'wrangler.toml:kv_namespaces' }] } }] })[0] ===
    'wrangler.toml:kv_namespaces');
check('signal-atoms: a declared atom is accepted', isKnownConfigAtom('package.json:exportsOrMain'));
check('signal-atoms: the vocabulary is non-empty', CONFIG_ATOMS.size > 0);
{
  const registry = JSON.parse(readFileSync(join(HERE, 'registry.json'), 'utf8'));
  const dead = registry.standards
    .flatMap((standard) => unknownConfigAtoms(standard.detect).map((atom) => `${standard.id}: ${atom}`));
  check('signal-atoms: no registry predicate names an atom the resolver cannot emit',
    dead.length === 0, dead.join('; '));
}

// ── #47 — a VS Code extension resolves as one ─────────────────────────────────────────────
{
  const { result } = fixture('vscode', (root) => {
    write(root, 'package.json', {
      name: 'ref-vscode-extension-package',
      main: './out/extension.js',
      engines: { vscode: '^1.104.0', node: '>=22 <27' },
      contributes: {
        commands: [{ command: 'ref.hello', title: 'Hello' }],
        configuration: { title: 'Ref', properties: {} }
      },
      devDependencies: { '@types/vscode': '1.104.0', typescript: '^5.9.0', vitest: '^3.2.0' }
    });
    write(root, 'src/extension.ts', 'export function activate() {}\n');
    write(root, 'tsconfig.json', { compilerOptions: { strict: true } });
  });
  const only = result.slices[0];
  check('#47: vscode-extension-package matches the extension slice',
    ids(only.archetypes).includes('vscode-extension-package'), `got ${ids(only.archetypes).join(', ') || '(none)'}`);
  // NB: `typescript-sdk` also matches this slice today, because it tests only "declares main".
  // That is #49, fixed separately.
  check('#47: cross-cutting standards still apply to the extension',
    ['typescript', 'security', 'testing'].every((id) => ids(only.cross).includes(id)),
    `got ${ids(only.cross).join(', ')}`);
}
{
  // An API-only extension contributes nothing declaratively; `engines.vscode` still identifies it.
  const { result } = fixture('vscode-api-only', (root) => {
    write(root, 'package.json', {
      name: 'api-only-extension',
      main: './out/extension.js',
      engines: { vscode: '^1.104.0' }
    });
    write(root, 'src/extension.ts', 'export function activate() {}\n');
  });
  check('#47: an extension with no `contributes` block still matches on engines.vscode',
    ids(result.slices[0].archetypes).includes('vscode-extension-package'),
    `got ${ids(result.slices[0].archetypes).join(', ') || '(none)'}`);
}

if (failures.length) {
  console.error(`Resolver fixture tests: ${failures.length} of ${checks} failed\n`);
  console.error(failures.map((failure) => `  - ${failure}`).join('\n'));
  process.exit(1);
}

console.log(`Resolver fixture tests passed (${checks} checks)`);
