import {
    ScoreEvent,
    type ScoreEvent as ScoreEventType
} from "./ScoreEvent";

export class ScoreManager {

    private score = 0;
    private level = 1;
    private totalLines = 0;
    private combo = -1;

    public getScore(): number {
        return this.score;
    }

    public getLevel(): number {
        return this.level;
    }

    public getTotalLines(): number {
        return this.totalLines;
    }
    public getCombo():number {
        return this.combo;
    }

    public addScore(event: ScoreEventType): void {
        if(event === ScoreEvent.NONE) {
            this.combo = -1;
            return;
        }

        this.combo++;
        switch (event) {

            case ScoreEvent.SINGLE:
                this.totalLines += 1;
                this.score += 100 * this.level;
                break;

            case ScoreEvent.DOUBLE:
                this.totalLines += 2;
                this.score += 300 * this.level;
                break;

            case ScoreEvent.TRIPLE:
                this.totalLines += 3;
                this.score += 500 * this.level;
                break;

            case ScoreEvent.TETRIS:
                this.totalLines += 4;
                this.score += 800 * this.level;
                break;

        }

        this.updateLevel();

    }

    private updateLevel(): void {

        this.level =
            Math.floor(
                this.totalLines / 10
            ) + 1;

    }
}
