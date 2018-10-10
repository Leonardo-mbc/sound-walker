import * as React from 'react';
import * as THREE from 'three';
import * as OrbitControls from 'three-orbitcontrols';
import { EffectComposer, RenderPass, GlitchPass } from 'postprocessing';
import * as styles from './style.css';
import * as TWEEN from 'tween.js';
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

interface AnimationGroundState {
  animationSymbolId: number;
}

export class AnimationGround extends React.Component<
  AnimationGroundProps,
  AnimationGroundState
> {
  private container: HTMLDivElement;
  private renderer: THREE.WebGLRenderer;
  private composer: typeof EffectComposer;
  private controls: typeof OrbitControls;

  constructor(props: AnimationGroundProps, state: AnimationGroundState) {
    super(props, state);

    this.state = {
      animationSymbolId: 0,
    };

    const width = innerWidth;
    const height = innerHeight;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const cameraBasePositions = { x: 0, y: 0, z: 50 };
    camera.position.set(
      cameraBasePositions.x,
      cameraBasePositions.y,
      cameraBasePositions.z
    );

    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.shadowMap.enabled = false;
    this.renderer.setPixelRatio(devicePixelRatio);

    this.composer = new EffectComposer(this.renderer);
    const renderPass = new RenderPass(scene, camera);
    this.composer.addPass(renderPass);

    const glitchPass = new GlitchPass();
    glitchPass.renderToScreen = true;
    this.composer.addPass(glitchPass);

    this.controls = new OrbitControls(camera, this.renderer.domElement);

    // materialの追加
    const triangleParticles = triangleParticlesFactory();
    triangleParticlesChildren = triangleParticles.children;
    scene.add(triangleParticles);

    const squareParticles = squareParticlesFactory();
    squareParticlesChildren = squareParticles.children;
    scene.add(squareParticles);

    const circleParticles = circleParticlesFactory();
    circleParticlesChildren = circleParticles.children;
    scene.add(circleParticles);

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
    this.controls.update();
    this.composer.render();
    requestAnimationFrame(this.frameAction.bind(this));
  }

  selectSymbolId() {
    const previousSymbolId = this.state.animationSymbolId;
    let animationSymbolId = Math.floor(Math.random() * 3);
    if (previousSymbolId === animationSymbolId) {
      animationSymbolId = this.selectSymbolId();
    }
    return animationSymbolId;
  }

  animationScheduler() {
    const duration = 1000;

    symbolTween = new TWEEN.Tween({ value: 0.0 })
      .to({ value: 1.0 }, duration)
      .easing(TWEEN.Easing.Exponential.Out)
      .onStart(() => {
        this.setState({ animationSymbolId: this.selectSymbolId() });
        switch (this.state.animationSymbolId) {
          case 0:
            triangleParticlesChildren.map((triangle) => {
              triangle.visible = true;
            });
            break;
          case 1:
            const nums = new Array();
            new Array(squareParticlesChildren.length).fill(0).map((_v, i) => {
              nums.push(i);
            });

            const shuffle = () => Math.random() - 0.5;
            nums.sort(shuffle);

            nums.map((n, idx) => {
              squareParticlesChildren[n].visible = true;
              setTimeout(() => {
                ((squareParticlesChildren[n].children[0] as Mesh)
                  .material as MeshBasicMaterial).wireframe = false;
              }, 5 * idx);
            });
            break;
          case 2:
            circleParticlesChildren.map((circle) => {
              circle.visible = true;
            });
            break;
        }
      })
      .onUpdate((progress: number) => {
        switch (this.state.animationSymbolId) {
          case 0:
            triangleParticlesChildren.map((triangle, idx) => {
              triangle.position.x =
                50 *
                (idx - Math.floor(triangleParticlesChildren.length * 0.5)) *
                progress;
            });
            break;
          case 1:
            break;
          case 2:
            circleParticlesChildren.map((circle, idx) => {
              const scale = (progress - (4 - idx) / 5) * 1.5;
              circle.children[0].scale.x = scale;
              circle.children[0].scale.y = scale;
            });
            break;
        }
      })
      .onComplete(() => {
        switch (this.state.animationSymbolId) {
          case 0:
            triangleParticlesChildren.map((triangle) => {
              triangle.visible = false;
            });
            break;
          case 1:
            squareParticlesChildren.map((square) => {
              square.visible = false;
              ((square.children[0] as Mesh)
                .material as MeshBasicMaterial).wireframe = true;
            });
            break;
          case 2:
            circleParticlesChildren.map((circle) => {
              circle.visible = false;
              circle.children[0].scale.x = 0.01;
              circle.children[0].scale.y = 0.01;
            });
            break;
        }
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
        ref={(elem) => (this.container = elem)}
        className={`${styles.container} ${
          this.props.fadeOut ? styles.fadeOut : ''
        }`}
      />
    );
  }
}
