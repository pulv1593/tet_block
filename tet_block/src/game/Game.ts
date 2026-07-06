import { InputManager } from "../input/InputManager";
import { GameSettings } from "../settings/GameSettings";
import { Bag } from "./bag";
import { Board } from "./Board";
import { GRAVITY_DELAY } from "./Constants";
import { Piece } from "./Piece";
import { TetrominoType } from "../types/Tetromino";
import { RotateDirection, Rotation } from "../srs/Rotation";
import { ScoreManager } from "../Score/ScoreManager";
import { ScoreEvent } from "../Score/ScoreEvent";

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
        return this.tryMoveDown();
    }

    public hardDrop(): void {
        this.currentPiece.y =
            this.getLandingY();
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

        return true;
    }

    public rotateCW(): boolean {
        if (
            !Rotation.rotate(
                this.board,
                this.currentPiece,
                RotateDirection.CW
            )
        ) {
            return false;
        }

        this.afterSuccessfulAction();

        return true;
    }

    public rotateCCW(): boolean {
        if (
            !Rotation.rotate(
                this.board,
                this.currentPiece,
                RotateDirection.CCW
            )
        ) {
            return false;
        }

        this.afterSuccessfulAction();

        return true;
    }

    //Merge
    private merge():void{
        this.board.mergePiece(
            this.currentPiece
        );

        this.isGrounded = false;
        this.lockTimer = 0;
        this.lockResetCount = 0;

        const lines = this.board.clearLines();

        switch (lines) {
        case 1:
            this.scoreManager.addScore(
                ScoreEvent.SINGLE
            );
            break;

        case 2:
            this.scoreManager.addScore(
                ScoreEvent.DOUBLE
            );
            break;

        case 3:
            this.scoreManager.addScore(
                ScoreEvent.TRIPLE
            );
            break;

        case 4:
            this.scoreManager.addScore(
                ScoreEvent.TETRIS
            );
            break;
        default:
            this.scoreManager.addScore(
                ScoreEvent.NONE
            );
            break;
        }

        this.canHold = true;

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

        this.canHold = false;

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
}