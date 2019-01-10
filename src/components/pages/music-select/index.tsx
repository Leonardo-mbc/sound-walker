import * as React from 'react';
import * as styles from './style.css';
import {
  MusicSelectProps,
  MUSIC_SELECT_DJ_MODE,
} from './music-select-container';
import { MusicDisc } from '../../commons/music-disc';
import {
  DISC_LABEL,
  MUSIC_SELECT_PLAY_BUTTON,
  MUSIC_SELECT_BACK_BUTTON,
  MUSIC_SELECT_CONFIRM_CANCEL,
  MUSIC_SELECT_CONFIRM,
  ARRIVAL_CONTAINER,
} from '../../../constant/target-name';
import {
  getMusicMetaByIds,
  getMusicPositionById,
} from '../../../utilities/get-music-info';
import { LoaderCurtain } from '../../commons/loader-curtain';
import { SamplePlayer } from './sample-player';
import { LogoTransition } from '../../commons/logo-transition';
import { musicList } from '../../../constant/music-list';

interface MusicSelectState {
  discTouchstartPositionX: number;
  discTouchmovePositionX: number;
  discTouchmovePreviousPositionX: number;
  isConfirmationVisible: boolean;
  isTransitionVisible: boolean;
  isArrivalShow: boolean;
  arrivalClassState: string;
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
      isConfirmationVisible: false,
      isTransitionVisible: false,
      isArrivalShow: false,
      arrivalClassState: '',
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
          const { musicSelect, mode } = this.props;
          const { cursor, musicList } = musicSelect;

          const target = (e.target as HTMLElement).getAttribute('data-target');
          switch (target) {
            case DISC_LABEL:
              if (this.state.discTouchstartPositionX === null) {
                this.setDiscTouchstartPositionX(e.touches[0].clientX);
              }
              break;
            case MUSIC_SELECT_CONFIRM:
              this.setState({ isConfirmationVisible: true });
              break;
            case MUSIC_SELECT_CONFIRM_CANCEL:
              this.setState({ isConfirmationVisible: false });
              break;
            case MUSIC_SELECT_PLAY_BUTTON:
              this.showTransition();
              this.props.sampleMusicFadeOut(
                musicList[cursor].map((musicInfo) => {
                  return musicInfo.meta.musicId;
                }),
                1000
              );
              setTimeout(() => {
                this.props.goToPlayer(mode, musicSelect.selectedMusicId);
              }, 2000 /* wait LogoTransition */);
              break;
            case MUSIC_SELECT_BACK_BUTTON:
              this.props.goToMainMenu();
              this.props.sampleMusicFadeOut(
                musicList[cursor].map((musicInfo) => {
                  return musicInfo.meta.musicId;
                })
              );
              break;

            case ARRIVAL_CONTAINER:
              const musicId = (e.target as HTMLElement).getAttribute(
                'data-music-id'
              );
              this.hideArrival(musicId);
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

    this.arrivalCheck();
  }

