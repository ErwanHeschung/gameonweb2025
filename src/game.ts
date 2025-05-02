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
import { inputManager } from "./player/InputManager";


window.addEventListener("DOMContentLoaded", async () => {
    const splash = document.getElementById("splash");
    const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement | null;

    document.getElementById("layoutSelect")?.addEventListener("change", (e) => {
        const layout = (e.target as HTMLSelectElement).value;
        inputManager.setLayout(layout as "QWERTY" | "AZERTY");
    });

    if (!canvas) {
        console.error("Canvas not found!");
        return;
    }

    setTimeout(async () => {
        if (splash) {
            splash.style.transition = "opacity 1s";
            splash.style.opacity = "0";
            setTimeout(() => {
                splash.style.display = "none";
            }, 1000);
        }

        canvas.style.cursor = "none";
        canvas.addEventListener("click", () => {
            if (canvas.requestPointerLock) {
                canvas.requestPointerLock();
            }
        });

        const engine = new BABYLON.Engine(canvas, true);
        engine.displayLoadingUI = () => { };
        engine.hideLoadingUI();

        const scene = new BABYLON.Scene(engine);
        const ImportedAmmo = await Ammo.call({});
        scene.enablePhysics(new BABYLON.Vector3(0, -20, 0), new AmmoJSPlugin(true, ImportedAmmo));

        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);

        Promise.all([
            initWorld(scene),
            loadCharacter(scene, canvas, ImportedAmmo),
            addSkybox(scene)
        ])
            .then(() => {
                addMusic(scene);
                
                engine.runRenderLoop(() => {
                    updatePlayerMovement(scene);
                    scene.render();
                });
            })
            .catch(err => console.error("Fatal init error:", err));

        window.addEventListener("resize", () => {
            engine.resize();
        });

    }, 1500);
});

