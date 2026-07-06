export const ScoreEvent = {
    NONE: "NONE",
    
    SINGLE: "SINGLE",
    DOUBLE: "DOUBLE",
    TRIPLE: "TRIPLE",
    TETRIS: "TETRIS",
} as const;

export type ScoreEvent =
    typeof ScoreEvent[keyof typeof ScoreEvent];