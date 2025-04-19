import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import * as BABYLON from "@babylonjs/core";

window.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement | null;
    if (!canvas) {
        console.error("Canvas not found!");
        return;
    }

    // Initialize Babylon.js engine and scene
    const engine = new BABYLON.Engine(canvas, true);
    const scene = new BABYLON.Scene(engine);

    // Create and configure the camera
    const camera = new BABYLON.ArcRotateCamera(
        "Camera",
        Math.PI / 2,
        Math.PI / 4,
        10,
        BABYLON.Vector3.Zero(),
        scene
    );
    camera.attachControl(canvas, true);

    // Add a hemispheric light to the scene
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);

    // Load external assets and set up the scene
    initWorld(scene);
    addSkybox(scene);
    addMusic(scene);

    // Start the render loop
    engine.runRenderLoop(() => {
        scene.render();
    });

    // Handle window resize events
    window.addEventListener("resize", () => {
        engine.resize();
    });
});

function addMusic(scene: BABYLON.Scene) {
    const backgroundMusic = new BABYLON.Sound(
        "BackgroundMusic",
        "/music/background.mp3",
        scene,
        null,
        {
            loop: true,
            autoplay: true,
            volume: 0.5
        }
    );
}

function addSkybox(scene: BABYLON.Scene) {
    BABYLON.SceneLoader.AppendAsync("/models/sky.glb", "", scene)
        .then(() => {
            const skybox = scene.getMeshByName("Skybox") as BABYLON.Mesh;
            if (skybox) {
                skybox.position = BABYLON.Vector3.Zero();
                const scaleFactor = 2;
                skybox.scaling = new BABYLON.Vector3(scaleFactor, scaleFactor, scaleFactor);
                console.log("Skybox loaded and scaled.");
            } else {
                console.error("Skybox not found. Check mesh names.");
            }
        })
        .catch((error) => {
            console.error("Error loading skybox:", error);
        });
}

function initWorld(scene: BABYLON.Scene) {
    BABYLON.SceneLoader.AppendAsync("/models/world.glb", "", scene)
        .then(() => {
            console.log("World loaded successfully.");
        })
        .catch((error) => {
            console.error("Error loading world:", error);
        });
}