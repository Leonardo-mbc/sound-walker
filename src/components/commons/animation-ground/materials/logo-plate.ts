import * as THREE from 'three';

export const logoPlateFactory = () => {
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('/assets/images/logo@x2.png');
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  texture.format = THREE.RGBFormat;

  const geometry = new THREE.PlaneBufferGeometry(2048, 2048, 1, 1);
  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    map: texture,
    fog: false,
    transparent: false,
  });

  const logo = new THREE.Mesh(geometry, material);

  logo.visible = false;

  return logo;
};
