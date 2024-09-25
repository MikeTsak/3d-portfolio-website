import * as THREE from 'three';

export const setupLighting = (scene) => {
  // Ambient light for general illumination
  const ambientLight = new THREE.AmbientLight(0xffffff, 2); // Brighter ambient light
  scene.add(ambientLight);

  // Directional light to simulate sunlight
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5); // Adjust intensity if needed
  directionalLight.position.set(0, 50, 50); // Position above and to the side
  directionalLight.castShadow = true;

  // Configure the shadow camera (so the shadow covers a large area like the plane)
  const shadowSize = 100; // Increase to cover the whole plane
  directionalLight.shadow.camera.left = -shadowSize;
  directionalLight.shadow.camera.right = shadowSize;
  directionalLight.shadow.camera.top = shadowSize;
  directionalLight.shadow.camera.bottom = -shadowSize;

  directionalLight.shadow.camera.near = 1; // Near plane for shadow rendering
  directionalLight.shadow.camera.far = 100; // Far plane for shadow rendering

  // Increase shadow map resolution for better quality
  directionalLight.shadow.mapSize.width = 2048;  // Default is 512, increase for better shadows
  directionalLight.shadow.mapSize.height = 2048;

  // Add the directional light to the scene
  scene.add(directionalLight);
};
