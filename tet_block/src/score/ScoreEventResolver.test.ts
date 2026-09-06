import { describe, expect, it } from "vitest";

import type { LockResult } from "../game/LockResult";
import { SpinType } from "../spin/SpinType";
import { ScoreEvent } from "./ScoreEvent";
import { resolveScoreEvent } from "./ScoreEventResolver";

function lockResult(
    type: typeof SpinType[keyof typeof SpinType],
    isMini: boolean,
    linesCleared: number
): LockResult {
    return {
        spin: { type, isMini, rotated: type !== SpinType.NONE },
        linesCleared,
        isPerfectClear: false,
    };
}

describe("resolveScoreEvent", () => {
    it.each([
        [SpinType.NONE, false, 0, ScoreEvent.NONE],
        [SpinType.NONE, false, 1, ScoreEvent.SINGLE],
        [SpinType.NONE, false, 4, ScoreEvent.TETRIS],
        [SpinType.T, false, 0, ScoreEvent.SPIN_ZERO],
        [SpinType.T, false, 1, ScoreEvent.SPIN_SINGLE],
        [SpinType.T, false, 2, ScoreEvent.SPIN_DOUBLE],
        [SpinType.T, false, 3, ScoreEvent.SPIN_TRIPLE],
        [SpinType.I, false, 4, ScoreEvent.SPIN_QUAD],
        [SpinType.T, true, 0, ScoreEvent.SPIN_MINI_ZERO],
        [SpinType.T, true, 1, ScoreEvent.SPIN_MINI_SINGLE],
        [SpinType.T, true, 2, ScoreEvent.SPIN_MINI_DOUBLE],
        [SpinType.L, true, 1, ScoreEvent.SPIN_MINI_SINGLE],
        [SpinType.L, true, 3, ScoreEvent.SPIN_MINI_TRIPLE],
        [SpinType.I, true, 4, ScoreEvent.SPIN_MINI_QUAD],
    ] as const)(
        "maps %s mini=%s lines=%i to %s",
        (type, isMini, linesCleared, expected) => {
            expect(
                resolveScoreEvent(lockResult(type, isMini, linesCleared))
            ).toBe(expected);
        }
    );
});