  calcDiscMove(x: number) {
    const { musicSelect, achievement } = this.props;
    const { cursor, musicList } = musicSelect;
    const openedMusics = achievement.scores
      .filter(({ status }) => status === 'UNLOCKED')
      .map(({ musicId }) => musicId);

    if (this.state.discTouchstartPositionX !== null) {
      const moveX = x - this.state.discTouchstartPositionX;
      const acc =
        Math.abs(this.state.discTouchmovePreviousPositionX - moveX) / 2;
      const amountX = moveX + acc * moveX * 0.075;
      if (
        amountX <= -170 &&
        cursor <
          musicList.filter(
            (discInfo) => 0 <= openedMusics.indexOf(discInfo[0].meta.musicId)
          ).length -
            1
      ) {
        this.setCursor(cursor + 1);
        this.setDiscTouchstartPositionX(null);
        this.setDiscTouchmovePositionX(0);
      } else if (170 <= amountX && 0 < cursor) {
        this.setCursor(cursor - 1);
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
    const { musicSelect, setCursor, setSelectedMusicId } = this.props;
    const { musicList, discSide } = musicSelect;

    setCursor(newCursor);
    setSelectedMusicId(
      musicList[newCursor][discSide[newCursor] || 0].meta.musicId
    );
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

  showTransition() {
    this.setState({
      isTransitionVisible: true,
    });
  }

  arrivalCheck() {
    const { achievement } = this.props;
    const arrivalMusics = achievement.scores
      .filter(({ status }) => status === 'ARRIVAL')
      .map(({ musicId }) => musicId);

    const arrivalPosition = getMusicPositionById(arrivalMusics[0], musicList); // FIXME: musicList を store の musicList に置き換える
    this.setState({
      arrivalClassState: '',
      isArrivalShow: arrivalPosition ? true : false,
    });
  }

  hideArrival(musicId: string) {
    this.setState({
      arrivalClassState: 'hide',
    });

    setTimeout(() => {
      this.setState({
        isArrivalShow: false,
      });
      this.props.setAchievementState({ musicId, status: 'UNLOCKED' });
      this.arrivalCheck();
    }, 200);
  }

  render() {
    const {
      musicSelect,
      fadeDiscMusic,
      changeDiscSide,
      mode,
      isSystemReady,
      achievement,
      ringUnlockSound,
    } = this.props;
    const { cursor, musicList, discSide, selectedMusicId } = musicSelect;

    const discListStyle: React.CSSProperties = {
      transform: `translate3d(calc(${this.state.discTouchmovePositionX *
        0.8}px - ${cursor * 100}vh), calc(${this.state.discTouchmovePositionX *
        0.8}px - ${cursor * 100}vh), 0px)`,
    };
    const openedMusics = achievement.scores
      .filter(({ status }) => status === 'UNLOCKED')
      .map(({ musicId }) => musicId);
    const arrivalMusics = achievement.scores
      .filter(({ status }) => status === 'ARRIVAL')
      .map(({ musicId }) => musicId);
    const isMusicOpened = 0 <= openedMusics.indexOf(selectedMusicId);
    const selectedDiscMeta = getMusicMetaByIds([selectedMusicId], musicList)[0];

    let arrivalPosition = null;
    let arrivalMeta = null;

    if (arrivalMusics.length !== 0) {
      arrivalPosition = getMusicPositionById(arrivalMusics[0], musicList);
      if (arrivalPosition) {
        arrivalMeta =
          musicList[arrivalPosition.cursor][arrivalPosition.side].meta;
      }
    }

    return (
      <div ref={(elem) => (this.container = elem)} className={styles.container}>
        {isSystemReady ? (
          <>
            <div className={styles.title}>
              {mode === MUSIC_SELECT_DJ_MODE ? 'DJ MODE' : 'PLAY MODE'}
            </div>
            <div
              className={styles.backButton}
              data-target={MUSIC_SELECT_BACK_BUTTON}
            >
              Back
            </div>
            <div
              className={`${styles.playButton} ${
                isMusicOpened ? '' : styles.locked
              }`}
              data-target={isMusicOpened ? MUSIC_SELECT_CONFIRM : ''}
            >
              Play
            </div>
            <div className={styles.discList} style={discListStyle}>
              {musicList
                .filter(
                  (discInfo) =>
                    0 <= openedMusics.indexOf(discInfo[0].meta.musicId)
                )
                .map((discInfo, idx) => {
                  const customStyle: React.CSSProperties = {
                    marginLeft: `${idx * 200}vh`,
                  };
                  return (
                    <MusicDisc
                      key={`music-disc-${idx}`}
                      discInfo={discInfo}
                      discSide={discSide[idx]}
                      customStyle={customStyle}
                      fadeDiscMusic={fadeDiscMusic.bind(this, idx)}
                      changeDiscSide={changeDiscSide.bind(this, idx)}
                      isSideBLocked={
                        openedMusics.indexOf(discInfo[1].meta.musicId) < 0
                      }
                    >
                      {cursor === idx ? (
                        <SamplePlayer
                          key={`sample-player-${idx}`}
                          sampleMusicPlay={() => {
                            setTimeout(() => {
                              this.props.sampleMusicPlay({
                                musicIds: discInfo.map(
                                  (info) => info.meta.musicId
                                ),
                                faderGainValues: musicSelect.discFaders[
                                  cursor
                                ] || [1, 0],
                              });
                            }, 500); // 前の曲を止めるまでにかかる時間
                          }}
                          sampleMusicFadeOut={() => {
                            this.props.sampleMusicFadeOut(
                              discInfo.map((info) => info.meta.musicId)
                            );
                          }}
                        />
                      ) : null}
                    </MusicDisc>
                  );
                })}
            </div>
            {this.state.isConfirmationVisible ? (
              <div
                className={styles.confirmCover}
                data-target={MUSIC_SELECT_CONFIRM_CANCEL}
              >
                <div className={styles.confirm}>
                  <span className={styles.discTitle}>
                    「{selectedDiscMeta ? selectedDiscMeta.title : ''}
                    」を再生します よろしいですか？
                  </span>
                  <div className={styles.answerSet}>
                    <span
                      className={`${styles.answer} ${styles.play}`}
                      data-target={MUSIC_SELECT_PLAY_BUTTON}
                    >
                      Play
                    </span>
                    <span
                      className={styles.answer}
                      data-target={MUSIC_SELECT_CONFIRM_CANCEL}
                    >
                      CANCEL
                    </span>
                  </div>
                </div>
              </div>
            ) : null}
            {this.state.isArrivalShow && arrivalMeta ? (
              <div
                className={`${styles.arrivalContainer} ${
                  this.state.arrivalClassState
                }`}
                onLoad={() => ringUnlockSound()}
                data-target={ARRIVAL_CONTAINER}
                data-music-id={arrivalMeta.musicId}
              >
                <div
                  className={styles.arrivalItems}
                  data-target={ARRIVAL_CONTAINER}
                  data-music-id={arrivalMeta.musicId}
                >
                  <MusicDisc
                    isDiscImageOnly
                    discInfo={musicList[arrivalPosition.cursor]}
                    discSide={arrivalPosition.side}
                    size="25vh"
                    customStyle={{ margin: '20px' }}
                  />
                  <div
                    className={styles.arrivalMessage}
                    data-target={ARRIVAL_CONTAINER}
                    data-music-id={arrivalMeta.musicId}
                  >
                    <span
                      className={styles.unlockedText}
                      data-target={ARRIVAL_CONTAINER}
                      data-music-id={arrivalMeta.musicId}
                    >
                      {arrivalMeta.title}
                    </span>
                  </div>
                </div>
              </div>
            ) : null}
            {this.state.isTransitionVisible ? (
              <LogoTransition duration={1000} />
            ) : null}
          </>
        ) : (
          <LoaderCurtain />
        )}
      </div>
    );
  }
}
