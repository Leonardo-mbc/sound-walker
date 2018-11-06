import * as THREE from 'three';
import { colors } from './material-colors';

export const circleSpectrumFactory = () => {
  const spectrum = new THREE.Object3D();
  const split = 48;
  const theta = Math.PI / split;
  const ofs = 5;
  const width = 1;

  for (let i = 0; i < split * 2; i++) {
    const rectShape = new THREE.Shape();
    rectShape.moveTo(
      ofs * Math.cos(theta * i) +
        width * 0.5 * Math.cos(theta * i - Math.PI / 2),
      ofs * Math.sin(theta * i) +
        width * 0.5 * Math.sin(theta * i - Math.PI / 2)
    );
    rectShape.lineTo(
      ofs * Math.cos(theta * i) +
        width * 0.5 * Math.cos(theta * i + Math.PI / 2),
      ofs * Math.sin(theta * i) +
        width * 0.5 * Math.sin(theta * i + Math.PI / 2)
    );
    rectShape.lineTo(
      10 * Math.cos(theta * i) +
        width * 0.5 * Math.cos(theta * i + Math.PI / 2),
      10 * Math.sin(theta * i) + width * 0.5 * Math.sin(theta * i + Math.PI / 2)
    );
    rectShape.lineTo(
      10 * Math.cos(theta * i) +
        width * 0.5 * Math.cos(theta * i - Math.PI / 2),
      10 * Math.sin(theta * i) + width * 0.5 * Math.sin(theta * i - Math.PI / 2)
    );

    const geometry = new THREE.ShapeGeometry(rectShape);
    const material = new THREE.MeshBasicMaterial({
      color: colors[2],
      fog: false,
    });
    const line = new THREE.Mesh(geometry, material);
    spectrum.add(line);
  }

  spectrum.position.set(0, 0, 30);
  spectrum.visible = false;

  return spectrum;
};
