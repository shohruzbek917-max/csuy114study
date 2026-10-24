import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  BookOpen,
  Code2,
  Layers,
  ArrowUpRight,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  Check,
  CheckCheck,
  Clock3,
  CalendarDays,
  X,
  ExternalLink,
  RotateCcw,
  Sparkles,
  Menu,
  GraduationCap,
  Variable,
  ToggleLeft,
  Library,
  GitBranch,
  Repeat2,
  TextCursorInput,
  Braces,
  CircleHelp,
} from "lucide-react";
import { topics, flashcards, challenges } from "./data/course.js";
import {
  readProgress,
  persistProgress,
  daysUntilExam,
} from "./lib/progress.js";
import Practice from "./components/Practice.jsx";
import Tutor from "./components/Tutor.jsx";
const icons = {
  Variable,
  ToggleLeft,
  Library,
  GitBranch,
  Repeat2,
  TextCursorInput,
  Braces,
};
export const topicColors = [
  "green",
  "blue",
  "yellow",
  "purple",
  "orange",
  "pink",
  "cyan",
];
export function TopicIcon({ topic, size = 19 }) {
  const Icon = icons[topic.icon] || Code2;
  return <Icon size={size} />;
}
const navItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "topics", label: "Study topics", icon: BookOpen },
  { id: "practice", label: "Practice lab", icon: Code2 },
  { id: "flashcards", label: "Flashcards", icon: Layers },
];
export default function App() {
  const [view, setView] = useState("overview");
  const [progress, setProgress] = useState(readProgress);
  const [activeTopic, setActiveTopic] = useState(topics[0].id);
  const [activeChallenge, setActiveChallenge] = useState(challenges[0].id);
  const [menu, setMenu] = useState(false);
  const [settings, setSettings] = useState(false);
  const [tutor, setTutor] = useState(false);
  const [codeContext, setCodeContext] = useState("");
  const [helpPrompt, setHelpPrompt] = useState("");
  useEffect(() => persistProgress(progress), [progress]);
  useEffect(() => {
    document.title = `${navItems.find((item) => item.id === view)?.label || "Resources"} · Study Room`;
    window.scrollTo(0, 0);
  }, [view]);
  useEffect(() => {
    const esc = (e) => {
      if (e.key === "Escape") {
        setSettings(false);
        setMenu(false);
        setTutor(false);
      }
    };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);
  function mark(kind, id, remove = false) {
    setProgress((p) => ({
      ...p,
      [kind]: remove
        ? p[kind].filter((x) => x !== id)
        : [...new Set([...p[kind], id])],
      dates: [...new Set([...p.dates, new Date().toLocaleDateString("en-CA")])],
    }));
  }
  function go(next) {
    setView(next);
    setMenu(false);
  }
  function openProblem(id) {
    setActiveChallenge(id);
    go("practice");
  }
  function openTopic(id) {
    setActiveTopic(id);
    go("topics");
  }
  function ask(prompt = "") {
    setHelpPrompt(prompt);
    setTutor(true);
  }
  const days = daysUntilExam();
  const reviewed = topics.filter((t) =>
    progress.reviewed.includes(t.id),
  ).length;
  const solved = challenges.filter((t) =>
    progress.solved.includes(t.id),
  ).length;
  const mastered = flashcards.filter((t) =>
    progress.mastered.includes(t.id),
  ).length;
  const percent = Math.round(
    ((reviewed + solved + mastered) /
      (topics.length + challenges.length + flashcards.length)) *
      100,
  );
  const nextProblem =
    challenges.find((t) => !progress.solved.includes(t.id)) || challenges[0];
  return (
    <div className="app-shell">
      {menu && <div className="mobile-scrim" onClick={() => setMenu(false)} />}
      <aside className={`sidebar ${menu ? "is-open" : ""}`}>
        <button
          className="brand"
          onClick={() => go("overview")}
          aria-label="Study Room home"
        >
          <span className="brand-mark">
            <i />
            <i />
            <i />
            <i />
          </span>
          studyroom<span className="brand-dot">.</span>
        </button>
        <div className="course-switch">
          <span className="nyu-mark">N</span>
          <div>
            <strong>CS-UY 1114</strong>
            <span>NYU Tandon · Fall 2026</span>
          </div>
          <GraduationCap size={17} />
        </div>
        <div className="nav-label">YOUR WORKSPACE</div>
        <nav>
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              aria-current={view === id ? "page" : undefined}
              className={`nav-item ${view === id ? "active" : ""}`}
              onClick={() => go(id)}
            >
              <Icon size={19} />
              <span>{label}</span>
              {id === "topics" ? (
                <small>7</small>
              ) : id === view ? (
                <span className="active-dot" />
              ) : null}
            </button>
          ))}
        </nav>
        <button
          className={`nav-item resources-nav ${view === "resources" ? "active" : ""}`}
          onClick={() => go("resources")}
        >
          <Library size={19} />
          <span>Course resources</span>
          <ArrowUpRight size={15} />
        </button>
        <div className="sidebar-bottom">
          <div className="exam-mini">
            <div>
              <span className="tiny-label">THE NEXT MILESTONE</span>
              <CalendarDays size={15} />
            </div>
            <strong>Midterm 01</strong>
            <p>
              October 27, 2026 <span>·</span>{" "}
              {days > 0
                ? `${days} days away`
                : days === 0
                  ? "Today"
                  : "Review mode"}
            </p>
            <div className="mini-progress">
              <i style={{ width: `${percent}%` }} />
            </div>
            <footer>
              <span>Your preparation</span>
              <b>{percent}%</b>
            </footer>
          </div>
          <button className="profile" onClick={() => setSettings(true)}>
            <span className="avatar">Y</span>
            <span>
              <strong>Your study space</strong>
              <small>One concept at a time</small>
            </span>
            <CircleHelp size={17} />
          </button>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <button
            className="icon-button mobile-menu"
            aria-label="Open navigation"
            onClick={() => setMenu(true)}
          >
            <Menu size={20} />
          </button>
          <div className="breadcrumbs">
            Workspace <ChevronRight size={13} />
            <span>
              {navItems.find((n) => n.id === view)?.label || "Course resources"}
            </span>
          </div>
          <div className="topbar-right">
            <span className="semester-dot" />
            Fall 2026
            <span className="topbar-divider" />
            <span className="course-tag">CS-UY 1114</span>
          </div>
        </header>
        <main
          className={
            view === "practice" ? "main-content practice-main" : "main-content"
          }
        >
          {view === "overview" && (
            <>
              <div className="page-kicker">
                <span>SMALL STEPS. BIG UNDERSTANDING.</span>
                <span className="live-label">
                  <i />
                  Your midterm study space
                </span>
              </div>
              <section className="hero">
                <div className="hero-copy">
                  <div className="eyebrow">
                    <span /> LET’S GET MIDTERM READY
                  </div>
                  <h1>
                    Make it <em>click.</em>
                  </h1>
                  <p>
                    A little practice. A lot more confidence.
                    <br />
                    Your space to turn Python concepts into second nature.
                  </p>
                  <div className="hero-actions">
                    <button
                      className="button primary"
                      onClick={() => openProblem(nextProblem.id)}
                    >
                      Start practicing <ArrowUpRight size={18} />
                    </button>
                    <button
                      className="button text-button"
                      onClick={() => go("flashcards")}
                    >
                      Review flashcards <ArrowRight size={16} />
                    </button>
                  </div>
                  <div className="hero-caption">
                    <CheckCheck size={15} />
                    Built around your course. Made for your pace.
                  </div>
                </div>
                <div className="hero-art" aria-hidden="true">
                  <div className="orbit orbit-one" />
                  <div className="orbit orbit-two" />
                  <div className="orbit orbit-three" />
                  <span className="art-star star-one">✦</span>
                  <span className="art-star star-two">✧</span>
                  <div className="floating-token token-braces">{"{ }"}</div>
                  <div className="floating-token token-check">
                    <Check size={22} />
                  </div>
                  <div className="code-art">
                    <div className="code-art-top">
                      <span />
                      <span />
                      <span />
                      <small>your_next_chapter.py</small>
                    </div>
                    <div className="code-art-body">
                      <span className="code-line-no">1</span>
                      <code>
                        <b>while</b> learning:
                        <br />
                        <span className="code-line-no">2</span> practice()
                        <br />
                        <span className="code-line-no">3</span> confidence{" "}
                        <i>+=</i> <em>1</em>
                        <br />
                        <span className="code-line-no">4</span>
                        <br />
                        <span className="code-line-no">5</span>
                        <span className="code-comment"># you've got this.</span>
                        <span className="code-caret" />
                      </code>
                    </div>
                  </div>
                  <div className="art-label">
                    <span />
                    PROGRESS, ONE LINE AT A TIME
                  </div>
                </div>
              </section>
              <section className="stats-grid" aria-label="Your study progress">
                <Stat
                  icon={BookOpen}
                  label="Topics reviewed"
                  value={reviewed}
                  total={topics.length}
                  note="Build your foundation"
                />
                <Stat
                  icon={Code2}
                  label="Problems solved"
                  value={solved}
                  total={challenges.length}
                  note="Put your knowledge to work"
                />
                <Stat
                  icon={Layers}
                  label="Cards mastered"
                  value={mastered}
                  total={flashcards.length}
                  note="Keep the concepts fresh"
                />
              </section>
              <div className="dashboard-columns">
                <section className="roadmap">
                  <div className="section-heading">
                    <div>
                      <h2>
                        Your study roadmap{" "}
                        <span className="count-badge">07</span>
                      </h2>
                      <p>Seven topics. A stronger foundation.</p>
                    </div>
                    <button
                      className="subtle-link"
                      onClick={() => go("topics")}
                    >
                      View all <ArrowUpRight size={15} />
                    </button>
                  </div>
                  <div className="topic-list">
                    {topics.map((topic, index) => (
                      <button
                        className="topic-row"
                        key={topic.id}
                        onClick={() => openTopic(topic.id)}
                      >
                        <span className={`topic-icon ${topicColors[index]}`}>
                          <TopicIcon topic={topic} />
                        </span>
                        <span className="topic-row-copy">
                          <strong>{topic.name}</strong>
                          <small>{topic.description}</small>
                        </span>
                        <span
                          className={`topic-status ${progress.reviewed.includes(topic.id) ? "done" : ""}`}
                        >
                          {progress.reviewed.includes(topic.id) ? (
                            <>
                              <Check size={12} />
                              Reviewed
                            </>
                          ) : (
                            "Explore topic"
                          )}
                        </span>
                        <ChevronRight size={17} />
                      </button>
                    ))}
                  </div>
                </section>
                <div className="dashboard-side">
                  <section className="focus-card">
                    <div className="card-eyebrow">
                      <span className="purple-dot" /> A GOOD PLACE TO START
                      <ArrowUpRight size={17} />
                    </div>
                    <div className="focus-icon">
                      <Code2 size={25} />
                    </div>
                    <h2>{nextProblem.title}</h2>
                    <p>
                      {nextProblem.description.split("\n")[0].slice(0, 120)}
                      {nextProblem.description.split("\n")[0].length > 120
                        ? "…"
                        : ""}
                    </p>
                    <div className="problem-meta">
                      <span
                        className={`difficulty ${nextProblem.difficulty.toLowerCase()}`}
                      >
                        {nextProblem.difficulty}
                      </span>
                      <span>
                        <Clock3 size={13} />
                        {nextProblem.minutes} min
                      </span>
                    </div>
                    <button
                      className="button secondary full-width"
                      onClick={() => openProblem(nextProblem.id)}
                    >
                      Give it a go <ArrowRight size={17} />
                    </button>
                  </section>
                  <QuickCard
                    cards={flashcards}
                    onAll={() => go("flashcards")}
                  />
                </div>
              </div>
              <div className="bottom-note">
                <span>
                  <span className="small-brand-mark">✳</span> Understanding
                  beats memorizing. You’re in the right place.
                </span>
                <button onClick={() => go("resources")}>
                  Made with your course material <ArrowUpRight size={13} />
                </button>
              </div>
            </>
          )}
          {view === "topics" && (
            <>
              <PageTitle
                eyebrow="BUILD YOUR FOUNDATION"
                title="One concept at a time."
                description="Clear explanations, small examples, and the ideas that show up on your midterm."
              />
              <div className="topic-chips">
                {topics.map((t, i) => (
                  <button
                    key={t.id}
                    className={`filter-chip ${activeTopic === t.id ? "selected" : ""}`}
                    onClick={() => setActiveTopic(t.id)}
                  >
                    <TopicIcon topic={t} size={15} />
                    {t.name}
                    {progress.reviewed.includes(t.id) && <Check size={13} />}
                  </button>
                ))}
              </div>
              <TopicDetail
                topic={topics.find((t) => t.id === activeTopic)}
                reviewed={progress.reviewed.includes(activeTopic)}
                onReview={() => mark("reviewed", activeTopic)}
                onPractice={() => {
                  const c = challenges.find((c) => c.topic === activeTopic);
                  if (c) openProblem(c.id);
                }}
              />
            </>
          )}
          {view === "practice" && (
            <Practice
              challenges={challenges}
              topics={topics}
              activeId={activeChallenge}
              onSelect={setActiveChallenge}
              solved={progress.solved}
              onSolve={(id) => mark("solved", id)}
              onAsk={ask}
              onCodeChange={setCodeContext}
            />
          )}
          {view === "flashcards" && (
            <Flashcards
              cards={flashcards}
              topics={topics}
              mastered={progress.mastered}
              onMaster={(id, remove) => mark("mastered", id, remove)}
            />
          )}
          {view === "resources" && <Resources topics={topics} />}
        </main>
      </div>
      <button
        className={`tutor-launch ${tutor ? "hidden" : ""}`}
        onClick={() => ask()}
        aria-label="Open study assistant"
      >
        <Sparkles size={20} />
        <span>Study buddy</span>
        <span className="tutor-launch-dot" />
      </button>
      {tutor && (
        <Tutor
          onClose={() => setTutor(false)}
          initialPrompt={helpPrompt}
          context={{
            topic: topics.find(
              (t) =>
                t.id ===
                (view === "practice"
                  ? challenges.find((c) => c.id === activeChallenge)?.topic
                  : activeTopic),
            )?.name,
            problem:
              view === "practice"
                ? challenges.find((c) => c.id === activeChallenge)
                : null,
            code: view === "practice" ? codeContext : "",
          }}
        />
      )}
      {settings && (
        <div className="modal-scrim" onClick={() => setSettings(false)}>
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="about-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              autoFocus
              className="icon-button close-modal"
              onClick={() => setSettings(false)}
              aria-label="Close"
            >
              <X size={20} />
            </button>
            <span className="topic-icon green">
              <GraduationCap />
            </span>
            <h2 id="about-title">Your room to figure it out.</h2>
            <p>
              Made for CS-UY 1114 at NYU Tandon. Your progress and code stay in
              this browser. No account needed.
            </p>
            <p>
              The exam date is October 27, 2026. Material is adapted from the
              public course repository, with original practice exercises. This
              is an independent study tool, not an official NYU product.
            </p>
            <button
              className="button secondary"
              onClick={() => {
                setSettings(false);
                go("resources");
              }}
            >
              Explore course sources <ArrowUpRight size={16} />
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
function Stat({ icon: Icon, label, value, total, note }) {
  return (
    <div className="stat-card">
      <div className="stat-label">
        <span>{label}</span>
        <Icon size={17} />
      </div>
      <div className="stat-value">
        {value}
        <span>/ {total}</span>
      </div>
      <div className="stat-footer">
        <span>{note}</span>
        <div className="stat-track">
          <i style={{ width: `${(value / total) * 100}%` }} />
        </div>
      </div>
    </div>
  );
}
export function PageTitle({ eyebrow, title, description }) {
  return (
    <div className="page-title">
      <div className="eyebrow">{eyebrow}</div>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
}
function QuickCard({ cards, onAll }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const c = cards[index];
  return (
    <section className="quick-card">
      <div className="card-eyebrow">
        <Layers size={15} /> A QUICK BRAIN WARM-UP
      </div>
      <button
        className="quick-card-question"
        onClick={() => setFlipped(!flipped)}
      >
        <span className="tiny-label">
          {flipped ? "THE ANSWER" : "THINK ABOUT IT"}
        </span>
        <strong>{flipped ? c.answer : c.question}</strong>
        <small>
          <RotateCcw size={12} />
          {flipped ? "Tap to see question" : "Tap to reveal answer"}
        </small>
      </button>
      <footer>
        <button className="subtle-link" onClick={onAll}>
          All flashcards <ArrowUpRight size={14} />
        </button>
        <button
          className="icon-button"
          aria-label="Next quick flashcard"
          onClick={() => {
            setIndex((index + 1) % cards.length);
            setFlipped(false);
          }}
        >
          <ArrowRight size={16} />
        </button>
      </footer>
    </section>
  );
}
function TopicDetail({ topic, reviewed, onReview, onPractice }) {
  return (
    <div className="topic-detail">
      <div className="topic-detail-header">
        <span className={`topic-icon ${topicColors[topics.indexOf(topic)]}`}>
          <TopicIcon topic={topic} size={25} />
        </span>
        <div>
          <h2>{topic.name}</h2>
          <p>{topic.description}</p>
        </div>
        <span className="pill">{topic.lessons.length} key ideas</span>
      </div>
      <div className="lesson-grid">
        {topic.lessons.map((lesson, i) => (
          <article className="lesson" key={lesson.title}>
            <div className="lesson-number">0{i + 1}</div>
            <h3>{lesson.title}</h3>
            <p>{lesson.body}</p>
            {lesson.code && (
              <pre>
                <code>{lesson.code}</code>
              </pre>
            )}
          </article>
        ))}
      </div>
      <div className="topic-detail-footer">
        <a href={topic.sourceUrl} target="_blank" rel="noreferrer">
          Read the original course notes <ExternalLink size={14} />
        </a>
        <div>
          <button className="button secondary" onClick={onReview}>
            {reviewed ? <Check size={16} /> : <BookOpen size={16} />}{" "}
            {reviewed ? "Reviewed" : "Mark as reviewed"}
          </button>
          <button className="button primary" onClick={onPractice}>
            Try a problem <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
function Flashcards({ cards, topics, mastered, onMaster }) {
  const [filter, setFilter] = useState("all");
  const [onlyNew, setOnlyNew] = useState(false);
  const [order, setOrder] = useState(null);
  const [index, setIndex] = useState(0);
  const [flip, setFlip] = useState(false);
  let deck = cards.filter(
    (c) =>
      (filter === "all" || c.topic === filter) &&
      (!onlyNew || !mastered.includes(c.id)),
  );
  if (order)
    deck = [...deck].sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
  const card = deck[index % Math.max(deck.length, 1)];
  function next(delta) {
    setIndex((i) => (i + delta + deck.length) % Math.max(deck.length, 1));
    setFlip(false);
  }
  useEffect(() => {
    const handler = (e) => {
      if (["INPUT", "TEXTAREA", "SELECT", "BUTTON"].includes(e.target.tagName))
        return;
      if (e.key === "ArrowRight") {
        next(1);
      }
      if (e.key === "ArrowLeft") {
        next(-1);
      }
      if (e.code === "Space") {
        e.preventDefault();
        setFlip((f) => !f);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [deck.length]);
  return (
    <>
      <PageTitle
        eyebrow="A LITTLE ACTIVE RECALL"
        title="Know it. Don’t just recognize it."
        description="Think through the answer before you flip. A few cards a day goes a long way."
      />
      <div className="flash-toolbar">
        <select
          aria-label="Filter flashcards by topic"
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setIndex(0);
            setFlip(false);
          }}
        >
          <option value="all">All topics</option>
          {topics.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={onlyNew}
            onChange={(e) => {
              setOnlyNew(e.target.checked);
              setIndex(0);
              setFlip(false);
            }}
          />
          Still learning only
        </label>
        <button
          className="button secondary compact"
          onClick={() => {
            setOrder(
              cards
                .map((c) => ({ id: c.id, key: Math.random() }))
                .sort((a, b) => a.key - b.key)
                .map((c) => c.id),
            );
            setIndex(0);
            setFlip(false);
          }}
        >
          <Repeat2 size={15} />
          Shuffle
        </button>
      </div>
      <div className="flashcard-container">
        {card ? (
          <>
            <div className="flash-progress">
              <span>
                {(index % deck.length) + 1} <span>/ {deck.length} cards</span>
              </span>
              <span>
                <CheckCheck size={15} />
                {
                  mastered.filter((id) => cards.some((c) => c.id === id)).length
                }{" "}
                mastered
              </span>
            </div>
            <button
              className={`flashcard ${flip ? "flipped" : ""}`}
              onClick={() => setFlip(!flip)}
              aria-label={flip ? "Show question" : "Reveal answer"}
            >
              <div className="flashcard-top">
                <span>{topics.find((t) => t.id === card.topic)?.name}</span>
                <span>
                  {flip ? "ANSWER" : "QUESTION"} <Layers size={16} />
                </span>
              </div>
              <div className="flashcard-content">
                <span className="flashcard-symbol">{flip ? "↳" : "“"}</span>
                <h2>{flip ? card.answer : card.question}</h2>
                {!flip && card.code && <pre>{card.code}</pre>}
              </div>
              <div className="flashcard-bottom">
                <RotateCcw size={14} />
                {flip ? "Click to see question" : "Click to reveal answer"}
                <kbd>space</kbd>
              </div>
            </button>
            <div className="flash-controls">
              <button className="button secondary" onClick={() => next(-1)}>
                <ChevronLeft size={16} />
                Previous
              </button>
              <button
                className={`button ${mastered.includes(card.id) ? "secondary" : "primary"}`}
                onClick={() => {
                  onMaster(card.id, mastered.includes(card.id));
                  if (!mastered.includes(card.id)) {
                    setFlip(false);
                    if (!onlyNew) next(1);
                  }
                }}
              >
                <Check size={17} />
                {mastered.includes(card.id)
                  ? "Mark as learning"
                  : "Got it — mark mastered"}
              </button>
              <button className="button secondary" onClick={() => next(1)}>
                Next
                <ChevronRight size={16} />
              </button>
            </div>
            <p className="keyboard-note">Use ← → to navigate · Space to flip</p>
          </>
        ) : (
          <div className="empty-state">
            <CheckCheck size={36} />
            <h2>All caught up.</h2>
            <p>
              You’ve mastered every card in this selection. Try another topic or
              review the whole deck.
            </p>
            <button
              className="button primary"
              onClick={() => setOnlyNew(false)}
            >
              Review all cards
            </button>
          </div>
        )}
      </div>
    </>
  );
}
function Resources({ topics }) {
  return (
    <>
      <PageTitle
        eyebrow="STRAIGHT FROM THE SOURCE"
        title="Your course, connected."
        description="Use the original lectures alongside your practice. These notes are the foundation of this study space."
      />
      <section className="source-feature">
        <div className="topic-icon purple">
          <Library size={26} />
        </div>
        <div>
          <span className="eyebrow">CS-UY 1114 · FALL 2026</span>
          <h2>Problem Solving and Programming</h2>
          <p>
            Course material by Sebastian Romero Cruz. Our topic summaries and
            original exercises follow the publicly available Python lectures and
            Midterm 1 review.
          </p>
          <a
            className="button primary"
            href="https://github.com/sebastianromerocruz/CS1114-Problem-Solving-And-Programming#cs-uy-1114-material"
            target="_blank"
            rel="noreferrer"
          >
            Open course repository <ExternalLink size={16} />
          </a>
        </div>
      </section>
      <div className="resource-grid">
        {topics.map((t, i) => (
          <a
            className="resource-card"
            href={t.sourceUrl}
            key={t.id}
            target="_blank"
            rel="noreferrer"
          >
            <span className={`topic-icon ${topicColors[i]}`}>
              <TopicIcon topic={t} />
            </span>
            <h3>{t.name}</h3>
            <p>Original lecture notes and examples</p>
            <ExternalLink size={16} />
          </a>
        ))}
      </div>
      <div className="notice">
        <CircleHelp size={20} />
        <p>
          <strong>A study companion, not an official exam guide.</strong> The
          topic list and October 27 exam date were provided for this study plan.
          Check your instructor’s announcements for the final exam scope and
          policies. Practice exercises here are original; they are not predicted
          exam questions.
        </p>
      </div>
    </>
  );
}
