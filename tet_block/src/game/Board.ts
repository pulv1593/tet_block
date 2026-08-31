import { TETROMINO_SHAPES } from "../types/Tetromino";
import { BOARD_HEIGHT, BOARD_WIDTH } from "./Constants";
import { Piece } from "./Piece";

export class Board {
    grid: number[][];
    
    constructor() {
        this.grid = Array.from(
            {length: BOARD_HEIGHT},
            () => Array(BOARD_WIDTH).fill(0)
        );
    }

    isValidPosition(
        piece: Piece,
        newX: number,
        newY: number,
        rotation: number = piece.rotation
    ):boolean {
        const shape = TETROMINO_SHAPES[piece.type][rotation];
        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (shape[y][x] === 0) {
                    continue;
                }

                const boardX = newX + x;
                const boardY = newY + y;

                // 좌우 벽
                if (
                    boardX < 0 ||
                    boardX >= this.grid[0].length
                ) {
                    return false;
                }

                // 바닥
                if (
                    boardY >= this.grid.length
                ) {
                    return false;
                }

                // 이미 놓인 블록
                if (
                    boardY >= 0 &&
                    this.grid[boardY][boardX] !== 0
                ) {
                    return false;
                }
            }
        }
        return true;
    }

    public mergePiece(piece: Piece): boolean {
        const shape = piece.getShape();
        let fullyInsideBoard = true;

        for (let y = 0; y < shape.length; y++) {

            for (let x = 0; x < shape[y].length; x++) {

                if (shape[y][x] === 0) {
                    continue;
                }

                const boardY = piece.y + y;

                if (boardY < 0) {
                    fullyInsideBoard = false;
                    continue;
                }

                this.grid[
                    boardY
                ][
                    piece.x + x
                ] = piece.id;

            }

        }


        return fullyInsideBoard;

    }

    private isLineFull(y: number) :boolean {
        for (let x = 0; x < this.grid[y].length; x++) {
            if (this.grid[y][x] === 0) {
                return false;
            }
        }
        return true;
    }

    private removeLine(y: number): void {
        for (let row = y; row > 0; row--) {

            this.grid[row] = [...this.grid[row - 1]];

        }

        this.grid[0] =
            new Array(this.grid[0].length).fill(0);
    }

    public clearLines(): number {
        let cleared = 0;

        for (let y = this.grid.length - 1; y >= 0; y--) {

            if (!this.isLineFull(y)) {
                continue;
            }

            this.removeLine(y);

            cleared++;

            y++;
        }

        return cleared;
    }

    public isEmpty(): boolean {
        return this.grid.every(
            row => row.every(cell => cell === 0)
        );
    }

    public isBlocked(
        x: number,
        y: number
    ): boolean {
        if (
            x < 0 ||
            x >= BOARD_WIDTH ||
            y >= BOARD_HEIGHT
        ) {
            return true;
        }

        if (y < 0) {
            return false;
        }
        return this.grid[y][x] !== 0;
    }
}
