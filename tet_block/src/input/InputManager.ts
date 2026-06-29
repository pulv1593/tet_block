import { Board } from "../game/Board";
import { Piece } from "../game/Piece";
import { RotateDirection, Rotation } from "../srs/Rotation";

export class InputManager {
    private board: Board;
    private piece: Piece;

    constructor(board: Board, piece: Piece) {
        this.board = board;
        this.piece = piece;
    }

    initialize() {
        window.addEventListener("keydown", (e)=> {
            switch (e.code) {
                case "ArrowLeft":
                    if (
                        this.board.isValidPosition(
                            this.piece,
                            this.piece.x - 1,
                            this.piece.y
                        )
                    ) {
                        this.piece.x--;
                    }
                    break;
                case "ArrowRight":
                    if (
                        this.board.isValidPosition(
                            this.piece,
                            this.piece.x + 1,
                            this.piece.y
                        )
                    )   {
                        this.piece.x++;
                    }
                    break;
                case "ArrowDown":
                    if (
                        this.board.isValidPosition(
                            this.piece,
                            this.piece.x,
                            this.piece.y + 1
                        )
                    ) {
                        this.piece.y++;
                    }
                    break;
                case "KeyX":
                    Rotation.rotate(
                        this.board,
                        this.piece,
                        RotateDirection.CW
                    );
                    break;
                case "KeyZ":
                    Rotation.rotate(
                        this.board,
                        this.piece,
                        RotateDirection.CCW
                    );
                    break;
            }
        })
    }
}