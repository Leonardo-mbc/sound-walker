import * as THREE from 'three';

export const logoPlateWhiteFactory = () => {
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('/assets/images/logo_white@x2.png');
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
  logo.position.set(0, 0, -300);

  return logo;
};
