import * as React from 'react';
import { Route, Routes } from 'react-router';
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
        <Routes>
          <Route
            path="/title/menu"
            element={
              <TitleMenu
                isLoadComplete={title.isLoadComplete}
                jumpTitleSound={jumpTitleSound}
                goToMusicSelect={goToMusicSelect}
                goToDJMode={goToDJMode}
              />
            }
          />
          <Route
            path="/title/intro"
            element={
              <TitleIntro
                isLoadComplete={title.isLoadComplete}
                goToMainMenu={goToMainMenu}
              />
            }
          />
          <Route
            path="*"
            element={
              <TitleIndex
                isLoadComplete={title.isLoadComplete}
                startGameTitle={startGameTitle}
              />
            }
          />
        </Routes>
      </div>
    );
  }
}
