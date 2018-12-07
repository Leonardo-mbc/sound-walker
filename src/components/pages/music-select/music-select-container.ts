import { connect } from 'react-redux';
import { MusicSelect } from '.';
import { MusicSelectState } from './music-select-interfaces';
import * as MusicSelectAction from './music-select-actions';
import * as TitleAction from '../title/title-actions';
import * as SystemAction from '../../../systems/system-actions';
import { Achievement } from '../../../systems/system-interfaces';

export interface MusicSelectProps {
  mode: MusicSelectMode;
  isSystemReady: boolean;
  musicSelect: MusicSelectState;
  achievement: Achievement;
  goToPlayer: (mode: MusicSelectMode, musicId: string) => void;
  goToMainMenu: () => void;
  sampleMusicPlay: (
    { musicIds, faderGainValues }: MusicSelectAction.SampleMusicPlayPayload
  ) => void;
  sampleMusicFadeOut: (musicIds: string[], duration?: number) => void;
  fadeDiscMusic: (cursor: number, values: number[]) => void;
  changeDiscSide: (cursor: number, discSide: number) => void;
  setSelectedMusicId: (musicId: string) => void;
  getMusicList: () => void;
  setCursor: (cursor: number) => void;
  ringUnlockSound: () => void;
  setAchievementState: (
    { musicId, status }: SystemAction.SetAchievementStatePayload
  ) => void;
}

export const MUSIC_SELECT_PLAY = 'MUSIC_SELECT_PLAY';
export const MUSIC_SELECT_DJ_MODE = 'MUSIC_SELECT_DJ_MODE';
export type MusicSelectMode =
  | typeof MUSIC_SELECT_PLAY
  | typeof MUSIC_SELECT_DJ_MODE;

export const MusicSelectView = connect(
  (state: MusicSelectProps) => {
    const { musicSelect } = state;
    return {
      musicSelect,
    };
  },
  (dispatch) => ({
    goToPlayer: (mode: MusicSelectMode, musicId: string) => {
      dispatch(MusicSelectAction.goToPlayer(mode, musicId));
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
    sampleMusicFadeOut: (musicIds: string[], duration?: number) => {
      dispatch(MusicSelectAction.sampleMusicFadeOut(musicIds, duration));
    },
    fadeDiscMusic: (cursor: number, values: number[]) => {
      dispatch(MusicSelectAction.fadeDiscMusic(cursor, values));
    },
    changeDiscSide: (cursor: number, discSide: number) => {
      dispatch(MusicSelectAction.changeDiscSide(cursor, discSide));
    },
    setSelectedMusicId: (musicId: string) => {
      dispatch(MusicSelectAction.setSelectedMusicId(musicId));
    },
    getMusicList: () => {
      dispatch(MusicSelectAction.getMusicList());
    },
    setCursor: (cursor: number) => {
      dispatch(MusicSelectAction.setCursor(cursor));
    },
    ringUnlockSound: () => {
      dispatch(SystemAction.ringUnlockSound());
    },
    setAchievementState: ({
      musicId,
      status,
    }: SystemAction.SetAchievementStatePayload) => {
      dispatch(SystemAction.setAchievementState({ musicId, status }));
    },
  })
)(MusicSelect);
