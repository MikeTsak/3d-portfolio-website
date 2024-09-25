import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import nipplejs from 'nipplejs'; // Import nipplejs for the joystick
import { setupLighting } from '../utils/Lighting';
import { createGroundPlane } from '../utils/Plane';
import { createSmokeSystem, emitSmoke, updateSmokeParticles } from '../utils/SmokeSystem';
import { loadCarModel } from '../utils/CarLoader';
import { setupControls } from '../utils/Controls';

const My3DScene = () => {
  const mountRef = useRef(null);
  const carModelRef = useRef(null); // To store car model
  const cameraTargetRef = useRef(new THREE.Vector3()); // For smooth camera follow
  const smokeParticles = useRef([]); // Store smoke particles
  const velocity = { forward: 0, turn: 0 }; // Track movement
  let time = 0; // For bounce animation

  const [isMobile, setIsMobile] = useState(false); // Detect mobile devices

  const speed = 0.1; // Car speed
  const turnSpeed = 0.05; // Turning speed
  const bounceSpeed = 2; // Bounce speed
  const bounceHeight = 0.05; // Bounce height
  const tiltFactor = 0.02; // Tilt based on acceleration
  const cameraLerpSpeed = 0.05; // Smooth camera follow

  useEffect(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB); // Sky color

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);

    // Detect if mobile
    const isMobileDevice = /Mobi|Android/i.test(navigator.userAgent);
    setIsMobile(isMobileDevice);

    // Setup scene components
    setupLighting(scene); // Add lighting
    const groundPlane = createGroundPlane(); // Create ground plane
    scene.add(groundPlane);

    // Load the car model
    loadCarModel(scene, carModelRef, cameraTargetRef);

    // Create smoke system
    createSmokeSystem(scene, smokeParticles);

    // Setup controls (keyboard & joystick)
    setupControls(isMobileDevice, velocity, speed, turnSpeed);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      if (carModelRef.current) {
        carModelRef.current.rotation.y += velocity.turn; // Turn car
        carModelRef.current.translateZ(velocity.forward); // Move car

        // Bounce effect
        time += bounceSpeed * 0.01;
        const bounce = Math.sin(time) * bounceHeight;
        carModelRef.current.position.y = bounce;

        // Tilt effect based on acceleration
        const tilt = -velocity.forward * tiltFactor;
        carModelRef.current.rotation.x = tilt;

        // Emit and update smoke
        if (velocity.forward > 0) emitSmoke(carModelRef, smokeParticles);
        updateSmokeParticles(smokeParticles);

        // Smooth camera follow
        const carPosition = carModelRef.current.position.clone();
        const carDirection = new THREE.Vector3();
        carModelRef.current.getWorldDirection(carDirection);
        const targetCameraPosition = carPosition.clone().add(carDirection.clone().multiplyScalar(-10)).setY(5);
        camera.position.lerp(targetCameraPosition, cameraLerpSpeed);
        cameraTargetRef.current.lerp(carPosition, cameraLerpSpeed);
        camera.lookAt(cameraTargetRef.current);
      }

      renderer.render(scene, camera);
    };

    animate(); // Start animation

    // Cleanup when component unmounts
    return () => {
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <>
      <div ref={mountRef} style={{ width: '100vw', height: '100vh' }}></div>
      {isMobile && <div id="joystick-zone" style={{ position: 'absolute', left: '0', top: '0', width: '100%', height: '100%' }}></div>}
    </>
  );
};

export default My3DScene;
