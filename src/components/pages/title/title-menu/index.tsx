import * as React from 'react';
import * as styles from './style.css';
import { Redirect } from 'react-router';
import {
  MENU_MUSIC_SELECT,
  MENU_DJ_MODE,
  MENU_OPTIONS,
  CREDIT_BUTTON,
  CREDIT_CONTAINER,
  GITHUB_BUTTON,
  NCS_LINK,
  LEONARDO_LINK,
} from '../../../../constant/target-name';
import { AnimationGround } from '../../../commons/animation-ground';

interface TitleMenuProps {
  isLoadComplete: boolean;
  jumpTitleSound: () => void;
  goToMusicSelect: () => void;
  goToDJMode: () => void;
}

interface TitleMenuState {
  selectedItem: string;
  animationGroundFadeOut: boolean;
  creditShow: boolean;
  creditClass: string;
}

export class TitleMenu extends React.Component<TitleMenuProps, TitleMenuState> {
  private container: HTMLDivElement;

  constructor(props: TitleMenuProps, state: TitleMenuState) {
    super(props, state);

    if (props.isLoadComplete) {
      props.jumpTitleSound();
    }

    this.state = {
      selectedItem: null,
      animationGroundFadeOut: false,
      creditShow: false,
      creditClass: '',
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
            case MENU_DJ_MODE:
              this.selectMenu(target);
              break;
            case CREDIT_BUTTON:
              this.showCredit();
              break;
            case GITHUB_BUTTON:
              this.openGithub();
              break;
            case CREDIT_CONTAINER:
              this.turnOffCredit();
              break;
              case NCS_LINK:
            this.openNCS();
              break;
            case LEONARDO_LINK:
              this.openLeonardo();

            case MENU_MUSIC_SELECT:
            case MENU_OPTIONS:
          }
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
  }

  selectMenu(state: string) {
    this.setState({
      selectedItem: state,
      animationGroundFadeOut: true,
    });

    switch (state) {
      case MENU_MUSIC_SELECT:
        this.props.goToMusicSelect();
        break;
      case MENU_DJ_MODE:
        this.props.goToDJMode();
        break;
    }
  }

  showCredit() {
    this.setState({ creditClass: 'show', creditShow: true });
  }

  turnOffCredit() {
    this.setState({ creditClass: 'hide' });
  }

  hideCredit() {
    this.setState({ creditClass: '', creditShow: false });
  }

  openGithub() {
    location.href='https://github.com/Leonardo-mbc/sound-walker';
  }

  openNCS() {
    location.href='http://spoti.fi/NCS';
  }

  openLeonardo() {
    location.href='https://twitter.com/Leonardo_engr';
  }

  render() {
    return this.props.isLoadComplete ? (
      <div ref={(elem) => (this.container = elem)} className={styles.container}>
        <div className={styles.animationContainer}>
          <AnimationGround fadeOut={this.state.animationGroundFadeOut} />
        </div>
        {/* <div
          className={`${styles.menuList} ${
            this.state.selectedItem !== null ? styles.selected : ''
          }`}
        >
          <span
            className={
              this.state.selectedItem &&
              this.state.selectedItem !== MENU_MUSIC_SELECT
                ? styles.hideMenuText
                : ''
            }
          >
            <p
              className={styles.underDevelopment}
              data-target={MENU_MUSIC_SELECT}
            >
              Music Select
            </p>
          </span>
          <span
            className={
              this.state.selectedItem &&
              this.state.selectedItem !== MENU_DJ_MODE
                ? styles.hideMenuText
                : ''
            }
          >
            <p data-target={MENU_DJ_MODE}>Dj Mode</p>
          </span>
          <span
            className={
              this.state.selectedItem &&
              this.state.selectedItem !== MENU_OPTIONS
                ? styles.hideMenuText
                : ''
            }
            onClick={() => this.selectMenu(MENU_OPTIONS)}
          >
            <p data-target={MENU_OPTIONS}>Options</p>
          </span>
        </div> */}
        <div className={styles.playDjModeContainer} data-target={MENU_DJ_MODE}>
          <span className={this.state.selectedItem !== null ? styles.selected : ''} data-target={MENU_DJ_MODE}>TAP TO PLAY DJ MODE</span>
        </div>
        {this.state.creditShow ? (
          <div
            className={`${styles.creditContainer} ${this.state.creditClass}`}
            data-target={CREDIT_CONTAINER}
            onAnimationEnd={() =>
              this.state.creditClass === 'hide' ? this.hideCredit() : null
            }
          >
            <div className={styles.creditBody} data-target={CREDIT_CONTAINER}>
              <div className={styles.ncs}>
                <img src="/assets/images/ncs-jacket.jpg" />
                <div>
                  <p>Music provided by NoCopyrightSounds.</p>
                  <p data-target={NCS_LINK}>Watch: http://spoti.fi/NCS</p>
                </div>
              </div>
              <div>
                <p>Program, Design</p>
                <p data-target={LEONARDO_LINK}>Leonardo (@Leonardo_engr)</p>
              </div>
            </div>
          </div>
        ) : null}
        <div className={styles.footer}>
          <span data-target={GITHUB_BUTTON}>
            <span data-target={GITHUB_BUTTON} className={styles.githubIcon} />
          </span>
          <span data-target={CREDIT_BUTTON}>Credit</span>
        </div>
      </div>
    ) : (
      <Redirect to={'/'} />
    );
  }
}
