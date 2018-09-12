export type ActionTypes =
  | SetLoadingBarWidth
  | SetLoadComplete
  | StartGameTitle;


export const SET_LOADING_BAR_WIDTH = 'SET_LOADING_BAR_WIDTH';
export const SET_LOAD_COMPLETE = 'SET_LOAD_COMPLETE';
export const START_GAME_TITLE = 'START_GAME_TITLE';

export interface SetLoadingBarWidth {
  type: typeof SET_LOADING_BAR_WIDTH,
  payload: {
    loaded: number;
  };
}
export const setLoadingBarWidth = (loaded: number): SetLoadingBarWidth => ({
  type: SET_LOADING_BAR_WIDTH,
  payload: {
    loaded
  }
});

export interface SetLoadComplete {
  type: typeof SET_LOAD_COMPLETE
}
export const setLoadComplete = (): SetLoadComplete => ({
  type: SET_LOAD_COMPLETE
});

export interface StartGameTitle {
  type: typeof START_GAME_TITLE
}
export const startGameTitle = (): StartGameTitle => ({
  type: START_GAME_TITLE
});


