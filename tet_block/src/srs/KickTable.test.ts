import { describe, expect, it } from "vitest";

import { TetrominoType } from "../types/Tetromino";
import { getKickOffsets } from "./KickTable";

describe("JLSTZ counter-clockwise SRS kicks", () => {
    it.each([
        [1, 0, [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]]],
        [2, 1, [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]]],
        [3, 2, [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]]],
        [0, 3, [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]]],
    ] as const)("returns the SRS offsets for %i>%i", (from, to, expected) => {
        const offsets = getKickOffsets(TetrominoType.T, from, to);

        expect(offsets.map(({ x, y }) => [x, y])).toEqual(expected);
    });
});
