export const turnRoles = ["user", "assistant"] as const;

export type TurnRole = (typeof turnRoles)[number];
