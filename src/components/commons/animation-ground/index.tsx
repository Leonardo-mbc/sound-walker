import * as React from 'react';
import * as THREE from 'three';
import { EffectComposer, EffectPass, GlitchEffect, RenderPass } from 'postprocessing';
import * as styles from './style.css';
import * as TWEEN from '../../../utilities/tween';
import { triangleParticlesFactory } from './materials/triangle-particles';
import { logoPlateFactory } from './materials/logo-plate';
import { squareParticlesFactory } from './materials/square-particles';
import { Mesh, MeshBasicMaterial } from 'three';
import { circleParticlesFactory } from './materials/circle-particles';

let triangleParticlesChildren: THREE.Object3D[];
let squareParticlesChildren: THREE.Object3D[];
let circleParticlesChildren: THREE.Object3D[];
let logoPlate: THREE.Object3D;
let symbolTween: any;
let logoPlateTween: any;

interface AnimationGroundProps {
  fadeOut: boolean;
}

export class AnimationGround extends React.Component<AnimationGroundProps> {
  private container: HTMLDivElement;
  private renderer: THREE.WebGLRenderer;
  private composer: EffectComposer;
  private clock: THREE.Clock;
  private camera: THREE.PerspectiveCamera;
  private symbolRoot: THREE.Object3D;
  private symbolId = 0;
  private viewWidth = 0;
  private viewHeight = 0;

