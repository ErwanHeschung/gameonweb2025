import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { Scene } from "@babylonjs/core";
import { Entity } from "../common/Entity";

export class Slime extends Entity{

    constructor(scene: Scene) {
        super(scene,"slime");
    }

    override async loadModel(): Promise<void> {
        await super.loadModel("/models/mobs/", "slime.glb", 0, 0, 0);
    }

}
