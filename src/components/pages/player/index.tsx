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

interface MatchParams {
  musicId: string;
}

interface PlayerViewState {
  isTransitionVisible: boolean;
}

export class Player extends React.Component<
  PlayerViewProps & RouteComponentProps<MatchParams>,
  PlayerViewState
> {
  constructor(
    props: PlayerViewProps & RouteComponentProps<MatchParams>,
    state: PlayerViewState
  ) {
    super(props, state);

    const { match, loadMusicInfo, loadSoundNodes } = this.props;
    const { musicId } = match.params;

    loadSoundNodes();
    loadMusicInfo(musicId);

    this.state = { isTransitionVisible: true };
  }

  componentDidMount() {
    const { match } = this.props;
    const { musicId } = match.params;

    this.props.addPlayLog(musicId);
    this.props.achievementReview();
  }

  render() {
    const { match, player, mode, isSystemReady } = this.props;
    const { loadMusic, backToDJMode } = this.props;
    const { musicId } = match.params;
    return (
      <div className={styles.container}>
        {isSystemReady ? (
          <SoundPlayer musicId={musicId} loadMusic={loadMusic} />
        ) : (
          <div id="system-loading-bar" />
        )}
        {player.isSourceReady && !player.isMusicPlaying ? (
          <div
            className={styles.touchToStart}
            onClick={() => {
              this.props.startMusic();
            }}
          >
            <span className={styles.text}>START TO PLAY</span>
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
            SYSTEM: {this.props.isSystemReady ? 'READY' : '...'}
            <br />
            MUSIC: {this.props.player.isSourceReady ? 'READY' : '...'}
            <br />
            SCORE: {this.props.player.isMusicInfoReady ? 'READY' : '...'}
            <br />
          </div>
        )}
      </div>
    );
  }
}