  constructor(props: AnimationGroundProps) {
    super(props);

    const width = innerWidth;
    const height = innerHeight;

    const scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.set(0, 0, 50);

    this.clock = new THREE.Clock();
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setSize(width, height, false);
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.shadowMap.enabled = false;
    this.renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    this.renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));

    this.composer = new EffectComposer(this.renderer, {
      frameBufferType: THREE.UnsignedByteType,
    });
    const renderPass = new RenderPass(scene, this.camera);
    this.composer.addPass(renderPass);
    this.composer.addPass(
      new EffectPass(
        this.camera,
        new GlitchEffect({
          ratio: 0.15,
        })
      )
    );

    // materialの追加
    this.symbolRoot = new THREE.Object3D();
    scene.add(this.symbolRoot);

    const triangleParticles = triangleParticlesFactory();
    triangleParticlesChildren = triangleParticles.children;
    this.symbolRoot.add(triangleParticles);

    const squareParticles = squareParticlesFactory();
    squareParticlesChildren = squareParticles.children;
    this.symbolRoot.add(squareParticles);

    const circleParticles = circleParticlesFactory();
    circleParticlesChildren = circleParticles.children;
    this.symbolRoot.add(circleParticles);

    logoPlate = logoPlateFactory();
    scene.add(logoPlate);
  }

  componentDidMount() {
    this.container.appendChild(this.renderer.domElement);
    this.animationScheduler();
    this.frameAction();
  }

  componentWillUnmount() {
    symbolTween.stop();
    logoPlateTween.stop();
  }

  frameAction() {
    this.resizeIfNeeded();
    this.fitSymbolsToWidth();
    this.fitLogoEndScale();
    this.composer.render(this.clock.getDelta());
    requestAnimationFrame(this.frameAction.bind(this));
  }

  fitLogoEndScale() {
    if (this.viewWidth === 0 || this.viewHeight === 0) {
      return;
    }
    const aspect = this.viewWidth / this.viewHeight;
    if (aspect >= 1) {
      logoPlate.scale.set(1, 1, 1);
      return;
    }
    const endDistance = Math.abs(this.camera.position.z - -650);
    const halfHeight =
      Math.tan(THREE.MathUtils.degToRad(this.camera.fov * 0.5)) * endDistance;
    const scale = (halfHeight * 2 * aspect * 0.92) / 2048;
    logoPlate.scale.set(scale, scale, 1);
  }

  fitSymbolsToWidth() {
    if (!this.symbolRoot || this.viewWidth === 0 || this.viewHeight === 0) {
      return;
    }
    const aspect = this.viewWidth / this.viewHeight;
    if (aspect >= 1) {
      this.symbolRoot.scale.set(1, 1, 1);
      return;
    }
    const distance = Math.abs(this.camera.position.z - -400);
    const halfHeight =
      Math.tan(THREE.MathUtils.degToRad(this.camera.fov * 0.5)) * distance;
    const scale = (halfHeight * aspect * 0.92) / 650;
    this.symbolRoot.scale.set(scale, scale, 1);
  }

  resizeIfNeeded() {
    if (!this.container) {
      return;
    }
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    if (width === 0 || height === 0) {
      return;
    }
    if (width === this.viewWidth && height === this.viewHeight) {
      return;
    }
    this.viewWidth = width;
    this.viewHeight = height;
    this.camera.aspect = width / height;
    this.camera.position.z = 50;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
    this.renderer.setSize(width, height, false);
    this.composer.setSize(width, height);
  }

  pickSymbolId(previous: number) {
    let next = Math.floor(Math.random() * 3);
    while (next === previous) {
      next = Math.floor(Math.random() * 3);
    }
    return next;
  }

  hideSymbol(symbolId: number) {
    switch (symbolId) {
      case 0:
        triangleParticlesChildren.forEach((triangle) => {
          triangle.visible = false;
        });
        break;
      case 1:
        squareParticlesChildren.forEach((square) => {
          square.visible = false;
          ((square.children[0] as Mesh).material as MeshBasicMaterial).wireframe =
            true;
        });
        break;
      case 2:
        circleParticlesChildren.forEach((circle) => {
          circle.visible = false;
          circle.children[0].scale.x = 0.01;
          circle.children[0].scale.y = 0.01;
        });
        break;
    }
  }

  showSymbol(symbolId: number) {
    switch (symbolId) {
      case 0:
        triangleParticlesChildren.forEach((triangle) => {
          triangle.visible = true;
        });
        break;
      case 1: {
        const order = squareParticlesChildren.map((_square, index) => index);
        order.sort(() => Math.random() - 0.5);
        order.forEach((n, idx) => {
          squareParticlesChildren[n].visible = true;
          window.setTimeout(() => {
            ((squareParticlesChildren[n].children[0] as Mesh)
              .material as MeshBasicMaterial).wireframe = false;
          }, 5 * idx);
        });
        break;
      }
      case 2:
        circleParticlesChildren.forEach((circle) => {
          circle.visible = true;
        });
        break;
    }
  }

  animateSymbol(symbolId: number, progress: number) {
    switch (symbolId) {
      case 0:
        triangleParticlesChildren.forEach((triangle, idx) => {
          triangle.position.x =
            50 *
            (idx - Math.floor(triangleParticlesChildren.length * 0.5)) *
            progress;
        });
        break;
      case 2:
        circleParticlesChildren.forEach((circle, idx) => {
          const scale = (progress - (4 - idx) / 5) * 1.5;
          circle.children[0].scale.x = scale;
          circle.children[0].scale.y = scale;
        });
        break;
    }
  }

  animationScheduler() {
    const duration = 1000;

    symbolTween = new TWEEN.Tween({ value: 0.0 })
      .to({ value: 1.0 }, duration)
      .easing(TWEEN.Easing.Exponential.Out)
      .onStart(() => {
        this.hideSymbol(0);
        this.hideSymbol(1);
        this.hideSymbol(2);
        this.symbolId = this.pickSymbolId(this.symbolId);
        this.showSymbol(this.symbolId);
      })
      .onUpdate((state: { value: number }) => {
        this.animateSymbol(this.symbolId, state.value);
      })
      .onComplete(() => {
        this.hideSymbol(this.symbolId);
      })
      .start();

    logoPlateTween = new TWEEN.Tween(logoPlate.position)
      .to({ z: -650 }, duration)
      .easing(TWEEN.Easing.Exponential.Out)
      .onStart(() => {
        logoPlate.visible = true;
      })
      .onComplete(() => {
        logoPlate.visible = false;
        logoPlate.position.set(0, 0, -300);
      });

    symbolTween.chain(logoPlateTween);
    logoPlateTween.chain(symbolTween);
  }

  render() {
    return (
      <div
        ref={(elem) => { this.container = elem; }}
        className={`${styles.container} ${
          this.props.fadeOut ? styles.fadeOut : ''
        }`}
      />
    );
  }
}
