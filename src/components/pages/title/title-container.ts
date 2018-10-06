import { connect } from 'react-redux';
import { RouteProps } from 'react-router';
import { Title } from './index';
import { TitleState } from './title-interfaces';
import * as TitleAction from './title-actions';

export interface TitleViewProps {
  title: TitleState;
  router: RouteProps;
  startGameTitle: () => void;
  goToMainMenu: () => void;
  jumpTitleSound: () => void;
  goToMusicSelect: () => void;
}

export const TitleView = connect(
  (state: TitleViewProps) => {
    const { title, router } = state;
    return {
      title,
      router,
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
  })
)(Title);
