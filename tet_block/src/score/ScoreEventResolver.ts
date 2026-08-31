import type { LockResult } from "../game/LockResult";
import { SpinType } from "../spin/SpinType";
import { ScoreEvent } from "./ScoreEvent";
import type { ScoreEvent as ScoreEventType } from "./ScoreEvent";

export function resolveScoreEvent(
    result: LockResult
): ScoreEventType {
    const { spin, linesCleared } = result;

    if (spin.type !== SpinType.NONE) {
        if (spin.isMini) {
            return [
                ScoreEvent.SPIN_MINI_ZERO,
                ScoreEvent.SPIN_MINI_SINGLE,
                ScoreEvent.SPIN_MINI_DOUBLE,
            ][linesCleared] ?? ScoreEvent.NONE;
        }

        return [
            ScoreEvent.SPIN_ZERO,
            ScoreEvent.SPIN_SINGLE,
            ScoreEvent.SPIN_DOUBLE,
            ScoreEvent.SPIN_TRIPLE,
        ][linesCleared] ?? ScoreEvent.NONE;
    }

    return [
        ScoreEvent.NONE,
        ScoreEvent.SINGLE,
        ScoreEvent.DOUBLE,
        ScoreEvent.TRIPLE,
        ScoreEvent.TETRIS,
    ][linesCleared] ?? ScoreEvent.NONE;
}
