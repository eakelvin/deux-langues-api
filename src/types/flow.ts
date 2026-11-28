export const flows = ["written", "mimic", "conversation"] as const;

export type Flow = (typeof flows)[number];
