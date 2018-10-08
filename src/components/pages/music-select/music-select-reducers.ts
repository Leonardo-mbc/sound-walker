import { initialState } from '../../../constant/initial-state';
import { ActionTypes } from './music-select-actions';
import { MusicSelectState } from './music-select-interfaces';

export function playerReducer(
  state = initialState.player,
  action: ActionTypes
): MusicSelectState {
  switch (action.type) {
    default:
      return state;
  }
}
