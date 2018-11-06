import * as THREE from 'three';
import { colors } from './material-colors';

export const speakerConeFactory = () => {
  const speakerCone = new THREE.Object3D();

  const circleGeometry1 = new THREE.CircleGeometry(8.0, 1024);
  const circleMaterial1 = new THREE.MeshBasicMaterial({
    color: colors[2],
    fog: false,
  });
  speakerCone.add(new THREE.Mesh(circleGeometry1, circleMaterial1));

  const circleGeometry2 = new THREE.CircleGeometry(6.5, 1024);
  const circleMaterial2 = new THREE.MeshBasicMaterial({
    color: 0x000000,
    fog: false,
  });
  speakerCone.add(new THREE.Mesh(circleGeometry2, circleMaterial2));

  const circleGeometry3 = new THREE.CircleGeometry(6.0, 1024);
  const circleMaterial3 = new THREE.MeshBasicMaterial({
    color: colors[2],
  });
  speakerCone.add(new THREE.Mesh(circleGeometry3, circleMaterial3));

  const circleGeometry4 = new THREE.CircleGeometry(5.7, 1024);
  const circleMaterial4 = new THREE.MeshBasicMaterial({
    color: 0x001827,
  });
  speakerCone.add(new THREE.Mesh(circleGeometry4, circleMaterial4));

  const circleGeometry5 = new THREE.CircleGeometry(2.3, 1024);
  const circleMaterial5 = new THREE.MeshBasicMaterial({
    color: colors[2],
  });
  speakerCone.add(new THREE.Mesh(circleGeometry5, circleMaterial5));

  const circleGeometry6 = new THREE.CircleGeometry(2.0, 1024);
  const circleMaterial6 = new THREE.MeshBasicMaterial({
    color: 0x000000,
  });
  speakerCone.add(new THREE.Mesh(circleGeometry6, circleMaterial6));

  speakerCone.visible = false;

  return speakerCone;
};
