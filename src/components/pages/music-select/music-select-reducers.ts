import { initialState } from '../../../constant/initial-state';
import { ActionTypes, FADE_DISC_MUSIC } from './music-select-actions';
import { MusicSelectState } from './music-select-interfaces';

export function musicSelectReducer(
  state = initialState.musicSelect,
  action: ActionTypes
): MusicSelectState {
  switch (action.type) {
    case FADE_DISC_MUSIC:
      const discFaders = [...state.discFaders];
      discFaders[action.payload.cursor] = action.payload.values;

      return {
        ...state,
        discFaders,
      };

    default:
      return state;
  }
}
