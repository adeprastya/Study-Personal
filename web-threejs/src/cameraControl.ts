import * as THREE from "three";
import { camera } from "./core";

const MOVE_SPEED = 0.5;
const keysPressed: Record<string, boolean> = {};

export function initializeCameraControls(): void {
	window.addEventListener("keydown", (e) => (keysPressed[e.key.toLowerCase()] = true));
	window.addEventListener("keyup", (e) => (keysPressed[e.key.toLowerCase()] = false));
}

export function updateCameraPosition(): void {
	const forward = new THREE.Vector3();
	camera.getWorldDirection(forward);
	forward.y = 0;
	forward.normalize();

	const right = new THREE.Vector3();
	right.crossVectors(camera.up, forward).normalize();

	if (keysPressed["w"] || keysPressed["arrowup"]) camera.position.add(forward.multiplyScalar(MOVE_SPEED));
	if (keysPressed["s"] || keysPressed["arrowdown"]) camera.position.add(forward.multiplyScalar(-MOVE_SPEED));
	if (keysPressed["a"] || keysPressed["arrowleft"]) camera.position.add(right.multiplyScalar(MOVE_SPEED));
	if (keysPressed["d"] || keysPressed["arrowright"]) camera.position.add(right.multiplyScalar(-MOVE_SPEED));
}
