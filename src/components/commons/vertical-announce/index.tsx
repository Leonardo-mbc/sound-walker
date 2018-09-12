import * as React from 'react';
import * as styles from './style.css';

export interface VerticalAnnounceProps {
  isVisible: boolean;
}

export class VerticalAnnounce extends React.Component<VerticalAnnounceProps, {}> {
  render() {
    return (
      this.props.isVisible
        ? <div className={styles.container}>
            <div className="notice">
              このゲームはヨコ向きで遊びます。
              <br/> 画面をヨコにしてください。
              <br/>
              <img src="assets/images/yoko_black@x2.gif" width="300px" />
            </div>
          </div>
        : null
    );
  }
}
