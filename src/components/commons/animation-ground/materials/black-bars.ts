import * as THREE from 'three';

export const blackBarsFactory = (offsetX: number, index: number) => {
  const geometry = new THREE.PlaneGeometry(1024, 8, 1, 1);
  const material = new THREE.MeshBasicMaterial({
    fog: false,
    transparent: true,
    opacity: 1,
  });
  // 画面の背景 #212121 と揃える。sRGB のまま渡すと線だけ黒く浮く
  material.color.setHex(0x212121, THREE.LinearSRGBColorSpace);

  const lines = new THREE.Object3D();
  const split = 6;
  for (let i = 0; i < split; i++) {
    const line = new THREE.Mesh(geometry, material);
    line.position.set(i * 50 - 112 + offsetX, 0, -400 + index);
    line.rotateZ(Math.PI / 3);
    lines.add(line);
  }

  return lines;
};
