import * as BABYLON from "@babylonjs/core";

export function addSkybox(scene: BABYLON.Scene): Promise<void> {
    return BABYLON.SceneLoader.AppendAsync("/models/sky.glb", "", scene)
        .then(() => {
            const skybox = scene.getMeshByName("Skybox") as BABYLON.Mesh;
            if (skybox) {
                skybox.position = BABYLON.Vector3.Zero();
                const scaleFactor = 2; // Adjust as needed.
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