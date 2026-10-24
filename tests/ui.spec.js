import { test, expect } from '@playwright/test';
import { challenges, flashcards, topics, traces } from '../src/data/course.js';

const browserErrors = new Map();
const expectedNetworkStatus = new Map();
test.beforeEach(async ({ page }) => {
  const errors = [];
  browserErrors.set(page, errors);
  expectedNetworkStatus.set(page, new Set());
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error' && ![...expectedNetworkStatus.get(page)].some(status => message.text().includes(String(status)))) errors.push(message.text()); });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Make it click.' })).toBeVisible();
});
test.afterEach(async ({ page }) => { expect(browserErrors.get(page)).toEqual([]); });

async function nav(page, name) {
  const opener = page.getByRole('button', { name: 'Open navigation' });
  if (await opener.isVisible()) await opener.click();
  await page.locator('.sidebar').getByRole('button', { name, exact: name !== 'Study topics' }).click();
}
async function openEditor(page) {
  await nav(page, 'Practice lab');
  await page.getByRole('checkbox', { name: 'Paper mode' }).uncheck();
  await expect(page.getByRole('textbox', { name: 'Python code editor' })).toBeVisible();
}
async function selectProblem(page, challenge) {
  await page.locator('.problem-list').getByRole('button', { name: new RegExp(challenge.title) }).click();
  await expect(page.locator('.problem-heading h2')).toHaveText(challenge.title);
}

