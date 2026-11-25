import * as THREE from 'three';
import { colors } from './material-colors';

export const circleSpectrumFactory = () => {
  const spectrum = new THREE.Object3D();
  const split = 48;
  const theta = Math.PI / split;
  const ofs = 5;
  const width = 1;

  for (let i = 0; i < split * 2; i++) {
    const angle = theta * i;
    const innerLeft = point(ofs, angle, width, -1);
    const innerRight = point(ofs, angle, width, 1);
    const outerRight = point(10, angle, width, 1);
    const outerLeft = point(10, angle, width, -1);
    const positions = new Float32Array([
      innerLeft.x,
      innerLeft.y,
      0,
      innerRight.x,
      innerRight.y,
      0,
      outerRight.x,
      outerRight.y,
      0,
      outerLeft.x,
      outerLeft.y,
      0,
    ]);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setIndex([0, 1, 2, 0, 2, 3]);
    const material = new THREE.MeshBasicMaterial({
      color: colors[2],
      fog: false,
      side: THREE.DoubleSide,
    });
    const line = new THREE.Mesh(geometry, material);
    line.frustumCulled = false;
    spectrum.add(line);
  }

  spectrum.position.set(0, 0, 1);
  spectrum.visible = false;

  return spectrum;
};

function point(radius: number, angle: number, width: number, side: number) {
  const perpendicular = angle + (side * Math.PI) / 2;
  return {
    x: radius * Math.cos(angle) + width * 0.5 * Math.cos(perpendicular),
    y: radius * Math.sin(angle) + width * 0.5 * Math.sin(perpendicular),
  };
}
