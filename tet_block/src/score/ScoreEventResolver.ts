import type { LockResult } from "../game/LockResult";
import { SpinType } from "../spin/SpinType";
import { ScoreEvent } from "./ScoreEvent";
import type { ScoreEvent as ScoreEventType } from "./ScoreEvent";

export function resolveScoreEvent(
    result: LockResult
): ScoreEventType {
    const { spin, linesCleared } = result;

    if (spin.type === SpinType.T) {
        if (spin.isMini) {
            return [
                ScoreEvent.T_SPIN_MINI_ZERO,
                ScoreEvent.T_SPIN_MINI_SINGLE,
                ScoreEvent.T_SPIN_MINI_DOUBLE,
            ][linesCleared] ?? ScoreEvent.NONE;
        }

        return [
            ScoreEvent.T_SPIN_ZERO,
            ScoreEvent.T_SPIN_SINGLE,
            ScoreEvent.T_SPIN_DOUBLE,
            ScoreEvent.T_SPIN_TRIPLE,
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
