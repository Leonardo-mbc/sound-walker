import * as React from 'react';
import { Route, Switch } from 'react-router';
import * as styles from './style.css';
import { TitleViewProps } from './title-container';
import { TitleMenu } from './title-menu';
import { TitleIntro } from './title-intro';
import { TitleIndex } from './title-index';

export class Title extends React.Component<TitleViewProps, {}> {
  render() {
    const {
      title,
      startGameTitle,
      goToMainMenu,
      jumpTitleSound,
      goToMusicSelect,
      goToDJMode,
    } = this.props;

    return (
      <div className={styles.container}>
        <Switch>
          <Route
            path="/title/menu"
            render={() => (
              <TitleMenu
                isLoadComplete={title.isLoadComplete}
                jumpTitleSound={jumpTitleSound}
                goToMusicSelect={goToMusicSelect}
                goToDJMode={goToDJMode}
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
              <TitleIndex
                isLoadComplete={title.isLoadComplete}
                startGameTitle={startGameTitle}
              />
            )}
          />
        </Switch>
      </div>
    );
  }
}
