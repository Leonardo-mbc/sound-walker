import * as React from 'react';
import * as styles from './style.css';
import { DiscInfo } from './music-disc-interface';
import { DISC_LABEL, FADER_BAR } from '../../../constant/target-name';

interface MusicDiscProps {
  discInfo: DiscInfo;
  customStyle: React.CSSProperties;
  selectedMusicId: string;
  isLevelVisible?: boolean;
  fadeDiscMusic?: (values: number[]) => void;
}

interface MusicDiscState {
  faderBarTouchstartPositionX: number;
  faderBarTouchmovePositionX: number;
  faderBarPositionX: number;
}

export class MusicDisc extends React.Component<MusicDiscProps, MusicDiscState> {
  private container: HTMLDivElement;
  private fader: HTMLDivElement;

  constructor(props: MusicDiscProps, state: MusicDiscState) {
    super(props, state);

    this.state = {
      faderBarTouchstartPositionX: null,
      faderBarTouchmovePositionX: 0,
      faderBarPositionX: 0,
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
            case FADER_BAR:
              if (this.state.faderBarTouchstartPositionX === null) {
                this.setFaderBarTouchstartPositionX(e.touches[0].clientX);
              }
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
            case FADER_BAR:
              this.calcFaderBarMove(e.touches[0].clientX);
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
            case FADER_BAR:
              this.setFaderBarTouchstartPositionX(null);
              this.setFaderBarPositionX(
                this.state.faderBarPositionX +
                  this.state.faderBarTouchmovePositionX
              );
              this.setFaderBarTouchmovePositionX(0);
              break;
          }
        },
        passiveSupported ? { passive: false } : false
      );
    } catch (err) {}
  }

  setFaderBarTouchstartPositionX(x: number) {
    this.setState({
      faderBarTouchstartPositionX: x,
    });
  }

  setFaderBarTouchmovePositionX(x: number) {
    this.setState({
      faderBarTouchmovePositionX: x,
    });
  }

  setFaderBarPositionX(x: number) {
    this.setState({
      faderBarPositionX: x,
    });
  }

  calcFaderBarMove(x: number) {
    if (this.state.faderBarTouchstartPositionX !== null) {
      const moveX = x - this.state.faderBarTouchstartPositionX;
      const faderBarWidth = parseFloat(getComputedStyle(this.fader).width);

      if (this.state.faderBarPositionX + moveX < 0) {
        this.setFaderBarTouchmovePositionX(-this.state.faderBarPositionX);
      } else if (faderBarWidth < this.state.faderBarPositionX + moveX) {
        this.setFaderBarTouchmovePositionX(
          faderBarWidth - this.state.faderBarPositionX
        );
      } else {
        this.setFaderBarTouchmovePositionX(moveX);
      }

      if (this.props.fadeDiscMusic) {
        const cueAGain =
          1.0 -
          (this.state.faderBarPositionX +
            this.state.faderBarTouchmovePositionX) /
            faderBarWidth;
        const cueBGain = 1.0 - cueAGain;

        this.props.fadeDiscMusic([cueAGain, cueBGain]);
      }
    }
  }

  render() {
    const { customStyle, discInfo, selectedMusicId } = this.props;

    const discCustomStyle = {
      backgroundImage: `url(/assets/images/disc-images/${
        discInfo[0].meta.discImage
      })`,
    };

    let pickerCustomStyle: React.CSSProperties;
    if (this.fader) {
      pickerCustomStyle = {
        marginLeft: `${((this.state.faderBarPositionX +
          this.state.faderBarTouchmovePositionX) /
          parseFloat(getComputedStyle(this.fader).width)) *
          100}%`,
      };
    }

    return (
      <div
        ref={(elem) => (this.container = elem)}
        className={styles.container}
        style={customStyle}
      >
        <div
          className={styles.disc}
          style={discCustomStyle}
          data-target={DISC_LABEL}
        />
        <div className={styles.details}>
          <div
            className={`${styles.values} ${
              selectedMusicId === discInfo[0].meta.musicId ? styles.show : ''
            }`}
          >
            <div className={styles.title}>{discInfo[0].meta.title}</div>
            <div className={styles.artist}>{discInfo[0].meta.artist}</div>
          </div>
        </div>
        <div className={styles.remixes}>
          <div className={styles.crossFader}>
            <span className={styles.a}>A</span>
            <div ref={(elem) => (this.fader = elem)} className={styles.fader}>
              <div
                className={styles.pick}
                style={pickerCustomStyle}
                data-target={FADER_BAR}
              >
                <div className={styles.bar} data-target={FADER_BAR} />
              </div>
            </div>
            <span className={styles.b}>B</span>
          </div>
        </div>
      </div>
    );
  }
}
