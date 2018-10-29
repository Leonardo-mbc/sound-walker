import * as React from 'react';
import * as styles from './style.css';
import { MusicMetaData } from '../../pages/player/player-interfaces';

interface DJPlayerProps {
  meta: MusicMetaData;
}

interface DJPlayerState {}

export class DJPlayer extends React.Component<DJPlayerProps, DJPlayerState> {
  private container: HTMLDivElement;

  constructor(props: DJPlayerProps, state: DJPlayerState) {
    super(props, state);
  }

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

          const target = (e.target as HTMLElement).getAttribute('data-target');
          switch (target) {
            default:
              break;
          }
        },
        passiveSupported ? { passive: false } : false
      );

      this.container.addEventListener(
        'touchmove',
        (e) => {
          e.preventDefault();

          const target = (e.target as HTMLElement).getAttribute('data-target');
          switch (target) {
            default:
              break;
          }
        },
        passiveSupported ? { passive: false } : false
      );

      this.container.addEventListener(
        'touchend',
        (e) => {
          e.preventDefault();

          const target = (e.target as HTMLElement).getAttribute('data-target');
          switch (target) {
            default:
              break;
          }
        },
        passiveSupported ? { passive: false } : false
      );
    } catch (err) {}
  }

  render() {
    return (
      <div ref={(elem) => (this.container = elem)} className={styles.container}>
        dj-player
      </div>
    );
  }
}