test('topic review and resource navigation preserve real progress', async ({ page }) => {
  await nav(page, 'Study topics');
  await expect(page.getByRole('heading', { name: topics[0].name, exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Mark as reviewed' }).click();
  await expect(page.getByRole('button', { name: 'Reviewed', exact: true })).toBeVisible();
  await nav(page, 'Overview');
  await expect(page.locator('.stat-card').first().locator('.stat-value')).toHaveText(`1/ ${topics.length}`);
  await page.reload();
  await expect(page.locator('.stat-card').first().locator('.stat-value')).toHaveText(`1/ ${topics.length}`);
  await nav(page, 'Course resources');
  await expect(page.getByRole('heading', { name: 'Your course, connected.' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Open course repository' })).toHaveAttribute('href', /github.com\/sebastianromerocruz/);
  expect(await page.locator('.resource-card').count()).toBe(7);
});

test('flashcards flip, master, filter, and retain mastery on refresh', async ({ page }) => {
  await nav(page, 'Flashcards');
  await expect(page.locator('.flashcard h2')).toHaveText(flashcards[0].question);
  await page.getByRole('button', { name: 'Reveal answer', exact: true }).click();
  await expect(page.locator('.flashcard h2')).toHaveText(flashcards[0].answer);
  await page.getByRole('button', { name: 'Got it — mark mastered' }).click();
  await expect(page.locator('.flash-progress')).toContainText('1 mastered');
  await page.getByRole('combobox', { name: 'Filter flashcards by topic' }).selectOption('variables');
  await page.getByRole('checkbox', { name: 'Still learning only' }).check();
  await expect(page.locator('.flash-progress')).toContainText('/ 4 cards');
  await expect(page.locator('.flashcard h2')).toHaveText(flashcards.filter(card => card.topic === 'variables')[1].question);
  await page.getByRole('combobox', { name: 'Filter flashcards by topic' }).selectOption('functions');
  await expect(page.locator('.flashcard-top')).toContainText('Functions');
  await expect(page.locator('.flash-progress')).toContainText('/ 5 cards');
  await page.reload();
  await nav(page, 'Flashcards');
  await expect(page.locator('.flash-progress')).toContainText('1 mastered');
});

test('paper practice defaults on, supports self-check, and tracing gives honest feedback', async ({ page }) => {
  await nav(page, 'Practice lab');
  await expect(page.getByRole('checkbox', { name: 'Paper mode' })).toBeChecked();
  await expect(page.getByRole('textbox', { name: 'Python code editor' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Hints', exact: true }).click();
  await expect(page.locator('.hint').first()).toContainText(challenges[0].hints[0]);
  await page.getByRole('button', { name: 'Solution', exact: true }).click();
  await expect(page.locator('.solution-code')).toHaveCount(0);
  await page.getByRole('button', { name: 'Reveal solution', exact: true }).click();
  await expect(page.locator('.solution-code')).toHaveText(challenges[0].solution);
  await page.getByRole('button', { name: 'I checked my handwritten solution' }).click();
  await expect(page.locator('.completion-label')).toHaveText('Completed');
  await page.getByRole('button', { name: 'Trace output', exact: true }).click();
  await page.getByRole('textbox', { name: 'Your predicted output' }).fill('wrong');
  await page.getByRole('button', { name: 'Check answer', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Not quite');
  await page.getByRole('textbox', { name: 'Your predicted output' }).fill(traces[0].answer);
  await page.getByRole('button', { name: 'Check answer', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Exactly right');
  await expect(page.locator('.trace-progress')).toContainText('1 /');
  await page.reload();
  await nav(page, 'Practice lab');
  await expect(page.locator('.completion-label')).toHaveText('Completed');
  await page.getByRole('button', { name: 'Trace output', exact: true }).click();
  await expect(page.locator('.trace-progress')).toContainText('1 /');
});

test('Python editor runs actual code, detects wrong answers and errors, and isolates drafts', async ({ page }) => {
  await openEditor(page);
  const editor = page.getByRole('textbox', { name: 'Python code editor' });
  await editor.fill('print(0)');
  await page.getByRole('button', { name: 'Check solution', exact: true }).click();
  await expect(page.locator('.output-title')).toContainText(`0/${challenges[0].tests.length} passed`, { timeout: 60000 });
  await expect(page.locator('.test-result.failed')).toHaveCount(challenges[0].tests.length);
  await editor.fill(challenges[0].solution);
  await page.getByRole('button', { name: 'Check solution', exact: true }).click();
  await expect(page.locator('.output-title')).toContainText(`${challenges[0].tests.length}/${challenges[0].tests.length} passed`);
  await expect(page.locator('.completion-label')).toHaveText('Completed');
  await page.getByRole('textbox', { name: 'Standard input' }).fill('135');
  await page.getByRole('button', { name: 'Run', exact: true }).click();
  await expect(page.locator('.output-panel > pre')).toHaveText('2 15');
  await editor.fill('print(1 / 0)');
  await page.getByRole('button', { name: 'Run', exact: true }).click();
  await expect(page.locator('.error-output')).toContainText('ZeroDivisionError');
  const firstDraft = '# draft one\nprint("one")';
  const secondDraft = '# draft two\nprint("two")';
  await editor.fill(firstDraft);
  await selectProblem(page, challenges[1]);
  await expect(editor).toHaveValue(challenges[1].starter);
  await editor.fill(secondDraft);
  await selectProblem(page, challenges[0]);
  await expect(editor).toHaveValue(firstDraft);
  await page.reload();
  await openEditor(page);
  await expect(editor).toHaveValue(firstDraft);
  await selectProblem(page, challenges[1]);
  await expect(editor).toHaveValue(secondDraft);
});

test('local tutor clearly labels curated help and gives problem-aware hints', async ({ page }) => {
  await page.route('**/api/health', route => route.fulfill({ json: { ok: true, aiConfigured: false } }));
  await nav(page, 'Practice lab');
  await page.getByRole('button', { name: 'Open study assistant' }).click();
  await expect(page.getByText('Built-in study hints', { exact: true })).toBeVisible();
  await expect(page.locator('.tutor-notice')).toContainText('not AI-generated replies');
  await page.getByRole('textbox', { name: 'Message study buddy' }).fill('Give me a hint');
  await page.getByRole('button', { name: 'Send message', exact: true }).click();
  await expect(page.locator('.chat-message.assistant').last()).toContainText(challenges[0].hints[0]);
  await page.getByRole('textbox', { name: 'Message study buddy' }).fill('How do I trace code?');
  await page.getByRole('button', { name: 'Send message', exact: true }).click();
  await expect(page.locator('.chat-message.assistant').last()).toContainText('Make a column for each variable');
  await page.getByRole('button', { name: 'Close study buddy' }).click();
  await expect(page.getByRole('dialog', { name: 'Your study buddy' })).toHaveCount(0);
});

test('mobile navigation and all principal views fit a 375px screen', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.waitForTimeout(400); // CSS sidebar transitions after the viewport changes.
  const assertFits = async () => {
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375);
  };
  await assertFits();
  for (const name of ['Study topics', 'Practice lab', 'Flashcards', 'Course resources', 'Overview']) {
    await nav(page, name);
    await assertFits();
  }
  await page.getByRole('button', { name: 'Open study assistant' }).click();
  const panel = page.locator('.tutor-panel');
  await expect(panel).toBeVisible();
  const box = await panel.boundingBox();
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(375);
  await assertFits();
});


test('configured AI sends private context only with opt-in and recovers from provider errors', async ({ page }) => {
  await page.route('**/api/health', route => route.fulfill({ json: { ok: true, aiConfigured: true } }));
  const requests = [];
  let shouldFail = false;
  await page.route('**/api/chat', async route => {
    requests.push(route.request().postDataJSON());
    if (shouldFail) {
      await route.fulfill({ status: 429, json: { error: 'Usage limit reached. Try again.' } });
    } else {
      await route.fulfill({ json: { message: 'Try integer division for complete hours and modulo for the remainder.' } });
    }
  });
  await nav(page, 'Practice lab');
  await page.getByRole('button', { name: 'Open study assistant' }).click();
  await expect(page.getByText('AI tutor · OpenAI', { exact: true })).toBeVisible();
  await page.getByRole('textbox', { name: 'Message study buddy' }).fill('Can I get a hint?');
  await page.getByRole('button', { name: 'Send message', exact: true }).click();
  await expect(page.locator('.chat-message.assistant').last()).toContainText('integer division');
  expect(requests[0].context.problem).toContain(challenges[0].description);
  expect(requests[0].context.code).toBe('');
  await page.getByRole('checkbox', { name: 'Include my current code with this question' }).check();
  await page.getByRole('textbox', { name: 'Message study buddy' }).fill('Please look at my code.');
  await page.getByRole('button', { name: 'Send message', exact: true }).click();
  await expect(page.locator('.chat-message.assistant')).toHaveCount(3);
  expect(requests[1].context.code).toBe(challenges[0].starter);
  shouldFail = true;
  expectedNetworkStatus.get(page).add(429);
  await page.getByRole('textbox', { name: 'Message study buddy' }).fill('Help me again');
  await page.getByRole('button', { name: 'Send message', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Usage limit reached');
  await expect(page.getByRole('textbox', { name: 'Message study buddy' })).toHaveValue('Help me again');
  shouldFail = false;
  await page.getByRole('button', { name: 'Send message', exact: true }).click();
  await expect(page.getByRole('alert')).toHaveCount(0);
  await expect(page.locator('.chat-message.assistant')).toHaveCount(4);
});


test('print packet button opens printing and print layout contains all 20 exercises', async ({ page }) => {
  await nav(page, 'Practice lab');
  await page.evaluate(() => { window.__printCalls = 0; window.print = () => { window.__printCalls += 1; }; });
  await page.getByRole('button', { name: 'Print practice packet' }).click();
  expect(await page.evaluate(() => window.__printCalls)).toBe(1);
  await expect(page.locator('.print-sheet')).toBeHidden();
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('.app-shell')).toBeHidden();
  await expect(page.getByRole('region', { name: 'Printable practice packet' })).toBeVisible();
  await expect(page.locator('.print-task')).toHaveCount(challenges.length + traces.length);
  await expect(page.locator('.print-trace')).toHaveCount(traces.length);
  await expect(page.locator('.print-sheet')).toContainText('Midterm 01 / Paper practice');
  for (const challenge of challenges) await expect(page.locator('.print-sheet')).toContainText(challenge.title);
  const pdf = await page.pdf({ format: 'A4', printBackground: false });
  expect(pdf.subarray(0, 4).toString()).toBe('%PDF');
  expect(pdf.length).toBeGreaterThan(20000);
});
