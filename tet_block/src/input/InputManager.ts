import { Game } from "../game/Game";

export class InputManager {

    private game: Game;

    // Horizontal Input
    private leftPressed = false;
    private rightPressed = false;
    private horizontalDirection = 0;

    // Vertical Input
    private downPressed = false;

    // DAS
    private dasTimer = 0;
    private dasCompleted = false;

    // ARR
    private arrTimer = 0;

    // SDF
    private sdfTimer = 0;

    constructor(game: Game) {
        this.game = game;
    }

    initialize() {
        this.initializeKeyDown();
        this.initializeKeyUp();
    }

    private initializeKeyDown(): void {
        window.addEventListener("keydown", (e) => {

            if (this.game.isGameOver()) {
                return;
            }

            switch (e.code) {

                case "ArrowLeft":

                    if (!this.leftPressed) {
                        this.game.moveLeft();

                        this.dasTimer = 0;
                        this.arrTimer = 0;
                        this.dasCompleted = false;

                    }

                    this.leftPressed = true;
                    this.horizontalDirection = -1;

                    break;

                case "ArrowRight":

                    if (!this.rightPressed) {
                        this.game.moveRight();

                        this.dasTimer = 0;
                        this.arrTimer = 0;
                        this.dasCompleted = false;

                    }

                    this.rightPressed = true;
                    this.horizontalDirection = 1;

                    break;

                case "ArrowDown":

                    this.downPressed = true;

                    break;

                case "KeyX":
                    this.game.rotateCW();
                    break;

                case "KeyZ":
                    this.game.rotateCCW();
                    break;

                case "Space":
                    this.game.hardDrop();
                    break;

                case "KeyC":
                    this.game.hold();
                    break;
            }
        });
    }

    private initializeKeyUp(): void {
        window.addEventListener("keyup", (e) => {

            switch (e.code) {

                case "ArrowLeft":
                    this.leftPressed = false;
                    break;

                case "ArrowRight":
                    this.rightPressed = false;
                    break;
                case "ArrowDown":
                    this.downPressed = false;
                    break;
            }

            if (this.leftPressed) {

                this.horizontalDirection = -1;

            } else if (this.rightPressed) {

                this.horizontalDirection = 1;

            } else {

                this.horizontalDirection = 0;

            }

            this.dasTimer = 0;
            this.arrTimer = 0;
            this.dasCompleted = false;
        });
    }

    public update(deltaTime: number): void {

        this.updateHorizontal(deltaTime);

        this.updateSoftDrop(deltaTime);

    }

    private updateHorizontal(deltaTime: number): void {

        if (this.horizontalDirection === 0) {
            return;
        }

        // DAS
        if (!this.dasCompleted) {

            this.dasTimer += deltaTime;

            if (
                this.dasTimer <
                this.game.getSettings().das
            ) {
                return;
            }

            this.dasCompleted = true;
        }

        // ARR = 0
        if (this.game.getSettings().arr === 0) {
            while (true) {
                const moved = this.horizontalDirection < 0 ? this.game.moveLeft() : this.game.moveRight();
                if(!moved) {
                    break;
                }
            }
            return;
        }

        // ARR
        this.arrTimer += deltaTime;

        if (
            this.arrTimer <
            this.game.getSettings().arr
        ) {
            return;
        }

        this.arrTimer -=
            this.game.getSettings().arr;

        if(this.horizontalDirection < 0) {
            this.game.moveLeft();
        } else {
            this.game.moveRight();
        }
    }

    private updateSoftDrop(deltaTime: number): void {

        if (!this.downPressed) {

            this.sdfTimer = 0;
            return;

        }

        if (
            this.game.getSettings().sdf === Infinity
        ) {

            while (this.game.softDrop()) {}

            return;

        }

        this.sdfTimer += deltaTime;

        const interval =
            1000 /
            this.game.getSettings().sdf;

        while (this.sdfTimer >= interval) {

            this.sdfTimer -= interval;

            if (!this.game.softDrop()) {
                break;
            }

        }

    }
}