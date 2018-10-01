import * as React from 'react';
import * as styles from './style.css';
import { Redirect } from 'react-router';

interface TitleMenuProps {
  isLoadComplete: boolean;
  jumpTitleSound: () => void;
}

export class TitleMenu extends React.Component<TitleMenuProps, {}> {
  constructor(props: TitleMenuProps, state: {}) {
    super(props, state);

    if (props.isLoadComplete) {
      props.jumpTitleSound();
    }
  }

  render() {
    return this.props.isLoadComplete ? (
      <div className={styles.container}>menu</div>
    ) : (
      <Redirect to={'/'} />
    );
  }
}
