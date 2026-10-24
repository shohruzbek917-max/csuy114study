import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { topics, flashcards, challenges, traces } from '../src/data/course.js';

function python(code, stdin = '') {
  const run = spawnSync('python3', ['-c', code], {
    input: stdin,
    encoding: 'utf8',
    timeout: 3000,
    maxBuffer: 256 * 1024,
  });
  assert.ifError(run.error);
  assert.equal(run.status, 0, run.stderr || `Python exited ${run.status}`);
  return run.stdout.trim();
}

function evaluateFunction(challenge, example) {
  const code = [
    'import json, random',
    'random.seed(42)',
    challenge.solution,
    `print(json.dumps(${challenge.functionName}(*json.loads(${JSON.stringify(JSON.stringify(example.args))}))))`,
  ].join('\n');
  return JSON.parse(python(code));
}

test('all study material has unique IDs, supported topics, and real source links', () => {
  assert.equal(topics.length, 7);
  const topicIds = new Set(topics.map(topic => topic.id));
  for (const collection of [topics, flashcards, challenges, traces]) {
    assert.equal(new Set(collection.map(item => item.id)).size, collection.length);
  }
  for (const item of [...flashcards, ...challenges, ...traces]) {
    assert.ok(topicIds.has(item.topic), `${item.id}: missing topic ${item.topic}`);
  }
  for (const topic of topics) {
    const url = new URL(topic.sourceUrl);
    assert.equal(url.hostname, 'github.com');
    assert.ok(url.pathname.startsWith('/sebastianromerocruz/CS1114-Problem-Solving-And-Programming/'));
    assert.ok(topic.lessons.length > 0);
    assert.ok(challenges.some(challenge => challenge.topic === topic.id));
    assert.ok(flashcards.some(card => card.topic === topic.id));
  }
});

for (const challenge of challenges) {
  test(`${challenge.title}: reference solution passes all ${challenge.tests.length} cases in real Python`, () => {
    assert.ok(challenge.tests.length >= 3, 'Need representative examples and boundaries');
    assert.ok(challenge.hints.length > 0);
    assert.ok(challenge.starter.trim());
    for (const [index, example] of challenge.tests.entries()) {
      const label = `${challenge.id} test ${index + 1}`;
      if (challenge.functionName) {
        const actual = evaluateFunction(challenge, example);
        if (typeof example.expected === 'number') {
          assert.ok(Math.abs(actual - example.expected) <= Math.max(1e-9, Math.abs(example.expected) * 1e-9), `${label}: ${actual} != ${example.expected}`);
        } else {
          assert.deepEqual(actual, example.expected, label);
        }
      } else {
        assert.equal(python(challenge.solution, example.stdin), String(example.expected).trim(), label);
      }
    }
  });
}

for (const trace of traces) {
  test(`${trace.title}: tracing answer equals actual Python output`, () => {
    assert.equal(python(trace.code), trace.answer.trim());
    assert.ok(trace.explanation.trim());
  });
}
