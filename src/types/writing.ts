import type { MistakeItem } from "./mistake.js";

export type CorrectionReply = {
  corrections: MistakeItem[];
  correctedText: string;
};
