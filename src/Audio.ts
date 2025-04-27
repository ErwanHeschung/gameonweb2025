import * as BABYLON from "@babylonjs/core";

export function addMusic(scene: BABYLON.Scene): void {
    new BABYLON.Sound(
        "BackgroundMusic",
        "/music/background.mp3",
        scene,
        null,
        {
            loop: true,
            autoplay: true,
            volume: 0.5,
        }
    );
}