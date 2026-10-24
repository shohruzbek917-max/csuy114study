import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  X,
  ArrowUp,
  BookOpen,
  LoaderCircle,
  Info,
} from "lucide-react";
import { topics } from "../data/course.js";
export default function Tutor({ onClose, initialPrompt, context }) {
  const [configured, setConfigured] = useState(false);
  const [checked, setChecked] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hey, I’m your study buddy. Let’s figure it out together. Ask for a hint, talk through a concept, or practice tracing a program.",
    },
  ]);
  const [input, setInput] = useState(initialPrompt || "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [includeCode, setIncludeCode] = useState(false);
  const bottom = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/health", { signal: controller.signal })
      .then((r) => r.json())
      .then((d) => {
        setConfigured(d.aiConfigured);
        setChecked(true);
      })
      .catch(() => setChecked(true));
    inputRef.current?.focus();
    return () => {
      controller.abort();
      abortRef.current?.abort();
    };
  }, []);
  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, busy]);
  async function send(event) {
    event?.preventDefault();
    const question = input.trim();
    if (!question || busy) return;
    setInput("");
    setError("");
    const next = [...messages, { role: "user", content: question }];
    setMessages(next);
    if (!configured) {
      setMessages([
        ...next,
        {
          role: "assistant",
          content: localHint(question, context),
          local: true,
        },
      ]);
      return;
    }
    setBusy(true);
    const controller = new AbortController();
    abortRef.current = controller;
    const timeout = setTimeout(() => controller.abort(), 35000);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.slice(1).slice(-23),
          context: {
            topic: context.topic,
            problem: context.problem
              ? `${context.problem.title}\n${context.problem.description}`
              : "",
            code: includeCode ? context.code : "",
          },
        }),
        signal: controller.signal,
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(
          data.error || "The assistant could not answer. Try again.",
        );
      setMessages((m) => [...m, { role: "assistant", content: data.message }]);
    } catch (e) {
      setError(
        e.name === "AbortError"
          ? "The request was interrupted or timed out. Please try again."
          : e.message,
      );
      setInput(question);
      setMessages(next.slice(0, -1));
    } finally {
      clearTimeout(timeout);
      setBusy(false);
    }
  }
  return (
    <section
      className="tutor-panel"
      role="dialog"
      aria-modal="false"
      aria-labelledby="tutor-title"
    >
      <header>
        <span className="tutor-avatar">
          <Sparkles size={19} />
        </span>
        <div>
          <h2 id="tutor-title">Your study buddy</h2>
          <span>
            <i className={configured ? "connected" : ""} />
            {!checked
              ? "Connecting…"
              : configured
                ? "AI tutor · OpenAI"
                : "Built-in study hints"}
          </span>
        </div>
        <button
          className="icon-button"
          onClick={onClose}
          aria-label="Close study buddy"
        >
          <X size={19} />
        </button>
      </header>
      {!configured && (
        <div className="tutor-notice">
          <Info size={15} />
          <p>
            AI isn’t connected yet. These are curated course hints, not
            AI-generated replies.
          </p>
        </div>
      )}
      {context.problem && (
        <div className="tutor-context">
          <BookOpen size={13} /> Helping with{" "}
          <strong>{context.problem.title}</strong>
        </div>
      )}
      <div className="chat-messages">
        {messages.map((message, i) => (
          <div key={i} className={`chat-message ${message.role}`}>
            <span>
              {message.role === "assistant" ? <Sparkles size={13} /> : "YOU"}
            </span>
            <div>
              {message.role === "assistant" ? (
                <AssistantText text={message.content} />
              ) : (
                message.content
              )}
            </div>
          </div>
        ))}
        {busy && (
          <div className="chat-thinking">
            <LoaderCircle size={15} className="spin" /> Thinking it through…
          </div>
        )}
        <div ref={bottom} />
      </div>
      {messages.length < 3 && (
        <div className="chat-suggestions">
          {["Give me a hint", "Explain this topic", "How do I trace code?"].map(
            (q) => (
              <button
                key={q}
                onClick={() => {
                  setInput(q);
                  inputRef.current?.focus();
                }}
              >
                {q}
              </button>
            ),
          )}
        </div>
      )}
      {error && (
        <div className="chat-error" role="alert">
          {error}
        </div>
      )}
      <form className="chat-form" onSubmit={send}>
        {configured && context.code && (
          <label className="share-code">
            <input
              type="checkbox"
              checked={includeCode}
              onChange={(e) => setIncludeCode(e.target.checked)}
            />
            <span>Include my current code with this question</span>
          </label>
        )}
        <div className="chat-input">
          <input
            ref={inputRef}
            aria-label="Message study buddy"
            maxLength={4000}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What’s on your mind?"
            disabled={busy}
          />
          <button
            type="submit"
            aria-label="Send message"
            disabled={!input.trim() || busy || !checked}
          >
            <ArrowUp size={18} />
          </button>
        </div>
        <p>
          {configured
            ? "AI can make mistakes. Check your course notes."
            : "Want live AI help? Connect a server API key."}
        </p>
      </form>
    </section>
  );
}
function localHint(question, context) {
  const text = question.toLowerCase();
  if (/trac|paper|handwrit/.test(text))
    return "Try a trace table on paper.\n\n1. Make a column for each variable.\n2. Read one statement at a time and record new values.\n3. For a loop, add a row per iteration.\n4. Keep a separate output column for print().\n\nPay special attention to the stop value of range() and the difference between print() and return.";
  if (/hint|help|stuck/.test(text) && context.problem)
    return `${context.problem.hints[0]}\n\nBefore coding, try the example by hand. What is the first value your program needs to know? More hints are available in the problem’s Hints tab.`;
  if (/solution|answer/.test(text) && context.problem)
    return "A worked solution is available in this problem’s Solution tab. First, write your approach and trace one example by hand. When you reveal the solution, compare each step and check a boundary case.";
  const keywords = {
    variables: /variabl|data type|integer|float|input|casting/,
    booleans: /boolean|logical|comparison|\band\b|\bor\b/,
    libraries: /random|math|floor|ceil|sqrt/,
    selection: /selection|conditional|\bif\b|elif/,
    loops: /loop|range|while|iteration/,
    strings: /string|slice|slicing|character/,
    functions: /function|return|parameter|argument/,
  };
  const matched = topics.find((t) => keywords[t.id]?.test(text));
  const match = matched || topics.find((t) => t.name === context.topic);
  if (match) {
    const lesson = match.lessons[0];
    return `${match.name}: ${lesson.title}\n\n${lesson.body}${lesson.code ? "\n\n" + lesson.code : ""}\n\nTry changing one input and predicting the result before you run it.`;
  }
  return "For a Python problem, identify the inputs, the expected output, and a small example you can work by hand. Then choose selection for a decision, a loop for repeated work, or a function for a reusable task.\n\nAsk about variables, booleans, math/random, selection, loops, strings, functions, or tracing. Live open-ended AI answers will be available after an OpenAI key is connected.";
}

function AssistantText({ text }) {
  const chunks = text.split(/(```[\s\S]*?```)/g);
  return chunks.map((chunk, index) => {
    if (chunk.startsWith("```")) {
      return (
        <pre className="chat-code" key={index}>
          <code>
            {chunk
              .replace(/^```[a-zA-Z0-9_-]*\n?/, "")
              .replace(/```$/, "")
              .trimEnd()}
          </code>
        </pre>
      );
    }
    return (
      <React.Fragment key={index}>
        {chunk
          .split(/(`[^`\n]+`|\*\*[^*]+\*\*)/g)
          .map((part, i) =>
            part.startsWith("`") ? (
              <code key={i}>{part.slice(1, -1)}</code>
            ) : part.startsWith("**") ? (
              <strong key={i}>{part.slice(2, -2)}</strong>
            ) : (
              part
            ),
          )}
      </React.Fragment>
    );
  });
}
