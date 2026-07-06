import { Board } from "../game/Board";
import { Piece } from "../game/Piece";
import { TetrominoType } from "../types/Tetromino";

import { SpinType } from "./SpinType";
import type { SpinResult } from "./SpinResult";
import { ActionType } from "../action/ActionType";
import type { ActionType as ActionTypeType } from "../action/ActionType";

export class SpinDetector {

    public static detect(
        board: Board,
        piece: Piece,
        lastAction: ActionTypeType
    ): SpinResult {
        if(lastAction !== ActionType.ROTATE) {
            return this.noSpin(false);
        };

        switch (piece.type) {
        case TetrominoType.T:
            return this.detectTSpin(board, piece);

        case TetrominoType.L:
            return this.detectLSpin(board, piece);

        case TetrominoType.J:
            return this.detectJSpin(board, piece);

        case TetrominoType.S:
            return this.detectSSpin(board, piece);

        case TetrominoType.Z:
            return this.detectZSpin(board, piece);

        case TetrominoType.I:
            return this.detectISpin(board, piece);

        case TetrominoType.O:
            return this.detectOSpin(board, piece);
        }
    };

    private static noSpin(
        rotated: boolean
    ): SpinResult {
        return {
            type: SpinType.NONE,
            isMini: false,
            rotated,
        };
    };
    
    private static detectTSpin(
        board: Board,
        piece: Piece
    ): SpinResult {
        const blocked = 
            this.countBlockedCorners(board, piece);
        if (blocked < 3) {
            return this.noSpin(true);
        }
        return {
            type: SpinType.T,
            isMini:false,
            rotated: true,
        }
    };

    private static detectLSpin(
        board: Board,
        piece: Piece
    ): SpinResult {
        return this.noSpin(true);
    };

    private static detectJSpin(
        board: Board,
        piece: Piece
    ): SpinResult {
        return this.noSpin(true);
    };

    private static detectSSpin(
        board: Board,
        piece: Piece
    ): SpinResult {
        return this.noSpin(true);
    };

    private static detectZSpin(
        board: Board,
        piece: Piece
    ): SpinResult {
        return this.noSpin(true);
    };

    private static detectISpin(
        board: Board,
        piece: Piece
    ): SpinResult {
        return this.noSpin(true);
    };

    private static detectOSpin(
        board: Board,
        piece: Piece
    ): SpinResult {
        return this.noSpin(true);
    };

    private static countBlockedCorners(
        board: Board,
        piece: Piece
    ): number {
        const pivotX = piece.x + 1;
        const pivotY = piece.y + 1;
        let blocked = 0;

        if (board.isBlocked(pivotX - 1, pivotY - 1)) {
            blocked++;
        }
        if (board.isBlocked(pivotX + 1, pivotY - 1)) {
            blocked++;
        }
        if (board.isBlocked(pivotX - 1, pivotY + 1)) {
            blocked++;
        }
        if (board.isBlocked(pivotX + 1, pivotY + 1)) {
            blocked++;
        }
        return blocked;
    }
}