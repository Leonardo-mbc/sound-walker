import * as THREE from 'three';
import { squareFactory } from './square';
import { colors } from './material-colors';

export const squareParticlesFactory = () => {
  const params = new Array();
  for (let y = -5; y <= 5; y++) {
    for (let x = -5; x <= 5; x++) {
      params.push({
        color: colors[Math.floor(Math.random() * 5)],
        width: 100,
        offsetX: 120 * x,
        offsetY: 120 * y,
      });
    }
  }

  const squareParticles = new THREE.Object3D();

  params.map(({ color, width, offsetX, offsetY }) => {
    const square = new THREE.Object3D();
    square.add(
      squareFactory({
        color,
        width,
        offsetX,
        offsetY,
      })
    );
    square.visible = false;
    squareParticles.add(square);
  });

  return squareParticles;
};
