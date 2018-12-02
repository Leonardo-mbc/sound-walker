import * as React from 'react';
import * as styles from './style.css';

export class LoaderCurtain extends React.Component<{}, {}> {
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.loadingText}>LOADING</div>
        <div id="system-loading-bar" className={styles.loadingBar} />
      </div>
    );
  }
}
