import * as React from 'react';
import * as styles from './style.css';
import { Configs } from '../../../../systems/system-interfaces';
import {
  TUTORIAL_MS_CLOSE,
  TUTORIAL_MS_SKIP_NEXT,
} from '../../../../constant/target-name';

interface MusicSelectTutorialProps {
  setSkipTutorialState: (value: Partial<Configs>) => void;
  hideTutorial: () => void;
}

interface MusicSelectTutorialState {
  isSkipTutorialFromNext: boolean;
}

export class MusicSelectTutorial extends React.Component<
  MusicSelectTutorialProps,
  MusicSelectTutorialState
> {
  private container: HTMLDivElement;

  constructor(
    props: MusicSelectTutorialProps,
    state: MusicSelectTutorialState
  ) {
    super(props, state);

    this.state = {
      isSkipTutorialFromNext: false,
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
            case TUTORIAL_MS_CLOSE:
              this.props.hideTutorial();
              break;
            case TUTORIAL_MS_SKIP_NEXT:
              const { isSkipTutorialFromNext } = this.state;
              this.setSkipTutorialState(!isSkipTutorialFromNext);
              break;
          }
        },
        passiveSupported ? { passive: false } : false
      );
    } catch (err) {}
  }

  setSkipTutorialState(isSkipTutorialFromNext: boolean) {
    const { setSkipTutorialState } = this.props;

    // FIXME 動作は問題ないけど、型でエラーになる
    const skipTarget = 'musicSelect' || '';

    setSkipTutorialState({ [skipTarget]: isSkipTutorialFromNext });
    this.setState({
      isSkipTutorialFromNext,
    });
  }

  render() {
    const { isSkipTutorialFromNext } = this.state;

    return (
      <div
        ref={(elem) => (this.container = elem)}
        className={styles.container}
        data-title={`TUTORIAL`}
        data-target={TUTORIAL_MS_CLOSE}
      >
        <div className={styles.sliderContainer}>
          <div className={styles.sliderBody}>
            <div className={styles.slider}>
              <img src="/assets/images/tutorial/music-select.gif" />
              <div className={styles.detail}>
                <span className={styles.detailTitle}>曲を切り替える</span>
                <span className={styles.detailBody}>
                  左右にスワイプすることで曲を切り替えることができます。（２曲以上解禁されている場合）
                  <br />
                  クロスフェーダーはスライドでAまたはBに切り替えることができます。
                </span>
              </div>
            </div>
          </div>
        </div>
        <div
          className={styles.tutorialConfig}
          data-target={TUTORIAL_MS_SKIP_NEXT}
        >
          <span
            className={`${styles.checkBox} ${
              isSkipTutorialFromNext ? 'checked' : ''
            }`}
            data-target={TUTORIAL_MS_SKIP_NEXT}
          />
          <span data-target={TUTORIAL_MS_SKIP_NEXT}>
            次からこのチュートリアルを表示しない
          </span>
        </div>
        <div className={styles.close} data-target={TUTORIAL_MS_CLOSE}>
          <div className={styles.button} data-target={TUTORIAL_MS_CLOSE} />
        </div>
      </div>
    );
  }
}
