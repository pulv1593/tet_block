import { CELL_SIZE } from "./Constants";
import { Board } from "./Board";
import { Piece } from "./Piece";
import { Game } from "./Game";

export class Renderer {

    private ctx: CanvasRenderingContext2D;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
    }

    render(game: Game): void {

        this.ctx.clearRect(
            0,
            0,
            this.ctx.canvas.width,
            this.ctx.canvas.height
        );

        this.drawBoard(game.board);
        this.drawPiece(game.currentPiece);
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

        const shape = piece.getShape();

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