import { Board } from "./game/Board";
import { Renderer } from "./game/Renderer";
import {
    BOARD_WIDTH,
    BOARD_HEIGHT,
    CELL_SIZE
} from "./game/Constants";
import { Piece } from "./game/Piece";
import { TetrominoType } from "./types/Tetromino";
import { InputManager } from "./input/InputManager";

const canvas = document.getElementById("game") as HTMLCanvasElement;

canvas.width = BOARD_WIDTH * CELL_SIZE;
canvas.height = BOARD_HEIGHT * CELL_SIZE;

const ctx = canvas.getContext("2d")!;

const board = new Board();
const renderer = new Renderer(ctx);
const piece = new Piece(TetrominoType.T);

const input = new InputManager(board, piece);
input.initialize();

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    renderer.drawBoard(board);

    renderer.drawPiece(piece);

    requestAnimationFrame(gameLoop);
}

gameLoop();

console.log(
    board.isValidPosition(
        piece,
        piece.x,
        piece.y
    )
);