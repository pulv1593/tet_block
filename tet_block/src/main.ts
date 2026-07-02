import { Game } from "./game/Game";
import { Renderer } from "./game/Renderer";
import {
    BOARD_WIDTH,
    BOARD_HEIGHT,
    CELL_SIZE,
    LEFT_PANEL_WIDTH,
    RIGHT_PANEL_WIDTH,
} from "./game/Constants";

const canvas =
    document.getElementById("game") as HTMLCanvasElement;

canvas.width = LEFT_PANEL_WIDTH + BOARD_WIDTH * CELL_SIZE + RIGHT_PANEL_WIDTH;
canvas.height = BOARD_HEIGHT * CELL_SIZE;

const ctx = canvas.getContext("2d")!;

const game = new Game();

const renderer = new Renderer(ctx);

let lastTime = performance.now();

function gameLoop(currentTime: number) {

    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    game.update(deltaTime);

    renderer.render(game);

    requestAnimationFrame(gameLoop);

}

requestAnimationFrame(gameLoop);