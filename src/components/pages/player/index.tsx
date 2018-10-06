import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import * as styles from './style.css';
import { PlayerViewProps } from './player-container';
import { SoundPlayer } from '../../commons/sound-player';
import { NotesPlayer } from '../../commons/notes-player/index';

interface MatchParams {
  musicId: string;
}

export class Player extends React.Component<
  PlayerViewProps & RouteComponentProps<MatchParams>,
  {}
> {
  componentWillMount() {
    const { match, loadMusicInfo } = this.props;
    const { musicId } = match.params;

    loadMusicInfo(musicId);
  }

  render() {
    const { match, player } = this.props;
    const { loadMusic } = this.props;
    const { musicId } = match.params;
    return (
      <div className={styles.container}>
        {player.isSystemReady ? (
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
          <NotesPlayer
            scores={player.musicInfo.scores}
            source={player.source}
            meta={player.musicInfo.meta}
            offsetCurrentTime={player.offsetCurrentTime}
          />
        ) : (
          <div className={styles.loadState}>
            SYSTEM: {this.props.player.isSystemReady ? 'READY' : '...'}
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
