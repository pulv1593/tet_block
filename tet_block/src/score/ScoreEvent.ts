export const ScoreEvent = {
    NONE: "NONE",
    
    SINGLE: "SINGLE",
    DOUBLE: "DOUBLE",
    TRIPLE: "TRIPLE",
    TETRIS: "TETRIS",

    T_SPIN_ZERO: "T_SPIN_ZERO",
    T_SPIN_SINGLE: "T_SPIN_SINGLE",
    T_SPIN_DOUBLE: "T_SPIN_DOUBLE",
    T_SPIN_TRIPLE: "T_SPIN_TRIPLE",

    T_SPIN_MINI_ZERO: "T_SPIN_MINI_ZERO",
    T_SPIN_MINI_SINGLE: "T_SPIN_MINI_SINGLE",
    T_SPIN_MINI_DOUBLE: "T_SPIN_MINI_DOUBLE",
} as const;

export type ScoreEvent =
    typeof ScoreEvent[keyof typeof ScoreEvent];
