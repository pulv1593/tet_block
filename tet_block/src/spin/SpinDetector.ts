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
        lastAction: ActionTypeType,
        kickIndex: number,
    ): SpinResult {
        if(lastAction !== ActionType.ROTATE) {
            return this.noSpin(false);
        };

        switch (piece.type) {
        case TetrominoType.T:
            return this.detectTSpin(board, piece, kickIndex);

        default:
            return this.noSpin(true);
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
        kickIndex: number,
    ): SpinResult {
        const blocked = 
            this.countBlockedCorners(board, piece);
        if (blocked < 3) {
            return this.noSpin(true);
        }
        const frontCorners =
            this.countFrontCorners(board, piece);

        // Both front corners make a full T-spin. SRS test 5 (index 4)
        // upgrades a mini-shaped placement to a full T-spin.
        const isMini = frontCorners < 2 && kickIndex !== 4;

        return {
            type: SpinType.T,
            isMini,
            rotated: true,
        };
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
