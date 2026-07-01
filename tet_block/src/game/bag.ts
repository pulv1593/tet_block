import { TetrominoType } from "../types/Tetromino";

export class Bag {

    private pieces: TetrominoType[] = [];

    constructor() {
        this.refill();
    }

    next(): TetrominoType {

        if (this.pieces.length === 0) {
            this.refill();
        }

        return this.pieces.pop()!;
    }

    private refill(): void {

        this.pieces = [
            TetrominoType.I,
            TetrominoType.O,
            TetrominoType.T,
            TetrominoType.S,
            TetrominoType.Z,
            TetrominoType.J,
            TetrominoType.L,
        ];

        this.shuffle();
    }

    private shuffle(): void {

        for (let i = this.pieces.length - 1; i > 0; i--) {

            const j = Math.floor(
                Math.random() * (i + 1)
            );

            [
                this.pieces[i],
                this.pieces[j]
            ] = [
                this.pieces[j],
                this.pieces[i]
            ];
        }

    }
}