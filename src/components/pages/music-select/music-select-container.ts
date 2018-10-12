import { connect } from 'react-redux';
import { MusicSelect } from '.';
import { MusicSelectState } from './music-select-interfaces';
import * as MusicSelectAction from './music-select-actions';
import * as TitleAction from '../title/title-actions';

export interface MusicSelectProps {
  musicSelect: MusicSelectState;
  goToPlayer: (musicId: string) => void;
  goToMainMenu: () => void;
  sampleMusicPlay: (
    { musicIds, faderGainValues }: MusicSelectAction.SampleMusicPlayPayload
  ) => void;
  sampleMusicFadeOut: (musicIds: string[]) => void;
  fadeDiscMusic: (cursor: number, values: number[]) => void;
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
    sampleMusicPlay: ({
      musicIds,
      faderGainValues,
    }: MusicSelectAction.SampleMusicPlayPayload) => {
      dispatch(
        MusicSelectAction.sampleMusicPlay({ musicIds, faderGainValues })
      );
    },
    sampleMusicFadeOut: (musicIds: string[]) => {
      dispatch(MusicSelectAction.sampleMusicFadeOut(musicIds));
    },
    fadeDiscMusic: (cursor: number, values: number[]) => {
      dispatch(MusicSelectAction.fadeDiscMusic(cursor, values));
    },
  })
)(MusicSelect);
