import * as React from 'react';
import * as styles from './style.css';
import { Redirect } from 'react-router';
import {
  MENU_MUSIC_SELECT,
  MENU_DJ_MODE,
  MENU_OPTIONS,
} from '../../../../constant/target-name';
import { AnimationGround } from '../../../commons/animation-ground';

interface TitleMenuProps {
  isLoadComplete: boolean;
  jumpTitleSound: () => void;
  goToMusicSelect: () => void;
}

interface TitleMenuState {
  selected: boolean;
}

export class TitleMenu extends React.Component<TitleMenuProps, TitleMenuState> {
  private container: HTMLDivElement;

  constructor(props: TitleMenuProps, state: TitleMenuState) {
    super(props, state);

    if (props.isLoadComplete) {
      props.jumpTitleSound();
    }

    this.state = {
      selected: false,
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
          if (target) {
            this.selectMenu(target);
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
      selected: true,
    });

    switch (state) {
      case MENU_MUSIC_SELECT:
        this.props.goToMusicSelect();
        break;
    }
  }

  render() {
    return this.props.isLoadComplete ? (
      <div ref={(elem) => (this.container = elem)} className={styles.container}>
        <div className={styles.animationContainer}>
          <AnimationGround />
        </div>
        <div
          className={`${styles.menuList} ${
            this.state.selected ? styles.selected : ''
          }`}
        >
          <span onClick={() => this.selectMenu(MENU_MUSIC_SELECT)}>
            <p data-target={MENU_MUSIC_SELECT}>Music Select</p>
          </span>
          <span onClick={() => this.selectMenu(MENU_DJ_MODE)}>
            <p data-target={MENU_DJ_MODE}>Dj Mode</p>
          </span>
          <span onClick={() => this.selectMenu(MENU_OPTIONS)}>
            <p data-target={MENU_OPTIONS}>Options</p>
          </span>
        </div>
      </div>
    ) : (
      <Redirect to={'/'} />
    );
  }
}
