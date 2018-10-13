import { initialState } from '../../../constant/initial-state';
import {
  ActionTypes,
  FADE_DISC_MUSIC,
  CHANGE_DISC_SIDE,
  SET_SELECTED_MUSIC_ID,
  SET_MUSIC_LIST,
  SET_CURSOR,
} from './music-select-actions';
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

    case CHANGE_DISC_SIDE:
      const discSideCopy = [...state.discSide];
      const { cursor, discSide } = action.payload;
      discSideCopy[cursor] = discSide;

      return {
        ...state,
        discSide: discSideCopy,
        selectedMusicId: state.musicList[cursor][discSide].meta.musicId,
      };

    case SET_SELECTED_MUSIC_ID:
      return {
        ...state,
        selectedMusicId: action.payload.musicId,
      };

    case SET_MUSIC_LIST:
      return {
        ...state,
        musicList: action.payload.musicList,
      };

    case SET_CURSOR:
      return {
        ...state,
        cursor: action.payload.cursor,
      };

    default:
      return state;
  }
}
