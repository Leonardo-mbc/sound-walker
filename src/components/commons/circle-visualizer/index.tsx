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
  private composer: typeof EffectComposer;

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

    // materialの追加
    circleSpectrum = circleSpectrumFactory();
    circleSpectrum.visible = true;
    scene.add(circleSpectrum);

    speakerCone = speakerConeFactory();
    speakerCone.visible = true;
    scene.add(speakerCone);

    waveForm = waveFormFactory();
    waveForm.visible = true;
    scene.add(waveForm);
  }

  componentDidMount() {
    this.container.appendChild(this.renderer.domElement);
    this.frameAction();
  }

  frameAction() {
    this.calcWaveForm();
    this.calcSpectrum();
    this.composer.render();
    requestAnimationFrame(this.frameAction.bind(this));
  }

  calcWaveForm() {
    const { analyzerParams } = this.props;

    const waveFormMesh = waveForm as THREE.Mesh;
    const waveFormGeometry = waveFormMesh.geometry as THREE.Geometry;

    for (var i = 0; i < 1024; i++) {
      waveFormGeometry.vertices[i].y = analyzerParams.times[i] * 1;
    }

    waveFormGeometry.verticesNeedUpdate = true;
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
    for (let i = 0; i < freqsLength; i++) {
      const value = Math.sqrt(analyzerParams.freqs[i]);
      const width = value * 0.15 < 1 ? 1 : value * 0.15;
      const halfWidth = width * 0.25;
      const spectrumMeth = circleSpectrum.children[i] as THREE.Mesh;
      const spectrumGeometry = spectrumMeth.geometry as THREE.ShapeGeometry;
      const spectrumMaterial = spectrumMeth.material as THREE.MeshBasicMaterial;
      const spectrumVertices = spectrumGeometry.vertices;

      const thetaMuli = theta * i;
      const thetaPlusPI = thetaMuli + Math.PI / 2;
      const thetaSubPI = thetaMuli - Math.PI / 2;

      spectrumVertices[2].x =
        value * Math.cos(thetaMuli) + halfWidth * Math.cos(thetaPlusPI);
      spectrumVertices[2].y =
        value * Math.sin(thetaMuli) + halfWidth * Math.sin(thetaPlusPI);
      spectrumVertices[3].x =
        value * Math.cos(thetaMuli) + halfWidth * Math.cos(thetaSubPI);
      spectrumVertices[3].y =
        value * Math.sin(thetaMuli) + halfWidth * Math.sin(thetaSubPI);

      spectrumGeometry.verticesNeedUpdate = true;
      spectrumMaterial.color.setHSL(analyzerParams.freqs[i] / 256, 1.0, 0.5);
    }

    for (let i = freqsLength; i < freqsLength * 2; i++) {
      const value = Math.sqrt(analyzerParams.freqs[i - freqsLength]);
      const width = value * 0.15 < 1 ? 1 : value * 0.15;
      const halfWidth = width * 0.25;
      const spectrumMeth = circleSpectrum.children[i] as THREE.Mesh;
      const spectrumGeometry = spectrumMeth.geometry as THREE.ShapeGeometry;
      const spectrumMaterial = spectrumMeth.material as THREE.MeshBasicMaterial;
      const spectrumVertices = spectrumGeometry.vertices;

      const thetaMuli = theta * i;
      const thetaPlusPI = thetaMuli + Math.PI / 2;
      const thetaSubPI = thetaMuli - Math.PI / 2;

      spectrumVertices[2].x =
        value * Math.cos(thetaMuli) + halfWidth * Math.cos(thetaPlusPI);
      spectrumVertices[2].y =
        value * Math.sin(thetaMuli) + halfWidth * Math.sin(thetaPlusPI);
      spectrumVertices[3].x =
        value * Math.cos(thetaMuli) + halfWidth * Math.cos(thetaSubPI);
      spectrumVertices[3].y =
        value * Math.sin(thetaMuli) + halfWidth * Math.sin(thetaSubPI);

      spectrumGeometry.verticesNeedUpdate = true;
      spectrumMaterial.color.setHSL(
        analyzerParams.freqs[i - freqsLength] / 256,
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
