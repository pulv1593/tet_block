import { InputManager } from "../input/InputManager";
import { GameSettings } from "../settings/GameSettings";
import { Bag } from "./bag";
import { Board } from "./Board";
import { GRAVITY_DELAY } from "./Constants";
import { Piece } from "./Piece";
import { TetrominoType } from "../types/Tetromino";
import { RotateDirection, Rotation } from "../srs/Rotation";
import { ScoreManager } from "../score/ScoreManager";
import { SpinType } from "../spin/SpinType";
import { SpinDetector } from "../spin/SpinDetector";
import type { SpinResult } from "../spin/SpinResult";
import { ActionType } from "../action/ActionType";
import type { ActionType as ActionTypeType } from "../action/ActionType";
import type { LockResult } from "./LockResult";
import type { RotationResult } from "../srs/RotationResult";
import { resolveScoreEvent } from "../score/ScoreEventResolver";

export class Game {

    readonly board: Board;
    readonly input: InputManager;

    private settings: GameSettings;

    public getSettings(): GameSettings {
        return this.settings;
    }

    currentPiece: Piece;

    //gravity 변수
    private gravityTimer = 0;
    private gravityDelay = GRAVITY_DELAY;

    //lock delay 변수
    private lockTimer = 0;
    private isGrounded = false;
    
    // Lock Reset
    private lockResetCount = 0;
    private readonly maxLockReset = 15;

    private get lockDelay():number {
        return this.settings.lockDelay;
    }

    //7-bag 변수
    private bag : Bag;

    //gameover 변수
    private gameOver = false;

    //hold 변수
    private heldPiece: TetrominoType | null = null;
    private canHold = true;

    //score 변수
    private scoreManager: ScoreManager;

    //spin 변수
    private lastSpin: SpinResult = {
        type: SpinType.NONE,
        isMini: false,
        rotated: false,
    };

    private lastLockResult: LockResult = {
        spin: this.lastSpin,
        linesCleared: 0,
        isPerfectClear: false,
    };
    //action 변수
    private lastAction: ActionTypeType =
        ActionType.NONE;

    private lastRotation: RotationResult | null = null;

    constructor() {

        this.board = new Board();

        this.bag = new Bag();
        this.currentPiece =
            new Piece(this.bag.next());

        this.settings = new GameSettings();

        this.input = new InputManager(this);

        this.scoreManager = new ScoreManager();

        this.input.initialize();
    }

    update(deltaTime: number):void {
        
        if(this.gameOver) {
            return;
        };

        this.input.update(deltaTime);
        this.updateGravity(deltaTime);
        this.updateLockDelay(deltaTime);
    }

    //1칸 down
    private tryMoveDown():boolean {

        if (
            this.board.isValidPosition(
                this.currentPiece,
                this.currentPiece.x,
                this.currentPiece.y + 1
            )
        ) {

            this.currentPiece.move(0,1);
            this.isGrounded = false;
            this.lockResetCount = 0;
            return true;
        }
        this.isGrounded = true;
        return false;
    }
    
    public softDrop(): boolean {
        const moved = this.tryMoveDown();

        if(moved) {
            this.scoreManager.addSoftDropScore(1);
            this.lastAction = ActionType.SOFT_DROP;
            this.lastRotation = null;
        }

        return moved;
    }

    public hardDrop(): void {
        const landingY = this.getLandingY();
        const dropDistance = landingY - this.currentPiece.y;

        this.scoreManager.addHardDropScore(dropDistance);

        // A zero-distance hard drop only locks the piece, so preserve a
        // preceding rotation for T-spin detection. Moving downward invalidates it.
        if (dropDistance > 0) {
            this.lastAction = ActionType.HARD_DROP;
            this.lastRotation = null;
        }

        this.currentPiece.y = landingY;
        this.merge();
    }

    private updateGroundState(): void {
        this.isGrounded =
            !this.board.isValidPosition(
                this.currentPiece,
                this.currentPiece.x,
                this.currentPiece.y + 1
            );

        if (!this.isGrounded) {
            this.lockTimer = 0;
        }
    }

    private afterSuccessfulAction(): void {
        this.updateGroundState();
        this.resetLockDelay();
    }

    private updateGravity(deltaTime: number): void {
        this.gravityTimer += deltaTime;

        while (this.gravityTimer >= this.gravityDelay) {

            this.gravityTimer -= this.gravityDelay;

            this.tryMoveDown();
        }
    }

    private updateLockDelay(deltaTime: number): void {
        if (!this.isGrounded) {
            this.lockTimer = 0;
            return;
        }

        this.lockTimer += deltaTime;

        if (this.lockTimer >= this.lockDelay) {
            this.merge();
        }
    }

    public moveLeft(): boolean {
        if (
            !this.board.isValidPosition(
                this.currentPiece,
                this.currentPiece.x - 1,
                this.currentPiece.y
            )
        ) {
            return false;
        }

        this.currentPiece.move(-1, 0);

        this.afterSuccessfulAction();

        this.lastAction = ActionType.MOVE;
        this.lastRotation = null;

        return true;
    }

    public moveRight(): boolean {
        if (
            !this.board.isValidPosition(
                this.currentPiece,
                this.currentPiece.x + 1,
                this.currentPiece.y
            )
        ) {
            return false;
        }

        this.currentPiece.move(1, 0);

        this.afterSuccessfulAction();

        this.lastAction = ActionType.MOVE;
        this.lastRotation = null;

        return true;
    }

    public rotateCW(): boolean {
        const result = Rotation.rotate(
            this.board,
            this.currentPiece,
            RotateDirection.CW
        );

        if (!result.rotated) {
            return false;
        }

        this.lastRotation = result;

        this.afterSuccessfulAction();
        this.lastAction = ActionType.ROTATE;
        
        return true;
    }

