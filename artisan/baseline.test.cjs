const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const profile = JSON.parse(fs.readFileSync(path.join(__dirname, 'health-check-profile.json'), 'utf8'));

test('test-only profile cannot enable production writes or automatic installation', () => {
  assert.equal(profile.mode, 'test-only');
  for (const key of ['productionWrites', 'customerDataInRepository', 'automaticSkillInstallation'])
    assert.equal(profile[key], false, key);
});
test('only the reviewed onboarding guidance is selected and every source exists', () => {
  assert.deepEqual([...profile.skills].sort(),
    ['backend-patterns', 'github-ops', 'security-review', 'tdd-workflow', 'verification-loop']);
  for (const skill of profile.skills)
    assert.ok(fs.existsSync(path.join(root, 'skills', skill, 'SKILL.md')), skill);
});
test('baseline workflow needs no secrets and runs without dependency installation', () => {
  const workflow = fs.readFileSync(path.join(root, '.github/workflows/artisan-baseline.yml'), 'utf8');
  assert.match(workflow, /contents: read/);
  assert.match(workflow, /persist-credentials: false/);
  assert.doesNotMatch(workflow, /secrets\.|pull_request_target|npm (?:ci|install)/);
  for (const match of workflow.matchAll(/uses:\s*([^\s]+)/g))
    assert.match(match[1], /@[a-f0-9]{40}$/);
});
