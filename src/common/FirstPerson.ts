import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { FreeCamera, KeyboardEventTypes, Scene, Vector3 } from "@babylonjs/core";
import { Slime } from "../mobs/slime";

export class FirstPerson extends Slime{
    private camera: FreeCamera;

    constructor(scene: Scene) {
        super(scene);

        this.camera = new FreeCamera("firstPersonCamera", new Vector3(0, 1, 0), scene);
        this.camera.attachControl(scene.getEngine().getRenderingCanvas(), true);

        this.camera.parent = this.parent;
        this.playAnimation("idle");
        this.setupControls();
    }

    override async loadModel(): Promise<void> {
        await super.loadModel();
        this.camera.position.set(0, 6, -6);
    }

    setupControls() {
        const speed = 0.1;

        this.scene.onKeyboardObservable.add((kbInfo) => {
            switch (kbInfo.type) {
                case KeyboardEventTypes.KEYDOWN:
                    switch (kbInfo.event.key) {
                        case "z":
                            this.parent.position.addInPlace(this.camera.getDirection(Vector3.Forward()).scale(speed));
                            this.playAnimation("jump");
                            break;
                        case "s":
                            this.parent.position.addInPlace(this.camera.getDirection(Vector3.Backward()).scale(speed));
                            this.playAnimation("jump");
                            break;
                        case "q":
                            this.parent.position.addInPlace(this.camera.getDirection(Vector3.Left()).scale(speed));
                            this.playAnimation("jump");
                            break;
                        case "d":
                            this.parent.position.addInPlace(this.camera.getDirection(Vector3.Right()).scale(speed));
                            this.playAnimation("jump");
                            break;
                        default:
                            this.playAnimation("idle");
                            break;
                    }
                    break;
                case KeyboardEventTypes.KEYUP:
                    this.playAnimation("idle");
                    break;
            }
        });
    }
}
