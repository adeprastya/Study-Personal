import { initializeCore, renderer, scene, camera, controls } from "./core";
import { createGrid } from "./grid";
import { visualizeDataPoints } from "./dataVisualizer";
import { initializeCameraControls, updateCameraPosition } from "./cameraControl";
import { data } from "./dummyData";

function initializeApplication(): void {
	initializeCore();

	createGrid(50, 50, -10);
	data.forEach(([x, y, z], i) => visualizeDataPoints(x, y, z, i.toString()));

	initializeCameraControls();
}

function animate(): void {
	requestAnimationFrame(animate);
	controls.update();
	updateCameraPosition();
	renderer.render(scene, camera);
}

initializeApplication();
animate();
