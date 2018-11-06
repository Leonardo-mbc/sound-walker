import * as React from 'react';
import * as THREE from 'three';
import * as OrbitControls from 'three-orbitcontrols';
import { EffectComposer, RenderPass } from 'postprocessing';
import * as styles from './style.css';
import { circleSpectrumFactory } from './materials/circle-spectrum';
import { speakerConeFactory } from './materials/speaker-cone';
import { AnalyserParams } from '../../../systems/system-interfaces';
let circleSpectrum: THREE.Object3D;
let speakerCone: THREE.Object3D;

interface CircleVisualizerProps {
  analyzerNode: AnalyserNode;
  analyzerParams: AnalyserParams;
}

interface CircleVisualizerState {}

export class CircleVisualizer extends React.Component<
  CircleVisualizerProps,
  CircleVisualizerState
> {
  private container: HTMLDivElement;
  private renderer: THREE.WebGLRenderer;
  private composer: typeof EffectComposer;
  private controls: typeof OrbitControls;

  constructor(props: CircleVisualizerProps, state: CircleVisualizerState) {
    super(props, state);

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
    renderPass.renderToScreen = true;
    this.composer.addPass(renderPass);

    // this.controls = new OrbitControls(camera, this.renderer.domElement);

    // materialの追加
    circleSpectrum = circleSpectrumFactory();
    circleSpectrum.visible = true;
    scene.add(circleSpectrum);

    speakerCone = speakerConeFactory();
    speakerCone.visible = true;
    scene.add(speakerCone);
  }

  componentDidMount() {
    this.container.appendChild(this.renderer.domElement);
    this.frameAction();
  }

  frameAction() {
    this.calcSpectrum();
    this.controls.update();
    this.composer.render();
    requestAnimationFrame(this.frameAction.bind(this));
  }

  getSpectrum() {
    const { analyzerNode, analyzerParams } = this.props;
    analyzerNode.getByteTimeDomainData(analyzerParams.times);
    analyzerNode.getByteFrequencyData(analyzerParams.freqs);
  }

  calcSpectrum() {
    const { analyzerParams } = this.props;
    this.getSpectrum();

    const theta = Math.PI / analyzerParams.freqs.length;

    for (let i = 0; i < analyzerParams.freqs.length; i++) {
      const value = analyzerParams.freqs[i] * 0.05;
      const width = value * 0.15 < 1 ? 1 : value * 0.15;
      ((circleSpectrum.children[i] as THREE.Mesh)
        .geometry as THREE.ShapeGeometry).vertices[2].x =
        value * Math.cos(theta * i) +
        width * 0.5 * Math.cos(theta * i + Math.PI / 2);
      ((circleSpectrum.children[i] as THREE.Mesh)
        .geometry as THREE.ShapeGeometry).vertices[2].y =
        value * Math.sin(theta * i) +
        width * 0.5 * Math.sin(theta * i + Math.PI / 2);
      ((circleSpectrum.children[i] as THREE.Mesh)
        .geometry as THREE.ShapeGeometry).vertices[3].x =
        value * Math.cos(theta * i) +
        width * 0.5 * Math.cos(theta * i - Math.PI / 2);
      ((circleSpectrum.children[i] as THREE.Mesh)
        .geometry as THREE.ShapeGeometry).vertices[3].y =
        value * Math.sin(theta * i) +
        width * 0.5 * Math.sin(theta * i - Math.PI / 2);

      ((circleSpectrum.children[i] as THREE.Mesh)
        .geometry as THREE.ShapeGeometry).verticesNeedUpdate = true;
      ((circleSpectrum.children[i] as THREE.Mesh)
        .material as THREE.MeshBasicMaterial).color.setHSL(
        analyzerParams.freqs[i] / 256,
        1.0,
        0.5
      );
    }

    for (
      let i = analyzerParams.freqs.length;
      i < analyzerParams.freqs.length * 2;
      i++
    ) {
      const value =
        analyzerParams.freqs[i - analyzerParams.freqs.length] * 0.05;
      const width = value * 0.15 < 1 ? 1 : value * 0.15;
      ((circleSpectrum.children[i] as THREE.Mesh)
        .geometry as THREE.ShapeGeometry).vertices[2].x =
        value * Math.cos(theta * i) +
        width * 0.5 * Math.cos(theta * i + Math.PI / 2);
      ((circleSpectrum.children[i] as THREE.Mesh)
        .geometry as THREE.ShapeGeometry).vertices[2].y =
        value * Math.sin(theta * i) +
        width * 0.5 * Math.sin(theta * i + Math.PI / 2);
      ((circleSpectrum.children[i] as THREE.Mesh)
        .geometry as THREE.ShapeGeometry).vertices[3].x =
        value * Math.cos(theta * i) +
        width * 0.5 * Math.cos(theta * i - Math.PI / 2);
      ((circleSpectrum.children[i] as THREE.Mesh)
        .geometry as THREE.ShapeGeometry).vertices[3].y =
        value * Math.sin(theta * i) +
        width * 0.5 * Math.sin(theta * i - Math.PI / 2);

      ((circleSpectrum.children[i] as THREE.Mesh)
        .geometry as THREE.ShapeGeometry).verticesNeedUpdate = true;
      ((circleSpectrum.children[i] as THREE.Mesh)
        .material as THREE.MeshBasicMaterial).color.setHSL(
        analyzerParams.freqs[i - analyzerParams.freqs.length] / 256,
        1.0,
        0.5
      );
    }

    speakerCone.position.z = analyzerParams.freqs[6] * 0.07;
  }

  render() {
    return (
      <div
        ref={(elem) => (this.container = elem)}
        className={styles.container}
      />
    );
  }
}
