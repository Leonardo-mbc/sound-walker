import * as React from 'react';
import * as styles from './style.css';
import { MusicSelectProps } from './music-select-container';
import { MusicDisc } from '../../commons/music-disc';

// デバッグ用 const Object
import { musicList } from '../../../constant/music-list';
import {
  DISC_LABEL,
  MUSIC_SELECT_PLAY_BUTTON,
  MUSIC_SELECT_BACK_BUTTON,
} from '../../../constant/target-name';

interface MusicSelectState {
  cursor: number;
  discTouchstartPositionX: number;
  discTouchmovePositionX: number;
  discTouchmovePreviousPositionX: number;
  selectedMusicId: string;
}

export class MusicSelect extends React.Component<
  MusicSelectProps,
  MusicSelectState
> {
  private container: HTMLDivElement;

  constructor(props: MusicSelectProps, state: MusicSelectState) {
    super(props, state);

    this.state = {
      cursor: 0,
      discTouchstartPositionX: null,
      discTouchmovePositionX: 0,
      discTouchmovePreviousPositionX: 0,
      selectedMusicId: 'm1',
    };

    // TODO: musicList を本物に置き換え
    this.props.sampleMusicPlay({
      musicIds: musicList[0].map((musicInfo) => {
        return musicInfo.meta.musicId;
      }),
      faderGainValues: [1, 0],
    });

    // TODO: デコードが複数同時に立たけるようにする。キューイングなどで！
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
            case DISC_LABEL:
              if (this.state.discTouchstartPositionX === null) {
                this.setDiscTouchstartPositionX(e.touches[0].clientX);
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
            case MUSIC_SELECT_PLAY_BUTTON:
              this.props.goToPlayer(this.state.selectedMusicId);
              break;
            case MUSIC_SELECT_BACK_BUTTON:
              this.props.goToMainMenu();
              this.props.sampleMusicFadeOut(
                musicList[this.state.cursor].map((musicInfo) => {
                  return musicInfo.meta.musicId;
                })
              );
              break;
          }
        },
        passiveSupported ? { passive: false } : false
      );
    } catch (err) {}
  }

  calcDiscMove(x: number) {
    if (this.state.discTouchstartPositionX !== null) {
      const moveX = x - this.state.discTouchstartPositionX;
      const acc =
        Math.abs(this.state.discTouchmovePreviousPositionX - moveX) / 2;
      const amountX = moveX + acc * moveX * 0.075;
      if (amountX <= -170 && this.state.cursor < musicList.length - 1) {
        // TODO: musicList を本物に置き換え

        this.setCursor(this.state.cursor + 1);
        this.setSelectedMusicId(musicList[this.state.cursor][0].meta.musicId);
        // TODO: musicList を本物に置き換え
        this.setDiscTouchstartPositionX(null);
        this.setDiscTouchmovePositionX(0);
      } else if (170 <= amountX && 0 < this.state.cursor) {
        this.setCursor(this.state.cursor - 1);
        this.setSelectedMusicId(musicList[this.state.cursor][0].meta.musicId);
        // TODO: musicList を本物に置き換え
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
    const { musicSelect } = this.props;

    this.props.sampleMusicFadeOut(
      musicList[this.state.cursor].map((musicInfo) => {
        return musicInfo.meta.musicId;
      })
    );

    this.setState({
      cursor: newCursor,
    });

    setTimeout(() => {
      // TODO: musicList を本物に置き換え
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

  setSelectedMusicId(musicId: string) {
    this.setState({
      selectedMusicId: musicId,
    });
  }

  render() {
    const discListStyle: React.CSSProperties = {
      transform: `translate3d(calc(${this.state.discTouchmovePositionX *
        0.8}px - ${this.state.cursor * 100}vh), calc(${this.state
        .discTouchmovePositionX * 0.8}px - ${this.state.cursor * 100}vh), 0px)`,
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
                selectedMusicId={this.state.selectedMusicId}
                fadeDiscMusic={this.props.fadeDiscMusic.bind(this, idx)}
              />
            );
          })}
        </div>
      </div>
    );
  }
}
