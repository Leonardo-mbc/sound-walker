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
  constructor(props: TitleMenuProps, state: TitleMenuState) {
    super(props, state);

    if (props.isLoadComplete) {
      props.jumpTitleSound();
    }

    this.state = {
      selected: false,
    };
  }

  selectMenu(
    state: 'SELECTED_MUSIC_SELECT' | 'SELECTED_DJ_MODE' | 'SELECTED_OPTIONS'
  ) {
    this.setState({
      selected: true,
    });

    switch (state) {
      case SELECTED_MUSIC_SELECT:
        setTimeout(() => this.props.goToMusicSelect(), 800);
        break;
    }
  }

  render() {
    return this.props.isLoadComplete ? (
      <div className={styles.container}>
        <div
          className={`${styles.menuList} ${
            this.state.selected ? styles.selected : ''
          }`}
        >
          <span onClick={() => this.selectMenu(SELECTED_MUSIC_SELECT)}>
            <p>Music Select</p>
          </span>
          <span onClick={() => this.selectMenu(SELECTED_DJ_MODE)}>
            <p>Dj Mode</p>
          </span>
          <span onClick={() => this.selectMenu(SELECTED_OPTIONS)}>
            <p>Options</p>
          </span>
        </div>
      </div>
    ) : (
      <Redirect to={'/'} />
    );
  }
}
