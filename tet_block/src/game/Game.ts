import { InputManager } from "../input/InputManager";
import { TetrominoType } from "../types/Tetromino";
import { Board } from "./Board";
import { GRAVITY_DELAY } from "./Constants";
import { Piece } from "./Piece";

export class Game {

    readonly board: Board;
    readonly input: InputManager;

    currentPiece: Piece;

    private gravityTimer = 0;
    private gravityDelay = GRAVITY_DELAY;

    constructor() {

        this.board = new Board();

        this.currentPiece =
            new Piece(TetrominoType.I);

        this.input =
            new InputManager(this);

        this.input.initialize();
    }

    update(deltaTime: number):void {

        this.gravityTimer += deltaTime;

        while (this.gravityTimer >= this.gravityDelay) {

            this.gravityTimer -= this.gravityDelay;

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

            this.currentPiece.move(0,1);
            return;
        }

    }

}
//현재 mino
//Gravity
//Lock Delay
//Spawn
//Merge
//7-bag