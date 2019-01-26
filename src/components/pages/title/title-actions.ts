export type ActionTypes =
  | SetLoadingBarWidth
  | SetLoadComplete
  | StartGameTitle
  | GoToMainMenu
  | JumpTitleSound
  | GoToMusicSelect
  | GoToDJMode
  | SetOffsetCurrentTime;

export const SET_LOADING_BAR_WIDTH = 'SET_LOADING_BAR_WIDTH';
export const SET_LOAD_COMPLETE = 'SET_LOAD_COMPLETE';
export const START_GAME_TITLE = 'START_GAME_TITLE';
export const GO_TO_MAIN_MENU = 'GO_TO_MAIN_MENU';
export const JUMP_TITLE_SOUND = 'JUMP_TITLE_SOUND';
export const GO_TO_MUSIC_SELECT = 'GO_TO_MUSIC_SELECT';
export const GO_TO_DJ_MODE = 'GO_TO_DJ_MODE';
export const SET_TITLE_OFFSET_CURRENT_TIME = 'SET_TITLE_OFFSET_CURRENT_TIME';

export interface SetLoadingBarWidth {
  type: typeof SET_LOADING_BAR_WIDTH;
  payload: {
    loaded: number;
  };
}
export const setLoadingBarWidth = (loaded: number): SetLoadingBarWidth => ({
  type: SET_LOADING_BAR_WIDTH,
  payload: {
    loaded,
  },
});

export interface SetLoadComplete {
  type: typeof SET_LOAD_COMPLETE;
}
export const setLoadComplete = (): SetLoadComplete => ({
  type: SET_LOAD_COMPLETE,
});

export interface StartGameTitle {
  type: typeof START_GAME_TITLE;
}
export const startGameTitle = (): StartGameTitle => ({
  type: START_GAME_TITLE,
});

export interface GoToMainMenu {
  type: typeof GO_TO_MAIN_MENU;
}
export const goToMainMenu = (): GoToMainMenu => ({
  type: GO_TO_MAIN_MENU,
});

export interface JumpTitleSound {
  type: typeof JUMP_TITLE_SOUND;
}
export const jumpTitleSound = (): JumpTitleSound => ({
  type: JUMP_TITLE_SOUND,
});

export interface GoToMusicSelect {
  type: typeof GO_TO_MUSIC_SELECT;
}
export const goToMusicSelect = (): GoToMusicSelect => ({
  type: GO_TO_MUSIC_SELECT,
});

export interface GoToDJMode {
  type: typeof GO_TO_DJ_MODE;
}
export const goToDJMode = (): GoToDJMode => ({
  type: GO_TO_DJ_MODE,
});

export interface SetOffsetCurrentTime {
  type: typeof SET_TITLE_OFFSET_CURRENT_TIME;
  payload: {
    offsetCurrentTime: number;
  };
}
export const setOffsetCurrentTime = (
  offsetCurrentTime: number
): SetOffsetCurrentTime => ({
  type: SET_TITLE_OFFSET_CURRENT_TIME,
  payload: {
    offsetCurrentTime,
  },
});
