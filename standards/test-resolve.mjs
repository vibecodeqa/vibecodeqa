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
  check('#49: typescript-sdk no longer claims the extension slice',
    !ids(only.archetypes).includes('typescript-sdk'), `got ${ids(only.archetypes).join(', ')}`);
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

// ── #48 — a Flutter/Firebase workspace resolves the same on Melos 6 and Melos 7+ ──────────
//
// Melos 7 deleted melos.yaml: configuration moved under a `melos:` key in the root
// pubspec.yaml and membership moved to Dart's native `workspace:` key. Detection has to
// follow the ecosystem, so both layouts must give the same answer.
function flutterFirebaseWorkspace(root, layout) {
  write(root, 'firebase.json', {
    functions: [{ source: 'packages/functions', codebase: 'default', runtime: 'nodejs22' }],
    firestore: { rules: 'firestore.rules', indexes: 'firestore.indexes.json' }
  });
  write(root, 'firestore.rules', 'rules_version = "2";\n');
  for (const name of ['app', 'admin', 'shared']) {
    write(root, `packages/${name}/pubspec.yaml`,
      `name: reference_${name}\nenvironment:\n  sdk: ^3.11.5\ndependencies:\n  firebase_core: ^4.1.1\n  cloud_firestore: ^6.0.2\n`);
    write(root, `packages/${name}/lib/main.dart`, 'void main() {}\n');
  }
  write(root, 'packages/functions/package.json', {
    name: 'reference-functions',
    main: 'lib/index.js',
    dependencies: { 'firebase-admin': '^13.6.0', 'firebase-functions': '^6.5.0' }
  });
  write(root, 'packages/functions/src/index.ts', 'export const noop = () => {};\n');

  if (layout === 'melos6') {
    write(root, 'melos.yaml', 'name: reference_workspace\npackages:\n  - packages/*\n');
    write(root, 'pubspec.yaml',
      'name: reference_workspace\nenvironment:\n  sdk: ^3.11.5\ndev_dependencies:\n  melos: ^6.3.2\n');
  } else {
    // Melos 8 layout: no melos.yaml anywhere.
    write(root, 'pubspec.yaml',
      'name: reference_workspace\nenvironment:\n  sdk: ^3.11.5\n' +
      'workspace:\n  - packages/app\n  - packages/admin\n  - packages/shared\n  - packages/functions\n' +
      'dev_dependencies:\n  melos: ^8.2.2\nmelos:\n  scripts:\n    analyze:\n      run: flutter analyze\n');
  }
}

for (const layout of ['melos6', 'melos8']) {
  const { result } = fixture(`flutter-${layout}`, (root) => flutterFirebaseWorkspace(root, layout));
  check(`#48 (${layout}): the flutter-firebase-app recipe matches`,
    ids(result.recipes).includes('flutter-firebase-app'),
    `got ${ids(result.recipes).join(', ') || '(none)'}`);
  check(`#48 (${layout}): the workspace slices into its four packages, not one`,
    result.slices.length === 4,
    `got ${result.slices.length}: ${result.slices.map((s) => s.slice).join(', ')}`);
  for (const member of ['packages/app', 'packages/admin', 'packages/shared', 'packages/functions']) {
    check(`#48 (${layout}): ${member} is its own slice`, Boolean(slice(result, member)),
      `slices: ${result.slices.map((s) => s.slice).join(', ')}`);
  }
}

// ── #49 — `typescript-sdk` means "meant to be imported", not "declares main" ──────────────
//
// A Firebase Functions package *must* declare `main` — that is how firebase-tools finds the
// compiled entry point — so "declares main" collected every Functions codebase and graded it
// on export maps and tarball tests. The positive signal is a types declaration.
{
  const { result } = fixture('firebase-functions', (root) => {
    write(root, 'firebase.json', { functions: [{ source: '.', codebase: 'default', runtime: 'nodejs22' }] });
    write(root, 'package.json', {
      name: 'reference-functions',
      main: 'lib/index.js',
      engines: { node: '22' },
      dependencies: { 'firebase-admin': '^13.6.0', 'firebase-functions': '^6.5.0' },
      devDependencies: { typescript: '^5.9.0' }
    });
    write(root, 'src/index.ts', 'export const noop = () => {};\n');
  });
  check('#49: a Firebase Functions package is not claimed by typescript-sdk',
    !ids(result.slices[0].archetypes).includes('typescript-sdk'),
    `got ${ids(result.slices[0].archetypes).join(', ')}`);
}
{
  // The control: a real library, in the same shape, still resolves as an SDK.
  const { result } = fixture('sdk', (root) => {
    write(root, 'package.json', {
      name: '@vcqa-ref/widget-sdk',
      main: './dist/index.cjs',
      module: './dist/index.js',
      types: './dist/index.d.ts',
      exports: { '.': { types: './dist/index.d.ts', import: './dist/index.js' } },
      files: ['dist', 'src'],
      devDependencies: { typescript: '^5.9.0' }
    });
    write(root, 'src/index.ts', 'export const version = "1";\n');
    write(root, 'tsconfig.json', { compilerOptions: { declaration: true } });
  });
  check('#49: a genuine typed library still resolves as typescript-sdk',
    ids(result.slices[0].archetypes).includes('typescript-sdk'),
    `got ${ids(result.slices[0].archetypes).join(', ') || '(none)'}`);
}
{
  // A library that wraps firebase-admin for consumers is an SDK, not a Functions codebase:
  // the exclusion is on `firebase-functions` alone, deliberately.
  const { result } = fixture('firebase-admin-sdk', (root) => {
    write(root, 'package.json', {
      name: '@acme/firebase-helpers',
      main: './dist/index.js',
      types: './dist/index.d.ts',
      dependencies: { 'firebase-admin': '^13.6.0' }
    });
    write(root, 'src/index.ts', 'export const helper = () => {};\n');
  });
  check('#49: a library wrapping firebase-admin is still an SDK',
    ids(result.slices[0].archetypes).includes('typescript-sdk'),
    `got ${ids(result.slices[0].archetypes).join(', ') || '(none)'}`);
}

if (failures.length) {
  console.error(`Resolver fixture tests: ${failures.length} of ${checks} failed\n`);
  console.error(failures.map((failure) => `  - ${failure}`).join('\n'));
  process.exit(1);
}

console.log(`Resolver fixture tests passed (${checks} checks)`);
