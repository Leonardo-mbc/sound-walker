import * as React from 'react';
import * as styles from './style.css';
import {
  MusicScore,
  MusicMetaData,
} from '../../pages/player/player-interfaces';
import { TapEffect } from '../tap-effect';
import { KNOB_PLATE } from '../../../constant/target-name';

interface NotesPlayerV2Props {
  scores: MusicScore[][];
  meta: MusicMetaData;
  source: AudioBufferSourceNode;
  offsetCurrentTime: number;
}

interface NotesPlayerV2State {
  stepsTimers: number[];
  stepsState: StepsState;
  timingBarBlink: boolean;
  tapEffectDoms: JSX.Element[];
  knobBarState: KnobBarState;
}

interface StepsState {
  [key: string]: {
    isVisible: boolean;
    position: number;
  };
}
interface KnobBarState {
  vwx: number;
  y: number;
  opacity: number;
  vwwidth: number;
}

export class NotesPlayerV2 extends React.Component<
  NotesPlayerV2Props,
  NotesPlayerV2State
> {
  private container: HTMLDivElement;
  private stepCursor: HTMLDivElement;

  constructor(props: NotesPlayerV2Props, state: NotesPlayerV2State) {
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
                isVisible: true,
              },
            },
          });

          // カーソルの移動
          setTimeout(() => {
            this.stepCursor.style.top = `${5 +
              (8 - stepsState[key].position) * (90 / 8) +
              (90 / 8 - 5) / 2 -
              1}vh`;
          }, animationOffset - 200);
        }, (step.time + props.meta.offsetTime) * 1000 - animationOffset);

        stepsTimers.push(timerId);
        stepsState[key] = {
          isVisible: false,
          position: step.position,
        };
      });
    });

    setInterval(() => {
      this.setState({
        timingBarBlink: !this.state.timingBarBlink,
      });
    }, (60 / props.meta.bpm) * 1000);

    this.state = {
      stepsTimers,
      stepsState,
      timingBarBlink: false,
      tapEffectDoms: [],
      knobBarState: { vwx: 0, y: 0, opacity: 0, vwwidth: 50 },
    };
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

          const target = (e.target as HTMLElement).getAttribute('data-target');
          switch (target) {
            case KNOB_PLATE:
              this.setKnobBarOpacity(1);
              this.calcKnobBarMove(e.touches[0].clientY);
              break;

            default:
              this.onTap(e);
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
            case KNOB_PLATE:
              this.calcKnobBarMove(e.touches[0].clientY);
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
            case KNOB_PLATE:
              this.setKnobBarOpacity(0);
              break;
          }
        },
        passiveSupported ? { passive: false } : false
      );
    } catch (err) {}
  }

  onTap(e: TouchEvent) {
    const { source, offsetCurrentTime } = this.props;
    const { tapEffectDoms } = this.state;
    const fingerCount = e.touches.length;
    const currentTime = source.context.currentTime;
    const playTime = currentTime - offsetCurrentTime;

    Array(fingerCount)
      .fill(0)
      .map((_, id) => {
        const touch = e.touches.item(id);
        this.setState({
          tapEffectDoms: [
            ...tapEffectDoms,
            <TapEffect
              key={`${currentTime}`}
              isVisible
              x={touch.clientX}
              y={touch.clientY}
            />,
          ],
        });

        console.log(touch.identifier, touch.screenX, touch.screenY, playTime);
      });
  }

  setKnobBarOpacity(opacity: number) {
    this.setState({
      knobBarState: {
        ...this.state.knobBarState,
        opacity,
      },
    });
  }

  setKnobBarPosition(vwx: number, y: number) {
    this.setState({
      knobBarState: {
        ...this.state.knobBarState,
        vwx,
        y,
      },
    });
  }

  setKnobBarWidth(vwwidth: number) {
    this.setState({
      knobBarState: {
        ...this.state.knobBarState,
        vwwidth,
      },
    });
  }

  calcKnobBarMove(y: number) {
    const ratio = Math.sin(Math.PI * (y / innerHeight));
    const vwx = ratio * 10;
    const vwwidth = 60 - ratio * 10;

    this.setKnobBarPosition(vwx, y);
    this.setKnobBarWidth(vwwidth);
  }

  render() {
    const { scores } = this.props;
    const { stepsState, timingBarBlink, tapEffectDoms } = this.state;

    const KNOB_BIT_COUNT = 15;
    const knobBarStyle = {
      left: `${this.state.knobBarState.vwx}vw`,
      top: `calc(${this.state.knobBarState.y}px - 6vh)`,
      opacity: this.state.knobBarState.opacity,
      width: `${this.state.knobBarState.vwwidth}vw`,
    };

    return (
      <div ref={(elem) => (this.container = elem)} className={styles.container}>
        <div
          className={`${styles.timingBar} ${
            timingBarBlink ? styles.timingBarBlink : ''
          }`}
        />
        <div className={styles.knobPlate} data-target={KNOB_PLATE}>
          {new Array(KNOB_BIT_COUNT).fill(0).map((_, idx) => {
            const knobBinStyle: React.CSSProperties = {
              marginLeft: `${5 +
                Math.sin(Math.PI * (idx / (KNOB_BIT_COUNT - 1))) * 10}vw`,
              ...(idx % 2 === 1
                ? {
                    opacity: 0.3,
                    width: '4vw',
                  }
                : {}),
            };
            return (
              <div
                key={`knob-bit-${idx}`}
                style={knobBinStyle}
                className={styles.knobBit}
                data-target={KNOB_PLATE}
              />
            );
          })}
        </div>
        <div style={knobBarStyle} className={styles.knobBar} />
        <div className={styles.tapToSpike}>
          <div className={styles.spikeButton}>
            <span>TAP TO SPIKE</span>
          </div>
        </div>
        <div
          ref={(elem) => (this.stepCursor = elem)}
          className={styles.stepCursor}
        />
        {scores.map((score, scoreKey) => {
          return score.map((_, stepKey) => {
            const key = `${scoreKey}-${stepKey}`;
            const stepStyle = {
              top: `${5 +
                (8 - stepsState[key].position) * (90 / 8) +
                (90 / 8 - 5) / 2}vh`,
            };
            return stepsState[key].isVisible ? (
              <div key={key} className={styles.step} style={stepStyle} />
            ) : null;
          });
        })}
        {tapEffectDoms //FIXME: 出し方がよくない、同時タップだと新しい方が見えない
          .slice(
            tapEffectDoms.length < 10 ? 0 : tapEffectDoms.length - 10,
            tapEffectDoms.length
          )
          .map((v) => v)}
      </div>
    );
  }
}
