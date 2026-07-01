import { InputManager } from "../input/InputManager";
import { TetrominoType } from "../types/Tetromino";
import { Board } from "./Board";
import { Piece } from "./Piece";

export class Game {

    readonly board: Board;
    readonly input: InputManager;

    currentPiece: Piece;

    private gravityTimer = 0;
    private gravityDelay = 1000;

    constructor() {

        this.board = new Board();

        this.currentPiece =
            new Piece(TetrominoType.I);

        this.input =
            new InputManager(this);

        this.input.initialize();
    }

    update(deltaTime: number) {

        this.gravityTimer += deltaTime;

        if (this.gravityTimer >= this.gravityDelay) {

            this.gravityTimer = 0;

            this.softDrop();

        }

    }

    private softDrop() {

        if (
            this.board.isValidPosition(
                this.currentPiece,
                this.currentPiece.x,
                this.currentPiece.y + 1
            )
        ) {

            this.currentPiece.y++;

        }

    }

}
//현재 mino
//Gravity
//Lock Delay
//Spawn
//Merge
//7-bag