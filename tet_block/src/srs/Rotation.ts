import { Board } from "../game/Board";
import { Piece } from "../game/Piece";

import { getKickOffsets } from "./KickTable";
import type { RotationResult } from "./RotationResult";

export const RotateDirection = {
    CW: "CW",
    CCW: "CCW",
    ROTATE_180: "ROTATE_180"
} as const;

export type RotateDirection =
    typeof RotateDirection[keyof typeof RotateDirection];

export class Rotation {
    private static getNextRotation(
        rotation: number,
        direction: RotateDirection
    ): number {
        switch (direction) {
            case RotateDirection.CW:
                return (rotation + 1) % 4;
            case RotateDirection.CCW:
                return (rotation + 3) % 4;
            case RotateDirection.ROTATE_180:
                return (rotation + 2) % 4;
        }
    }

    static rotate(
        board: Board,
        piece: Piece,
        direction: RotateDirection
    ): RotationResult {

        const oldRotation = piece.rotation;

        const newRotation = Rotation.getNextRotation(
            oldRotation,
            direction
        );

        const kicks = getKickOffsets(
            piece.type,
            oldRotation,
            newRotation
        );

        for (let i = 0; i < kicks.length; i++) {
            const kick = kicks[i];

            const testX = piece.x + kick.x;
            const testY = piece.y - kick.y;

            if (
                board.isValidPosition(
                    piece,
                    testX,
                    testY,
                    newRotation
                )
            ) {

                piece.rotation = newRotation;
                piece.x = testX;
                piece.y = testY;

                return {
                    rotated: true,
                    kickIndex: i,
                    kick,
                    fromRotation: oldRotation,
                    toRotation: newRotation,
                };
            }

        }

        return {
            rotated: false,
            kickIndex: -1,
            kick: null,
            fromRotation: oldRotation,
            toRotation: newRotation,
        };
    }
}
