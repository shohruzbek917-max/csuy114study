export const EMPTY_PROGRESS = {
  solved: [],
  mastered: [],
  reviewed: [],
  dates: [],
};
export function readProgress() {
  try {
    const saved = JSON.parse(
      localStorage.getItem("studyroom-progress") || "{}",
    );
    return Object.fromEntries(
      Object.keys(EMPTY_PROGRESS).map((key) => [
        key,
        Array.isArray(saved[key]) ? saved[key] : [],
      ]),
    );
  } catch {
    return { ...EMPTY_PROGRESS };
  }
}
export function persistProgress(progress) {
  try {
    localStorage.setItem("studyroom-progress", JSON.stringify(progress));
  } catch {
    /* Private mode can disable storage. */
  }
}
export function daysUntilExam(now = new Date()) {
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const value = (type) =>
    Number(today.find((part) => part.type === type).value);
  return Math.round(
    (Date.UTC(2026, 9, 27) -
      Date.UTC(value("year"), value("month") - 1, value("day"))) /
      86400000,
  );
}
