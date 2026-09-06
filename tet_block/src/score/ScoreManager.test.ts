import { describe, expect, it } from "vitest";

import { ScoreEvent } from "./ScoreEvent";
import { ScoreManager } from "./ScoreManager";

describe("ScoreManager combo and back-to-back", () => {
    it("adds combo score after the first consecutive line clear", () => {
        const manager = new ScoreManager();

        manager.addScore(ScoreEvent.SINGLE);
        expect(manager.getCombo()).toBe(0);
        expect(manager.getLastScoreGain()).toBe(100);

        manager.addScore(ScoreEvent.SINGLE);
        expect(manager.getCombo()).toBe(1);
        expect(manager.getLastScoreGain()).toBe(150);
        expect(manager.getScore()).toBe(250);
    });

    it("awards the B2B multiplier from the second difficult clear", () => {
        const manager = new ScoreManager();

        manager.addScore(ScoreEvent.TETRIS);
        expect(manager.getBackToBackCount()).toBe(1);
        expect(manager.wasLastBackToBackBonus()).toBe(false);
        expect(manager.getLastScoreGain()).toBe(800);

        manager.addScore(ScoreEvent.SPIN_DOUBLE);
        expect(manager.getBackToBackCount()).toBe(2);
        expect(manager.wasLastBackToBackBonus()).toBe(true);
        expect(manager.getLastScoreGain()).toBe(1850);
    });

    it("preserves B2B but resets combo on a zero-line T-spin", () => {
        const manager = new ScoreManager();

        manager.addScore(ScoreEvent.TETRIS);
        manager.addScore(ScoreEvent.SPIN_ZERO);

        expect(manager.getBackToBackCount()).toBe(1);
        expect(manager.getCombo()).toBe(-1);
        expect(manager.getLastScoreGain()).toBe(400);
    });

    it("breaks B2B on an ordinary line clear", () => {
        const manager = new ScoreManager();

        manager.addScore(ScoreEvent.SPIN_SINGLE);
        manager.addScore(ScoreEvent.SINGLE);

        expect(manager.getBackToBackCount()).toBe(0);
        expect(manager.wasLastBackToBackBonus()).toBe(false);
    });

    it("adds the Perfect Clear bonus to the line clear score", () => {
        const manager = new ScoreManager();

        manager.addScore(ScoreEvent.TETRIS, true);

        expect(manager.getLastScoreGain()).toBe(4300);
        expect(manager.getScore()).toBe(4300);
    });

    it("scores soft and hard drop distance without a level multiplier", () => {
        const manager = new ScoreManager();

        manager.addSoftDropScore(3);
        manager.addHardDropScore(4);

        expect(manager.getScore()).toBe(11);
    });
});
