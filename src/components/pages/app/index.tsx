import * as React from 'react';
import * as QRCode from 'qrcode.react';
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
  render() {
    const { system } = this.props;
    const { isSystemReady, display, achievement, configs, sound } = system;
    const contextState = sound.context.state;

    return (
      <div className={styles.container}>
        {system.userAgent.os == 'PC' || IS_DEBUG ? (
          <>
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
                    contextState={contextState}
                    achievement={achievement}
                    skipTutorial={configs.skipTutorial.musicSelect}
                  />
                )}
              />
              <Route
                path="/dj-mode"
                render={() => (
                  <MusicSelectView
                    mode={MUSIC_SELECT_DJ_MODE}
                    isSystemReady={isSystemReady}
                    contextState={contextState}
                    achievement={achievement}
                    skipTutorial={configs.skipTutorial.musicSelect}
                  />
                )}
              />
              <Route path="/" component={TitleView} />
            </Switch>
            <LoadingCircle isVisible={display.isLoadingCircleVisible} />
            <VerticalAnnounce isVisible={!display.isPortrait} />
          </>
        ) : (
          <div className={styles.qrContainer}>
            <img src="assets/images/logo@x2.png" />
            <div className={styles.qrBody}>
              <p>スマートフォンでアクセスしてください</p>
              <div className={styles.qr}>
                <QRCode
                  size={128}
                  value={location.href}
                  bgColor="#212121"
                  fgColor="#FFFFFF"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
