import {
    DEFAULT_DAS,
    DEFAULT_ARR,
    DEFAULT_SDF,
    DEFAULT_LOCK_DELAY
} from "../game/Constants";

export class GameSettings {
    //display
    showGhostPiece = true;

    //input
    das = DEFAULT_DAS;
    arr = DEFAULT_ARR;
    sdf = DEFAULT_SDF;

    lockDelay = DEFAULT_LOCK_DELAY;

}