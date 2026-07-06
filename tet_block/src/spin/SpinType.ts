export const SpinType = {
    NONE: "NONE",

    T: "T",
    L: "L",
    J: "J",
    S: "S",
    Z: "Z",
    I: "I",
    O: "O",
} as const;

export type SpinType =
    typeof SpinType[keyof typeof SpinType];