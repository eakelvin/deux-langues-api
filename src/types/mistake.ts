import type { ErrorCategory } from "./category.js";

export type MistakeItem = {
  phrase: string;
  original: string;
  corrected: string;
  explanation: string;
  category: ErrorCategory;
};
