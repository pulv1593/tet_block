import type { KickOffset } from "./KickTable";

export interface RotationResult {
    rotated: boolean;
    kickIndex: number;
    kick: KickOffset | null;
    fromRotation: number;
    toRotation: number;
}
