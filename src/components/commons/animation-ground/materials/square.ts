import * as THREE from 'three';

interface squareFactoryParams {
  color: number;
  width: number;
  offsetX: number;
  offsetY: number;
}

export const squareFactory = ({
  color,
  width,
  offsetX,
  offsetY,
}: squareFactoryParams) => {
  const rectShape = new THREE.Shape();
  rectShape.moveTo(-width * 0.5, width * 0.5);
  rectShape.lineTo(width * 0.5, width * 0.5);
  rectShape.lineTo(width * 0.5, -width * 0.5);
  rectShape.lineTo(-width * 0.5, -width * 0.5);
  rectShape.lineTo(-width * 0.5, width * 0.5);

  const geometry = new THREE.ShapeGeometry(rectShape);
  const material = new THREE.MeshBasicMaterial({
    color: color,
    fog: false,
    wireframe: true,
    wireframeLinewidth: 2,
    transparent: true,
    opacity: 0.5,
  });
  const square = new THREE.Mesh(geometry, material);

  square.position.set(0 + offsetX, 0 + offsetY, -400);

  return square;
};
