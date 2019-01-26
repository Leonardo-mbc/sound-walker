import { initialState } from '../../../constant/initial-state';
import {
  ActionTypes,
  SET_LOADING_BAR_WIDTH,
  SET_LOAD_COMPLETE,
  SET_TITLE_OFFSET_CURRENT_TIME,
} from './title-actions';
import { TitleState } from './title-interfaces';

export function titleReducer(
  state: TitleState = initialState.title,
  action: ActionTypes
): TitleState {
  switch (action.type) {
    case SET_LOADING_BAR_WIDTH:
      return {
        ...state,
        loadingBarWidth: 100.0 * action.payload.loaded,
      };

    case SET_LOAD_COMPLETE:
      return {
        ...state,
        isLoadComplete: true,
      };

    case SET_TITLE_OFFSET_CURRENT_TIME:
      return {
        ...state,
        offsetCurrentTime: action.payload.offsetCurrentTime,
      };

    default:
      return state;
  }
}
