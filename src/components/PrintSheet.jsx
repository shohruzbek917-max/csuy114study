import React from "react";
import { challenges, traces } from "../data/course.js";
export default function PrintSheet() {
  return (
    <section className="print-sheet" aria-label="Printable practice packet">
      <header>
        <strong>studyroom.</strong>
        <span>CS-UY 1114 · NYU Tandon · October 27, 2026</span>
      </header>
      <h1>Midterm 01 / Paper practice</h1>
      <p>
        Write Python by hand. Use descriptive variable names, indentation, and
        the course’s permitted techniques. These are original practice
        questions, not predicted exam questions. Solutions are available in the
        website’s Practice lab.
      </p>
      <h2>Part 1 · Write the code</h2>
      {challenges.map((c, i) => (
        <article className="print-task" key={c.id}>
          <div className="print-task-title">
            <h3>
              {String(i + 1).padStart(2, "0")}. {c.title}
            </h3>
            <span>
              {c.difficulty} · {c.minutes} min
            </span>
          </div>
          <p>{c.description}</p>
          <div className="print-example">
            <b>Example:</b> {c.examples[0].input || "(no input)"} →{" "}
            {c.examples[0].output}
          </div>
          <div className="print-writing-space" />
          <label>
            □ Traced an example　 □ Checked a boundary case　 □ Compared with
            solution
          </label>
        </article>
      ))}
      <h2 className="print-part-two">Part 2 · Trace the output</h2>
      <p>
        Track variable values in a table. Write the exact output, including line
        breaks.
      </p>
      {traces.map((t, i) => (
        <article className="print-task print-trace" key={t.id}>
          <h3>
            {String(i + 1).padStart(2, "0")}. {t.title}
          </h3>
          <pre>{t.code}</pre>
          <div className="print-writing-space" />
        </article>
      ))}
      <footer>
        Independent study companion. Source:
        github.com/sebastianromerocruz/CS1114-Problem-Solving-And-Programming
      </footer>
    </section>
  );
}
