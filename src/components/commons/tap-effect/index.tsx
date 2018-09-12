import * as React from 'react';
import * as styles from './style.css';

interface TapEffectProps {
  isVisible?: boolean;
  x: number;
  y: number;
}

interface TapEffectState {
  isHide: boolean;
  circleStep: number;
}

export class TapEffect extends React.Component<TapEffectProps, TapEffectState> {
  constructor(props: TapEffectProps, state: TapEffectState) {
    super(props, state);

    this.state = {
      isHide: false,
      circleStep: 0.0
    }

    const intervalId = setInterval(() => {
      this.setState({
        circleStep: this.state.circleStep + 1.0
      });
    }, 100);

    setTimeout(() => {
      this.setState({
        isHide: true
      });
      clearInterval(intervalId);
    }, 100 * 3)
  }
  
  render() {
    const { isHide, circleStep } = this.state;
    const { x, y } = this.props;
    const TIP_COUNT = 12;
    const TIP_SIZE = 5;
    const CIRCLE_SIZE = 30 - TIP_SIZE / 2;
    const STEP_SIZE = (30 - (3 - circleStep) * 8);

    const containerStyle = {
      left: x - CIRCLE_SIZE - TIP_SIZE * 0.5,
      top: y - CIRCLE_SIZE - TIP_SIZE * 0.5
    };

    const tipStyles: React.CSSProperties[] = Array(TIP_COUNT).fill(0).map((_, idx) => {
      return {
        top: `${Math.cos(2 * Math.PI / TIP_COUNT * idx) * STEP_SIZE + CIRCLE_SIZE}px`,
        left: `${Math.sin(2 * Math.PI / TIP_COUNT * idx) * STEP_SIZE + CIRCLE_SIZE}px`
      }
    });

    return (
      this.props.isVisible && !isHide
        ? <div className={styles.container} style={containerStyle}>
            {Array(TIP_COUNT).fill(0).map((_, key) => {
              return <span key={key} style={tipStyles[key]} className={styles.tip} />
            })}
          </div> :null
    );
  }
}
