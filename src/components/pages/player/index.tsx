import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import * as styles from './style.css';
import { PlayerViewProps } from './player-container';
import { SoundPlayer } from '../../commons/sound-player';
import { NotesPlayerV2 } from '../../commons/notes-player-v2';
import {
  MUSIC_SELECT_PLAY,
  MUSIC_SELECT_DJ_MODE,
} from '../music-select/music-select-container';
import { DJPlayer } from '../../commons/dj-palyer';
import { PlayerTutorial } from './player-tutorial';
import { PLAYER_START_MUSIC } from '../../../constant/target-name';

interface MatchParams {
  musicId: string;
}

interface PlayerViewState {
  isTransitionVisible: boolean;
  showTutorial: boolean;
}

export class Player extends React.Component<
  PlayerViewProps & RouteComponentProps<MatchParams>,
  PlayerViewState
> {
  private container: HTMLDivElement;

  constructor(
    props: PlayerViewProps & RouteComponentProps<MatchParams>,
    state: PlayerViewState
  ) {
    super(props, state);

    const { match, loadMusicInfo, loadSoundNodes } = this.props;
    const { musicId } = match.params;

    loadSoundNodes();
    loadMusicInfo(musicId);

    this.state = {
      isTransitionVisible: true,
      showTutorial: !props.skipTutorial,
    };
  }

  componentDidMount() {
    const { match } = this.props;
    const { musicId } = match.params;

    this.props.addPlayLog(musicId);
    this.props.achievementReview();

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
            case PLAYER_START_MUSIC:
              this.props.startMusic();
              break;
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

      this.container.addEventListener(
        'touchend',
        (e) => {
          e.preventDefault();
        },
        passiveSupported ? { passive: false } : false
      );
    } catch (err) {}
  }

  hideTutorial() {
    this.setState({
      showTutorial: false,
    });
  }

  render() {
    const {
      match,
      player,
      mode,
      isSystemReady,
      loadMusic,
      backToDJMode,
      setSkipTutorialState,
    } = this.props;
    const { showTutorial } = this.state;
    const { musicId } = match.params;
    return (
      <div
        ref={(elem) => (this.container = elem)}
        className={`${styles.container} ${
          showTutorial ? styles.tutorialShow : ''
        }`}
      >
        {showTutorial ? (
          <div className={styles.tutorialContainer}>
            <PlayerTutorial
              mode={mode}
              setSkipTutorialState={setSkipTutorialState}
              hideTutorial={() => this.hideTutorial()}
            />
          </div>
        ) : null}
        {isSystemReady ? (
          <SoundPlayer musicId={musicId} loadMusic={loadMusic} />
        ) : (
          <div id="system-loading-bar" />
        )}
        {player.isSourceReady && !player.isMusicPlaying ? (
          <div className={styles.touchToStart} data-target={PLAYER_START_MUSIC}>
            <span className={styles.text} data-target={PLAYER_START_MUSIC}>
              START TO PLAY
            </span>
          </div>
        ) : null}
        {player.isMusicPlaying ? (
          (() => {
            switch (mode) {
              case MUSIC_SELECT_PLAY:
                return (
                  <NotesPlayerV2
                    scores={player.musicInfo.scores}
                    source={player.source}
                    meta={player.musicInfo.meta}
                    offsetCurrentTime={player.offsetCurrentTime}
                  />
                );

              case MUSIC_SELECT_DJ_MODE:
                return (
                  <DJPlayer
                    meta={player.musicInfo.meta}
                    filterNode={player.filterNode}
                    gainNode={player.gainNode}
                    analyzerNode={player.analyzerNode}
                    analyzerParams={player.analyzerParams}
                    backToDJMode={() => backToDJMode()}
                  />
                );
            }
          })()
        ) : (
          <div className={styles.loadState}>
            SYSTEM:{' '}
            {this.props.isSystemReady ? (
              'READY'
            ) : (
              <span id="player-system-progress">...</span>
            )}
            <br />
            MUSIC:{' '}
            {this.props.player.isSourceReady ? (
              'READY'
            ) : (
              <span id="player-music-progress">...</span>
            )}
            <br />
            SCORE: {this.props.player.isMusicInfoReady ? 'READY' : '...'}
            <br />
          </div>
        )}
      </div>
    );
  }
}
