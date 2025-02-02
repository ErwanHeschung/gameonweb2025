import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { Engine, Scene, SceneLoader } from "@babylonjs/core";
import { FirstPerson } from "./common/FirstPerson";

class App {
    public scene: Scene;
    public slime: FirstPerson;

    constructor() {
        const canvas = document.createElement("canvas");
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.id = "gameCanvas";
        document.body.appendChild(canvas);

        const engine = new Engine(canvas, true);
        this.scene = new Scene(engine);

        this.createSky();

        this.slime = new FirstPerson(this.scene); // Use FirstPerson
        this.slime.loadModel();

        engine.runRenderLoop(() => {
            this.scene.render();
        });
    }

    async createSky(): Promise<void> {
        await SceneLoader.ImportMeshAsync(null, "/models/", "sky.glb", this.scene);
    }
}

new App();
