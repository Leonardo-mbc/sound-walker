import * as React from 'react';
import { Route, Switch } from 'react-router';
import * as styles from './style.css';
import { TitleView } from '../title/title-container';
import { PlayerView } from '../player/player-container';
import { State } from '../../../constant/initial-state';
import { LoadingCircle } from '../../commons/loading-circle';
import { VerticalAnnounce } from '../../commons/vertical-announce/index';
import {
  MusicSelectView,
  MUSIC_SELECT_DJ_MODE,
  MUSIC_SELECT_PLAY,
} from '../music-select/music-select-container';
import { AppProps } from './app-container';

export class App extends React.Component<State & AppProps, {}> {
  private container: HTMLDivElement;

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
        () => {
          const { system } = this.props;
          if (!system.isTouchedForPlay) {
            this.props.audioEnable();
          }
        },
        passiveSupported ? { passive: false } : false
      );
    } catch (err) {}
  }

  render() {
    const { system } = this.props;
    const {
      isSystemReady,
      isTouchedForPlay,
      display,
      achievement,
      configs,
    } = system;
    return (
      <div ref={(elem) => (this.container = elem)} className={styles.container}>
        <Switch>
          <Route
            path="/player/:musicId"
            render={(props) => (
              <PlayerView
                mode={MUSIC_SELECT_PLAY}
                isSystemReady={isSystemReady}
                skipTutorial={configs.skipTutorial.playMode}
                {...props}
              />
            )}
          />
          <Route
            path="/dj-player/:musicId"
            render={(props) => (
              <PlayerView
                mode={MUSIC_SELECT_DJ_MODE}
                isSystemReady={isSystemReady}
                skipTutorial={configs.skipTutorial.djMode}
                {...props}
              />
            )}
          />
          <Route
            path="/music-select"
            render={() => (
              <MusicSelectView
                mode={MUSIC_SELECT_PLAY}
                isSystemReady={isSystemReady}
                isTouchedForPlay={isTouchedForPlay}
                achievement={achievement}
              />
            )}
          />
          <Route
            path="/dj-mode"
            render={() => (
              <MusicSelectView
                mode={MUSIC_SELECT_DJ_MODE}
                isSystemReady={isSystemReady}
                isTouchedForPlay={isTouchedForPlay}
                achievement={achievement}
              />
            )}
          />
          <Route path="/" component={TitleView} />
        </Switch>
        <LoadingCircle isVisible={display.isLoadingCircleVisible} />
        <VerticalAnnounce isVisible={!display.isPortrait} />
      </div>
    );
  }
}
