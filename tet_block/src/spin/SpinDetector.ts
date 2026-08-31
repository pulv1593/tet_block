import { Board } from "../game/Board";
import { Piece } from "../game/Piece";
import { TetrominoType } from "../types/Tetromino";

import { SpinType } from "./SpinType";
import type { SpinResult } from "./SpinResult";
import { ActionType } from "../action/ActionType";
import type { ActionType as ActionTypeType } from "../action/ActionType";
import type { RotationResult } from "../srs/RotationResult";

export class SpinDetector {

    public static detect(
        board: Board,
        piece: Piece,
        lastAction: ActionTypeType,
        lastRotation: RotationResult | null,
    ): SpinResult {
        if (
            lastAction !== ActionType.ROTATE ||
            lastRotation === null ||
            !lastRotation.rotated ||
            lastRotation.toRotation !== piece.rotation
        ) {
            return this.noSpin(false);
        }

        switch (piece.type) {
        case TetrominoType.T:
            return this.detectTSpin(board, piece, lastRotation);

        default:
            return this.detectImmobileSpin(board, piece);
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
        piece: Piece,
        lastRotation: RotationResult,
    ): SpinResult {
        const blocked = 
            this.countBlockedCorners(board, piece);
        if (blocked < 3) {
            return this.detectImmobileSpin(board, piece);
        }
        const frontCorners =
            this.countFrontCorners(board, piece);

        const isMini =
            frontCorners < 2 &&
            !this.isMiniUpgrade(lastRotation);

        return {
            type: SpinType.T,
            isMini,
            rotated: true,
        };
    };

    private static isMiniUpgrade(
        rotation: RotationResult
    ): boolean {
        if (rotation.kick === null) {
            return false;
        }

        return (
            Math.abs(rotation.kick.x) === 1 &&
            Math.abs(rotation.kick.y) === 2
        );
    }

    private static detectImmobileSpin(
        board: Board,
        piece: Piece
    ): SpinResult {
        if (!this.isImmobile(board, piece)) {
            return this.noSpin(true);
        }

        return {
            type: piece.type,
            isMini: true,
            rotated: true,
        };
    }

    private static isImmobile(
        board: Board,
        piece: Piece
    ): boolean {
        return (
            !board.isValidPosition(piece, piece.x - 1, piece.y) &&
            !board.isValidPosition(piece, piece.x + 1, piece.y) &&
            !board.isValidPosition(piece, piece.x, piece.y - 1) &&
            !board.isValidPosition(piece, piece.x, piece.y + 1)
        );
    }

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

    private static countFrontCorners(
        board: Board,
        piece: Piece,
    ): number {
        const pivotX = piece.x + 1;
        const pivotY = piece.y + 1;

        let blocked = 0;

        switch (piece.rotation) {
            //Up
            case 0:
                if (board.isBlocked(pivotX - 1, pivotY - 1)) {
                    blocked++;
                }
                if (board.isBlocked(pivotX + 1, pivotY - 1)) {
                    blocked++;
                }
                break;
            //Right
            case 1:
                if (board.isBlocked(pivotX + 1, pivotY - 1)) {
                    blocked++;
                }
                if (board.isBlocked(pivotX + 1, pivotY + 1)) {
                    blocked++;
                }
                break;
            //Down
            case 2:
                if (board.isBlocked(pivotX - 1, pivotY + 1)) {
                    blocked++;
                }
                if (board.isBlocked(pivotX + 1, pivotY + 1)) {
                    blocked++;
                }
                break;
            //Left
            case 3:
                if (board.isBlocked(pivotX - 1, pivotY - 1)) {
                    blocked++;
                }
                if (board.isBlocked(pivotX - 1, pivotY + 1)) {
                    blocked++;
                }
                break;
        }

        return blocked;
    }
}
