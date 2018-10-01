import * as React from 'react';
import { Route, Switch } from 'react-router';
import * as styles from './style.css';
import { TitleViewProps } from './title-container';
import { TitleMenu } from './title-menu';
import { TitleIntro } from './title-intro';

export class Title extends React.Component<TitleViewProps, {}> {
  render() {
    const { title, startGameTitle, goToMainMenu, jumpTitleSound } = this.props;
    const loadingBarStyle = {};

    return (
      <div className={styles.container}>
        <Switch>
          <Route
            path="/title/menu"
            render={() => (
              <TitleMenu
                isLoadComplete={title.isLoadComplete}
                jumpTitleSound={jumpTitleSound}
              />
            )}
          />
          <Route
            path="/title/intro"
            render={() => (
              <TitleIntro
                isLoadComplete={title.isLoadComplete}
                goToMainMenu={goToMainMenu}
              />
            )}
          />
          <Route
            path="/"
            render={() => (
              <div className={styles.loadingContainer}>
                {title.isLoadComplete ? (
                  <div
                    className={styles.touchToStart}
                    onClick={() => startGameTitle()}
                  >
                    タッチしてスタート
                  </div>
                ) : (
                  <div className={styles.loaderContainer}>
                    <div className={styles.loadingText}>LOADING</div>
                    <div
                      id="system-loading-bar"
                      className={styles.loadingBar}
                      style={loadingBarStyle}
                    />
                  </div>
                )}
              </div>
            )}
          />
        </Switch>
      </div>
    );
  }
}
