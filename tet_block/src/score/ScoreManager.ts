import {
    ScoreEvent,
    type ScoreEvent as ScoreEventType
} from "./ScoreEvent";

interface ScoreRule {
    points: number;
    lines: number;
    difficult: boolean;
}

const SCORE_RULES: Record<ScoreEventType, ScoreRule> = {
    [ScoreEvent.NONE]: { points: 0, lines: 0, difficult: false },
    [ScoreEvent.SINGLE]: { points: 100, lines: 1, difficult: false },
    [ScoreEvent.DOUBLE]: { points: 300, lines: 2, difficult: false },
    [ScoreEvent.TRIPLE]: { points: 500, lines: 3, difficult: false },
    [ScoreEvent.TETRIS]: { points: 800, lines: 4, difficult: true },
    [ScoreEvent.T_SPIN_ZERO]: { points: 400, lines: 0, difficult: false },
    [ScoreEvent.T_SPIN_SINGLE]: { points: 800, lines: 1, difficult: true },
    [ScoreEvent.T_SPIN_DOUBLE]: { points: 1200, lines: 2, difficult: true },
    [ScoreEvent.T_SPIN_TRIPLE]: { points: 1600, lines: 3, difficult: true },
    [ScoreEvent.T_SPIN_MINI_ZERO]: { points: 100, lines: 0, difficult: false },
    [ScoreEvent.T_SPIN_MINI_SINGLE]: { points: 200, lines: 1, difficult: true },
    [ScoreEvent.T_SPIN_MINI_DOUBLE]: { points: 400, lines: 2, difficult: true },
};

export class ScoreManager {

    private score = 0;
    private level = 1;
    private totalLines = 0;
    private combo = -1;
    private backToBackCount = 0;
    private lastScoreGain = 0;
    private lastBackToBackBonus = false;

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

    public getBackToBackCount(): number {
        return this.backToBackCount;
    }

    public getLastScoreGain(): number {
        return this.lastScoreGain;
    }

    public wasLastBackToBackBonus(): boolean {
        return this.lastBackToBackBonus;
    }

    public addScore(event: ScoreEventType): void {
        this.lastScoreGain = 0;
        this.lastBackToBackBonus = false;

        if(event === ScoreEvent.NONE) {
            this.combo = -1;
            return;
        }

        const rule = SCORE_RULES[event];

        let actionScore = rule.points * this.level;

        if (rule.lines > 0) {
            this.combo++;
            const comboScore = 50 * this.combo * this.level;

            if (rule.difficult) {
                if (this.backToBackCount > 0) {
                    actionScore *= 1.5;
                    this.lastBackToBackBonus = true;
                }
                this.backToBackCount++;
            } else {
                this.backToBackCount = 0;
            }

            actionScore += comboScore;
            this.totalLines += rule.lines;
        } else {
            this.combo = -1;
        }

        this.lastScoreGain = actionScore;
        this.score += actionScore;

        this.updateLevel();

    }

    private updateLevel(): void {

        this.level =
            Math.floor(
                this.totalLines / 10
            ) + 1;

    }
}
