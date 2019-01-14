import * as React from 'react';
import { Route, Switch } from 'react-router';
import * as styles from './style.css';
import { PlayerView } from '../player/player-container';
import { State } from '../../../constant/initial-state';
import { LoadingCircle } from '../../commons/loading-circle';
import { VerticalAnnounce } from '../../commons/vertical-announce/index';
import { MUSIC_SELECT_DJ_MODE } from '../music-select/music-select-container';
import { AppProps } from './app-container';

export class App extends React.Component<State & AppProps, {}> {
  render() {
    const { system } = this.props;
    const { isSystemReady, display, configs } = system;

    return (
      <div className={styles.container}>
        <Switch>
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
        </Switch>
        <LoadingCircle isVisible={display.isLoadingCircleVisible} />
        <VerticalAnnounce isVisible={!display.isPortrait} />
      </div>
    );
  }
}
