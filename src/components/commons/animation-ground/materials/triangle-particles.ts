import * as THREE from 'three';
import { triangleFactory } from './triangle';
import { blackBarsFactory } from './black-bars';
import { colors } from './material-colors';

export const triangleParticlesFactory = () => {
  const triangleParticles = new THREE.Object3D();
  const params = new Array();
  for (let n = 1; n <= 5; n++) {
    params.push({ color: colors[n - 1], offsetX: (n - 3) * 100, offsetY: 0 });
  }

  params.map(({ color, offsetX, offsetY }, index) => {
    var triangle = new THREE.Object3D();
    triangle.add(
      triangleFactory({
        index,
        color,
        offsetX,
        offsetY,
      })
    );
    triangle.add(blackBarsFactory(offsetX, index));
    triangle.visible = false;
    triangleParticles.add(triangle);
  });

  triangleParticles.position.y = 40;
  triangleParticles.position.z = 240;
  return triangleParticles;
};
