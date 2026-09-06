import { describe, expect, it } from "vitest";

import { ActionType } from "../action/ActionType";
import { Board } from "../game/Board";
import { Piece } from "../game/Piece";
import type { RotationResult } from "../srs/RotationResult";
import { TetrominoType } from "../types/Tetromino";
import { SpinDetector } from "./SpinDetector";
import { SpinType } from "./SpinType";

function rotationResult(
    kickIndex = 0,
    x = 0,
    y = 0
): RotationResult {
    return {
        rotated: true,
        kickIndex,
        kick: { x, y },
        fromRotation: 3,
        toRotation: 0,
    };
}

function tPiece(rotation = 0): Piece {
    const piece = new Piece(TetrominoType.T);
    piece.x = 3;
    piece.y = 10;
    piece.rotation = rotation;
    return piece;
}

function blockCorners(
    board: Board,
    corners: Array<"frontLeft" | "frontRight" | "backLeft" | "backRight">
): void {
    const positions = {
        frontLeft: [3, 10],
        frontRight: [5, 10],
        backLeft: [3, 12],
        backRight: [5, 12],
    } as const;

    for (const corner of corners) {
        const [x, y] = positions[corner];
        board.grid[y][x] = 1;
    }
}

function blockAllMovement(board: Board, piece: Piece): void {
    const shape = piece.getShape();
    const occupied = new Set<string>();

    for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
            if (shape[y][x] !== 0) {
                occupied.add(`${piece.x + x},${piece.y + y}`);
            }
        }
    }

    for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
        for (const cell of occupied) {
            const [x, y] = cell.split(",").map(Number);
            const destination = `${x + dx},${y + dy}`;

            if (!occupied.has(destination)) {
                board.grid[y + dy][x + dx] = 1;
                break;
            }
        }
    }
}

describe("SpinDetector T-spin", () => {
    it("requires the last successful action to be a rotation", () => {
        const board = new Board();
        const piece = tPiece();
        blockCorners(board, ["frontLeft", "frontRight", "backLeft"]);

        const result = SpinDetector.detect(
            board,
            piece,
            ActionType.MOVE,
            rotationResult()
        );

        expect(result.type).toBe(SpinType.NONE);
    });

    it("rejects rotation metadata that does not match the piece rotation", () => {
        const board = new Board();
        const piece = tPiece();
        blockCorners(board, ["frontLeft", "frontRight", "backLeft"]);
        const mismatchedRotation = rotationResult();
        mismatchedRotation.toRotation = 1;

        const result = SpinDetector.detect(
            board,
            piece,
            ActionType.ROTATE,
            mismatchedRotation
        );

        expect(result.type).toBe(SpinType.NONE);
    });

    it("rejects a rotation with fewer than three blocked corners", () => {
        const board = new Board();
        const piece = tPiece();
        blockCorners(board, ["frontLeft", "frontRight"]);

        const result = SpinDetector.detect(
            board,
            piece,
            ActionType.ROTATE,
            rotationResult()
        );

        expect(result.type).toBe(SpinType.NONE);
    });

    it("detects a full T-spin when both front corners are blocked", () => {
        const board = new Board();
        const piece = tPiece();
        blockCorners(board, ["frontLeft", "frontRight", "backLeft"]);

        const result = SpinDetector.detect(
            board,
            piece,
            ActionType.ROTATE,
            rotationResult()
        );

        expect(result).toEqual({
            type: SpinType.T,
            isMini: false,
            rotated: true,
        });
    });

    it("detects a Mini when only one front corner is blocked", () => {
        const board = new Board();
        const piece = tPiece();
        blockCorners(board, ["frontLeft", "backLeft", "backRight"]);

        const result = SpinDetector.detect(
            board,
            piece,
            ActionType.ROTATE,
            rotationResult()
        );

        expect(result.type).toBe(SpinType.T);
        expect(result.isMini).toBe(true);
    });

    it("upgrades a Mini shape when the final kick moves the center 1 by 2", () => {
        const board = new Board();
        const piece = tPiece();
        blockCorners(board, ["frontLeft", "backLeft", "backRight"]);

        const result = SpinDetector.detect(
            board,
            piece,
            ActionType.ROTATE,
            rotationResult(4, 1, -2)
        );

        expect(result.type).toBe(SpinType.T);
        expect(result.isMini).toBe(false);
    });

    it("does not upgrade a Mini after a 180-degree kick", () => {
        const board = new Board();
        const piece = tPiece();
        blockCorners(board, ["frontLeft", "backLeft", "backRight"]);
        const halfRotation = rotationResult(4, 1, -2);
        halfRotation.fromRotation = 2;

        const result = SpinDetector.detect(
            board,
            piece,
            ActionType.ROTATE,
            halfRotation
        );

        expect(result.type).toBe(SpinType.T);
        expect(result.isMini).toBe(true);
    });

    it.each([
        { rotation: 0, corners: [[3, 10], [5, 10], [3, 12]] },
        { rotation: 1, corners: [[5, 10], [5, 12], [3, 10]] },
        { rotation: 2, corners: [[3, 12], [5, 12], [3, 10]] },
        { rotation: 3, corners: [[3, 10], [3, 12], [5, 10]] },
    ])(
        "uses the correct front corners in rotation $rotation",
        ({ rotation, corners }) => {
            const board = new Board();
            const piece = tPiece(rotation);

            for (const [x, y] of corners) {
                board.grid[y][x] = 1;
            }

            const rotationMetadata = rotationResult();
            rotationMetadata.toRotation = piece.rotation;

            const result = SpinDetector.detect(
                board,
                piece,
                ActionType.ROTATE,
                rotationMetadata
            );

            expect(result.type).toBe(SpinType.T);
            expect(result.isMini).toBe(false);
        }
    );
});

describe("SpinDetector All-Mini+", () => {
    it.each([
        TetrominoType.I,
        TetrominoType.O,
        TetrominoType.J,
        TetrominoType.L,
        TetrominoType.S,
        TetrominoType.Z,
    ])("detects an immobile %s piece as a Mini Spin", (type) => {
        const board = new Board();
        const piece = new Piece(type);
        piece.x = 3;
        piece.y = 10;

        blockAllMovement(board, piece);

        expect(
            board.isValidPosition(piece, piece.x, piece.y)
        ).toBe(true);

        const result = SpinDetector.detect(
            board,
            piece,
            ActionType.ROTATE,
            rotationResult()
        );

        expect(result).toEqual({
            type,
            isMini: true,
            rotated: true,
        });
    });

    it("does not detect a movable non-T piece as a spin", () => {
        const board = new Board();
        const piece = new Piece(TetrominoType.L);

        const result = SpinDetector.detect(
            board,
            piece,
            ActionType.ROTATE,
            rotationResult()
        );

        expect(result.type).toBe(SpinType.NONE);
    });

    it("uses immobile Mini detection when T fails the three-corner rule", () => {
        const board = new Board();
        const piece = tPiece();

        // Block left, right, up, and down without overlapping the T piece.
        // Only two diagonal corners are occupied, so 3-corner detection fails.
        board.grid[10][3] = 1;
        board.grid[10][5] = 1;
        board.grid[9][4] = 1;
        board.grid[12][4] = 1;

        expect(
            board.isValidPosition(piece, piece.x, piece.y)
        ).toBe(true);

        const result = SpinDetector.detect(
            board,
            piece,
            ActionType.ROTATE,
            rotationResult()
        );

        expect(result.type).toBe(SpinType.T);
        expect(result.isMini).toBe(true);
    });
});
