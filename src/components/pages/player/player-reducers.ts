import { initialState } from '../../../constant/initial-state';
import {
  ActionTypes,
  SET_SYSTEM_READY,
  SET_MUSIC_SOURCE,
  SET_MUSIC_INFO,
  START_MUSIC,
  SET_OFFSET_CURRENT_TIME
} from './player-actions';
import { PlayerState } from './player-interfaces';

export function playerReducer(state = initialState.player, action: ActionTypes): PlayerState {
  switch (action.type) {
    case SET_SYSTEM_READY:
      return {
        ...state,
        isSystemReady: action.payload.isSystemReady
      };

    case SET_MUSIC_SOURCE:
      return {
        ...state,
        source: action.payload.musicSource,
        isSourceReady: true
      };

    case SET_MUSIC_INFO:
      return {
        ...state,
        musicInfo: action.payload.musicInfo,
        isMusicInfoReady: true
      };
    
    case START_MUSIC:
    return {
      ...state,
      isMusicPlaying: true
    }
    
    case SET_OFFSET_CURRENT_TIME:
    return {
      ...state,
      offsetCurrentTime: action.payload.offsetCurrentTime
    }

    default:
      return state;
  }
}
