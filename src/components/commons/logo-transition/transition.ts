import * as THREE from 'three';
import { SimpleScene } from './simple-scene';

interface TransitionParams {
  useTexture: boolean;
  transition: number;
  transitionSpeed: number;
  textureId: number;
  textureThreshold: number;
}

export class Transition {
  private _scene: THREE.Scene;
  private _sceneA: SimpleScene;
  private _sceneB: SimpleScene;
  private _transitionParams: TransitionParams;
  private _quadmaterial: THREE.ShaderMaterial;
  private _textures: THREE.Texture[];
  private _cameraOrtho: THREE.OrthographicCamera;

  constructor(
    sceneA: SimpleScene,
    sceneB: SimpleScene,
    transitionParams: TransitionParams
  ) {
    this._sceneA = sceneA;
    this._sceneB = sceneB;
    this._transitionParams = transitionParams;

    this._scene = new THREE.Scene();
    this._cameraOrtho = new THREE.OrthographicCamera(
      window.innerWidth / -2,
      window.innerWidth / 2,
      window.innerHeight / 2,
      window.innerHeight / -2,
      -10,
      10
    );

    this._textures = [];
    const textureLoader = new THREE.TextureLoader();
    for (let i = 0; i < 6; i++)
      this._textures[i] = textureLoader.load(
        '/assets/images/transition/transition' + (i + 1) + '.png'
      );

    this._quadmaterial = new THREE.ShaderMaterial({
      uniforms: {
        tDiffuse1: {
          type: 't',
          value: null,
        },
        tDiffuse2: {
          type: 't',
          value: null,
        },
        mixRatio: {
          type: 'f',
          value: 0.0,
        },
        threshold: {
          type: 'f',
          value: 0.1,
        },
        useTexture: {
          type: 'i',
          value: 1,
        },
        tMixTexture: {
          type: 't',
          value: this._textures[0],
        },
      },
      vertexShader: [
        'varying vec2 vUv;',

        'void main() {',

        'vUv = vec2( uv.x, uv.y );',
        'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',

        '}',
      ].join('\n'),
      fragmentShader: [
        'uniform float mixRatio;',

        'uniform sampler2D tDiffuse1;',
        'uniform sampler2D tDiffuse2;',
        'uniform sampler2D tMixTexture;',

        'uniform int useTexture;',
        'uniform float threshold;',

        'varying vec2 vUv;',

        'void main() {',

        'vec4 texel1 = texture2D( tDiffuse1, vUv );',
        'vec4 texel2 = texture2D( tDiffuse2, vUv );',

        'if (useTexture==1) {',

        'vec4 transitionTexel = texture2D( tMixTexture, vUv );',
        'float r = mixRatio * (1.0 + threshold * 2.0) - threshold;',
        'float mixf=clamp((transitionTexel.r - r)*(1.0/threshold), 0.0, 1.0);',

        'gl_FragColor = mix( texel1, texel2, mixf );',
        '} else {',

        'gl_FragColor = mix( texel2, texel1, mixRatio );',

        '}',
        '}',
      ].join('\n'),
    });

    const quadgeometry = new THREE.PlaneBufferGeometry(
      window.innerWidth,
      window.innerHeight
    );

    this._scene.add(new THREE.Mesh(quadgeometry, this._quadmaterial));

    // Link both scenes and their FBOs
    this._quadmaterial.uniforms.tDiffuse1.value = sceneA.fbo;
    this._quadmaterial.uniforms.tDiffuse2.value = sceneB.fbo;
  }

  setTextureThreshold(value: any) {
    this._quadmaterial.uniforms.threshold.value = value;
  }

  useTexture(value: any) {
    this._quadmaterial.uniforms.useTexture.value = value ? 1 : 0;
  }

  setTexture(i: number) {
    this._quadmaterial.uniforms.tMixTexture.value = this._textures[i];
  }

  render(renderer: THREE.WebGLRenderer, delta: number, transition: number) {
    this._quadmaterial.uniforms.tMixTexture.value = this._textures[
      this._transitionParams.textureId
    ];
    this._quadmaterial.uniforms.mixRatio.value = transition;

    // Prevent render both scenes when it's not necessary
    if (transition == 0) {
      this._sceneB.render(renderer, delta, false);
    } else if (transition == 1) {
      this._sceneA.render(renderer, delta, false);
    } else {
      // When 0<transition<1 render transition between two scenes
      this._sceneA.render(renderer, delta, true);
      this._sceneB.render(renderer, delta, true);
      renderer.render(this._scene, this._cameraOrtho, null, true);
    }
  }
}
