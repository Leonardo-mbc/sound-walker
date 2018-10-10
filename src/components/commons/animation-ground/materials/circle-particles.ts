import * as THREE from 'three';
import { circleFactory } from './circle';
import { colors } from './material-colors';

export const circleParticlesFactory = () => {
  const params = new Array();
  for (let n = 1; n <= 5; n++) {
    params.push({ color: colors[n - 1], r: 600, z: -n });
  }

  const circleParticles = new THREE.Object3D();

  params.map(({ color, r, z }) => {
    const circle = new THREE.Object3D();
    circle.add(circleFactory({ color, r, z }));
    circle.visible = false;
    circleParticles.add(circle);
  });

  return circleParticles;
};
