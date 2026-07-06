export const ActionType = {
    NONE: "NONE",

    MOVE: "MOVE",
    ROTATE: "ROTATE",

    SOFT_DROP: "SOFT_DROP",
    HARD_DROP: "HARD_DROP",

    HOLD: "HOLD",
} as const;

export type ActionType =
    typeof ActionType[keyof typeof ActionType];