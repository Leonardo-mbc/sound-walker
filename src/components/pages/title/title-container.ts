import { connect } from 'react-redux';
import { Title } from './index';
import * as TitleAction from './title-actions';
import { State } from '../../../constant/initial-state';

export interface TitleViewProps {
  title: {
    isLoadComplete: boolean;
  };
  startGameTitle: () => void;
  goToMainMenu: () => void;
  jumpTitleSound: () => void;
  goToMusicSelect: () => void;
  goToDJMode: () => void;
}

export const TitleView = connect(
  (state: State) => {
    return {
      title: {
        isLoadComplete: state.title.isLoadComplete,
      },
    };
  },
  (dispatch) => ({
    startGameTitle: () => {
      dispatch(TitleAction.startGameTitle());
    },
    goToMainMenu: () => {
      dispatch(TitleAction.goToMainMenu());
    },
    jumpTitleSound: () => {
      dispatch(TitleAction.jumpTitleSound());
    },
    goToMusicSelect: () => {
      dispatch(TitleAction.goToMusicSelect());
    },
    goToDJMode: () => {
      dispatch(TitleAction.goToDJMode());
    },
  })
)(Title);
