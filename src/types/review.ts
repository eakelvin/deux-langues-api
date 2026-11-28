export const reviewResults = ["correct", "incorrect"] as const;

export type ReviewResult = (typeof reviewResults)[number];
