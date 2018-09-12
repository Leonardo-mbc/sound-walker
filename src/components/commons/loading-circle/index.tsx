import * as React from 'react';
import * as styles from './style.css';

interface LoadingCircleProps {
  isVisible?: boolean;
}

export class LoadingCircle extends React.Component<LoadingCircleProps, {}> {
  render() {
    return (
      this.props.isVisible
        ? <div className={styles.container}>
            <span className={styles.text}>LOADING</span>
          </div> :null
    );
  }
}
