import * as React from 'react';
import * as styles from './style.css';
import { MusicScore, MusicMetaData } from '../../pages/player/player-interfaces';
import { TapEffect } from '../tap-effect';

interface NotesPlayerProps {
  scores: MusicScore[][];
  meta: MusicMetaData;
  source: AudioBufferSourceNode;
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

    this.setState({
      stepsTimers,
      stepsState
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
    const { context } = this.props.source;
    const fingerCount = e.touches.length;
    Array(fingerCount).fill(0).map((_, id) => {
      const touch = e.touches.item(id);
      this.setState({
        tapEffectDoms: [
          ...this.state.tapEffectDoms,
          <TapEffect key={`${context.currentTime}`} isVisible x={touch.clientX} y={touch.clientY} />
        ]
      });
      console.log(touch.identifier, touch.screenX, touch.screenY, context.currentTime);
    });
  }

  render() {
    const { scores } = this.props;
    const { stepsState, timingBarBlink } = this.state;

    return (
      <div ref={(elem) => this.container = elem} className={styles.container}>
        {scores.map((score, scoreKey) => {
          return score.map((_, stepKey) => {
            const key = `${scoreKey}-${stepKey}`;
            const stepStyle = {
              left: `calc(50% + ${50 + 100 * (stepsState[key].position - 4.5) + (5 * stepsState[key].position - 100)}px)`
            };
            return (
              stepsState[key].isVisible
              ? <div key={key} className={styles.step} style={stepStyle} />
              : null
            );
          });
        })}
        <div className={`${styles.timingBar} ${timingBarBlink? styles.timingBarBlink: ''}`} />
        {this.state.tapEffectDoms.map(v => v)}
      </div>
    );
  }
}
