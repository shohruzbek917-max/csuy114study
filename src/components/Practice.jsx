import React, { useState, useEffect } from "react";
import {
  Printer,
  Play,
  Check,
  ChevronRight,
  ArrowRight,
  Clock3,
  Code2,
  FilePenLine,
  FlaskConical,
  Lightbulb,
  RotateCcw,
  Sparkles,
  Eye,
  CheckCheck,
  Terminal,
  LoaderCircle,
  X,
  Pause,
} from "lucide-react";
import { traces } from "../data/course.js";
import { runPython, subscribePythonStatus } from "../lib/python.js";
const getDraft = (c) => {
  try {
    return localStorage.getItem(`studyroom-code-${c.id}`) ?? c.starter;
  } catch {
    return c.starter;
  }
};
export default function Practice({
  challenges,
  topics,
  activeId,
  onSelect,
  solved,
  onSolve,
  onAsk,
  onCodeChange,
}) {
  const challenge = challenges.find((c) => c.id === activeId) || challenges[0];
  const [mode, setMode] = useState("write");
  const [paper, setPaper] = useState(true);
  const [filter, setFilter] = useState("all");
  const [code, setCode] = useState(() => getDraft(challenge));
  const [stdin, setStdin] = useState("");
  const [tab, setTab] = useState("problem");
  const [hints, setHints] = useState(1);
  const [showSolution, setShowSolution] = useState(false);
  const [output, setOutput] = useState(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("idle");
  const [reset, setReset] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [ticking, setTicking] = useState(false);
  useEffect(() => subscribePythonStatus(setStatus), []);
  useEffect(() => {
    if (!ticking) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [ticking]);
  useEffect(() => {
    setCode(getDraft(challenge));
    setStdin(challenge.tests[0]?.stdin || "");
    setOutput(null);
    setTab("problem");
    setHints(1);
    setShowSolution(false);
    setSeconds(0);
    setTicking(false);
    setReset(false);
  }, [challenge.id]);
  useEffect(() => {
    onCodeChange(code);
  }, [code]);
  function updateCode(value) {
    setCode(value);
    setOutput(null);
    try {
      localStorage.setItem(`studyroom-code-${challenge.id}`, value);
    } catch {}
  }
  async function execute(tests = false) {
    setBusy(true);
    setOutput(null);
    try {
      const result = await runPython({
        code,
        stdin,
        tests: tests ? challenge.tests : [],
        functionName: challenge.functionName,
      });
      setOutput({ ...result, isTest: tests });
      if (
        tests &&
        result.results?.length === challenge.tests.length &&
        result.results.every((r) => r.passed)
      )
        onSolve(challenge.id);
    } catch (error) {
      setOutput({ error: error.message });
    } finally {
      setBusy(false);
    }
  }
  const visible = challenges.filter(
    (c) => filter === "all" || c.topic === filter,
  );
  return (
    <>
      <div className="lab-title-row">
        <div className="page-title">
          <div className="eyebrow">UNDERSTANDING, IN ACTION</div>
          <h1>Practice makes it click.</h1>
          <p>Write it. Trace it. Make it your own.</p>
        </div>
        <span className="paper-badge">
          <FilePenLine size={15} />
          Built for a handwritten exam
        </span>
      </div>
      <div className="lab-toolbar">
        <div className="segmented">
          <button
            className={mode === "write" ? "selected" : ""}
            onClick={() => setMode("write")}
          >
            <Code2 size={16} />
            Write code
          </button>
          <button
            className={mode === "trace" ? "selected" : ""}
            onClick={() => setMode("trace")}
          >
            <Eye size={16} />
            Trace output
          </button>
        </div>
        <div className="lab-tools">
          <button
            className="button secondary compact print-button"
            aria-label="Print practice packet"
            onClick={() => window.print()}
          >
            <Printer size={14} />
            <span>Print practice packet</span>
          </button>
          {mode === "write" && (
            <label className="paper-toggle">
              <input
                type="checkbox"
                checked={paper}
                onChange={(e) => setPaper(e.target.checked)}
              />
              <span className="toggle-track" />
              <FilePenLine size={15} />
              Paper mode
            </label>
          )}
        </div>
      </div>
      {mode === "trace" ? (
        <TracePractice topics={topics} />
      ) : (
        <div className="lab-layout">
          <aside className="problem-library">
            <div className="library-heading">
              <strong>Problem set</strong>
              <span>
                {solved.length}/{challenges.length}
              </span>
            </div>
            <select
              aria-label="Filter problems by topic"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All topics</option>
              {topics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            <div className="problem-list">
              {visible.map((c) => (
                <button
                  disabled={busy}
                  key={c.id}
                  onClick={() => onSelect(c.id)}
                  className={`problem-item ${c.id === challenge.id ? "selected" : ""}`}
                >
                  <span
                    className={`problem-index ${solved.includes(c.id) ? "solved" : ""}`}
                  >
                    {solved.includes(c.id) ? (
                      <Check size={14} />
                    ) : (
                      String(challenges.indexOf(c) + 1).padStart(2, "0")
                    )}
                  </span>
                  <span>
                    <strong>{c.title}</strong>
                    <small>
                      <span
                        className={`difficulty-dot ${c.difficulty.toLowerCase()}`}
                      />
                      {c.difficulty} <span>·</span> {c.minutes} min
                    </small>
                  </span>
                  <ChevronRight size={14} />
                </button>
              ))}
            </div>
          </aside>
          <section className="workspace">
            <div className="problem-heading">
              <div className="problem-meta">
                <span
                  className={`difficulty ${challenge.difficulty.toLowerCase()}`}
                >
                  {challenge.difficulty}
                </span>
                <span>
                  {topics.find((t) => t.id === challenge.topic)?.name}
                </span>
              </div>
              <h2>{challenge.title}</h2>
              <div className="problem-heading-bottom">
                <span>
                  <Clock3 size={14} />
                  {challenge.minutes} minute practice
                </span>
                {solved.includes(challenge.id) && (
                  <span className="completion-label">
                    <CheckCheck size={14} />
                    Completed
                  </span>
                )}
                <button
                  className="timer"
                  aria-label={
                    ticking ? "Pause practice timer" : "Start practice timer"
                  }
                  onClick={() => setTicking(!ticking)}
                >
                  {ticking ? <Pause size={12} /> : <Play size={12} />}{" "}
                  {String(Math.floor(seconds / 60)).padStart(2, "0")}:
                  {String(seconds % 60).padStart(2, "0")}
                </button>
              </div>
            </div>
            <div className="workspace-tabs">
              <button
                className={tab === "problem" ? "selected" : ""}
                onClick={() => setTab("problem")}
              >
                The problem
              </button>
              <button
                className={tab === "hints" ? "selected" : ""}
                onClick={() => setTab("hints")}
              >
                <Lightbulb size={14} />
                Hints
              </button>
              <button
                className={tab === "solution" ? "selected" : ""}
                onClick={() => setTab("solution")}
              >
                <Eye size={14} />
                Solution
              </button>
            </div>
            <div className="problem-content">
              {tab === "problem" && (
                <>
                  <p className="problem-description">{challenge.description}</p>
                  <div className="concept-pills">
                    {challenge.concepts.map((c) => (
                      <span key={c}>{c}</span>
                    ))}
                  </div>
                  <h3 className="example-heading">
                    Example{challenge.examples.length > 1 ? "s" : ""}
                  </h3>
                  <div className="examples">
                    {challenge.examples.map((example, i) => (
                      <div className="example" key={i}>
                        <div>
                          <span>
                            INPUT {challenge.functionName ? " / CALL" : ""}
                          </span>
                          <pre>{example.input || "(no input)"}</pre>
                        </div>
                        <ArrowRight size={15} />
                        <div>
                          <span>
                            {challenge.functionName ? "RETURN VALUE" : "OUTPUT"}
                          </span>
                          <pre>{example.output}</pre>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {tab === "hints" && (
                <div className="hints-panel">
                  <h3>A nudge in the right direction.</h3>
                  <p>Try each hint before moving to the next.</p>
                  {challenge.hints.slice(0, hints).map((hint, i) => (
                    <div className="hint" key={i}>
                      <span>{i + 1}</span>
                      <p>{hint}</p>
                    </div>
                  ))}
                  {hints < challenge.hints.length && (
                    <button
                      className="button secondary compact"
                      onClick={() => setHints((h) => h + 1)}
                    >
                      Reveal next hint <ArrowRight size={15} />
                    </button>
                  )}
                  <button
                    className="subtle-link hint-ask"
                    onClick={() =>
                      onAsk(
                        `Give me a small hint for ${challenge.title}. Don't reveal the solution.`,
                      )
                    }
                  >
                    <Sparkles size={15} />
                    Talk it through with study buddy
                  </button>
                </div>
              )}
              {tab === "solution" && (
                <div className="solution-panel">
                  {showSolution ? (
                    <>
                      <div className="solution-note">
                        <CheckCheck size={17} />
                        One possible approach. Compare the logic, not just the
                        lines.
                      </div>
                      <pre className="solution-code">
                        <code>{challenge.solution}</code>
                      </pre>
                      <p>
                        Test the example by hand. Check boundary values,
                        indentation, and whether the problem needs{" "}
                        <code>print</code> or <code>return</code>.
                      </p>
                      {paper && (
                        <button
                          className="button primary"
                          onClick={() => onSolve(challenge.id)}
                        >
                          <Check size={16} />
                          {solved.includes(challenge.id)
                            ? "Paper practice completed"
                            : "I checked my handwritten solution"}
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="solution-gate">
                      <Eye size={27} />
                      <h3>Give yourself a moment first.</h3>
                      <p>
                        You learn more by trying. Write a solution on paper or
                        use a hint, then compare your approach.
                      </p>
                      <button
                        className="button secondary"
                        onClick={() => setShowSolution(true)}
                      >
                        Reveal solution <Eye size={16} />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            {paper ? (
              <div className="paper-workspace">
                <div className="paper-workspace-top">
                  <FilePenLine size={18} />
                  <strong>Pen. Paper. Python.</strong>
                  <span>NO AUTOCOMPLETE. JUST YOU.</span>
                </div>
                <div className="paper-steps">
                  <div>
                    <span>01</span>
                    <p>
                      <strong>Write your approach</strong>Identify the inputs,
                      outputs, and steps before writing code.
                    </p>
                  </div>
                  <div>
                    <span>02</span>
                    <p>
                      <strong>Work through it by hand</strong>Use descriptive
                      names. Check indentation and trace the example.
                    </p>
                  </div>
                  <div>
                    <span>03</span>
                    <p>
                      <strong>Check your reasoning</strong>Compare your answer
                      with a solution, then try a boundary case.
                    </p>
                  </div>
                </div>
                <div className="paper-footer">
                  <span>
                    <Clock3 size={14} />
                    Try it in {challenge.minutes} minutes.
                  </span>
                  <button
                    className="button secondary compact"
                    onClick={() => setTab("solution")}
                  >
                    Ready to compare <ArrowRight size={15} />
                  </button>
                </div>
                <button
                  className="subtle-link try-editor"
                  onClick={() => setPaper(false)}
                >
                  Want to test your code? Open the Python editor{" "}
                  <ChevronRight size={14} />
                </button>
              </div>
            ) : (
              <div className="editor-shell">
                <div className="editor-topbar">
                  <span>
                    <Code2 size={15} />
                    solution.py <small>Python 3</small>
                  </span>
                  <button
                    className="icon-button"
                    aria-label="Reset code to starter"
                    disabled={busy}
                    onClick={() => setReset(true)}
                  >
                    <RotateCcw size={14} />
                  </button>
                </div>
                {reset && (
                  <div className="reset-confirm">
                    <span>Replace this draft with the starter code?</span>
                    <button
                      onClick={() => {
                        updateCode(challenge.starter);
                        setReset(false);
                      }}
                    >
                      Reset draft
                    </button>
                    <button onClick={() => setReset(false)}>Cancel</button>
                  </div>
                )}
                <div className="editor-area">
                  <div className="line-numbers" aria-hidden="true">
                    {code.split("\n").map((_, i) => (
                      <span key={i}>{i + 1}</span>
                    ))}
                  </div>
                  <textarea
                    aria-label="Python code editor"
                    spellCheck="false"
                    value={code}
                    disabled={busy}
                    onChange={(e) => updateCode(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Tab" && !e.shiftKey) {
                        e.preventDefault();
                        const start = e.target.selectionStart;
                        const end = e.target.selectionEnd;
                        const el = e.target;
                        updateCode(
                          code.slice(0, start) + "    " + code.slice(end),
                        );
                        setTimeout(() => {
                          el.selectionStart = el.selectionEnd = start + 4;
                        }, 0);
                      }
                    }}
                  />
                </div>
                <div className="stdin-row">
                  <label htmlFor="stdin">
                    Standard input <span>One input() value per line</span>
                  </label>
                  <textarea
                    id="stdin"
                    rows="2"
                    value={stdin}
                    onChange={(e) => setStdin(e.target.value)}
                    placeholder="Type input values here"
                  />
                </div>
                <div className="editor-actions">
                  <span className="runtime-status">
                    <i className={status === "ready" ? "ready" : ""} />
                    {status === "loading"
                      ? "Loading Python…"
                      : busy
                        ? "Running…"
                        : status === "ready"
                          ? "Python ready"
                          : "Python runs in your browser"}
                  </span>
                  <button
                    className="button secondary compact"
                    disabled={busy}
                    onClick={() => execute(false)}
                  >
                    {busy ? (
                      <LoaderCircle size={14} className="spin" />
                    ) : (
                      <Play size={14} />
                    )}
                    Run
                  </button>
                  <button
                    className="button primary compact"
                    disabled={busy}
                    onClick={() => execute(true)}
                  >
                    <FlaskConical size={15} />
                    Check solution
                  </button>
                </div>
                {output && (
                  <div className="output-panel" aria-live="polite">
                    <div className="output-title">
                      <Terminal size={14} />
                      {output.isTest ? "Test results" : "Output"}
                      {output.results && (
                        <span>
                          {output.results.filter((r) => r.passed).length}/
                          {output.results.length} passed
                        </span>
                      )}
                    </div>
                    {output.error && (
                      <pre className="error-output">{output.error}</pre>
                    )}
                    {output.results
                      ? output.results.map((r, i) => (
                          <div
                            className={`test-result ${r.passed ? "passed" : "failed"}`}
                            key={i}
                          >
                            <strong>
                              {r.passed ? <Check size={14} /> : <X size={14} />}
                              Test {i + 1} · {r.passed ? "Passed" : "Try again"}
                            </strong>
                            {!r.passed && (
                              <>
                                <pre>
                                  Expected: {format(r.expected)}
                                  {"\n"}Your result: {format(r.actual)}
                                </pre>
                                {r.error && (
                                  <pre className="error-output">{r.error}</pre>
                                )}
                              </>
                            )}
                          </div>
                        ))
                      : !output.error && (
                          <pre>
                            {output.output ||
                              "(Program finished with no printed output.)"}
                          </pre>
                        )}
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      )}
    </>
  );
}
function format(value) {
  return typeof value === "string" ? value : JSON.stringify(value);
}
function TracePractice({ topics }) {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState(null);
  const [reveal, setReveal] = useState(false);
  const trace = traces[index];
  const [done, setDone] = useState(() => {
    try {
      const x = JSON.parse(localStorage.getItem("studyroom-traces") || "[]");
      return Array.isArray(x) ? x : [];
    } catch {
      return [];
    }
  });
  function select(i) {
    setIndex(i);
    setAnswer("");
    setResult(null);
    setReveal(false);
  }
  function check() {
    const passed = answer.trim() === trace.answer.trim();
    setResult(passed);
    setReveal(true);
    if (passed) {
      const next = [...new Set([...done, trace.id])];
      setDone(next);
      try {
        localStorage.setItem("studyroom-traces", JSON.stringify(next));
      } catch {}
    }
  }
  return (
    <div className="trace-layout">
      <aside className="trace-guide">
        <span className="topic-icon yellow">
          <Eye size={23} />
        </span>
        <h2>Be the interpreter.</h2>
        <p>
          Read each line and track how the variables change. Write the exact
          printed output before checking.
        </p>
        <div className="trace-guide-note">
          <FilePenLine size={18} />
          <p>
            For exam practice, use a table on paper: one column per variable,
            one row per loop iteration.
          </p>
        </div>
        <div className="trace-progress">
          <strong>
            {done.length} / {traces.length}
          </strong>
          <span>traces completed correctly</span>
        </div>
        <div className="trace-selectors">
          {traces.map((t, i) => (
            <button
              aria-label={`Trace ${i + 1}: ${t.title}`}
              className={
                index === i ? "selected" : done.includes(t.id) ? "done" : ""
              }
              key={t.id}
              onClick={() => select(i)}
            >
              {done.includes(t.id) ? <Check size={15} /> : i + 1}
            </button>
          ))}
        </div>
      </aside>
      <section className="trace-card">
        <div className="problem-heading">
          <div className="problem-meta">
            <span className="difficulty medium">
              Trace {index + 1} of {traces.length}
            </span>
            <span>{topics.find((t) => t.id === trace.topic)?.name}</span>
          </div>
          <h2>{trace.title}</h2>
          <p>What does this program print?</p>
        </div>
        <pre className="trace-code">
          <code>{trace.code}</code>
        </pre>
        <div className="trace-answer">
          <label htmlFor="trace-output">
            Your predicted output{" "}
            <small>
              Keep the line breaks. Don’t include quotes around strings.
            </small>
          </label>
          <textarea
            id="trace-output"
            value={answer}
            onChange={(e) => {
              setAnswer(e.target.value);
              setResult(null);
            }}
            rows={4}
            placeholder="Write the output here…"
            spellCheck="false"
          />
          <div className="trace-actions">
            <button
              className="button secondary compact"
              onClick={() => setReveal(!reveal)}
            >
              <Eye size={15} />
              {reveal ? "Hide explanation" : "Reveal explanation"}
            </button>
            <button
              className="button primary compact"
              disabled={!answer.trim()}
              onClick={check}
            >
              <Check size={16} />
              Check answer
            </button>
          </div>
          {result !== null && (
            <div
              className={`trace-result ${result ? "passed" : "failed"}`}
              role="status"
            >
              {result
                ? "Exactly right. You followed every step."
                : "Not quite. Compare the output below and trace each line again."}
            </div>
          )}
          {reveal && (
            <div className="trace-explanation">
              <span className="tiny-label">EXPECTED OUTPUT</span>
              <pre>{trace.answer}</pre>
              <p>{trace.explanation}</p>
            </div>
          )}
          <button
            className="subtle-link next-trace"
            onClick={() => select((index + 1) % traces.length)}
          >
            Next trace <ArrowRight size={15} />
          </button>
        </div>
      </section>
    </div>
  );
}
