import { CELL_SIZE, BOARD_WIDTH } from "./Constants";
import { Board } from "./Board";
import { Piece } from "./Piece";
import { Game } from "./Game";
import { TETROMINO_COLORS, TetrominoType, TETROMINO_SHAPES, TETROMINO_IDS } from "../types/Tetromino";

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

        this.drawNextQueue(game.getNextQueue());
    }

    private drawBoard(board: Board) {
        for (let y = 0; y < board.grid.length; y++) {

            for (let x = 0; x < board.grid[y].length; x++) {

                const id = board.grid[y][x];

                if (id !== 0) {
                    this.drawBoardCell(
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

                this.drawBoardCell(
                    piece.x + x,
                    piece.y + y,
                    TETROMINO_COLORS[piece.id]
                );
            }
        }
    }

    private drawPixelCell(
        pixelX: number,
        pixelY: number,
        color: string
    ): void {

        this.ctx.fillStyle = color;

        this.ctx.fillRect(
            pixelX,
            pixelY,
            CELL_SIZE,
            CELL_SIZE
        );

        this.ctx.strokeStyle = "#000";

        this.ctx.strokeRect(
            pixelX,
            pixelY,
            CELL_SIZE,
            CELL_SIZE
        );

    }

    private drawBoardCell(
        x: number,
        y: number,
        color: string
    ): void {

        this.drawPixelCell(
            x * CELL_SIZE,
            y * CELL_SIZE,
            color
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

                this.drawBoardCell(
                    piece.x + x,
                    landingY + y,
                    TETROMINO_COLORS[piece.id]
                );

            }

        }

        this.ctx.globalAlpha = 1;
    }

    private drawNextQueue(
        queue: readonly TetrominoType[]
    ): void {

        const startX =
            BOARD_WIDTH * CELL_SIZE + 20;

        const startY = 20;

        this.ctx.fillStyle = "white";
        this.ctx.font = "20px Arial";
        this.ctx.fillText(
            "NEXT",
            startX,
            startY
        );

        queue.forEach((type, index) => {
            this.drawMiniPiece(
                type,
                startX,
                startY + 30 + index * 80
            );
        });

    }
    private drawMiniPiece(
        type: TetrominoType,
        pixelX: number,
        pixelY: number
    ): void {

        const shape =
            TETROMINO_SHAPES[type][0];

        const color =
            TETROMINO_COLORS[
                TETROMINO_IDS[type]
            ];

        for (let y = 0; y < shape.length; y++) {

            for (let x = 0; x < shape[y].length; x++) {

                if (shape[y][x] === 0) {
                    continue;
                }

                this.drawPixelCell(
                    pixelX + x * CELL_SIZE,
                    pixelY + y * CELL_SIZE,
                    color
                );

            }

        }

    }
}