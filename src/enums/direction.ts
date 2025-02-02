import { Vector3 } from "@babylonjs/core";

export const RotationDirection = {
    Forward: new Vector3(0, 0, 1),
    Backward: new Vector3(0, 0, -1),
    Left: new Vector3(-1, 0, 0),
    Right: new Vector3(1, 0, 0)
} as const;

export type RotationDirectionType = (typeof RotationDirection)[keyof typeof RotationDirection];
