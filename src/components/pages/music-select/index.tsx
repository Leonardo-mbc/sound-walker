import * as React from 'react';
import * as styles from './style.css';
import { MusicSelectProps } from './music-select-container';

export class MusicSelect extends React.Component<MusicSelectProps, {}> {
  render() {
    return <div className={styles.container}>MusicSelect</div>;
  }
}
