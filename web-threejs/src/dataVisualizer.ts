import * as THREE from "three";
import { scene } from "./core";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

const SPHERE_RADIUS = 0.4;
const DATA_SCALE = 1;

export function visualizeDataPoints(x: number, y: number, z: number, labelText: string = " ") {
	// Sphere
	const geometry = new THREE.SphereGeometry(SPHERE_RADIUS, 32, 32);
	const material = new THREE.MeshNormalMaterial();
	const sphere = new THREE.Mesh(geometry, material);
	sphere.position.set((x - 25) * DATA_SCALE, (y - 10) * DATA_SCALE, (z - 25) * DATA_SCALE);
	scene.add(sphere);

	// Text
	const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

	const fontLoader = new FontLoader();
	fontLoader.load("node_modules/three/examples/fonts/helvetiker_regular.typeface.json", (font) => {
		const textLabelGeometry = new TextGeometry(labelText, {
			font: font,
			size: 0.7,
			depth: 0.01
		});
		const textLabelMesh = new THREE.Mesh(textLabelGeometry, textMaterial);
		textLabelGeometry.computeBoundingBox();
		const textLabelWidth = textLabelGeometry!.boundingBox!.max.x - textLabelGeometry!.boundingBox!.min.x;
		textLabelMesh.position.set(
			sphere.position.x - textLabelWidth / 2,
			sphere.position.y + SPHERE_RADIUS + 0.2,
			sphere.position.z - 0.1
		);
		scene.add(textLabelMesh);

		const textCoordGeometry = new TextGeometry(`${x}, ${y}, ${z}`, {
			font: font,
			size: 0.3,
			depth: 0.01
		});
		const textCoordMesh = new THREE.Mesh(textCoordGeometry, textMaterial);
		textCoordGeometry.computeBoundingBox();
		const textCoordWidth = textCoordGeometry!.boundingBox!.max.x - textCoordGeometry!.boundingBox!.min.x;
		textCoordMesh.position.set(
			sphere.position.x - textCoordWidth / 2,
			sphere.position.y - SPHERE_RADIUS * 2,
			sphere.position.z - 0.1
		);
		scene.add(textCoordMesh);
	});
}
