import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ActionType } from "../action/ActionType";
import type { ActionType as ActionTypeType } from "../action/ActionType";
import type { RotationResult } from "../srs/RotationResult";
import { SpinType } from "../spin/SpinType";
import { TetrominoType } from "../types/Tetromino";
import { Game } from "./Game";
import { Piece } from "./Piece";

interface GameTestState {
    lastAction: ActionTypeType;
    lastRotation: RotationResult | null;
    heldPiece?: typeof TetrominoType[keyof typeof TetrominoType];
    lockTimer: number;
    lockResetCount: number;
    lockDelayResetPending: boolean;
    isGrounded: boolean;
    tryMoveDown(): boolean;
    spawn(): void;
    updateLockDelay(deltaTime: number): void;
}

function setLastRotation(game: Game): void {
    const state = game as unknown as GameTestState;
    state.lastAction = ActionType.ROTATE;
    state.lastRotation = {
        rotated: true,
        kickIndex: 0,
        kick: { x: 0, y: 0 },
        fromRotation: 3,
        toRotation: 0,
    };
}

describe("Game", () => {
    beforeEach(() => {
        vi.stubGlobal("window", {
            addEventListener: vi.fn(),
        });
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("preserves the last rotation when a hard drop locks from zero distance", () => {
        const game = new Game();
        const piece = new Piece(TetrominoType.T);
        piece.x = 3;
        piece.y = 18;
        game.currentPiece = piece;

        // The floor blocks both back corners; these cells block both front corners.
        game.board.grid[18][3] = 1;
        game.board.grid[18][5] = 1;
        setLastRotation(game);

        game.hardDrop();

        expect(game.getLastLockResult().spin).toEqual({
            type: SpinType.T,
            isMini: false,
            rotated: true,
        });
    });

    it("invalidates the last rotation when hard drop moves the piece", () => {
        const game = new Game();
        game.currentPiece = new Piece(TetrominoType.T);
        setLastRotation(game);

        game.hardDrop();

        expect(game.getLastLockResult().spin.type).toBe(SpinType.NONE);
    });

    it("invalidates the last rotation when gravity moves the piece", () => {
        const game = new Game();
        const state = game as unknown as GameTestState;
        setLastRotation(game);

        expect(state.tryMoveDown()).toBe(true);

        expect(state.lastAction).toBe(ActionType.NONE);
        expect(state.lastRotation).toBeNull();
    });

    it("detects block out after swapping an occupied hold piece", () => {
        const game = new Game();
        const state = game as unknown as GameTestState;
        state.heldPiece = TetrominoType.T;
        game.board.grid[0][4] = 1;

        game.hold();

        expect(game.isGameOver()).toBe(true);
    });

    // Lock delay and lock reset behavior
    it("detects grounding immediately after the final downward step", () => {
        const game = new Game();
        const state = game as unknown as GameTestState;
        const piece = new Piece(TetrominoType.T);
        piece.y = 17;
        game.currentPiece = piece;

        expect(state.tryMoveDown()).toBe(true);
        expect(state.isGrounded).toBe(true);
    });

    it("keeps the lock reset count when the piece moves down", () => {
        const game = new Game();
        const state = game as unknown as GameTestState;
        state.lockResetCount = 7;

        expect(state.tryMoveDown()).toBe(true);
        expect(state.lockResetCount).toBe(7);
    });

    it("does not reset lock time after all resets are consumed", () => {
        const game = new Game();
        const state = game as unknown as GameTestState;
        const piece = new Piece(TetrominoType.O);
        piece.y = 18;
        game.currentPiece = piece;
        state.isGrounded = true;
        state.lockTimer = 200;
        state.lockResetCount = 15;

        expect(game.rotateCW()).toBe(true);
        expect(state.lockTimer).toBe(200);
        expect(state.lockResetCount).toBe(15);
    });

    it("preserves exhausted lock time while moving downward in the air", () => {
        const game = new Game();
        const state = game as unknown as GameTestState;
        state.lockTimer = 200;
        state.lockResetCount = 15;

        expect(state.tryMoveDown()).toBe(true);
        expect(state.isGrounded).toBe(false);
        expect(state.lockTimer).toBe(200);
        expect(state.lockResetCount).toBe(15);
    });

    it("detects a grounded piece immediately after spawn", () => {
        const game = new Game();
        const state = game as unknown as GameTestState;

        game.board.grid[2].fill(1);
        state.spawn();

        expect(state.isGrounded).toBe(true);
    });

    it("does not add a whole frame after a grounded action resets the delay", () => {
        const game = new Game();
        const state = game as unknown as GameTestState;

        game.currentPiece = new Piece(TetrominoType.O);
        game.currentPiece.y = 18;
        state.isGrounded = true;
        state.lockTimer = 300;

        expect(game.moveLeft()).toBe(true);
        expect(state.lockTimer).toBe(0);
        expect(state.lockResetCount).toBe(1);

        state.updateLockDelay(400);

        expect(state.lockTimer).toBe(0);
        expect(state.lockDelayResetPending).toBe(false);
    });

    it("counts a grounded-to-airborne move as one lock reset", () => {
        const game = new Game();
        const state = game as unknown as GameTestState;

        game.currentPiece = new Piece(TetrominoType.O);
        game.currentPiece.y = 17;
        game.board.grid[19][5] = 1;
        state.isGrounded = true;
        state.lockTimer = 300;

        expect(game.moveLeft()).toBe(true);

        expect(state.isGrounded).toBe(false);
        expect(state.lockTimer).toBe(0);
        expect(state.lockResetCount).toBe(1);
    });

    it("keeps the fifteenth reset as the final available reset", () => {
        const game = new Game();
        const state = game as unknown as GameTestState;

        game.currentPiece = new Piece(TetrominoType.O);
        game.currentPiece.y = 18;
        state.isGrounded = true;

        for (let index = 0; index < 15; index++) {
            const moved = index % 2 === 0
                ? game.moveLeft()
                : game.moveRight();
            expect(moved).toBe(true);
        }

        expect(state.lockResetCount).toBe(15);

        state.lockDelayResetPending = false;
        state.lockTimer = 250;
        expect(game.moveRight()).toBe(true);

        expect(state.lockResetCount).toBe(15);
        expect(state.lockTimer).toBe(250);
        expect(state.lockDelayResetPending).toBe(false);
    });

    it("does not consume a reset for a failed movement", () => {
        const game = new Game();
        const state = game as unknown as GameTestState;

        game.currentPiece = new Piece(TetrominoType.O);
        game.currentPiece.x = -1;
        game.currentPiece.y = 18;
        state.isGrounded = true;

        expect(game.moveLeft()).toBe(false);
        expect(state.lockResetCount).toBe(0);
    });

    it("accumulates airborne time after the reset limit without locking midair", () => {
        const game = new Game();
        const state = game as unknown as GameTestState;
        const airbornePiece = game.currentPiece;

        state.isGrounded = false;
        state.lockResetCount = 15;
        state.lockTimer = 300;

        state.updateLockDelay(250);

        expect(state.lockTimer).toBe(500);
        expect(game.currentPiece).toBe(airbornePiece);

        state.isGrounded = true;
        state.updateLockDelay(1);

        expect(game.currentPiece).not.toBe(airbornePiece);
    });
});
