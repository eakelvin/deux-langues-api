import type { ReviewResult } from "./review.js";

export type ProgressMistake = {
  id: string;
  key: string;
  at: number;
  date: string;
};

export type ProgressAttempt = {
  mistakeId: string;
  result: ReviewResult;
  at: number;
  date: string;
};

export type ProgressResponseWords = {
  date: string;
  words: number;
};

export type ProgressInput = {
  today: string;
  practicedDates: string[];
  mistakes: ProgressMistake[];
  attempts: ProgressAttempt[];
  responses: ProgressResponseWords[];
};

export type ProgressDay = {
  date: string;
  practiced: boolean;
  mistakeCount: number;
  wordCount: number;
  mistakesPer100Words: number | null;
  repeatShare: number | null;
  reviewed: number;
  learned: number;
};

export type ProgressReport = {
  from: string;
  to: string;
  daysPracticed: number;
  mistakeCount: number;
  wordCount: number;
  mistakesPer100Words: number | null;
  repeatShare: number | null;
  reviewed: number;
  learned: number;
  days: ProgressDay[];
};
