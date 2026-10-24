import test, { afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { daysUntilExam, readProgress, persistProgress, EMPTY_PROGRESS } from '../src/lib/progress.js';

afterEach(() => { delete globalThis.localStorage; });

test('exam countdown follows New York calendar days, including UTC day boundaries', () => {
  const cases = [
    ['2026-10-24T23:31:00Z', 3],
    ['2026-10-27T03:59:59Z', 1],
    ['2026-10-27T04:00:00Z', 0],
    ['2026-10-28T03:59:59Z', 0],
    ['2026-10-28T04:00:00Z', -1],
  ];
  for (const [date, days] of cases) assert.equal(daysUntilExam(new Date(date)), days, date);
});

test('saved progress round-trips without requiring accounts or network', () => {
  const store = new Map();
  globalThis.localStorage = { getItem: key => store.get(key) ?? null, setItem: (key, value) => store.set(key, value) };
  assert.deepEqual(readProgress(), EMPTY_PROGRESS);
  const progress = { solved: ['minutes-converter'], mastered: ['v1'], reviewed: ['variables'], dates: ['2026-10-24'] };
  persistProgress(progress);
  assert.deepEqual(readProgress(), progress);
});

test('corrupt or unavailable local storage does not break studying', () => {
  globalThis.localStorage = { getItem: () => '{broken', setItem: () => { throw new Error('storage blocked'); } };
  assert.deepEqual(readProgress(), EMPTY_PROGRESS);
  assert.doesNotThrow(() => persistProgress(EMPTY_PROGRESS));
  delete globalThis.localStorage;
  assert.deepEqual(readProgress(), EMPTY_PROGRESS);
});

test('older saved progress fills missing fields and ignores malformed fields', () => {
  globalThis.localStorage = { getItem: () => JSON.stringify({ solved: ['sentinel-sum'], mastered: null, reviewed: 'all' }) };
  assert.deepEqual(readProgress(), { solved: ['sentinel-sum'], mastered: [], reviewed: [], dates: [] });
});
