import { BOARD_HEIGHT, BOARD_WIDTH } from "./Constants";

export class Board {
    grid: number[][];
    
    constructor() {
        this.grid = Array.from(
            {length: BOARD_HEIGHT},
            () => Array(BOARD_WIDTH).fill(0)
        );
    }
}