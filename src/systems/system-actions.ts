export type ActionTypes =
  | InitialRun
  | CreateSoundsLine
  | LoadSystemSounds
  | SetTitleSource
  | SetLoadingCircleVisible
  | SetDisplayVertically;


export const LOAD_SYSTEM_SOUNDS = 'LOAD_SYSTEM_SOUNDS';
export const INITIAL_RUN = 'INITIAL_RUN';
export const CREATE_SOUNDS_LINE = 'CREATE_SOUNDS_LINE';
export const SET_TITLE_SOURCE = 'SET_TITLE_SOURCE';
export const SET_LOADING_CIRCLE_VISIBLE = 'SET_LOADING_CIRCLE_VISIBLE';
export const SET_DISPLAY_VERTICALLY = 'SET_DISPLAY_VERTICALLY';


export interface InitialRun {
  type: typeof INITIAL_RUN
}
export const initialRun = (): InitialRun => ({
  type: INITIAL_RUN
});

export interface CreateSoundsLine {
  type: typeof CREATE_SOUNDS_LINE
}
export const createSoundsLine = (): CreateSoundsLine => ({
  type: CREATE_SOUNDS_LINE
});

export interface LoadSystemSounds {
  type: typeof LOAD_SYSTEM_SOUNDS
}
export const loadSystemSounds = (): LoadSystemSounds => ({
  type: LOAD_SYSTEM_SOUNDS
});

export interface SetTitleSource {
  type: typeof SET_TITLE_SOURCE,
  payload: {
    titleSource: AudioBufferSourceNode;
  }
}
export const setTitleSource = (titleSource: AudioBufferSourceNode): SetTitleSource => ({
  type: SET_TITLE_SOURCE,
  payload: {
    titleSource
  }
});

export interface SetLoadingCircleVisible {
  type: typeof SET_LOADING_CIRCLE_VISIBLE;
  payload: {
    isVisible: boolean;
  }
}
export const setLoadingCircleVisible = (isVisible: boolean): SetLoadingCircleVisible => ({
  type: SET_LOADING_CIRCLE_VISIBLE,
  payload: {
    isVisible
  }
});

export interface SetDisplayVertically {
  type: typeof SET_DISPLAY_VERTICALLY;
  payload: {
    width: number;
    height: number;
  }
}
export const setDisplayVertically = (width: number, height: number): SetDisplayVertically => ({
  type: SET_DISPLAY_VERTICALLY,
  payload: {
    width,
    height
  }
});
