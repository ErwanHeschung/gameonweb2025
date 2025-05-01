import * as BABYLON from "@babylonjs/core";

export function initWorld(scene: BABYLON.Scene): Promise<void> {
    return BABYLON.SceneLoader.AppendAsync("/models/world.glb", "", scene)
        .then(() => {
            scene.debugLayer.show();

            scene.meshes.forEach((mesh) => {
                if (!mesh.physicsImpostor && mesh.getTotalVertices() > 0) {

                    if (mesh.getTotalVertices() > 1500) {
                        console.warn(`Skipping physics for ${mesh.name} – too many vertices: ${mesh.getTotalVertices()}`);
                        return;
                    }
                    mesh.setParent(null, true);
                    mesh.physicsImpostor = new BABYLON.PhysicsImpostor(
                        mesh,
                        BABYLON.PhysicsImpostor.MeshImpostor,
                        { mass: 0, restitution: 0.1, friction: 0.9 },
                        scene
                    );

                    console.log(`Physics added to: ${mesh.name}`);
                }
            });

            console.log("World loaded successfully!");
        })
        .catch((error) => {
            console.error("Error loading world:", error);
        });
}