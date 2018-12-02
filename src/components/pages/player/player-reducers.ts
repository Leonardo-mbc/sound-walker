import { initialState } from '../../../constant/initial-state';
import {
  ActionTypes,
  SET_MUSIC_SOURCE,
  SET_MUSIC_INFO,
  START_MUSIC,
  SET_OFFSET_CURRENT_TIME,
  SET_SOUND_NODES,
} from './player-actions';
import { PlayerState } from './player-interfaces';
import { BACK_TO_DJ_MODE } from '../../../constant/target-name';

export function playerReducer(
  state = initialState.player,
  action: ActionTypes
): PlayerState {
  switch (action.type) {
    case SET_MUSIC_SOURCE:
      return {
        ...state,
        source: action.payload.musicSource,
        isSourceReady: true,
      };

    case SET_MUSIC_INFO:
      return {
        ...state,
        musicInfo: action.payload.musicInfo,
        isMusicInfoReady: true,
      };

    case START_MUSIC:
      return {
        ...state,
        isMusicPlaying: true,
      };

    case SET_OFFSET_CURRENT_TIME:
      return {
        ...state,
        offsetCurrentTime: action.payload.offsetCurrentTime,
      };

    case SET_SOUND_NODES:
      return {
        ...state,
        filterNode: action.payload.filterNode,
        gainNode: action.payload.systemGainNode,
        analyzerNode: action.payload.analyzerNode,
        analyzerParams: action.payload.analyzerParams,
      };

    case BACK_TO_DJ_MODE:
      return {
        ...state,
        isSourceReady: false,
        isMusicPlaying: false,
      };

    default:
      return state;
  }
}
