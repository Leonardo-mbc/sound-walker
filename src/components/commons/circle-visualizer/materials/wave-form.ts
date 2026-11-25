import * as THREE from 'three';

export const waveFormFactory = () => {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(1024 * 3);

  for (let i = 0; i < 1024; i++) {
    positions[i * 3] = i;
    positions[i * 3 + 1] = 0;
    positions[i * 3 + 2] = 0;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.LineBasicMaterial();
  material.color.setHex(0x9fd7ff, THREE.LinearSRGBColorSpace);

  const spectrum = new THREE.Line(geometry, material);
  spectrum.position.set(0, 0, 8);
  spectrum.frustumCulled = false;

  return spectrum;
};
