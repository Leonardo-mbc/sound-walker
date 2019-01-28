import * as React from 'react';
import * as styles from './style.css';
import {
  MusicSelectMode,
  MUSIC_SELECT_DJ_MODE,
  MUSIC_SELECT_PLAY,
} from '../../music-select/music-select-container';
import { Configs } from '../../../../systems/system-interfaces';
import {
  TUTORIAL_CLOSE,
  TUTORIAL_SKIP_NEXT,
  TUTORIAL_BACK_PAGE,
  TUTORIAL_NEXT_PAGE,
  TUTORIAL_BODY,
} from '../../../../constant/target-name';

interface PlayerTutorialProps {
  mode: MusicSelectMode;
  setSkipTutorialState: (value: Partial<Configs>) => void;
  hideTutorial: () => void;
}

interface PlayerTutorialState {
  isSkipTutorialFromNext: boolean;
  page: number;
  maxPage: number;
  touchstartPositionX: number;
  touchmovePositionX: number;
  touchmovePreviousPositionX: number;
}

const getTitleName = (mode: MusicSelectMode) => {
  switch (mode) {
    case MUSIC_SELECT_DJ_MODE:
      return 'DJ MODE';
    case MUSIC_SELECT_PLAY:
      return 'PLAY MODE';
  }
};

export class PlayerTutorial extends React.Component<
  PlayerTutorialProps,
  PlayerTutorialState
