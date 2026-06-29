import { Board } from "../game/Board";
import { Piece } from "../game/Piece";

import { getKickOffsets } from "./KickTable";

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
    ): boolean {

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

        for (const kick of kicks) {

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

                return true;
            }

        }

        return false;
    }
}