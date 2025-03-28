import * as THREE from "three";
import { scene } from "./core";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

export function createGrid(size = 10, divisions = 10, y = 0): void {
	// Grid
	const gridGeometry = new THREE.BufferGeometry();
	const gridMaterial = new THREE.LineBasicMaterial({ color: 0x777777 });
	const points: THREE.Vector3[] = [];

	const step = size / divisions;
	const halfSize = size / 2;

	for (let i = 0; i <= divisions; i++) {
		const horizontal1 = -halfSize + i * step;
		points.push(new THREE.Vector3(horizontal1, y, -halfSize));
		points.push(new THREE.Vector3(horizontal1, y, halfSize));

		const horizontal2 = -halfSize + i * step;
		points.push(new THREE.Vector3(-halfSize, y, horizontal2));
		points.push(new THREE.Vector3(halfSize, y, horizontal2));

		const vertical1 = y + i * step;
		points.push(new THREE.Vector3(-halfSize, vertical1, -halfSize));
		points.push(new THREE.Vector3(-halfSize, vertical1, halfSize));

		const vertical2 = halfSize - i * step;
		points.push(new THREE.Vector3(-halfSize, -halfSize - y * 1.5, vertical2));
		points.push(new THREE.Vector3(-halfSize, halfSize - y * 1.5, vertical2));

		const vertical3 = halfSize - i * step;
		points.push(new THREE.Vector3(vertical3, -halfSize - y * 1.5, -halfSize));
		points.push(new THREE.Vector3(vertical3, halfSize - y * 1.5, -halfSize));

		const vertical4 = y + i * step;
		points.push(new THREE.Vector3(-halfSize, vertical4, -halfSize));
		points.push(new THREE.Vector3(halfSize, vertical4, -halfSize));
	}

	gridGeometry.setFromPoints(points);
	const grid = new THREE.LineSegments(gridGeometry, gridMaterial);
	scene.add(grid);

	// Coord Text
	const textMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
	const fontLoader = new FontLoader();
	fontLoader.load("node_modules/three/examples/fonts/helvetiker_regular.typeface.json", (font) => {
		for (let i = 0; i <= divisions; i++) {
			const xTextGeometry = new TextGeometry(`${i * step}`, {
				font: font,
				size: 0.4,
				depth: 0.01
			});
			const xTextMesh = new THREE.Mesh(xTextGeometry, textMaterial);
			xTextGeometry.computeBoundingBox();
			const xTextWidth = xTextGeometry!.boundingBox!.max.x - xTextGeometry!.boundingBox!.min.x;
			xTextMesh.position.set(-halfSize + i * step - xTextWidth / 2, y + 0.5, halfSize);
			scene.add(xTextMesh);

			const yTextGeometry = new TextGeometry(`${i * step}`, {
				font: font,
				size: 0.4,
				depth: 0.01
			});
			const yTextMesh = new THREE.Mesh(yTextGeometry, textMaterial);
			yTextGeometry.computeBoundingBox();
			const yTextWidth = yTextGeometry!.boundingBox!.max.x - yTextGeometry!.boundingBox!.min.x;
			yTextMesh.position.set(-halfSize - yTextWidth / 2, -halfSize / 2 + i * step + 2, halfSize);
			scene.add(yTextMesh);

			const zTextGeometry = new TextGeometry(`${i * step}`, {
				font: font,
				size: 0.4,
				depth: 0.01
			});
			const zTextMesh = new THREE.Mesh(zTextGeometry, textMaterial);
			zTextGeometry.computeBoundingBox();
			const zTextWidth = zTextGeometry!.boundingBox!.max.x - zTextGeometry!.boundingBox!.min.x;
			zTextMesh.position.set(-halfSize - zTextWidth / 2, y + 0.5, -halfSize - i * -step);
			scene.add(zTextMesh);
		}
	});
}
