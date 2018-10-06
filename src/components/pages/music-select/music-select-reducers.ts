import { initialState } from '../../../constant/initial-state';
import { ActionTypes, SET_SYSTEM_READY } from './music-select-actions';
import { MusicSelectState } from './music-select-interfaces';

export function playerReducer(
  state = initialState.player,
  action: ActionTypes
): MusicSelectState {
  switch (action.type) {
    case SET_SYSTEM_READY:
      return {
        ...state,
        isSystemReady: action.payload.isSystemReady,
      };

    default:
      return state;
  }
}
