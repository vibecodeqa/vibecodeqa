#!/usr/bin/env node
import { readFileSync } from 'node:fs';

const checks = [
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
  ['docs/docs/standards/assessment.md', '[rule contract](rule-contract.md)'],
  ['standards/testing/docs/v1/index.md', '## Severity and evidence defaults'],
  ['standards/testing/docs/v1/index.md', 'acceptedException'],
  ['standards/testing/docs/v1/ci-and-evidence.md', '**Severity.**'],
  ['standards/testing/docs/v1/ci-and-evidence.md', '**Evidence.**']
];

const failures = [];
for (const [file, text] of checks) {
  const content = readFileSync(file, 'utf8');
  if (!content.includes(text)) {
    failures.push(`${file} must contain ${text}`);
  }
}

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join('\n'));
  process.exit(1);
}

console.log('Rule contract validation passed');
