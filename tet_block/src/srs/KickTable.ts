import { TetrominoType } from "../types/Tetromino";

export interface KickOffset {
    x: number;
    y: number;
}
export type RotationTransition = 
    "0>1"
    | "1>2"
    | "2>3"
    | "3>0"
    | "1>0"
    | "0>3"
    | "3>2"
    | "2>1";

export function getTransition(
    from: number,
    to: number
): RotationTransition {
    return `${from}>${to}` as RotationTransition;
}

//GuideLine  공식 데이터 사용.
export const JLSTZ_KICK_TABLE: Record<
    RotationTransition,
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
        { x: 1, y: 1 },
        { x: 0, y: -2 },
        { x: 1, y: -2 },
    ],

    "2>1": [
        { x: 0, y: 0 },
        { x: -1, y: 0 },
        { x: -1, y: -1 },
        { x: 0, y: 2 },
        { x: -1, y: 2 },
    ],

    "3>2": [
        { x: 0, y: 0 },
        { x: -1, y: 0 },
        { x: -1, y: 1 },
        { x: 0, y: -2 },
        { x: -1, y: -2 },
    ],

    "0>3": [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 1, y: -1 },
        { x: 0, y: 2 },
        { x: 1, y: 2 },
    ],
};
const O_KICK: KickOffset[] = [
    { x: 0, y: 0 }
];
const I_KICK: Record<RotationTransition, KickOffset[]> = {

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

    switch (type) {

        case TetrominoType.I:
            return I_KICK[transition];

        case TetrominoType.O:
            return O_KICK;

        default:
            return JLSTZ_KICK_TABLE[transition];
    }

}