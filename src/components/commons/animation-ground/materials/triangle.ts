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
  const geometry = new THREE.Geometry();

  geometry.vertices.push(new THREE.Vector3(0, 200, index));
  geometry.vertices.push(new THREE.Vector3(-400.0 / Math.sqrt(3), -200, index));
  geometry.vertices.push(new THREE.Vector3(400.0 / Math.sqrt(3), -200, index));

  geometry.faces[0] = new THREE.Face3(0, 1, 2);

  const material = new THREE.MeshBasicMaterial({
    color: color,
  });
  const triangle = new THREE.Mesh(geometry, material);

  triangle.position.set(0 + offsetX, 0 + offsetY, -400);

  return triangle;
};
