import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export const loadCarModel = (scene, carModelRef, wheelsRef, lightsRef) => {
  const loader = new GLTFLoader();
  loader.load('/delorian.glb', (gltf) => {
    const car = gltf.scene;
    car.scale.set(0.5, 0.5, 0.5);
    car.rotation.y = -Math.PI / 2;
    car.position.set(0, 0, 0);
    car.castShadow = true;

    // Traverse through the model to find wheels and lights
    car.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }

      // Assuming the wheels are named or identifiable (e.g., 'wheel_front_left')
      if (child.name.includes('wheel')) {
        wheelsRef.current.push(child); // Add wheel to the wheelsRef
      }

      // Assuming the lights are identifiable in the model
      if (child.isLight) {
        lightsRef.current.push(child); // Add light to the lightsRef
      }
    });

    scene.add(car);
    carModelRef.current = car;
  }, undefined, (error) => {
    console.error('Error loading model:', error);
  });
};
