import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import * as BABYLON from "@babylonjs/core";

class App {
    constructor() {
        console.log("App initialized");
    }
}

window.addEventListener("DOMContentLoaded", () => {
    const menuComponent = document.getElementById("menu") as HTMLElement | null;
    if (!menuComponent) {
        console.error("Menu component not found. Ensure <app-menu id='menu'> exists in your HTML.");
        return;
    }

    let startButton: HTMLAnchorElement | null = null;
    if (menuComponent.shadowRoot) {
        startButton = menuComponent.shadowRoot.querySelector("#play") as HTMLAnchorElement;
    } else {
        startButton = menuComponent.querySelector("#play") as HTMLAnchorElement;
    }

    if (!startButton) {
        console.error("Play button not found inside the menu component.");
        return;
    }

    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.id = "gameCanvas";
    canvas.style.display = "none";
    document.body.appendChild(canvas);

    startButton.addEventListener("click", () => {
        console.log("Starting the scene...");
        menuComponent.style.display = "none";
        canvas.style.display = "block";
        const engine: BABYLON.Engine = new BABYLON.Engine(canvas, true);
        const scene: BABYLON.Scene = new BABYLON.Scene(engine);

        const camera: BABYLON.ArcRotateCamera = new BABYLON.ArcRotateCamera(
            "Camera",
            Math.PI / 2,
            Math.PI / 4,
            10,
            BABYLON.Vector3.Zero(),
            scene
        );
        camera.attachControl(canvas, true);

        const light: BABYLON.HemisphericLight = new BABYLON.HemisphericLight(
            "light",
            new BABYLON.Vector3(1, 1, 0),
            scene
        );

        BABYLON.SceneLoader.AppendAsync("/models/sky.glb", "", scene).then(() => {
            console.log("Skybox loaded successfully.");
        }).catch((error) => {
            console.error("Error loading skybox:", error);
        });



        engine.runRenderLoop(() => {
            scene.render();
        });

        window.addEventListener("resize", () => {
            engine.resize();
        });
    });
});

new App();