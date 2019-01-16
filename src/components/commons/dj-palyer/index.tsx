import * as React from 'react';
import * as styles from './style.css';
import { MusicMetaData } from '../../pages/player/player-interfaces';
import { FilterNode, AnalyserParams } from '../../../systems/system-interfaces';
import { Knob } from '../knob';
import { KaossPad } from '../kaoss-pad';
import { CircleVisualizer } from '../circle-visualizer';

interface DJPlayerProps {
  meta: MusicMetaData;
  filterNode: FilterNode;
  gainNode: GainNode;
  analyzerNode: AnalyserNode;
  analyzerParams: AnalyserParams;
  backToDJMode: () => void;
}

interface DJPlayerState {}

const TWITTER = 'TWITTER';
const FACEBOOK = 'FACEBOOK';
const LINE = 'LINE';

let shareUrl = '';
let title = '';

export class DJPlayer extends React.Component<DJPlayerProps, DJPlayerState> {
  private container: HTMLDivElement;

  constructor(props: DJPlayerProps, state: DJPlayerState) {
    super(props, state);
  }

  componentDidMount() {
    let passiveSupported = false;
    try {
      document.addEventListener(
        'test',
        null,
        Object.defineProperty({}, 'passive', {
          get: function() {
            passiveSupported = true;
          },
        })
      );

      this.container.addEventListener(
        'touchstart',
        (e) => {
          e.preventDefault();

          switch (this.props.meta.musicId) {
            case 'm1':
              title = 'FastLane - NIVIRO Ft. Polly Anna';
              break;
            case 'r3':
              title = 'Linked - Jim Yosef & Anna Yvette';
              break;
            case 'm6':
              title = 'My Heart - Different Heaven & EH!DE';
              break;
            case 'm9':
              title = 'Popsicle - LFZ';
              break;
          }
          shareUrl = encodeURIComponent(
            `https://sound-walker-dj-demo.firebaseapp.com/#/dj-player/${
              this.props.meta.musicId
            }`
          );

          const target = (e.target as HTMLElement).getAttribute('data-target');
          switch (target) {
            case TWITTER:
              const twitterText = encodeURIComponent(
                `Playing [${title}] #SoundWalker`
              );
              location.href = `https://twitter.com/intent/tweet?text=${twitterText}&url=${shareUrl}`;
              break;
            case FACEBOOK:
              location.href = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
              break;
            case LINE:
              const lineText = encodeURIComponent(`${title} from Sound Walker`);
              location.href = `https://social-plugins.line.me/lineit/share?url=${shareUrl}&text=${lineText}`;
              break;
          }
        },
        passiveSupported ? { passive: false } : false
      );

      this.container.addEventListener(
        'touchmove',
        (e) => {
          e.preventDefault();

          const target = (e.target as HTMLElement).getAttribute('data-target');

          switch (target) {
            default:
              break;
          }
        },
        passiveSupported ? { passive: false } : false
      );

      this.container.addEventListener(
        'touchend',
        (e) => {
          e.preventDefault();

          const target = (e.target as HTMLElement).getAttribute('data-target');
          switch (target) {
            default:
              break;
          }
        },
        passiveSupported ? { passive: false } : false
      );
    } catch (err) {}
  }

  setVolume(volume: number) {
    this.props.gainNode.gain.value = volume / 100;
  }

  setResonance(resonance: number) {
    this.props.filterNode.highPassFilterNode.Q.value = resonance;
    this.props.filterNode.lowPassFilterNode.Q.value = resonance;
  }

  render() {
    const { analyzerNode, analyzerParams } = this.props;

    return (
      <div ref={(elem) => (this.container = elem)} className={styles.container}>
        <div className={styles.circleVisualizerContainer}>
          <CircleVisualizer
            analyzerNode={analyzerNode}
            analyzerParams={analyzerParams}
          />
        </div>
        <div className={styles.effectorContainer}>
          <div className={styles.knobContainer}>
            <Knob
              min={0}
              max={100}
              initialValue={100}
              color="orange"
              label="VOLUME"
              onChange={(v: number) => this.setVolume(v)}
            />
            <Knob
              min={0}
              max={30}
              initialValue={0}
              color="blue"
              label="RESONANCE"
              onChange={(v: number) => this.setResonance(v)}
            />
          </div>
          <KaossPad vhSize={80} filterNode={this.props.filterNode} />
        </div>
        <div className={styles.systemButtons}>
          <img
            src="assets/images/social-icons/twitter.svg"
            width="30px"
            data-target={TWITTER}
          />
          <img
            src="assets/images/social-icons/facebook.svg"
            width="30px"
            data-target={FACEBOOK}
          />
          <img
            src="assets/images/social-icons/line.svg"
            width="30px"
            data-target={LINE}
          />
        </div>
      </div>
    );
  }
}
