import * as THREE from 'three';

interface circleFactoryParams {
  color: number;
  r: number;
  z: number;
}

export const circleFactory = ({ color, r, z }: circleFactoryParams) => {
  const geometry = new THREE.CircleGeometry(r, 1024);

  const material = new THREE.MeshBasicMaterial({
    color: color,
  });
  const circle = new THREE.Mesh(geometry, material);

  circle.scale.set(0.01, 0.01, 0.01);
  circle.position.set(0, 0, -400 + 20 * z);

  return circle;
};
