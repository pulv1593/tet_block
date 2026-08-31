import { TetrominoType } from "../types/Tetromino";

export interface KickOffset {
    x: number;
    y: number;
}
export type QuarterRotationTransition =
    "0>1"
    | "1>2"
    | "2>3"
    | "3>0"
    | "1>0"
    | "0>3"
    | "3>2"
    | "2>1";

export type HalfRotationTransition =
    "0>2"
    | "1>3"
    | "2>0"
    | "3>1";

export type RotationTransition =
    QuarterRotationTransition | HalfRotationTransition;

export function getTransition(
    from: number,
    to: number
): RotationTransition | null {
    const transition = `${from}>${to}`;

    switch (transition) {
        case "0>1":
        case "1>2":
        case "2>3":
        case "3>0":
        case "1>0":
        case "0>3":
        case "3>2":
        case "2>1":
        case "0>2":
        case "1>3":
        case "2>0":
        case "3>1":
            return transition;
        default:
            return null;
    }
}

//GuideLine  공식 데이터 사용.
export const JLSTZ_KICK_TABLE: Record<
    QuarterRotationTransition,
    KickOffset[]
> = {

    "0>1": [
        { x: 0,  y: 0 },
        { x: -1, y: 0 },
        { x: -1, y: 1 },
        { x: 0,  y: -2 },
        { x: -1, y: -2 },
    ],

    "1>2": [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 1, y: -1 },
        { x: 0, y: 2 },
        { x: 1, y: 2 },
    ],

    "2>3": [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 0, y: -2 },
        { x: 1, y: -2 },
    ],

    "3>0": [
        { x: 0, y: 0 },
        { x: -1, y: 0 },
        { x: -1, y: -1 },
        { x: 0, y: 2 },
        { x: -1, y: 2 },
    ],

    "1>0": [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 1, y: -1 },
        { x: 0, y: 2 },
        { x: 1, y: 2 },
    ],

    "2>1": [
        { x: 0, y: 0 },
        { x: -1, y: 0 },
        { x: -1, y: 1 },
        { x: 0, y: -2 },
        { x: -1, y: -2 },
    ],

    "3>2": [
        { x: 0, y: 0 },
        { x: -1, y: 0 },
        { x: -1, y: -1 },
        { x: 0, y: 2 },
        { x: -1, y: 2 },
    ],

    "0>3": [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 0, y: -2 },
        { x: 1, y: -2 },
    ],
};
const O_KICK: KickOffset[] = [
    { x: 0, y: 0 }
];

const TETRIO_180_KICK_TABLE: Record<
    "0>2" | "1>3" | "2>0" | "3>1",
    KickOffset[]
> = {
    "0>2": [
        { x: 0, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
        { x: -1, y: 1 },
        { x: 1, y: 0 },
        { x: -1, y: 0 },
    ],
    "1>3": [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 1, y: 2 },
        { x: 1, y: 1 },
        { x: 0, y: 2 },
        { x: 0, y: 1 },
    ],
    "2>0": [
        { x: 0, y: 0 },
        { x: 0, y: -1 },
        { x: -1, y: -1 },
        { x: 1, y: -1 },
        { x: -1, y: 0 },
        { x: 1, y: 0 },
    ],
    "3>1": [
        { x: 0, y: 0 },
        { x: -1, y: 0 },
        { x: -1, y: 2 },
        { x: -1, y: 1 },
        { x: 0, y: 2 },
        { x: 0, y: 1 },
    ],
};
const I_KICK: Record<QuarterRotationTransition, KickOffset[]> = {

    "0>1": [
        { x: 0,  y: 0 },
        { x: -2, y: 0 },
        { x: 1,  y: 0 },
        { x: -2, y: -1 },
        { x: 1,  y: 2 },
    ],

    "1>2": [
        { x: 0,  y: 0 },
        { x: -1, y: 0 },
        { x: 2,  y: 0 },
        { x: -1, y: 2 },
        { x: 2,  y: -1 },
    ],

    "2>3": [
        { x: 0, y: 0 },
        { x: 2, y: 0 },
        { x: -1, y: 0 },
        { x: 2, y: 1 },
        { x: -1, y: -2 },
    ],

    "3>0": [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: -2, y: 0 },
        { x: 1, y: -2 },
        { x: -2, y: 1 },
    ],

    "1>0": [
        { x: 0, y: 0 },
        { x: 2, y: 0 },
        { x: -1, y: 0 },
        { x: 2, y: 1 },
        { x: -1, y: -2 },
    ],

    "2>1": [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: -2, y: 0 },
        { x: 1, y: -2 },
        { x: -2, y: 1 },
    ],

    "3>2": [
        { x: 0, y: 0 },
        { x: -2, y: 0 },
        { x: 1, y: 0 },
        { x: -2, y: -1 },
        { x: 1, y: 2 },
    ],

    "0>3": [
        { x: 0, y: 0 },
        { x: -1, y: 0 },
        { x: 2, y: 0 },
        { x: -1, y: 2 },
        { x: 2, y: -1 },
    ],
};

export function getKickOffsets(
    type: TetrominoType,
    from: number,
    to: number
): KickOffset[] {

    const transition = getTransition(from, to);

    if (transition === null) {
        return [];
    }

    if (
        transition === "0>2" ||
        transition === "1>3" ||
        transition === "2>0" ||
        transition === "3>1"
    ) {
        return TETRIO_180_KICK_TABLE[transition];
    }

    switch (type) {

        case TetrominoType.I:
            return I_KICK[transition];

        case TetrominoType.O:
            return O_KICK;

        default:
            return JLSTZ_KICK_TABLE[transition];
    }

}
