import { Game } from "../game/Game";
import { RotateDirection, Rotation } from "../srs/Rotation";

export class InputManager {
    private game: Game;

    constructor(game: Game) {
        this.game = game;
    }

    initialize() {
        window.addEventListener("keydown", (e)=> {
            switch (e.code) {
                case "ArrowLeft":
                    if (
                        this.game.board.isValidPosition(
                            this.game.currentPiece,
                            this.game.currentPiece.x - 1,
                            this.game.currentPiece.y
                        )
                    ) {
                        this.game.currentPiece.x--;
                    }
                    break;
                case "ArrowRight":
                    if (
                        this.game.board.isValidPosition(
                            this.game.currentPiece,
                            this.game.currentPiece.x + 1,
                            this.game.currentPiece.y
                        )
                    )   {
                        this.game.currentPiece.x++;
                    }
                    break;
                case "ArrowDown":
                    if (
                        this.game.board.isValidPosition(
                            this.game.currentPiece,
                            this.game.currentPiece.x,
                            this.game.currentPiece.y + 1
                        )
                    ) {
                        this.game.currentPiece.y++;
                    }
                    break;
                case "KeyX":
                    Rotation.rotate(
                        this.game.board,
                        this.game.currentPiece,
                        RotateDirection.CW
                    );
                    break;
                case "KeyZ":
                    Rotation.rotate(
                        this.game.board,
                        this.game.currentPiece,
                        RotateDirection.CCW
                    );
                    break;
            }
        })
    }
}