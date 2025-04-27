import * as BABYLON from "@babylonjs/core";

export function initWorld(scene: BABYLON.Scene): Promise<void> {
    return BABYLON.SceneLoader.AppendAsync("/models/world.glb", "", scene)
        .then((add) => {

            const world = scene.getTransformNodeByName("world");
            if (world) {
                world.getChildMeshes().forEach((mesh) => {
                    if (!mesh.physicsImpostor && mesh.getTotalVertices() > 0) {
                        const worldMatrix = mesh.getWorldMatrix().clone();
                        const pos = new BABYLON.Vector3();
                        const rot = new BABYLON.Quaternion();
                        const scale = new BABYLON.Vector3();
                        worldMatrix.decompose(scale, rot, pos);

                        //clear parent to avoid impostor issues
                        mesh.setParent(null);
                        mesh.position = pos;
                        mesh.scaling = scale;
                        mesh.rotationQuaternion = rot;

                        // Apply physics
                        mesh.physicsImpostor = new BABYLON.PhysicsImpostor(
                            mesh,
                            BABYLON.PhysicsImpostor.MeshImpostor,
                            { mass: 0, restitution: 0.1, friction: 0.9 },
                            scene
                        );

                        console.log(`Physics added to: ${mesh.name}`);
                    }
                });
            }
            console.log("World loaded successfully!");
        })
        .catch((error) => {
            console.error("Error loading world:", error);
        });
}