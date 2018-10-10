import * as THREE from 'three';

export const blackBarsFactory = (offsetX: number, index: number) => {
  const geometry = new THREE.PlaneBufferGeometry(1024, 8, 1, 1);
  const material = new THREE.MeshBasicMaterial({
    color: 0x212121,
    fog: false,
    transparent: true,
    opacity: 1,
  });

  const lines = new THREE.Object3D();
  const split = 6;
  for (let i = 0; i < split; i++) {
    const line = new THREE.Mesh(geometry, material);
    line.position.set(i * 50 - 112 + offsetX, 0, -400 + index);
    line.rotateZ(Math.PI / 3);
    lines.add(line);
  }

  return lines;
};
