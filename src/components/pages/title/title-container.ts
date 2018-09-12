import { connect } from 'react-redux';
import { RouteProps } from 'react-router';
import { Title } from "./index";
import { TitleState } from './title-interfaces';
import * as TitleAction from './title-actions';


export interface TitleViewProps {
  title: TitleState;
  router: RouteProps;
  startGameTitle: () => void;
}

export const TitleView = connect((state: TitleViewProps) => {
  const { title, router } = state;
  return {
    title,
    router
  };
}, (dispatch) => ({
  startGameTitle: () => {
    dispatch(TitleAction.startGameTitle());
  },
}))(Title);
