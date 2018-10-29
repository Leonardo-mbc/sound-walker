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

export class App extends React.Component<State, {}> {
  render() {
    const { system } = this.props;
    return (
      <div className={styles.container}>
        <Switch>
          <Route
            path="/player/:musicId"
            render={(props) => (
              <PlayerView mode={MUSIC_SELECT_PLAY} {...props} />
            )}
          />
          <Route
            path="/dj-player/:musicId"
            render={(props) => (
              <PlayerView mode={MUSIC_SELECT_DJ_MODE} {...props} />
            )}
          />
          <Route
            path="/music-select"
            render={() => <MusicSelectView mode={MUSIC_SELECT_PLAY} />}
          />
          <Route
            path="/dj-mode"
            render={() => <MusicSelectView mode={MUSIC_SELECT_DJ_MODE} />}
          />
          <Route path="/" component={TitleView} />
        </Switch>
        <LoadingCircle isVisible={system.display.isLoadingCircleVisible} />
        <VerticalAnnounce isVisible={!system.display.isPortrait} />
      </div>
    );
  }
}
