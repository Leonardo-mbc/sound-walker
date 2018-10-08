import * as React from 'react';
import * as styles from './style.css';
import { DiscInfo } from './music-disc-interface';
import { DISC_LABEL } from '../../../constant/target-name';

interface MusicDiscProps {
  discInfo: DiscInfo;
  customStyle: React.CSSProperties;
  isLevelVisible?: boolean;
}

export class MusicDisc extends React.Component<MusicDiscProps, {}> {
  render() {
    const { customStyle } = this.props;
    return (
      <div className={styles.container} style={customStyle}>
        <div className={styles.disc} data-target={DISC_LABEL}>
          {this.props.discInfo[0].meta.musicId}
        </div>
      </div>
    );
  }
}
