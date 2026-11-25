import * as React from 'react';
import * as THREE from 'three';
import { EffectComposer, RenderPass } from 'postprocessing';
import * as styles from './style.css';
import { circleSpectrumFactory } from './materials/circle-spectrum';
import { speakerConeFactory } from './materials/speaker-cone';
import { AnalyserParams } from '../../../systems/system-interfaces';
import { waveFormFactory } from './materials/wave-form';
let circleSpectrum: THREE.Object3D;
let speakerCone: THREE.Object3D;
let waveForm: THREE.Object3D;

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
  private composer: EffectComposer;
  private clock: THREE.Clock;
  private camera: THREE.PerspectiveCamera;
  private viewWidth = 0;
  private viewHeight = 0;
  private frameId = 0;

  constructor(props: CircleVisualizerProps, state: CircleVisualizerState) {
    super(props, state);

    const width = innerWidth;
    const height = innerHeight;

    const scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const cameraBasePositions = { x: 0, y: 0, z: 50 };
    this.camera.position.set(
      cameraBasePositions.x,
      cameraBasePositions.y,
      cameraBasePositions.z
    );

    this.clock = new THREE.Clock();
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.shadowMap.enabled = false;
    this.renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    this.renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));

    this.composer = new EffectComposer(this.renderer, {
      frameBufferType: THREE.UnsignedByteType,
    });
    const renderPass = new RenderPass(scene, this.camera);
    this.composer.addPass(renderPass);

    // materialの追加
    circleSpectrum = circleSpectrumFactory();
    circleSpectrum.visible = true;
    scene.add(circleSpectrum);

    speakerCone = speakerConeFactory();
    speakerCone.visible = true;
    scene.add(speakerCone);

    waveForm = waveFormFactory();
    waveForm.visible = true;
    waveForm.renderOrder = 2;
    scene.add(waveForm);
  }

  componentDidMount() {
    this.container.appendChild(this.renderer.domElement);
    this.frameAction();
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.frameId);
  }

  frameAction() {
    this.resizeIfNeeded();
    this.calcWaveForm();
    this.calcSpectrum();
    this.composer.render(this.clock.getDelta());
    this.frameId = requestAnimationFrame(this.frameAction.bind(this));
  }

  resizeIfNeeded() {
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
    this.camera.updateProjectionMatrix();
    this.composer.setSize(width, height);
  }

  visibleRadius(z: number) {
    const distance = Math.abs(this.camera.position.z - z);
    return (
      Math.tan(THREE.MathUtils.degToRad(this.camera.fov * 0.5)) * distance
    );
  }

  fitRadius(z: number) {
    const vertical = this.visibleRadius(z);
    if (this.viewHeight === 0) {
      return vertical;
    }
    const horizontal = vertical * (this.viewWidth / this.viewHeight);
    return Math.min(vertical, horizontal);
  }

  calcWaveForm() {
    const { analyzerParams } = this.props;

    const waveFormMesh = waveForm as THREE.Mesh;
    const waveFormGeometry = waveFormMesh.geometry as THREE.BufferGeometry;
    const positions = waveFormGeometry.getAttribute(
      'position'
    ) as THREE.BufferAttribute;
    const vertical = this.visibleRadius(waveForm.position.z);
    const aspect =
      this.viewHeight === 0 ? 1 : this.viewWidth / this.viewHeight;
    const horizontal = vertical * aspect;
    const span = horizontal * 2;
    waveForm.position.x = 0;
    waveForm.position.y = 0;

    for (let i = 0; i < 1024; i++) {
      const centered = (analyzerParams.times[i] - 128) / 128;
      positions.setX(i, (i / 1023 - 0.5) * span);
      positions.setY(i, centered * Math.min(vertical, horizontal) * 0.22);
    }

    positions.needsUpdate = true;
  }

  getSpectrum() {
    const { analyzerNode, analyzerParams } = this.props;
    analyzerNode.getByteTimeDomainData(analyzerParams.times);
    analyzerNode.getByteFrequencyData(analyzerParams.freqs);
  }

  calcSpectrum() {
    const { analyzerParams } = this.props;
    this.getSpectrum();

    const freqsLength = analyzerParams.freqs.length;
    const theta = Math.PI / freqsLength;
    const inner = 9.2;
    const maxRadius = this.fitRadius(circleSpectrum.position.z) * 0.96;

    const placeBar = (index: number, freqIndex: number) => {
      const freq = analyzerParams.freqs[freqIndex] || 0;
      const level = Math.sqrt(freq / 255);
      const outer = inner + 1.8 + level * Math.max(0, maxRadius - inner - 1.8);
      const halfWidth = 1.1 + level * 1.2;
      const spectrumMesh = circleSpectrum.children[index] as THREE.Mesh;
      const spectrumGeometry = spectrumMesh.geometry as THREE.BufferGeometry;
      const spectrumMaterial = spectrumMesh.material as THREE.MeshBasicMaterial;
      const spectrumVertices = spectrumGeometry.getAttribute(
        'position'
      ) as THREE.BufferAttribute;
      const angle = theta * index;
      const plus = angle + Math.PI / 2;
      const sub = angle - Math.PI / 2;

      spectrumVertices.setXY(
        0,
        inner * Math.cos(angle) + halfWidth * Math.cos(sub),
        inner * Math.sin(angle) + halfWidth * Math.sin(sub)
      );
      spectrumVertices.setXY(
        1,
        inner * Math.cos(angle) + halfWidth * Math.cos(plus),
        inner * Math.sin(angle) + halfWidth * Math.sin(plus)
      );
      spectrumVertices.setXY(
        2,
        outer * Math.cos(angle) + halfWidth * Math.cos(plus),
        outer * Math.sin(angle) + halfWidth * Math.sin(plus)
      );
      spectrumVertices.setXY(
        3,
        outer * Math.cos(angle) + halfWidth * Math.cos(sub),
        outer * Math.sin(angle) + halfWidth * Math.sin(sub)
      );
      spectrumVertices.needsUpdate = true;
      spectrumMaterial.color.setHSL(freq / 256, 1, 0.62);
    };

    for (let i = 0; i < freqsLength; i++) {
      placeBar(i, i);
    }
    for (let i = freqsLength; i < freqsLength * 2; i++) {
      placeBar(i, i - freqsLength);
    }

    speakerCone.position.z = Math.min(analyzerParams.freqs[6] * 0.02, 1);
  }

  render() {
    return (
      <div
        ref={(elem) => { this.container = elem; }}
        className={styles.container}
      />
    );
  }
}
