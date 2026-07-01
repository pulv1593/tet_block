import { CELL_SIZE } from "./Constants";
import { Board } from "./Board";
import { Piece } from "./Piece";
import { Game } from "./Game";
import { TETROMINO_COLORS } from "../types/Tetromino";

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

        if (game.settings.showGhostPiece) {
            this.drawGhost(
                game.currentPiece,
                game.getLandingY()
            );
        }

        this.drawPiece(game.currentPiece);
    }

    private drawBoard(board: Board) {
        for (let y = 0; y < board.grid.length; y++) {

            for (let x = 0; x < board.grid[y].length; x++) {

                const id = board.grid[y][x];

                if (id !== 0) {
                    this.drawCell(
                        x,
                        y,
                        TETROMINO_COLORS[id]
                    );
                }

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

    private drawPiece(piece: Piece) {

        const shape = piece.getShape();

        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {

                if (shape[y][x] === 0) {
                    continue;
                }

                this.drawCell(
                    piece.x + x,
                    piece.y + y,
                    TETROMINO_COLORS[piece.id]
                );
            }
        }
    }

    private drawCell(
        x: number,
        y: number,
        color: string
    ): void {

        this.ctx.fillStyle = color;

        this.ctx.fillRect(
            x * CELL_SIZE,
            y * CELL_SIZE,
            CELL_SIZE,
            CELL_SIZE
        );

        this.ctx.strokeStyle = "#000";

        this.ctx.strokeRect(
            x * CELL_SIZE,
            y * CELL_SIZE,
            CELL_SIZE,
            CELL_SIZE
        );

    }

    //Ghost Piece draw function
    private drawGhost(
        piece: Piece,
        landingY: number
    ): void {

        const shape = piece.getShape();

        this.ctx.globalAlpha = 0.3;

        for (let y = 0; y < shape.length; y++) {

            for (let x = 0; x < shape[y].length; x++) {

                if (shape[y][x] === 0) {
                    continue;
                }

                this.drawCell(
                    piece.x + x,
                    landingY + y,
                    TETROMINO_COLORS[piece.id]
                );

            }

        }

        this.ctx.globalAlpha = 1;
    }
}