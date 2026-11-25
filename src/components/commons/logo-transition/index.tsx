import * as React from 'react';
import * as THREE from 'three';
import * as TWEEN from '../../../utilities/tween';
import { EffectComposer, RenderPass } from 'postprocessing';
import * as styles from './style.css';
import { Transition } from './transition';
import { SimpleScene } from './simple-scene';
import { logoPlateFactory } from '../animation-ground/materials/logo-plate';

let logoPlate: THREE.Object3D;

interface LogoTransitionProps {
  direction?: 'fade-out' | 'fade-in';
  transitionEnd?: () => void;
  duration?: number;
}

interface LogoTransitionState {
  transitionValue: number;
}

export class LogoTransition extends React.Component<
  LogoTransitionProps,
  LogoTransitionState
> {
  private _container: HTMLDivElement;
  private _renderer: THREE.WebGLRenderer;
  private _composer: EffectComposer;
  private _clock: THREE.Clock;
  private _transition: Transition;
  private viewWidth = 0;
  private viewHeight = 0;

  constructor(props: LogoTransitionProps, state: LogoTransitionState) {
    super(props, state);

    const width = innerWidth;
    const height = innerHeight;

    this._clock = new THREE.Clock();
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 0, 50);

    this._renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this._renderer.setSize(width, height, false);
    this._renderer.setClearColor(0x212121, 0);
    this._renderer.shadowMap.enabled = false;
    this._renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    this._renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));

    this._composer = new EffectComposer(this._renderer, {
      frameBufferType: THREE.UnsignedByteType,
    });
    const renderPass = new RenderPass(scene, camera);
    this._composer.addPass(renderPass);

    const SceneA = new SimpleScene(0x212121, 1);
    const SceneB = new SimpleScene(0x212121, 0);

    logoPlate = logoPlateFactory();
    SceneA.scene.add(logoPlate);

    this._transition = new Transition(SceneA, SceneB, {
      useTexture: true,
      transition: 1,
      transitionSpeed: 2.0,
      textureId: 2,
      textureThreshold: 0.3,
    });

    this.state = {
      transitionValue: props.direction === 'fade-out' ? 1.0 : 0.0,
    };
  }

  componentDidMount() {
    this._container.appendChild(this._renderer.domElement);
    this.animationScheduler();
    this.frameAction();
  }

  animationScheduler() {
    const { direction, duration, transitionEnd } = this.props;
    const params = { value: direction === 'fade-out' ? 1.0 : 0.0 };

    if (direction === 'fade-out') {
      new TWEEN.Tween(params)
        .to({ value: 0.0 }, duration || 1000)
        .easing(TWEEN.Easing.Cubic.InOut)
        .onStart(() => {
          this.setState({ transitionValue: 1.0 });
          logoPlate.visible = true;
          logoPlate.position.set(0, 0, -650);
        })
        .onUpdate(() => {
          this.setState({ transitionValue: params.value });
        })
        .onComplete(() => {
          if (transitionEnd) {
            transitionEnd();
          }
        })
        .start();
    } else {
      new TWEEN.Tween(logoPlate.position)
        .to({ z: -650 }, duration || 1000)
        .easing(TWEEN.Easing.Exponential.Out)
        .onStart(() => {
          logoPlate.visible = true;
          logoPlate.position.set(0, 0, -300);
        })
        .onComplete(() => {
          logoPlate.visible = false;
          logoPlate.position.set(0, 0, -300);
        })
        .start();

      new TWEEN.Tween(params)
        .to({ value: 1.0 }, duration || 1000)
        .easing(TWEEN.Easing.Cubic.InOut)
        .onStart(() => {
          this.setState({ transitionValue: 0.0 });
        })
        .onUpdate(() => {
          this.setState({ transitionValue: params.value });
        })
        .onComplete(() => {
          if (transitionEnd) {
            transitionEnd();
          }
        })
        .start();
    }
  }

  frameAction() {
    this.resizeIfNeeded();
    this.coverLogo();
    this._transition.render(
      this._renderer,
      this._clock.getDelta(),
      this.state.transitionValue
    );
    requestAnimationFrame(this.frameAction.bind(this));
  }

  resizeIfNeeded() {
    const width = this._container.clientWidth;
    const height = this._container.clientHeight;
    if (width === 0 || height === 0) {
      return;
    }
    if (width === this.viewWidth && height === this.viewHeight) {
      return;
    }
    this.viewWidth = width;
    this.viewHeight = height;
    this._renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
    this._renderer.setSize(width, height, false);
    this._transition.resize(width, height);
  }

  coverLogo() {
    if (this.viewWidth === 0 || this.viewHeight === 0) {
      return;
    }
    const distance = Math.max(Math.abs(logoPlate.position.z), 1);
    const aspect = this.viewWidth / this.viewHeight;
    const halfHeight = Math.tan(THREE.MathUtils.degToRad(37.5)) * distance;
    const widthWorld = halfHeight * 2 * aspect;
    const scale = aspect < 1 ? widthWorld / 2048 : Math.max(1, widthWorld / 2048);
    logoPlate.scale.set(scale, scale, 1);
  }

  render() {
    return (
      <div
        ref={(elem) => { this._container = elem; }}
        className={styles.container}
      />
    );
  }
}
