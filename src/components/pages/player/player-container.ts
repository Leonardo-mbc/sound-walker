import { connect } from 'react-redux';
import { Player } from '.';
import { PlayerState } from './player-interfaces';
import * as PlayerAction from './player-actions';
import { MusicSelectMode } from '../music-select/music-select-container';
import * as SystemAction from '../../../systems/system-actions';
import { Configs } from '../../../systems/system-interfaces';
import { State } from '../../../constant/initial-state';

export interface PlayerViewProps {
  player: PlayerState;
  mode: MusicSelectMode;
  isSystemReady: boolean;
  skipTutorial: boolean;
  loadMusic: (url: string) => void;
  startMusic: () => void;
  loadMusicInfo: (musicId: string) => void;
  loadSoundNodes: () => void;
  backToDJMode: () => void;
  addPlayLog: (musicId: string) => void;
  achievementReview: () => void;
  setSkipTutorialState: (value: Partial<Configs>) => void;
}

export const PlayerView = connect(
  (state: State) => {
    return {
      player: state.player,
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
    setSkipTutorialState: (value: Partial<Configs>) => {
      dispatch(SystemAction.setConfigsState('skipTutorial', value));
    },
  })
)(Player);
