import type { SpinResult } from "../spin/SpinResult";

/** Result of locking one piece into the board. */
export interface LockResult {
    spin: SpinResult;
    linesCleared: number;
}
