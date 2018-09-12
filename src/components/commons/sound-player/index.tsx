import * as React from 'react';
import * as styles from './style.css';

interface SoundPlayerProps {
  musicId: string;
  loadMusic: (url: string) => void;
}

interface SoundPlayerState {

}

export class SoundPlayer extends React.Component<SoundPlayerProps, SoundPlayerState> {
  componentWillMount() {
    this.props.loadMusic(`../musics/${this.props.musicId}.mp3`);
  }

  render() {
    return (
      <div className={styles.container} />
    );
  }
}
