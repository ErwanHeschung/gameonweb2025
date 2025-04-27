import * as BABYLON from "@babylonjs/core";
import { inputManager } from "./InputManager";

export let playerMesh: BABYLON.Mesh | null = null;

const mouseSensitivity = 0.005;
let playerYaw = 0;
let currentAnimationName = "";
const animationGroups: { [key: string]: BABYLON.AnimationGroup } = {};

let previousAnimation: BABYLON.AnimationGroup | null = null;
let animationTransitionDuration = 0.3;
let animationTransitionElapsed = 0;
let isTransitioning = false;
let isJumping = false;

export function setupMouseRotation(canvas: HTMLCanvasElement) {
    canvas.onclick = () => {
        canvas.requestPointerLock();
    };
    canvas.addEventListener("pointermove", (e) => {
        if (document.pointerLockElement === canvas) {
            const deltaX = e.movementX;
            playerYaw += deltaX * mouseSensitivity;

            if (playerMesh) {
                playerMesh.rotation.y = playerYaw;
            }
        }
    });
}

export function loadCharacter(scene: BABYLON.Scene, canvas: HTMLCanvasElement, Ammo: any): Promise<void> {
    return BABYLON.SceneLoader.ImportMeshAsync(
        "", "/models/character/", "character.glb", scene
    ).then((result) => {
        result.animationGroups.forEach((animGroup) => {
            const animName = animGroup.name.toLowerCase();
            console.log(`🎞️ Animation Group Name: ${animName}`);
            animationGroups[animName] = animGroup;
        });

        const visualMeshes = result.meshes.filter(
            mesh => mesh instanceof BABYLON.Mesh && mesh.isVisible && mesh.getTotalVertices() > 0
        ) as BABYLON.Mesh[];

        if (visualMeshes.length === 0) {
            throw new Error("No visible meshes found in character.glb");
        }

        let min = new BABYLON.Vector3(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
        let max = new BABYLON.Vector3(Number.MIN_VALUE, Number.MIN_VALUE, Number.MIN_VALUE);
        visualMeshes.forEach(mesh => {
            const bounding = mesh.getBoundingInfo();
            const worldMatrix = mesh.getWorldMatrix();
            const meshMin = BABYLON.Vector3.TransformCoordinates(bounding.minimum, worldMatrix);
            const meshMax = BABYLON.Vector3.TransformCoordinates(bounding.maximum, worldMatrix);
            min = BABYLON.Vector3.Minimize(min, meshMin);
            max = BABYLON.Vector3.Maximize(max, meshMax);
        });
        const size = max.subtract(min);
        const center = min.add(size.scale(0.5));

        const colliderHeight = size.y;
        const collider = BABYLON.MeshBuilder.CreateBox("PlayerCollider", {
            width: 1.5,
            height: 4,
            depth: 1.5
        }, scene);

        collider.position = new BABYLON.Vector3(center.x, min.y + colliderHeight / 2, center.z);
        collider.isVisible = false;
        collider.physicsImpostor = new BABYLON.PhysicsImpostor(
            collider,
            BABYLON.PhysicsImpostor.BoxImpostor,
            { mass: 1, restitution: 0.1, friction: 1 },
            scene
        );
        const body = collider.physicsImpostor.physicsBody;
        if (body) {
            const freezeAll = new Ammo.btVector3(0, 0, 0);
            body.setAngularFactor(freezeAll);
        }
        playerMesh = collider;
        setupMouseRotation(canvas);
        const visualContainer = new BABYLON.TransformNode("VisualContainer", scene);
        visualMeshes.forEach(mesh => {
            const worldMatrix = mesh.getWorldMatrix().clone();
            const pos = new BABYLON.Vector3();
            const rot = new BABYLON.Quaternion();
            const scale = new BABYLON.Vector3();
            worldMatrix.decompose(scale, rot, pos);
            mesh.setParent(null);
            mesh.position = pos.subtract(collider.position);
            mesh.position.y += 5.5;
            mesh.rotationQuaternion = null;
            mesh.rotation = rot.toEulerAngles();
            mesh.scaling = scale.scale(0.3);
            mesh.isPickable = false;
            mesh.setParent(visualContainer);
        });

        visualContainer.parent = collider;

        const cam = new BABYLON.UniversalCamera("ThirdPersonCam", playerMesh.position.clone(), scene);
        cam.speed = 0;
        scene.activeCamera = cam;


        scene.onBeforeRenderObservable.add(() => {
            if (!playerMesh) return;

            if (playerMesh.position.y < -20) {
                playerMesh.physicsImpostor!.setLinearVelocity(BABYLON.Vector3.Zero());
                playerMesh.position = new BABYLON.Vector3(0, 5, 0);
            }

            visualContainer.rotation.y = +playerYaw;

            const camOffset = new BABYLON.Vector3(
                Math.sin(playerYaw + Math.PI) * 10,
                4,
                Math.cos(playerYaw + Math.PI) * 10
            );
            cam.position = playerMesh.position.add(camOffset);
            cam.setTarget(playerMesh.position.add(new BABYLON.Vector3(0, 2, 0)));

            if (isTransitioning && previousAnimation && animationGroups[currentAnimationName]) {
                animationTransitionElapsed += scene.getEngine().getDeltaTime() / 1000; // time in seconds
                let alpha = animationTransitionElapsed / animationTransitionDuration;
                if (alpha >= 1) {
                    alpha = 1;
                    previousAnimation.stop();
                    previousAnimation = null;
                    isTransitioning = false;
                }

                const currentAnimGroup = animationGroups[currentAnimationName]!;
                currentAnimGroup.setWeightForAllAnimatables(alpha);
                previousAnimation?.setWeightForAllAnimatables(1.0 - alpha);
            }
        });

        console.log("Character loaded with dynamic box collider.");
    }).catch((error) => {
        console.error("Error loading character:", error);
    });
}

export function updatePlayerMovement(scene: BABYLON.Scene): void {
    if (!playerMesh) return;
    const impostor = playerMesh.physicsImpostor;
    if (!impostor) return;

    const moveSpeed = 10;
    const currentVel = impostor.getLinearVelocity() ?? BABYLON.Vector3.Zero();

    const forward = new BABYLON.Vector3(
        Math.sin(playerYaw),
        0,
        Math.cos(playerYaw)
    );
    const right = new BABYLON.Vector3(forward.z, 0, -forward.x);
    let move = BABYLON.Vector3.Zero();

    if (inputManager.isKeyPressed("z")) move = move.add(forward);
    if (inputManager.isKeyPressed("s")) move = move.subtract(forward);
    if (inputManager.isKeyPressed("d")) move = move.add(right);
    if (inputManager.isKeyPressed("q")) move = move.subtract(right);

    let newYVelocity = currentVel.y;

    const rayOrigin = playerMesh.position.clone();
    const rayLength = 5;
    const ray = new BABYLON.Ray(rayOrigin, new BABYLON.Vector3(0, -1, 0), rayLength);

    const rayHit = scene.pickWithRay(ray, (mesh) => {
        return mesh !== playerMesh && mesh.isPickable;
    });

    const isOnGround = rayHit?.hit ?? false;

    if (inputManager.isKeyPressed(" ") && isOnGround) {
        newYVelocity = 7;
    }

    if (inputManager.isKeyPressed(" ") && isOnGround) {
        playAnimation("jump", false);
    }
    if (!isJumping) {
        if (move.lengthSquared() > 0) {
            playAnimation("running");
        } else {
            playAnimation("idle");
        }
    }

    if (move.lengthSquared() > 0) {
        move = move.normalize().scale(moveSpeed);
    }

    impostor.setLinearVelocity(new BABYLON.Vector3(move.x, newYVelocity, move.z));
}

function playAnimation(name: string, loop: boolean = true) {
    if (currentAnimationName === name) return;

    const newAnim = animationGroups[name];
    if (!newAnim) {
        console.warn(`Animation ${name} not found.`);
        return;
    }

    if (name === "jump" && !loop) {
        isJumping = true;

        newAnim.onAnimationGroupEndObservable.addOnce(() => {
            newAnim.pause();
            isJumping = false;
        });
    }   

    if (previousAnimation) {
        previousAnimation.stop();
    }

    previousAnimation = animationGroups[currentAnimationName] || null;
    currentAnimationName = name;

    newAnim.reset();
    newAnim.play(loop); 
    newAnim.setWeightForAllAnimatables(0);

    animationTransitionElapsed = 0;
    isTransitioning = true;

    if (name === "jump" && !loop) {
        newAnim.onAnimationGroupEndObservable.addOnce(() => {
            newAnim.pause();
        });
    }
}