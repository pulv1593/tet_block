import { describe, expect, it } from "vitest";

import { Board } from "../game/Board";
import { Piece } from "../game/Piece";
import { TetrominoType } from "../types/Tetromino";
import { RotateDirection, Rotation } from "./Rotation";

describe("Rotation SRS integration", () => {
    it.each([
        [RotateDirection.CW, 1, -1],
        [RotateDirection.CCW, 3, 1],
    ] as const)(
        "applies a floor kick for %s rotation",
        (direction, expectedRotation, expectedXOffset) => {
            const board = new Board();
            const piece = new Piece(TetrominoType.T);
            piece.x = 3;
            piece.y = 18;

            const result = Rotation.rotate(board, piece, direction);

            expect(result.rotated).toBe(true);
            expect(result.kickIndex).toBe(2);
            expect(piece.rotation).toBe(expectedRotation);
            expect(piece.x).toBe(3 + expectedXOffset);
            expect(piece.y).toBe(17);
        }
    );

    it("does not mutate a piece when every kick test fails", () => {
        const board = new Board();
        const piece = new Piece(TetrominoType.T);
        piece.x = 3;
        piece.y = 10;

        for (const row of board.grid) {
            row.fill(1);
        }

        const before = {
            x: piece.x,
            y: piece.y,
            rotation: piece.rotation,
        };
        const result = Rotation.rotate(
            board,
            piece,
            RotateDirection.CCW
        );

        expect(result.rotated).toBe(false);
        expect({
            x: piece.x,
            y: piece.y,
            rotation: piece.rotation,
        }).toEqual(before);
    });

    it("rotates a piece by 180 degrees", () => {
        const board = new Board();
        const piece = new Piece(TetrominoType.T);

        const result = Rotation.rotate(
            board,
            piece,
            RotateDirection.ROTATE_180
        );

        expect(result.rotated).toBe(true);
        expect(result.kickIndex).toBe(0);
        expect(piece.rotation).toBe(2);
    });
});
