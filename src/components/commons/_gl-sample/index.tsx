import * as React from 'react';
import * as THREE from 'three';
import * as OrbitControls from 'three-orbitcontrols';
import { EffectComposer, RenderPass, ShaderPass, BloomPass } from 'postprocessing';
import { CopyShader } from 'three-shaders';
import { median } from 'mathjs';
import * as styles from './style.css';
import { MusicScore } from '../../pages/player/player-interfaces';

interface NotesPlayerProps {
  scores: MusicScore[][];
  source: AudioBufferSourceNode;
}

interface NotesPlayerState {

}

export class NotesPlayer extends React.Component<NotesPlayerProps, NotesPlayerState> {
  private container: HTMLDivElement;
  private renderer: THREE.WebGLRenderer;
  private composer: typeof EffectComposer;
  private controls: typeof OrbitControls;

  componentWillMount() {
    const { scores } = this.props;
    const width = innerWidth;
    const height = innerHeight;

    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const cameraBasePositions = { x: 0, y: 5, z: 10 };
    camera.position.set(cameraBasePositions.x, cameraBasePositions.y, cameraBasePositions.z);

    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.shadowMap.enabled = false;
    this.renderer.setPixelRatio(devicePixelRatio);

    this.composer = new EffectComposer(this.renderer);
    const renderPass = new RenderPass(scene, camera);
    this.composer.addPass(renderPass);

    // const glitchPass = new GlitchPass();
    // glitchPass.renderToScreen = true;
    // this.composer.addPass(glitchPass);

    const bloomPass = new BloomPass(1.0, 25, 2.0, 512);
    bloomPass.renderToScreen = true;
    this.composer.addPass(bloomPass);

    const toScreen = new ShaderPass(CopyShader());
    toScreen.renderToScreen = false;
    this.composer.addPass(toScreen);

    this.controls = new OrbitControls(camera, this.renderer.domElement);

    let stepPosition: number[] = [];
    const stepGroup = new THREE.Group();

    scores.map((score, scoreKey) => {
      stepPosition[scoreKey] = 0;
      score.map((step) => {
        stepPosition[scoreKey] += step.signal;
        const geometry = new THREE.BoxBufferGeometry(0.5, 0.5, 2);
        const material = new THREE.MeshBasicMaterial({ color: 0xefefef });
        const cube = new THREE.Mesh(geometry, material);
        cube.rotateY(Math.PI / 2);
        cube.position.set(stepPosition[scoreKey] * 5, 0, -step.time * 10);
        stepGroup.add(cube);
      });
    });

    stepGroup.position.setX(-median(stepPosition));
    scene.add(stepGroup);
  }

  componentDidMount() {
    let passiveSupported = false;
    try {
      document.addEventListener("test", null, Object.defineProperty({}, "passive", {
        get: function() {
          passiveSupported = true;
        }
      }));
    } catch(err) {}

    this.container.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.onTap(e);
    }, passiveSupported ? { passive: false } : false);

    this.container.addEventListener('touchmove', (e) => {
      e.preventDefault();
    }, passiveSupported ? { passive: false } : false);

    this.container.appendChild(this.renderer.domElement);
    this.frameAction();
  }

  frameAction() {
    this.controls.update();
    this.composer.render();
    requestAnimationFrame(this.frameAction.bind(this));
  }

  onTap(e: TouchEvent) {
    const { context } = this.props.source;
    const fingerCount = e.touches.length;
    Array(fingerCount).fill(0).map((_, id) => {
      const touch = e.touches.item(id);
      console.log(touch.identifier, touch.screenX, touch.screenY, context.currentTime);
    });
  }

  render() {
    return (
      <div ref={(elem) => this.container = elem} className={styles.container}>

      </div>
    );
  }
}
