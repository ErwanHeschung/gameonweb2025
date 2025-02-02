import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { Scene, SceneLoader, TransformNode, AnimationGroup, Animation } from "@babylonjs/core";
import { RotationDirectionType } from "../enums/direction";

export class Entity {
    public scene: Scene;
    public parent: TransformNode;
    public animations: AnimationGroup[] = [];

    constructor(scene: Scene,meshName:string) {
        this.scene = scene;
        this.parent = new TransformNode(meshName+"parent", scene); 
    }

    async loadModel(path:string,filename:string,posx:number, posy:number, posz:number): Promise<void> {
        const result = await SceneLoader.ImportMeshAsync(null, path, filename, this.scene);
        const mesh = result.meshes[0];
        mesh.setParent(this.parent);
        mesh.position.set(posx, posy, posz);

        this.animations = result.animationGroups;
        this.playAnimation("idle");
    }

    playAnimation(name: string) {
        const anim = this.animations.find(a => a.name === name);
        if (!anim) return;

        if (anim.isPlaying) return;

        this.animations.forEach(a => a.stop());
        anim.start(true);
    }

    rotate(direction: RotationDirectionType) {

        const targetRotation = Math.atan2(direction.x, direction.z); // Calculate target angle

        // Create rotation animation
        const rotationAnimation = new Animation(
            "rotateAnimation",
            "rotation.y",
            30, // FPS
            Animation.ANIMATIONTYPE_FLOAT,
            Animation.ANIMATIONLOOPMODE_CONSTANT
        );

        // Define keyframes
        const keyFrames = [
            { frame: 0, value: this.parent.rotation.y },
            { frame: 10, value: targetRotation }
        ];

        rotationAnimation.setKeys(keyFrames);

        this.parent.animations = [];
        this.parent.animations.push(rotationAnimation);
        this.scene.beginAnimation(this.parent, 0, 10, false);
    }
}
