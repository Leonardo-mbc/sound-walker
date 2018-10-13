import * as React from 'react';
import * as styles from './style.css';
import { MusicSelectProps } from './music-select-container';
import { MusicDisc } from '../../commons/music-disc';
import {
  DISC_LABEL,
  MUSIC_SELECT_PLAY_BUTTON,
  MUSIC_SELECT_BACK_BUTTON,
} from '../../../constant/target-name';

interface MusicSelectState {
  discTouchstartPositionX: number;
  discTouchmovePositionX: number;
  discTouchmovePreviousPositionX: number;
}

export class MusicSelect extends React.Component<
  MusicSelectProps,
  MusicSelectState
> {
  private container: HTMLDivElement;

  constructor(props: MusicSelectProps, state: MusicSelectState) {
    super(props, state);

    this.state = {
      discTouchstartPositionX: null,
      discTouchmovePositionX: 0,
      discTouchmovePreviousPositionX: 0,
    };

    props.getMusicList();
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
          const { musicSelect } = this.props;
          const { cursor, musicList } = musicSelect;

          const target = (e.target as HTMLElement).getAttribute('data-target');
          switch (target) {
            case DISC_LABEL:
              if (this.state.discTouchstartPositionX === null) {
                this.setDiscTouchstartPositionX(e.touches[0].clientX);
              }
              break;
            case MUSIC_SELECT_PLAY_BUTTON:
              this.props.goToPlayer(musicSelect.selectedMusicId);
              this.props.sampleMusicFadeOut(
                musicList[cursor].map((musicInfo) => {
                  return musicInfo.meta.musicId;
                })
              );
              break;
            case MUSIC_SELECT_BACK_BUTTON:
              this.props.goToMainMenu();
              this.props.sampleMusicFadeOut(
                musicList[cursor].map((musicInfo) => {
                  return musicInfo.meta.musicId;
                })
              );
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
            case DISC_LABEL:
              this.calcDiscMove(e.touches[0].clientX);
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
            case DISC_LABEL:
              this.setDiscTouchstartPositionX(null);
              this.setDiscTouchmovePositionX(0);
              break;
          }
        },
        passiveSupported ? { passive: false } : false
      );
    } catch (err) {}
  }

  calcDiscMove(x: number) {
    const { musicSelect, setSelectedMusicId } = this.props;
    const { discSide, cursor, musicList } = musicSelect;

    if (this.state.discTouchstartPositionX !== null) {
      const moveX = x - this.state.discTouchstartPositionX;
      const acc =
        Math.abs(this.state.discTouchmovePreviousPositionX - moveX) / 2;
      const amountX = moveX + acc * moveX * 0.075;
      if (amountX <= -170 && cursor < musicList.length - 1) {
        this.setCursor(cursor + 1);
        setSelectedMusicId(
          musicList[cursor + 1][discSide[cursor] || 0].meta.musicId
        );
        this.setDiscTouchstartPositionX(null);
        this.setDiscTouchmovePositionX(0);
      } else if (170 <= amountX && 0 < cursor) {
        this.setCursor(cursor - 1);
        setSelectedMusicId(
          musicList[cursor - 1][discSide[cursor] || 0].meta.musicId
        );
        this.setDiscTouchstartPositionX(null);
        this.setDiscTouchmovePositionX(0);
      } else {
        this.setDiscTouchmovePreviousPositionX(
          this.state.discTouchmovePositionX
        );
        this.setDiscTouchmovePositionX(moveX);
      }
    }
  }

  async setCursor(newCursor: number) {
    const { musicSelect, setCursor } = this.props;
    const { cursor, musicList } = musicSelect;

    this.props.sampleMusicFadeOut(
      musicList[cursor].map((musicInfo) => {
        return musicInfo.meta.musicId;
      })
    );

    setCursor(newCursor);

    setTimeout(() => {
      this.props.sampleMusicPlay({
        musicIds: musicList[newCursor].map(
          (musicInfo) => musicInfo.meta.musicId
        ),
        faderGainValues: musicSelect.discFaders[newCursor] || [1, 0],
      });
    }, 500);
  }

  setDiscTouchstartPositionX(x: number) {
    this.setState({
      discTouchstartPositionX: x,
    });
  }

  setDiscTouchmovePositionX(x: number) {
    this.setState({
      discTouchmovePositionX: x,
    });
  }

  setDiscTouchmovePreviousPositionX(x: number) {
    this.setState({
      discTouchmovePreviousPositionX: x,
    });
  }

  render() {
    const { musicSelect, fadeDiscMusic, changeDiscSide } = this.props;
    const { selectedMusicId, cursor, musicList } = musicSelect;

    const discListStyle: React.CSSProperties = {
      transform: `translate3d(calc(${this.state.discTouchmovePositionX *
        0.8}px - ${cursor * 100}vh), calc(${this.state.discTouchmovePositionX *
        0.8}px - ${cursor * 100}vh), 0px)`,
    };
    return (
      <div ref={(elem) => (this.container = elem)} className={styles.container}>
        <div
          className={styles.playButton}
          data-target={MUSIC_SELECT_PLAY_BUTTON}
        >
          Play
        </div>
        <div
          className={styles.backButton}
          data-target={MUSIC_SELECT_BACK_BUTTON}
        >
          Back
        </div>
        <div className={styles.discList} style={discListStyle}>
          {musicList.map((discInfo, idx) => {
            const customStyle: React.CSSProperties = {
              marginLeft: `${idx * 200}vh`,
            };
            return (
              <MusicDisc
                key={`music-disc-${idx}`}
                discInfo={discInfo}
                customStyle={customStyle}
                selectedMusicId={selectedMusicId}
                fadeDiscMusic={fadeDiscMusic.bind(this, idx)}
                changeDiscSide={changeDiscSide.bind(this, idx)}
              />
            );
          })}
        </div>
      </div>
    );
  }
}
