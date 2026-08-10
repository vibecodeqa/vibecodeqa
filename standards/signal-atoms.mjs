// The closed vocabulary of `config` signal atoms.
//
// `resolve.mjs` is the only producer of these atoms and `registry.json` is the only
// consumer. Before this module existed the two drifted silently: `registry.json` asked for
// `package.json:contributes`, `resolve.mjs` never emitted it, and the predicate was
// unconditionally false for a year without anything noticing (#47).
//
// So the list lives here, once:
//   - `resolve.mjs` routes every `cfg.add()` through `addConfigAtom()`, which throws on an
//     atom that is not declared below — a producer cannot invent an atom off-list.
//   - `validate-registry.mjs` calls `unknownConfigAtoms()` on every detect predicate — a
//     consumer cannot ask for an atom that will never fire.
//
// Adding a signal means adding it here, emitting it in `resolve.mjs`, and documenting it in
// `SCHEMA.md`. Anything less fails CI.

export const CONFIG_ATOMS = new Set([
  // package.json facts
  'package.json',
  'package.json:bin',
  'package.json:exportsOrMain',
  'package.json:contributes',
  'package.json:engines.vscode',
  // Dart / Flutter facts
  'pubspec.yaml',
  'melos.yaml',
  // Firebase facts
  'firebase.json',
  // wrangler.toml facts (parsed from the file body, not mere existence)
  'wrangler.toml:d1_databases',
  'wrangler.toml:r2_buckets',
  'wrangler.toml:durable_objects'
]);

/** Add an atom to a signal set, refusing anything outside the declared vocabulary. */
export function addConfigAtom(cfg, atom) {
  if (!CONFIG_ATOMS.has(atom)) {
    throw new Error(
      `signal atom "${atom}" is not declared in standards/signal-atoms.mjs — ` +
        'declare it there (and in SCHEMA.md) before emitting it'
    );
  }
  cfg.add(atom);
  return cfg;
}

/** True when a `config` predicate names an atom the resolver can actually emit. */
export function isKnownConfigAtom(atom) {
  return CONFIG_ATOMS.has(atom);
}

/**
 * Collect every `config` atom in a detect predicate that `resolve.mjs` can never emit.
 * Returns `[]` for a healthy predicate, so an empty result is the passing case.
 */
export function unknownConfigAtoms(predicate, found = []) {
  if (!predicate || typeof predicate !== 'object') return found;
  for (const branch of ['all', 'any']) {
    for (const child of predicate[branch] || []) unknownConfigAtoms(child, found);
  }
  if (predicate.not) unknownConfigAtoms(predicate.not, found);
  if (typeof predicate.config === 'string' && !isKnownConfigAtom(predicate.config)) {
    found.push(predicate.config);
  }
  return found;
}
