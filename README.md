# Study Room · CS-UY 1114

An independent study companion for NYU Tandon's introductory Python course, focused on the October 27, 2026 first midterm. Dark, responsive study dashboard with topic explanations, flashcards, original programming problems, and output-tracing exercises.

The exam is handwritten, so **paper practice is the default**. Try each problem with a pen and paper, reveal the worked solution, and self-check your reasoning. The optional Python editor lets you run code or check it against representative test cases. Tracing drills ask you to predict exact printed output before revealing the explanation. The Print practice packet button produces an A4-friendly worksheet with all 12 writing prompts and eight tracing drills, with room to work by hand.

## Run locally

Use Node.js 24 and npm. Python 3 is needed only for the content verification tests.

```sh
npm ci
npm run dev
```

Open the Vite address shown in your terminal (normally port 5173). This command starts the frontend and a local API on port 3001. The `prepare` step copies the installed Pyodide runtime to `public/python/`; Python exercises then run locally in a browser worker, with no external runtime CDN. No user Python is executed on the server. If the assets need refreshing, run `npm run prepare`.

```sh
npm test         # Executes all reference solutions and traces in Python; checks progress/date logic
npm run build    # Builds production frontend, including local Python runtime
npm run preview  # Serves the build plus local API (normally port 4173)
npx playwright test  # Browser interaction tests; Chromium defaults to /usr/bin/chromium
```

The browser tests use a local Chromium binary; set `CHROMIUM_PATH` if yours is elsewhere. They start the development server if necessary and test desktop/mobile navigation, storage, paper practice, tracing, actual Python execution, and mocked AI responses. Mocked AI tests do not establish live provider access.

Progress and editor drafts are stored in this browser's local storage. Clearing browser data removes them. No account or cloud sync is implemented. Paper completions are self-reported; automated tests check behavior but do not enforce every course implementation rule such as avoiding `break` or `split()`.

## Connect OpenAI later

Copy `.env.example` to `.env`, add `STUDY_AI_KEY` securely in `.env`, and restart `npm run dev` (or the API process). The key stays on the Node server and is never sent to the browser. Do not use a `VITE_` variable for a secret or commit `.env`.

`OPENAI_API_KEY` is also supported as an alias for local development, but `STUDY_AI_KEY` is preferred for managed cloud secret settings.

`AI_MODEL` defaults to `gpt-4.1-mini`. `AI_BASE_URL` defaults to `https://api.openai.com/v1` and can point to an OpenAI-compatible HTTPS API. Provider availability, billing, and model access depend on your account.

With no key, the corner assistant is labeled **Built-in study hints** and provides curated topic explanations and exercise hints. It does not pretend these are AI replies. The optional live tutor is grounded in the selected problem and topic; AI answers can be wrong, so compare them with the course notes. Your current code is shared only when you enable the code-sharing option. Do not include personal information in messages.

For deployment, serve the frontend and `/api` under the same origin (or configure an appropriate reverse proxy), and keep API credentials in server secret storage. The API binds to loopback by default. Add authentication and appropriate usage controls before exposing a paid AI endpoint publicly; this repository is a personal study app, not a multi-user hosting service. `vite preview` is for checking a build locally.

## Course material and scope

The seven requested topics are variables/data types, Boolean expressions, `math`/`random`, selection, repetition, strings, and functions. Notes and original exercises were developed after reviewing [Sebastián Romero Cruz's public course repository](https://github.com/sebastianromerocruz/CS1114-Problem-Solving-And-Programming), including its Midterm 1 review. Exact source links, revision, attribution, and source inconsistencies are documented in [src/data/SOURCES.md](src/data/SOURCES.md).

This is not an official NYU product, and the exercises are not predictions of actual exam questions. Confirm final scope, date, and allowed techniques with your instructor. The October 27 date and handwritten format were supplied by the student. No source lecture assets are redistributed.