> {
  private container: HTMLDivElement;

  constructor(props: PlayerTutorialProps, state: PlayerTutorialState) {
    super(props, state);

    this.state = {
      isSkipTutorialFromNext: false,
      page: 0,
      maxPage: (() => {
        switch (props.mode) {
          case MUSIC_SELECT_DJ_MODE:
            return 1;
          case MUSIC_SELECT_PLAY:
            return 2;
        }
      })(),
      touchstartPositionX: null,
      touchmovePositionX: 0,
      touchmovePreviousPositionX: 0,
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
            case TUTORIAL_CLOSE:
              this.props.hideTutorial();
              break;
            case TUTORIAL_SKIP_NEXT:
              const { isSkipTutorialFromNext } = this.state;
              this.setSkipTutorialState(!isSkipTutorialFromNext);
              break;
            case TUTORIAL_BACK_PAGE:
              this.setPage(-1);
              break;
            case TUTORIAL_NEXT_PAGE:
              this.setPage(1);
              break;
            case TUTORIAL_BODY:
              if (this.state.touchstartPositionX === null) {
                this.setTouchstartPositionX(e.touches[0].clientX);
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
            case TUTORIAL_BODY:
              this.calcTutorialMove(e.touches[0].clientX);
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
            case TUTORIAL_BODY:
              this.setTouchstartPositionX(null);
              this.setTouchmovePositionX(0);
              break;
          }
        },
        passiveSupported ? { passive: false } : false
      );
    } catch (err) {}
  }

  setSkipTutorialState(isSkipTutorialFromNext: boolean) {
    const { mode, setSkipTutorialState } = this.props;

    const skipTarget = (() => {
      switch (mode) {
        case MUSIC_SELECT_DJ_MODE:
          return 'djMode';
        case MUSIC_SELECT_PLAY:
          return 'playMode';
      }
    })();

    setSkipTutorialState({ [skipTarget]: isSkipTutorialFromNext });
    this.setState({
      isSkipTutorialFromNext,
    });
  }

  setPage(direction: number) {
    const { page, maxPage } = this.state;

    let newPage = page + direction;
    if (newPage < 0) {
      newPage = 0;
    } else if (maxPage < newPage) {
      newPage = maxPage;
    }

    this.setState({ page: newPage });
  }

  setTouchstartPositionX(x: number) {
    this.setState({
      touchstartPositionX: x,
    });
  }

  setTouchmovePositionX(x: number) {
    this.setState({
      touchmovePositionX: x,
    });
  }

  setTouchmovePreviousPositionX(x: number) {
    this.setState({
      touchmovePreviousPositionX: x,
    });
  }

  calcTutorialMove(x: number) {
    if (this.state.touchstartPositionX !== null) {
      const { page, maxPage } = this.state;
      const moveX = x - this.state.touchstartPositionX;
      const acc = Math.abs(this.state.touchmovePreviousPositionX - moveX) / 2;
      const amountX = moveX + acc * moveX * 0.075;
      if (amountX <= -170 && page < maxPage) {
        this.setPage(1);
        this.setTouchstartPositionX(null);
        this.setTouchmovePositionX(0);
      } else if (170 <= amountX && 0 < page) {
        this.setPage(-1);
        this.setTouchstartPositionX(null);
        this.setTouchmovePositionX(0);
      } else {
        this.setTouchmovePreviousPositionX(this.state.touchmovePositionX);
        this.setTouchmovePositionX(moveX);
      }
    }
  }

  render() {
    const { mode } = this.props;
    const { isSkipTutorialFromNext, page, maxPage } = this.state;

    const slideBodyStyle = {
      transform: `translate3d(calc(${this.state.touchmovePositionX *
        0.8}px - ${page * 100}%), 0px, 0px)`,
    };

    return (
      <div
        ref={(elem) => (this.container = elem)}
        className={styles.container}
        data-title={`${getTitleName(mode)} TUTORIAL`}
        data-target={TUTORIAL_CLOSE}
      >
        <div className={styles.sliderContainer}>
          <div
            className={`${styles.pager} left`}
            style={{ visibility: page === 0 ? 'hidden' : 'visible' }}
            data-target={TUTORIAL_BACK_PAGE}
          />
          <div
            className={styles.sliderBody}
            style={slideBodyStyle}
            data-target={TUTORIAL_BODY}
          >
            <div className={styles.slider} data-target={TUTORIAL_BODY}>
              <img
                src="/assets/images/tutorial/knob.gif"
                data-target={TUTORIAL_BODY}
              />
              <div className={styles.detail} data-target={TUTORIAL_BODY}>
                <span
                  className={styles.detailTitle}
                  data-target={TUTORIAL_BODY}
                >
                  KNOB（ノブ）オブジェクト
                </span>
                <span className={styles.detailBody} data-target={TUTORIAL_BODY}>
                  KNOBオブジェクトは左右／上下にスワイプすることで値を変更できます。
                </span>
              </div>
            </div>
            <div className={styles.slider} data-target={TUTORIAL_BODY}>
              <img
                src="/assets/images/tutorial/effector-pad.gif"
                data-target={TUTORIAL_BODY}
              />
              <div className={styles.detail} data-target={TUTORIAL_BODY}>
                <span
                  className={styles.detailTitle}
                  data-target={TUTORIAL_BODY}
                >
                  エフェクターパッド
                </span>
                <span className={styles.detailBody} data-target={TUTORIAL_BODY}>
                  左右（←→）は LowPassFilter、上下（↑↓）は HighPassFilter
                  が割り当てられています。
                </span>
              </div>
            </div>
          </div>
          <div
            className={`${styles.pager} right`}
            style={{ visibility: page === maxPage ? 'hidden' : 'visible' }}
            data-target={TUTORIAL_NEXT_PAGE}
          />
        </div>
        <div className={styles.tutorialConfig} data-target={TUTORIAL_SKIP_NEXT}>
          <span
            className={`${styles.checkBox} ${
              isSkipTutorialFromNext ? 'checked' : ''
            }`}
            data-target={TUTORIAL_SKIP_NEXT}
          />
          <span data-target={TUTORIAL_SKIP_NEXT}>
            次からこのチュートリアルを表示しない
          </span>
        </div>
        <div className={styles.close} data-target={TUTORIAL_CLOSE}>
          <div className={styles.button} data-target={TUTORIAL_CLOSE} />
        </div>
      </div>
    );
  }
}
