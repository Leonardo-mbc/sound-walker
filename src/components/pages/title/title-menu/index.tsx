import * as React from 'react';
import * as styles from './style.css';
import { Redirect } from 'react-router';

const SELECTED_MUSIC_SELECT = 'SELECTED_MUSIC_SELECT';
const SELECTED_DJ_MODE = 'SELECTED_DJ_MODE';
const SELECTED_OPTIONS = 'SELECTED_OPTIONS';

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

          const state = (e.target as HTMLElement).getAttribute('data-target');
          if (state) {
            this.selectMenu(state);
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
      case SELECTED_MUSIC_SELECT:
        this.props.goToMusicSelect();
        break;
    }
  }

  render() {
    return this.props.isLoadComplete ? (
      <div ref={(elem) => (this.container = elem)} className={styles.container}>
        <div
          className={`${styles.menuList} ${
            this.state.selected ? styles.selected : ''
          }`}
        >
          <span onClick={() => this.selectMenu(SELECTED_MUSIC_SELECT)}>
            <p data-target="SELECTED_MUSIC_SELECT">Music Select</p>
          </span>
          <span onClick={() => this.selectMenu(SELECTED_DJ_MODE)}>
            <p data-target="SELECTED_DJ_MODE">Dj Mode</p>
          </span>
          <span onClick={() => this.selectMenu(SELECTED_OPTIONS)}>
            <p data-target="SELECTED_OPTIONS">Options</p>
          </span>
        </div>
      </div>
    ) : (
      <Redirect to={'/'} />
    );
  }
}
