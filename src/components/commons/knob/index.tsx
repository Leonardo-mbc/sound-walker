import * as React from 'react';
import * as styles from './style.css';
import { KNOB_COMPONENT_TARGET } from '../../../constant/target-name';
import { randomString } from '../../../utilities/random-string';
import { getTouchByTarget } from '../../../utilities/get-touched-touch';

interface KnobProps {
  min: number;
  max: number;
  initialValue?: number;
  onChange?: (v: number) => void;
  label?: string;
  color?: 'red' | 'orange' | 'blue' | 'purple';
  knobNeedleCount?: number;
}

interface KnobState {
  value: number;
  touchstartValue: number;
  knobTouchstartPosition: { x: number; y: number };
}

export class Knob extends React.Component<KnobProps, KnobState> {
  private thisKnobTargetName: string;

  constructor(props: KnobProps, state: KnobState) {
    super(props, state);

    this.state = {
      value: props.initialValue || props.min,
      touchstartValue: null,
      knobTouchstartPosition: {
        x: null,
        y: null,
      },
    };
    this.thisKnobTargetName = `${KNOB_COMPONENT_TARGET}-${randomString()}`;
  }

  onTouchStart(e: React.TouchEvent<HTMLElement>) {
    const target = (e.target as HTMLElement).getAttribute('data-target');
    const item = getTouchByTarget(e.touches, target);

    if (item) {
      this.setState({
        ...this.state,
        touchstartValue: this.state.value,
        knobTouchstartPosition: {
          x: item.clientX,
          y: item.clientY,
        },
      });
    }
  }

  onTouchMove(e: React.TouchEvent<HTMLElement>) {
    const target = (e.target as HTMLElement).getAttribute('data-target');
    const item = getTouchByTarget(e.touches, target);

    const ratio = {
      x:
        (item.clientX - this.state.knobTouchstartPosition.x) /
        (item.target as HTMLElement).clientWidth,
      y:
        (this.state.knobTouchstartPosition.y - item.clientY) /
        (item.target as HTMLElement).clientHeight,
    };

    const range = this.props.max - this.props.min;
    let value = Math.round(
      this.state.touchstartValue + ratio.x * range + ratio.y * range
    );
    if (value < this.props.min) {
      value = this.props.min;
    } else if (this.props.max < value) {
      value = this.props.max;
    }

    this.setState({
      value,
    });

    if (this.props.onChange) {
      this.props.onChange(value);
    }
  }

  onTouchEnd(_e: React.TouchEvent<HTMLElement>) {
    this.setState({
      ...this.state,
      touchstartValue: null,
      knobTouchstartPosition: {
        x: null,
        y: null,
      },
    });
  }

  render() {
    const knobNeedleCount = this.props.knobNeedleCount || 30;

    return (
      <div
        className={`${styles.container} ${
          this.props.label ? styles.whitLabel : null
        }`}
        data-target={this.thisKnobTargetName}
      >
        <div
          className={styles.indicators}
          data-target={this.thisKnobTargetName}
        >
          <div
            className={`${styles.knob} ${
              this.props.color ? styles[this.props.color] : ''
            }`}
            data-value={this.state.value}
            data-target={this.thisKnobTargetName}
            onTouchStart={(e) => this.onTouchStart(e)}
            onTouchMove={(e) => this.onTouchMove(e)}
            onTouchEnd={(e) => this.onTouchEnd(e)}
          />
          {new Array(knobNeedleCount).fill(0).map((_, idx) => {
            const indicatorStyle: React.CSSProperties = {
              transform: `rotate3d(0, 0, 1, ${220 *
                (idx / (knobNeedleCount - 1)) -
                20}deg)`,
            };
            const ratio =
              (this.state.value - this.props.min) /
              (this.props.max - this.props.min);
            return (
              <div
                key={`knob-indicator-${idx}`}
                className={`${styles.indicator} ${
                  ratio >= idx / (knobNeedleCount - 1) ? styles.on : ''
                }`}
                style={indicatorStyle}
              />
            );
          })}
        </div>
        {this.props.label ? (
          <div className={styles.label}>{this.props.label}</div>
        ) : null}
      </div>
    );
  }
}
