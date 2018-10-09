import { connect } from 'react-redux';
import { MusicSelect } from '.';
import { MusicSelectState } from './music-select-interfaces';
import * as MusicSelectAction from './music-select-actions';
import * as TitleAction from '../title/title-actions';

export interface MusicSelectProps {
  musicSelect: MusicSelectState;
  goToPlayer: (musicId: string) => void;
  goToMainMenu: () => void;
}

export const MusicSelectView = connect(
  (state: MusicSelectProps) => {
    const { musicSelect } = state;
    return {
      musicSelect,
    };
  },
  (dispatch) => ({
    goToPlayer: (musicId: string) => {
      dispatch(MusicSelectAction.goToPlayer(musicId));
    },
    goToMainMenu: () => {
      dispatch(TitleAction.goToMainMenu());
    },
  })
)(MusicSelect);
