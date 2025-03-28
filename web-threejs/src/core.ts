import * as THREE from "three";
import WebGL from "three/addons/capabilities/WebGL.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export let renderer: THREE.WebGLRenderer;
export let camera: THREE.PerspectiveCamera;
export let scene: THREE.Scene;
export let controls: OrbitControls;

export function initializeCore() {
	if (!WebGL.isWebGL2Available()) {
		const warning = WebGL.getWebGL2ErrorMessage();
		document.body.appendChild(warning);
		throw new Error("WebGL not supported");
	}

	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera.position.set(25, 10, 30);

	scene = new THREE.Scene();

	const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
	directionalLight.position.set(0, 10, 10);
	scene.add(directionalLight);

	controls = new OrbitControls(camera, renderer.domElement);
	controls.enableDamping = true;
	controls.dampingFactor = 0.05;

	window.addEventListener("resize", () => {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	});
}
