import * as React from 'react';
import * as styles from './style.css';
import { Redirect } from 'react-router';

interface TitleIntroProps {
  isLoadComplete: boolean;
  goToMainMenu: () => void;
}

interface TitleIntroState {
  creditState: string;
}

const CREDIT_SOUND_WALKER = 'CREDIT_SOUND_WALKER';
const CREDIT_SOUND_NCS = 'CREDIT_SOUND_NCS';
const CREDIT_SOUND_PROFILE = 'CREDIT_SOUND_PROFILE';
let creditNCSTimer: number, creditProfileTimer: number, creditEndTimer: number;

export class TitleIntro extends React.Component<
  TitleIntroProps,
  TitleIntroState
> {
  private container: HTMLDivElement;

  constructor(props: TitleIntroProps, state: TitleIntroState) {
    super(props, state);

    this.state = {
      creditState: CREDIT_SOUND_WALKER,
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
          clearTimeout(creditNCSTimer);
          clearTimeout(creditProfileTimer);
          clearTimeout(creditEndTimer);
          this.props.goToMainMenu();
        },
        passiveSupported ? { passive: false } : false
      );

      this.container.addEventListener(
        'touchmove',
        (e) => {
          e.preventDefault();
        },
        passiveSupported ? { passive: false } : false
      );
    } catch (err) {}
    if (this.props.isLoadComplete) {
      // @ts-ignore: Unreachable code error
      creditNCSTimer = setTimeout(() => {
        this.setState({
          creditState: CREDIT_SOUND_NCS,
        });
      }, 2400);
      // @ts-ignore: Unreachable code error
      creditProfileTimer = setTimeout(() => {
        this.setState({
          creditState: CREDIT_SOUND_PROFILE,
        });
      }, 4800);
      // @ts-ignore: Unreachable code error
      creditEndTimer = setTimeout(() => {
        this.props.goToMainMenu();
      }, 10000);
    }
  }

  render() {
    const { isLoadComplete } = this.props;
    const { creditState } = this.state;

    return (
      <div ref={(elem) => (this.container = elem)} className={styles.container}>
        {isLoadComplete ? (
          <div className={styles.goToMainMenu}>
            {(() => {
              switch (creditState) {
                case CREDIT_SOUND_WALKER:
                  return (
                    <img
                      className={styles.introLogo}
                      src="assets/images/logo-anim@x2.gif"
                    />
                  );
                case CREDIT_SOUND_NCS:
                  return (
                    <img
                      className={styles.ncsLogo}
                      src="assets/images/ncs-jacket.jpg"
                    />
                  );
                case CREDIT_SOUND_PROFILE:
                  return (
                    <span className={styles.profile}>
                      DEVELOPED BY Leonardo (@Leonardo_engr)
                    </span>
                  );
              }
            })()}
            <div className={styles.tapToSkip}>
              <span>TAP TO SKIP</span>
            </div>
          </div>
        ) : (
          <Redirect to={'/'} />
        )}
      </div>
    );
  }
}
