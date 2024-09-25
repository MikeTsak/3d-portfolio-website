import * as THREE from 'three';

export const createSmokeSystem = (scene, smokeParticles) => {
  const smokeTexture = new THREE.TextureLoader().load('/path/to/smoke-texture.png');
  const smokeGeometry = new THREE.PlaneGeometry(0.5, 0.5);
  const smokeMaterial = new THREE.MeshBasicMaterial({
    map: smokeTexture,
    transparent: true,
    opacity: 0.5,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  for (let i = 0; i < 200; i++) {
    const smokeParticle = new THREE.Mesh(smokeGeometry, smokeMaterial);
    smokeParticle.position.set(0, 0, 0);
    smokeParticle.visible = false;
    smokeParticles.current.push(smokeParticle);
    scene.add(smokeParticle);
  }
};

export const emitSmoke = (carModelRef, smokeParticles) => {
  const activeParticles = smokeParticles.current.filter(p => !p.visible);
  if (activeParticles.length > 0) {
    const smoke = activeParticles[0];
    smoke.position.set(carModelRef.current.position.x, carModelRef.current.position.y - 0.5, carModelRef.current.position.z - 1.5);
    smoke.visible = true;
    smoke.scale.set(0.1, 0.1, 0.1);
    smoke.material.opacity = 0.8;
    smoke.life = 0;
  }
};

export const updateSmokeParticles = (smokeParticles) => {
  smokeParticles.current.forEach((particle) => {
    if (particle.visible) {
      particle.position.y += 0.02;
      particle.scale.multiplyScalar(1.02);
      particle.material.opacity -= 0.02;
      particle.life += 0.01;
      if (particle.material.opacity <= 0 || particle.life > 2) {
        particle.visible = false;
      }
    }
  });
};
