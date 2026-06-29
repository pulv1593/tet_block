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
        newY: number
    ):boolean {
        const shape = piece.getShape();
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
}