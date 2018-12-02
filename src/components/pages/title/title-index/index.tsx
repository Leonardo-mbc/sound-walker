import * as React from 'react';
import * as styles from './style.css';
import { LoaderCurtain } from '../../../commons/loader-curtain';

interface TitleIndexProps {
  isLoadComplete: boolean;
  startGameTitle: () => void;
}

export class TitleIndex extends React.Component<TitleIndexProps, {}> {
  private container: HTMLDivElement;

  componentDidMount() {
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
          this.props.startGameTitle();
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
    } catch (err) {}
  }

  render() {
    const { isLoadComplete } = this.props;

    return (
      <div
        ref={(elem) => (this.container = elem)}
        className={styles.loadingContainer}
      >
        {isLoadComplete ? (
          <div className={styles.touchToStart}>タッチしてスタート</div>
        ) : (
          <LoaderCurtain />
        )}
      </div>
    );
  }
}
