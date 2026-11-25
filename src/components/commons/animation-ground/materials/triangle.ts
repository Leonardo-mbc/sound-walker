import * as THREE from 'three';

interface TriangleFactoryParams {
  index: number;
  color: number;
  offsetX: number;
  offsetY: number;
}

export const triangleFactory = ({
  index,
  color,
  offsetX,
  offsetY,
}: TriangleFactoryParams) => {
  const geometry = new THREE.BufferGeometry();
  const vertices = new Float32Array([
    0,
    200,
    index,
    -400.0 / Math.sqrt(3),
    -200,
    index,
    400.0 / Math.sqrt(3),
    -200,
    index,
  ]);
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

  const material = new THREE.MeshBasicMaterial({
    color: color,
  });
  const triangle = new THREE.Mesh(geometry, material);

  triangle.position.set(0 + offsetX, 0 + offsetY, -400);

  return triangle;
};
