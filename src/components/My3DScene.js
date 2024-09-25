import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { setupLighting } from '../utils/Lighting';
import { createGroundPlane } from '../utils/Plane';
import { createSmokeSystem, emitSmoke, updateSmokeParticles } from '../utils/SmokeSystem';
import { loadCarModel } from '../utils/CarLoader';
import { setupControls } from '../utils/Controls';
import nipplejs from 'nipplejs'; // For the joystick on mobile

const My3DScene = ({ mode }) => {
  const mountRef = useRef(null);
  const carModelRef = useRef(null); // To store car model
  const wheelsRef = useRef([]); // To store wheel objects
  const lightsRef = useRef([]); // To store any lights in the model
  const cameraTargetRef = useRef(new THREE.Vector3()); // For smooth camera follow
  const smokeParticles = useRef([]); // Store smoke particles
  const velocity = { forward: 0, turn: 0 }; // Track movement
  let joystickRef = useRef(null); // Store the joystick instance
  let time = 0; // For bounce animation

  const speed = 0.1; // Car speed
  const turnSpeed = 0.05; // Turning speed
  const cameraLerpSpeed = 0.05; // Smooth camera follow

  useEffect(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB); // Sky color

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);

    // Setup lighting
    setupLighting(scene);

    // Create and add ground plane
    const groundPlane = createGroundPlane();
    scene.add(groundPlane);

    // Load the car model (and capture wheels and lights)
    loadCarModel(scene, carModelRef, wheelsRef, lightsRef);

    // Create smoke system
    createSmokeSystem(scene, smokeParticles);

    // Setup controls based on mode and ensure cleanup is handled
    const cleanupControls = setupControls(mode === 'mobile', velocity, speed, turnSpeed);

    // Handle window resizing
    const onWindowResize = () => {
      // Update camera aspect ratio and renderer size when the window is resized
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    // Add the resize listener
    window.addEventListener('resize', onWindowResize);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      if (carModelRef.current) {
        carModelRef.current.rotation.y += velocity.turn; // Turn car
        carModelRef.current.translateZ(velocity.forward); // Move car

        // Smooth camera follow
        const carPosition = carModelRef.current.position.clone();
        const carDirection = new THREE.Vector3();
        carModelRef.current.getWorldDirection(carDirection);
        const targetCameraPosition = carPosition.clone().add(carDirection.clone().multiplyScalar(-10)).setY(5);

        // Ensure the camera is placed correctly on both desktop and mobile
        camera.position.lerp(targetCameraPosition, cameraLerpSpeed); // Smoothly follow the car
        cameraTargetRef.current.lerp(carPosition, cameraLerpSpeed); // Smoothly look at the car
        camera.lookAt(cameraTargetRef.current); // Make the camera look at the car

        // Render the scene
        renderer.render(scene, camera);
      }
    };

    animate(); // Start animation loop

    // Cleanup: remove resize listener, joystick, and controls when component unmounts
    return () => {
      window.removeEventListener('resize', onWindowResize);
      mountRef.current.removeChild(renderer.domElement);

      // Cleanup controls (joystick and keyboard events)
      cleanupControls();
    };
  }, [mode]); // Depend on mode to reload controls correctly

  return (
    <>
      <div ref={mountRef} style={{ width: '100vw', height: '100vh' }}></div>
      {mode === 'mobile' && (
        <div id="joystick-zone" style={{ position: 'absolute', left: '0', top: '0', width: '100%', height: '100%' }}></div>
      )}
    </>
  );
};

export default My3DScene;