    public rotateCCW(): boolean {
        const result = Rotation.rotate(
            this.board,
            this.currentPiece,
            RotateDirection.CCW
        );

        if (!result.rotated) {
            return false;
        }

        this.lastRotation = result;

        this.afterSuccessfulAction();
        this.lastAction = ActionType.ROTATE;

        return true;
    }

    public rotate180(): boolean {
        const result = Rotation.rotate(
            this.board,
            this.currentPiece,
            RotateDirection.ROTATE_180
        );

        if (!result.rotated) {
            return false;
        }

        this.lastRotation = result;

        this.afterSuccessfulAction();
        this.lastAction = ActionType.ROTATE;

        return true;
    }

    //Merge
    private merge():void{
        this.lastSpin = SpinDetector.detect (
            this.board,
            this.currentPiece,
            this.lastAction,
            this.lastRotation
        );

        const fullyInsideBoard = this.board.mergePiece(
            this.currentPiece
        );

        this.isGrounded = false;
        this.lockTimer = 0;
        this.lockResetCount = 0;

        const lines = this.board.clearLines();

        this.lastLockResult = {
            spin: this.lastSpin,
            linesCleared: lines,
            isPerfectClear:
                lines > 0 && this.board.isEmpty(),
        };

        this.scoreManager.addScore(
            resolveScoreEvent(this.lastLockResult),
            this.lastLockResult.isPerfectClear
        );

        this.logLockResult();

        this.canHold = true;

        if (!fullyInsideBoard) {
            this.gameOver = true;
            console.log("GAME OVER: LOCK OUT");
            return;
        }

        this.spawn();
    };

    private resetLockDelay(): void{
        if(!this.isGrounded) {
            return;
        }
        if(this.lockResetCount >= this.maxLockReset) {
            return;
        }
        this.lockTimer = 0;
        this.lockResetCount++;
    }

    //Spawn
    private spawn(): void {
        this.lastAction = ActionType.NONE;
        this.lastRotation = null;

        this.currentPiece =
            new Piece(
                this.bag.next()
            );
        if (
        !this.board.isValidPosition(
            this.currentPiece,
            this.currentPiece.x,
            this.currentPiece.y
            )
        ) {
            this.gameOver = true;
            console.log("GAME OVER");
        }
    }

    public isGameOver(): boolean {
        return this.gameOver;
    }

    public getNextQueue(): readonly TetrominoType[] {
        return this.bag.getQueue();
    }

    //Ghost Piece 함수
    public getLandingY(): number {
        let landingY = this.currentPiece.y;

        while (
            this.board.isValidPosition(
                this.currentPiece,
                this.currentPiece.x,
                landingY + 1
            )
        ) {
            landingY++;
        }

        return landingY;
    }

    //hold 함수
    public getHeldPiece(): TetrominoType | null {
        return this.heldPiece;
    }

    public hold(): void {
        if (!this.canHold) {
            return;
        }

        this.lastAction = ActionType.HOLD;
        this.lastRotation = null;
        this.canHold = false;
        this.gravityTimer = 0;
        this.lockTimer = 0;
        this.lockResetCount = 0;
        this.isGrounded = false;

        if (this.heldPiece === null) {

            this.heldPiece =
                this.currentPiece.type;

            this.spawn();

            return;
        }

        const temp = this.heldPiece;

        this.heldPiece =
            this.currentPiece.type;

        this.currentPiece =
            new Piece(temp);

        if (
            !this.board.isValidPosition(
                this.currentPiece,
                this.currentPiece.x,
                this.currentPiece.y
            )
        ) {
            this.gameOver = true;
            console.log("GAME OVER: HOLD BLOCK OUT");
        }
    }

    //scoreManager getter
    public getScore(): number {
        return this.scoreManager.getScore();
    }

    public getLevel(): number {
        return this.scoreManager.getLevel();
    }

    public getTotalLines(): number {
        return this.scoreManager.getTotalLines();
    }

    public getCombo(): number {
        return this.scoreManager.getCombo();
    }

    public getBackToBackCount(): number {
        return this.scoreManager.getBackToBackCount();
    }

    public getLastSpin(): SpinResult {
        return this.lastSpin;
    }

    public getLastLockResult(): LockResult {
        return this.lastLockResult;
    }

    public getLastAction(): ActionTypeType {
        return this.lastAction;
    }

    public getLastKickIndex(): number {
        return this.lastRotation?.kickIndex ?? -1;
    }

    private logLockResult(): void {
        const {
            spin,
            linesCleared,
            isPerfectClear,
        } = this.lastLockResult;

        console.log("[LOCK RESULT]", {
            result: this.getLockResultName(spin, linesCleared),
            spinType: spin.type,
            isMini: spin.isMini,
            linesCleared,
            isPerfectClear,
            kickIndex: this.getLastKickIndex(),
            combo: this.scoreManager.getCombo(),
            backToBack: this.scoreManager.getBackToBackCount(),
            backToBackBonus:
                this.scoreManager.wasLastBackToBackBonus(),
            scoreGain: this.scoreManager.getLastScoreGain(),
            score: this.scoreManager.getScore(),
        });
    }

    private getLockResultName(
        spin: SpinResult,
        linesCleared: number
    ): string {
        const lineName = [
            "ZERO",
            "SINGLE",
            "DOUBLE",
            "TRIPLE",
            "TETRIS",
        ][linesCleared] ?? `${linesCleared} LINES`;

        if (spin.type === SpinType.NONE) {
            return linesCleared === 0
                ? "NO CLEAR"
                : lineName;
        }

        const mini = spin.isMini ? " MINI" : "";

        return `${spin.type}-SPIN${mini} ${lineName}`;
    }
}
