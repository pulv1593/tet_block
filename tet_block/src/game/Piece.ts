import {
    TetrominoType,
    TETROMINO_SHAPES
} from "../types/Tetromino";

export class Piece {

    type: TetrominoType;

    x: number;

    y: number;

    rotation: number;

    constructor(type: TetrominoType) {

        this.type = type;

        this.rotation = 0;

        this.x = 3;

        this.y = 0;
    }

    getShape() {
        return TETROMINO_SHAPES[this.type][this.rotation]
    }
    rotateCW() {
        this.rotation = (this.rotation + 1) % 4;
    }
}