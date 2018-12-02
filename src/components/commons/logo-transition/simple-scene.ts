import * as THREE from 'three';

export class SimpleScene {
  private _scene: THREE.Scene;
  private _clearColor: number;
  private _alpha: number;
  private _camera: THREE.PerspectiveCamera;
  private _fbo: THREE.WebGLRenderTarget;

  get fbo(): THREE.WebGLRenderTarget {
    return this._fbo;
  }

  get scene(): THREE.Scene {
    return this._scene;
  }

  constructor(clearColor: number, alpha: number) {
    this._scene = new THREE.Scene();

    const width = innerWidth;
    const height = innerHeight;

    this._clearColor = clearColor;
    this._alpha = alpha;
    this._camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

    this._fbo = new THREE.WebGLRenderTarget(width * 2, height * 2, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      stencilBuffer: false,
    });
  }

  render(renderer: THREE.WebGLRenderer, _delta: number, _rtt: boolean) {
    renderer.setClearColor(this._clearColor, this._alpha);
    if (_rtt) {
      renderer.render(this._scene, this._camera, this.fbo, true);
    } else {
      renderer.render(this._scene, this._camera);
    }
  }
}
