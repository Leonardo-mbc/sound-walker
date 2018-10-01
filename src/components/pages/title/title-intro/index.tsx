import * as React from 'react';
import * as styles from './style.css';
import { Redirect } from 'react-router';

interface TitleIntroProps {
  isLoadComplete: boolean;
  goToMainMenu: () => void;
}

export class TitleIntro extends React.Component<TitleIntroProps, {}> {
  render() {
    const { isLoadComplete, goToMainMenu } = this.props;

    return (
      <div className={styles.container}>
        {isLoadComplete ? (
          <div className={styles.goToMainMenu} onClick={() => goToMainMenu()}>
            <img
              className={styles.introLogo}
              src="assets/images/logo-anim@x2.gif"
            />
          </div>
        ) : (
          <Redirect to={'/'} />
        )}
      </div>
    );
  }
}
