import { InputManager } from "../input/InputManager";
import { GameSettings } from "../settings/GameSettings";
import { Bag } from "./bag";
import { Board } from "./Board";
import { GRAVITY_DELAY, LOCK_DELAY } from "./Constants";
import { Piece } from "./Piece";
import { TetrominoType } from "../types/Tetromino";

export class Game {

    readonly board: Board;
    readonly input: InputManager;
    readonly settings: GameSettings;

    currentPiece: Piece;

    //gravity 변수
    private gravityTimer = 0;
    private gravityDelay = GRAVITY_DELAY;

    //lock delay 변수
    private lockTimer = 0;
    private readonly lockDelay = LOCK_DELAY;
    private isGrounded = false;

    //7-bag 변수
    private bag : Bag;

    //gameover 변수
    private gameOver = false;

    //hold 변수
    private heldPiece: TetrominoType | null = null;
    private canHold = true;

    constructor() {

        this.board = new Board();

        this.bag = new Bag();
        this.currentPiece =
            new Piece(this.bag.next());

        this.input =
            new InputManager(this);

        this.input.initialize();

        this.settings = new GameSettings();
    }

    update(deltaTime: number):void {
        
        if(this.gameOver) {
            return;
        };

        this.gravityTimer += deltaTime;

        while (this.gravityTimer >= this.gravityDelay) {

            this.gravityTimer -= this.gravityDelay;

            this.tryMoveDown();
        }

        //lock Delay
        if(this.isGrounded) {
            this.lockTimer += deltaTime;
            if(this.lockTimer >= this.lockDelay){
                this.merge();
            }
        } else {
            this.lockTimer = 0;
        }
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
            return true;
        }
        this.isGrounded = true;
        return false;
    }

    //Merge
    private merge():void{
        this.board.mergePiece(
            this.currentPiece
        );

        this.isGrounded = false;
        this.lockTimer = 0;

        const lines = this.board.clearLines();

        if (lines > 0) {
            console.log(`${lines} line(s) cleared`);
        }

        this.canHold = true;

        this.spawn();
        console.log(this.bag.getQueue())
    };

    public lockCurrentPiece():void {
        this.merge();
    };

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
}