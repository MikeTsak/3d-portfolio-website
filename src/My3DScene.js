import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const My3DScene = () => {
  const mountRef = useRef(null);
  const carModelRef = useRef(null); // Use a ref for the car model to avoid re-rendering issues
  const cameraTargetRef = useRef(new THREE.Vector3()); // To store the car's actual position for smooth camera follow
  const velocity = { forward: 0, turn: 0 }; // Track movement velocity and turning
  let time = 0; // Track time for bounce animation

  const speed = 0.1; // Speed of forward/backward movement
  const turnSpeed = 0.05; // Speed of turning
  const bounceSpeed = 2; // Speed of the bounce
  const bounceHeight = 0.05; // Height of the bounce
  const tiltFactor = 0.02; // How much the car tilts when accelerating/braking
  const cameraLerpSpeed = 0.05; // Speed of camera follow delay

  useEffect(() => {
    const scene = new THREE.Scene();

    // Set background color for the "sky"
    scene.background = new THREE.Color(0x87CEEB); // Light blue, like a daytime sky

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    // Enable shadows in the renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true; // Enable shadows in the renderer
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Optional: for softer shadows
    mountRef.current.appendChild(renderer.domElement);

    // Add basic ambient and directional lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 2); // Brighter ambient light
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(50, 100, 100).normalize();
    directionalLight.castShadow = true; // Enable shadows for this light

    // Configure shadow properties for the directional light
    directionalLight.shadow.mapSize.width = 1024;  // Higher is better for shadow resolution
    directionalLight.shadow.mapSize.height = 1024; // Higher is better for shadow resolution
    directionalLight.shadow.camera.near = 0.5; // Adjust near and far planes for the light's camera
    directionalLight.shadow.camera.far = 50;   // Adjust far plane distance

    scene.add(directionalLight);

    // Add a simple ground plane (the floor)
    const planeGeometry = new THREE.PlaneGeometry(200, 200);
    const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 }); // Forest green color for the ground
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2; // Make the plane flat on the x-z plane
    plane.position.y = -1; // Position it just below the car
    plane.receiveShadow = true; // Enable the plane to receive shadows
    scene.add(plane);

    // Load the DeLorean model
    const loader = new GLTFLoader();
    loader.load('/delorian.glb', (gltf) => {
      const car = gltf.scene;
      car.scale.set(0.5, 0.5, 0.5); // Scale the model if needed

      // Rotate the car 90 degrees around the Y-axis to face forward
      car.rotation.y = -Math.PI / 2; // Rotate 90 degrees around the Y-axis

      car.position.set(0, 0, 0); // Place the car in the center
      car.castShadow = true; // Enable shadow casting for the car

      // Traverse through the car model to enable shadow casting for all its children
      car.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true; // Optional: if any parts should receive shadows
        }
      });

      scene.add(car);
      carModelRef.current = car; // Use ref to store the car model
      cameraTargetRef.current.copy(car.position); // Set initial camera target to car position
    }, undefined, (error) => {
      console.error('Error loading model:', error); // Log any errors during loading
    });

    // Handle keyboard input for movement
    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'w':
          velocity.forward = speed; // Move forward
          break;
        case 's':
          velocity.forward = -speed; // Move backward
          break;
        case 'a':
          velocity.turn = turnSpeed; // Turn left
          break;
        case 'd':
          velocity.turn = -turnSpeed; // Turn right
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (event) => {
      switch (event.key) {
        case 'w':
        case 's':
          velocity.forward = 0; // Stop moving forward/backward
          break;
        case 'a':
        case 'd':
          velocity.turn = 0; // Stop turning
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Render the scene
    const animate = () => {
      requestAnimationFrame(animate);

      if (carModelRef.current) {
        // Rotate the car based on the turn velocity
        carModelRef.current.rotation.y += velocity.turn;

        // Move the car forward or backward in the direction it is facing
        carModelRef.current.translateZ(velocity.forward);

        // Add a subtle bounce effect to the car
        time += bounceSpeed * 0.01; // Increment time to create bounce oscillation
        const bounce = Math.sin(time) * bounceHeight; // Calculate bounce based on time
        carModelRef.current.position.y = bounce; // Apply bounce to car's y position

        // Tilt the car based on acceleration (tilt backward on forward acceleration, forward on reverse)
        const tilt = -velocity.forward * tiltFactor; // Negative tilt for forward, positive for reverse
        carModelRef.current.rotation.x = tilt; // Apply the tilt effect

        // Smooth camera follow with slight delay
        const carPosition = carModelRef.current.position.clone();
        const carDirection = new THREE.Vector3();
        carModelRef.current.getWorldDirection(carDirection); // Get the direction the car is facing

        // Calculate the desired camera position (behind and slightly above the car)
        const targetCameraPosition = carPosition.clone().add(carDirection.clone().multiplyScalar(-10)).setY(5);

        // Smoothly interpolate the camera's current position to the target position
        camera.position.lerp(targetCameraPosition, cameraLerpSpeed); // Interpolate with a smooth delay

        // Make the camera look at the car
        cameraTargetRef.current.lerp(carPosition, cameraLerpSpeed); // Smoothly follow the car
        camera.lookAt(cameraTargetRef.current); // Make the camera look at the car's new position
      }

      renderer.render(scene, camera);
    };

    animate(); // Start the animation loop

    // Clean up when component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []); // Empty dependency array ensures the effect runs once

  return <div ref={mountRef} style={{ width: '100vw', height: '100vh' }}></div>;
};

export default My3DScene;
