export type ActionTypes =
  | InitialRun
  | CreateSoundsLine
  | LoadSystemSounds
  | SetLoadingCircleVisible
  | SetDisplayVertically
  | RemakeSystemSounds
  | SetSystemSource;

export const INITIAL_RUN = 'INITIAL_RUN';
export const LOAD_SYSTEM_SOUNDS = 'LOAD_SYSTEM_SOUNDS';
export const CREATE_SOUNDS_LINE = 'CREATE_SOUNDS_LINE';
export const SET_LOADING_CIRCLE_VISIBLE = 'SET_LOADING_CIRCLE_VISIBLE';
export const SET_DISPLAY_VERTICALLY = 'SET_DISPLAY_VERTICALLY';
export const REMAKE_SYSTEM_SOUNDS = 'REMAKE_SYSTEM_SOUNDS';
export const SET_SYSTEM_SOURCE = 'SET_SYSTEM_SOURCE';

export interface InitialRun {
  type: typeof INITIAL_RUN;
}
export const initialRun = (): InitialRun => ({
  type: INITIAL_RUN,
});

export interface CreateSoundsLine {
  type: typeof CREATE_SOUNDS_LINE;
}
export const createSoundsLine = (): CreateSoundsLine => ({
  type: CREATE_SOUNDS_LINE,
});

export interface LoadSystemSounds {
  type: typeof LOAD_SYSTEM_SOUNDS;
}
export const loadSystemSounds = (): LoadSystemSounds => ({
  type: LOAD_SYSTEM_SOUNDS,
});

export interface SetLoadingCircleVisible {
  type: typeof SET_LOADING_CIRCLE_VISIBLE;
  payload: {
    isVisible: boolean;
  };
}
export const setLoadingCircleVisible = (
  isVisible: boolean
): SetLoadingCircleVisible => ({
  type: SET_LOADING_CIRCLE_VISIBLE,
  payload: {
    isVisible,
  },
});

export interface SetDisplayVertically {
  type: typeof SET_DISPLAY_VERTICALLY;
  payload: {
    width: number;
    height: number;
  };
}
export const setDisplayVertically = (
  width: number,
  height: number
): SetDisplayVertically => ({
  type: SET_DISPLAY_VERTICALLY,
  payload: {
    width,
    height,
  },
});

interface RemakeSystemSoundsPayload {
  key: string;
  bufferNode: AudioBufferSourceNode;
  startTime?: number;
  soonToPlay?: boolean;
}
export interface RemakeSystemSounds {
  type: typeof REMAKE_SYSTEM_SOUNDS;
  payload: RemakeSystemSoundsPayload;
}
export const remakeSystemSounds = ({
  key,
  bufferNode,
  startTime,
  soonToPlay,
}: RemakeSystemSoundsPayload): RemakeSystemSounds => ({
  type: REMAKE_SYSTEM_SOUNDS,
  payload: {
    key,
    bufferNode,
    startTime,
    soonToPlay,
  },
});

interface SetSystemSourcePayload {
  key: string;
  bufferNode: AudioBufferSourceNode;
}
export interface SetSystemSource {
  type: typeof SET_SYSTEM_SOURCE;
  payload: SetSystemSourcePayload;
}
export const setSystemSource = ({
  key,
  bufferNode,
}: SetSystemSourcePayload): SetSystemSource => ({
  type: SET_SYSTEM_SOURCE,
  payload: {
    key,
    bufferNode,
  },
});
