import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import * as BABYLON from "@babylonjs/core";
import { AmmoJSPlugin } from "@babylonjs/core";
import Ammo from 'ammojs-typed'
import { initWorld } from "./World";
import { addSkybox } from "./Skybox";
import { addMusic } from "./Audio";
import { loadCharacter, updatePlayerMovement } from "./player/Player";


window.addEventListener("DOMContentLoaded", async () => {
    
    const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement | null;
    if (!canvas) {
        console.error("Canvas not found!");
        return;
    }

    canvas.style.cursor = "none";
    canvas.addEventListener("click", () => {
        if (canvas.requestPointerLock) {
            canvas.requestPointerLock();
        }
    });

    const engine = new BABYLON.Engine(canvas, true);
    const scene = new BABYLON.Scene(engine);

    const ImportedAmmo = await Ammo.call({});
    scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new AmmoJSPlugin(true, ImportedAmmo));

    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);
    addMusic(scene);

    Promise.all([
        initWorld(scene),
        loadCharacter(scene, canvas,ImportedAmmo),
        addSkybox(scene)
    ])
        .then(() => {
            scene.debugLayer.show();
            engine.runRenderLoop(() => {
                updatePlayerMovement(scene);
                scene.render();
            });
        })
        .catch(err => console.error("Fatal init error:", err));

    window.addEventListener("resize", () => {
        engine.resize();
    });
});