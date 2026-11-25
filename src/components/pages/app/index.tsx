import * as React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Route, Routes, useParams } from 'react-router';
import * as styles from './style.css';
import { TitleView } from '../title/title-container';
import { PlayerView } from '../player/player-container';
import { State } from '../../../constant/initial-state';
import { LoadingCircle } from '../../commons/loading-circle';
import {
  MusicSelectView,
  MUSIC_SELECT_DJ_MODE,
  MUSIC_SELECT_PLAY,
  MusicSelectMode,
} from '../music-select/music-select-container';
import { AppProps } from './app-container';

function PlayerRoute(props: {
  mode: MusicSelectMode;
  isSystemReady: boolean;
  skipTutorial: boolean;
}) {
  const { musicId = '' } = useParams();
  return <PlayerView {...props} match={{ params: { musicId } }} />;
}

export class App extends React.Component<State & AppProps, {}> {
  render() {
    const { system } = this.props;
    const {
      isSystemReady,
      display,
      achievement,
      configs,
      sound,
      isMIDIConnected,
      userAgent,
    } = system;
    const contextState = sound.context ? sound.context.state : 'suspended';
    const playTutorial = configs ? configs.skipTutorial.playMode : false;
    const djTutorial = configs ? configs.skipTutorial.djMode : false;
    const musicSelectTutorial = configs
      ? configs.skipTutorial.musicSelect
      : false;

    return (
      <div className={styles.container}>
        {system.userAgent.os !== 'PC' || IS_DEBUG ? (
          <>
            <Routes>
              <Route
                path="/player/:musicId"
                element={
                  <PlayerRoute
                    mode={MUSIC_SELECT_PLAY}
                    isSystemReady={isSystemReady}
                    skipTutorial={playTutorial}
                  />
                }
              />
              <Route
                path="/dj-player/:musicId"
                element={
                  <PlayerRoute
                    mode={MUSIC_SELECT_DJ_MODE}
                    isSystemReady={isSystemReady}
                    skipTutorial={djTutorial}
                  />
                }
              />
              <Route
                path="/music-select"
                element={
                  <MusicSelectView
                    mode={MUSIC_SELECT_PLAY}
                    isSystemReady={isSystemReady}
                    contextState={contextState}
                    achievement={achievement}
                    skipTutorial={musicSelectTutorial}
                    isMIDIConnected={isMIDIConnected}
                    canUseMIDI={userAgent.os === 'Android'}
                  />
                }
              />
              <Route
                path="/dj-mode"
                element={
                  <MusicSelectView
                    mode={MUSIC_SELECT_DJ_MODE}
                    isSystemReady={isSystemReady}
                    contextState={contextState}
                    achievement={achievement}
                    skipTutorial={musicSelectTutorial}
                    isMIDIConnected={isMIDIConnected}
                    canUseMIDI={userAgent.os === 'Android'}
                  />
                }
              />
              <Route path="/*" element={<TitleView />} />
            </Routes>
            <LoadingCircle isVisible={display.isLoadingCircleVisible} />
          </>
        ) : (
          <div className={styles.qrContainer}>
            <img src="assets/images/logo@x2.png" />
            <div className={styles.qrBody}>
              <p>スマートフォンでアクセスしてください</p>
              <div className={styles.qr}>
                <QRCodeSVG
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
