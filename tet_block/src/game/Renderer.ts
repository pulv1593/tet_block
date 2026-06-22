import { CELL_SIZE } from "./Constants";
import { Board } from "./Board";
import { Piece } from "./Piece";

import {
    TETROMINO_SHAPES
} from "../types/Tetromino";

export class Renderer {

    private ctx: CanvasRenderingContext2D;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
    }


    drawBoard(board: Board) {

        for (let y = 0; y < board.grid.length; y++) {
            for (let x = 0; x < board.grid[y].length; x++) {

                this.ctx.strokeStyle = "#333";

                this.ctx.strokeRect(
                    x * CELL_SIZE,
                    y * CELL_SIZE,
                    CELL_SIZE,
                    CELL_SIZE
                );
            }
        }
    }

    drawPiece(piece: Piece) {

        const shape =
            TETROMINO_SHAPES[piece.type][piece.rotation];

        this.ctx.fillStyle = "#b000ff";

        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {

                if (shape[y][x] === 0) {
                    continue;
                }

                this.ctx.fillRect(
                    (piece.x + x) * CELL_SIZE,
                    (piece.y + y) * CELL_SIZE,
                    CELL_SIZE,
                    CELL_SIZE
                );

                this.ctx.strokeStyle = "#000";

                this.ctx.strokeRect(
                    (piece.x + x) * CELL_SIZE,
                    (piece.y + y) * CELL_SIZE,
                    CELL_SIZE,
                    CELL_SIZE
                );
            }
        }
    }
}