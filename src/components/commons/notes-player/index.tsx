import * as React from 'react';
import * as styles from './style.css';
import { MusicScore, MusicMetaData } from '../../pages/player/player-interfaces';
import { TapEffect } from '../tap-effect';

interface NotesPlayerProps {
  scores: MusicScore[][];
  meta: MusicMetaData;
  source: AudioBufferSourceNode;
  offsetCurrentTime: number;
}

interface NotesPlayerState {
  stepsTimers: number[];
  stepsState: StepsState;
  timingBarBlink: boolean;
  tapEffectDoms: JSX.Element[];
}

interface StepsState {
  [key:string]: {
    isVisible: boolean;
    position: number;
  };
};

export class NotesPlayer extends React.Component<NotesPlayerProps, NotesPlayerState> {
  private container: HTMLDivElement;

  constructor(props: NotesPlayerProps, state: NotesPlayerState) {
    super(props, state);

    const animationOffset = 800;

    let stepsTimers: number[] = [];
    let stepsState: StepsState = {};
    props.scores.map((score, scoreKey) => {
      score.map((step, stepKey) => {
        const key = `${scoreKey}-${stepKey}`;

        const timerId = window.setTimeout(() => {
          this.setState({
            stepsState: {
              ...this.state.stepsState,
              [key]: {
                ...this.state.stepsState[key],
                isVisible: true
              }
            }
          });
        }, (step.time + props.meta.offsetTime) * 1000 - animationOffset);

        stepsTimers.push(timerId);
        stepsState[key] = {
          isVisible: false,
          position: step.position
        };
      });
    });

    setInterval(() => {
      this.setState({
        timingBarBlink: !this.state.timingBarBlink
      });
    }, (60 / props.meta.bpm) * 1000)


    this.state = {
      stepsTimers,
      stepsState,
      timingBarBlink: false,
      tapEffectDoms: []
    }
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
  }

  onTap(e: TouchEvent) {
    const { source, offsetCurrentTime } = this.props;
    const { tapEffectDoms } = this.state;
    const fingerCount = e.touches.length;
    const currentTime = source.context.currentTime;
    const playTime = currentTime - offsetCurrentTime;

    Array(fingerCount).fill(0).map((_, id) => {
      const touch = e.touches.item(id);
      this.setState({
        tapEffectDoms: [
          ...tapEffectDoms,
          <TapEffect key={`${currentTime}`} isVisible x={touch.clientX} y={touch.clientY} />
        ]
      });

      console.log(touch.identifier, touch.screenX, touch.screenY, playTime);
    });
  }

  render() {
    const { scores } = this.props;
    const { stepsState, timingBarBlink, tapEffectDoms } = this.state;

    return (
      <div ref={(elem) => this.container = elem} className={styles.container}>
        {scores.map((score, scoreKey) => {
          return score.map((_, stepKey) => {
            const key = `${scoreKey}-${stepKey}`;
            const stepStyle = {
              left: `${(innerWidth * 0.125 - 2.5) * (stepsState[key].position - 1) + 10}px`
            };
            return (
              stepsState[key].isVisible
              ? <div key={key} className={styles.step} style={stepStyle} />
              : null
            );
          });
        })}
        <div className={`${styles.timingBar} ${timingBarBlink? styles.timingBarBlink: ''}`} />
        {
          tapEffectDoms //FIXME: 出し方がよくない、同時タップだと新しい方が見えない
            .slice(tapEffectDoms.length < 10 ? 0 : tapEffectDoms.length - 10, tapEffectDoms.length)
            .map(v => v)
        }
      </div>
    );
  }
}
