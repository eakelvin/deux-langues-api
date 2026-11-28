import type { ProgressAttempt, ProgressInput, ProgressReport } from "../../types/progress.js";
import { addDays } from "../../utils/streak.js";

const windowDays = 7;
const learnedInARow = 3;

function ratePer100(mistakes: number, words: number): number | null {
  if (words === 0) return null;
  return Math.round((mistakes / words) * 1000) / 10;
}

function share(part: number, whole: number): number | null {
  if (whole === 0) return null;
  return Math.round((part / whole) * 100) / 100;
}

function learnedDate(attempts: ProgressAttempt[]): string | null {
  const ordered = [...attempts].sort((a, b) => a.at - b.at);
  let streak = 0;
  let learned: string | null = null;
  for (const attempt of ordered) {
    if (attempt.result === "correct") {
      streak += 1;
      if (streak === learnedInARow) learned = attempt.date;
    } else {
      streak = 0;
      learned = null;
    }
  }
  return learned;
}

export function progressReport(input: ProgressInput): ProgressReport {
  const dates = Array.from({ length: windowDays }, (_, index) =>
    addDays(input.today, index - (windowDays - 1)),
  );
  const window = new Set(dates);
  const practiced = new Set(input.practicedDates.filter((date) => window.has(date)));

  const ordered = [...input.mistakes].sort((a, b) => a.at - b.at || a.id.localeCompare(b.id));
  const seen = new Set<string>();
  const repeats = new Set<string>();
  for (const mistake of ordered) {
    if (seen.has(mistake.key)) repeats.add(mistake.id);
    seen.add(mistake.key);
  }

  const learnedByMistake = new Map<string, string>();
  const attemptsByMistake = new Map<string, ProgressAttempt[]>();
  for (const attempt of input.attempts) {
    const list = attemptsByMistake.get(attempt.mistakeId) ?? [];
    list.push(attempt);
    attemptsByMistake.set(attempt.mistakeId, list);
  }
  for (const [mistakeId, attempts] of attemptsByMistake) {
    const date = learnedDate(attempts);
    if (date) learnedByMistake.set(mistakeId, date);
  }

  const days = dates.map((date) => {
    const mistakeRows = ordered.filter((mistake) => mistake.date === date);
    const mistakeCount = mistakeRows.length;
    const repeatCount = mistakeRows.filter((mistake) => repeats.has(mistake.id)).length;
    const wordCount = input.responses
      .filter((response) => response.date === date)
      .reduce((sum, response) => sum + response.words, 0);
    const reviewed = new Set(
      input.attempts
        .filter((attempt) => attempt.date === date)
        .map((attempt) => attempt.mistakeId),
    ).size;
    const learned = [...learnedByMistake.values()].filter((learnedOn) => learnedOn === date).length;

    return {
      date,
      practiced: practiced.has(date),
      mistakeCount,
      wordCount,
      mistakesPer100Words: ratePer100(mistakeCount, wordCount),
      repeatShare: share(repeatCount, mistakeCount),
      reviewed,
      learned,
    };
  });

  const mistakeCount = days.reduce((sum, day) => sum + day.mistakeCount, 0);
  const wordCount = days.reduce((sum, day) => sum + day.wordCount, 0);
  const repeatCount = ordered.filter(
    (mistake) => window.has(mistake.date) && repeats.has(mistake.id),
  ).length;
  const reviewed = new Set(
    input.attempts
      .filter((attempt) => window.has(attempt.date))
      .map((attempt) => attempt.mistakeId),
  ).size;
  const learned = [...learnedByMistake.values()].filter((date) => window.has(date)).length;

  return {
    from: dates[0],
    to: input.today,
    daysPracticed: practiced.size,
    mistakeCount,
    wordCount,
    mistakesPer100Words: ratePer100(mistakeCount, wordCount),
    repeatShare: share(repeatCount, mistakeCount),
    reviewed,
    learned,
    days,
  };
}
