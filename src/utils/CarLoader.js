import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export const loadCarModel = (scene, carModelRef, cameraTargetRef) => {
  const loader = new GLTFLoader();
  loader.load('/delorian.glb', (gltf) => {
    const car = gltf.scene;
    car.scale.set(0.5, 0.5, 0.5);
    car.rotation.y = -Math.PI / 2;
    car.position.set(0, 0, 0);
    car.castShadow = true;
    car.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    scene.add(car);
    carModelRef.current = car;
    cameraTargetRef.current.copy(car.position);
  }, undefined, (error) => {
    console.error('Error loading model:', error);
  });
};
