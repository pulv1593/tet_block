import { TetrominoType } from "../types/Tetromino";

export class Bag {

    private pieces: TetrominoType[] = [];
    private queue: TetrominoType[] = [];
    private readonly previewSize = 5;

    constructor() {
        this.refill();

        while(this.queue.length < this.previewSize) {
            this.queue.push(this.drawFromBag());
        };
    }

    next(): TetrominoType {
        const piece = this.queue.shift()!;

        this.queue.push(this.drawFromBag());

        return piece;
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

    private drawFromBag():TetrominoType {
        if(this.pieces.length === 0) {
            this.refill();
        };
        return this.pieces.pop()!;
    }

    public getQueue(): readonly TetrominoType[] {
        return this.queue;
    }
}