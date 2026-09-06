import { describe, expect, it } from "vitest";

import { TetrominoType } from "../types/Tetromino";
import { Board } from "./Board";
import { Piece } from "./Piece";

describe("Board top boundary", () => {
    it("does not access a negative row when locking above the board", () => {
        const board = new Board();
        const piece = new Piece(TetrominoType.T);
        piece.y = -1;

        expect(board.mergePiece(piece)).toBe(false);
        expect(board.grid[0].some(cell => cell !== 0)).toBe(true);
    });

    it("reports a fully visible merge as successful", () => {
        const board = new Board();
        const piece = new Piece(TetrominoType.T);

        expect(board.mergePiece(piece)).toBe(true);
    });
});
