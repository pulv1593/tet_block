export const ScoreEvent = {
    NONE: "NONE",
    
    SINGLE: "SINGLE",
    DOUBLE: "DOUBLE",
    TRIPLE: "TRIPLE",
    TETRIS: "TETRIS",

    SPIN_ZERO: "SPIN_ZERO",
    SPIN_SINGLE: "SPIN_SINGLE",
    SPIN_DOUBLE: "SPIN_DOUBLE",
    SPIN_TRIPLE: "SPIN_TRIPLE",
    SPIN_QUAD: "SPIN_QUAD",

    SPIN_MINI_ZERO: "SPIN_MINI_ZERO",
    SPIN_MINI_SINGLE: "SPIN_MINI_SINGLE",
    SPIN_MINI_DOUBLE: "SPIN_MINI_DOUBLE",
    SPIN_MINI_TRIPLE: "SPIN_MINI_TRIPLE",
    SPIN_MINI_QUAD: "SPIN_MINI_QUAD",
} as const;

export type ScoreEvent =
    typeof ScoreEvent[keyof typeof ScoreEvent];
