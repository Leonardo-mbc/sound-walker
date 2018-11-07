import * as THREE from 'three';

export const waveFormFactory = () => {
  const geometry = new THREE.Geometry();

  const material = new THREE.LineBasicMaterial({
    color: 0x000000,
    linewidth: 20,
  });

  const points = new Array();
  const offsetPosition = new Array();
  for (let i = 0; i < 1024; i++) {
    points.push(new THREE.Vector3(i, 0, 0));
    offsetPosition.push(new THREE.Vector3(i, 0, 0));
  }
  geometry.vertices = points;

  var spectrum = new THREE.Line(geometry, material);
  spectrum.position.set(-510, -130, -250);

  return spectrum;
};
