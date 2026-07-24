#!/usr/bin/env node
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('.', import.meta.url).pathname;
const indexPath = join(root, 'docs/standards/assessments/index.md');
const reportsDir = join(root, 'docs/standards/assessments/stacks');
const errors = [];

const bands = [
  { min: 95, max: 100, verdict: 'gold' },
  { min: 85, max: 94, verdict: 'good' },
  { min: 70, max: 84, verdict: 'partial' },
  { min: 50, max: 69, verdict: 'draft' },
  { min: 0, max: 49, verdict: 'unreliable' }
];

function expectedVerdict(score) {
  const band = bands.find((entry) => score >= entry.min && score <= entry.max);
  return band?.verdict;
}

function fail(message) {
  errors.push(message);
}

const index = readFileSync(indexPath, 'utf8');
for (const line of index.split('\n')) {
  const match = line.match(/^\| \[([^\]]+)\]\([^)]*\) \| ([a-z-]+) \| ([0-9]+) \| \[Assessment\]\(stacks\/([^)]+)\) \|$/);
  if (!match) continue;
  const [, title, verdict, scoreText, reportFile] = match;
  const score = Number(scoreText);
  const expected = expectedVerdict(score);
  if (verdict !== expected) {
    fail(`${title}: index verdict ${verdict} does not match ${score} (${expected})`);
  }
  const reportPath = join(reportsDir, reportFile);
  const report = readFileSync(reportPath, 'utf8');
  const verdictLine = report.split('\n').find((entry) => /^[a-z-]+ - /.test(entry));
  const verdictMatch = verdictLine?.match(/^([a-z-]+) - .*?([0-9]+)\/100/);
  if (verdictMatch) {
    const [, reportVerdict, reportScoreText] = verdictMatch;
    const reportScore = Number(reportScoreText);
    const reportExpected = expectedVerdict(reportScore);
    if (reportVerdict !== reportExpected) {
      fail(`${reportFile}: report verdict ${reportVerdict} does not match ${reportScore} (${reportExpected})`);
    }
  }
}

for (const file of readdirSync(reportsDir).filter((name) => name.endsWith('.md')).sort()) {
  const report = readFileSync(join(reportsDir, file), 'utf8');
  for (const field of ['Target scope:', 'Source target:', 'Live target:', 'Published assessment URL:', 'Commit:']) {
    if (!report.includes(field)) fail(`${file}: missing ${field}`);
  }
  if (!report.includes('Target scope: Stack page assessment only')) {
    fail(`${file}: target scope must be stack page assessment only`);
  }
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log('Assessment validation passed');
