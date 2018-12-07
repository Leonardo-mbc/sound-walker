import { connect } from 'react-redux';
import { RouteProps } from 'react-router';
import { Player } from '.';
import { PlayerState } from './player-interfaces';
import * as PlayerAction from './player-actions';
import { MusicSelectMode } from '../music-select/music-select-container';
import * as SystemAction from '../../../systems/system-actions';

export interface PlayerViewProps {
  player: PlayerState;
  router: RouteProps;
  mode: MusicSelectMode;
  isSystemReady: boolean;
  loadMusic: (url: string) => void;
  startMusic: () => void;
  loadMusicInfo: (musicId: string) => void;
  loadSoundNodes: () => void;
  backToDJMode: () => void;
  addPlayLog: (musicId: string) => void;
  achievementReview: () => void;
}

export const PlayerView = connect(
  (state: PlayerViewProps) => {
    const { player, router } = state;
    return {
      player,
      router,
    };
  },
  (dispatch) => ({
    loadMusic: (url: string) => {
      dispatch(PlayerAction.loadMusic(url));
    },
    startMusic: () => {
      dispatch(PlayerAction.startMusic());
    },
    loadMusicInfo: (musicId: string) => {
      dispatch(PlayerAction.loadMusicInfo(musicId));
    },
    loadSoundNodes: () => {
      dispatch(PlayerAction.loadSoundNodes());
    },
    backToDJMode: () => {
      dispatch(PlayerAction.backToDJMode());
    },
    addPlayLog: (musicId: string) => {
      dispatch(SystemAction.addPlayLog(musicId));
    },
    achievementReview: () => {
      dispatch(SystemAction.achievementReview());
    },
  })
)(Player);
