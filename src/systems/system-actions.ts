import { Achievement, AchievementState, Configs } from './system-interfaces';

export type ActionTypes =
  | InitialRun
  | SetSystemReady
  | CreateSoundsLine
  | LoadSystemSounds
  | SetLoadingCircleVisible
  | SetDisplayVertically
  | RemakeSystemSounds
  | SetSystemSource
  | SetSampleSource
  | GetAchievement
  | SetAchievement
  | GetConfigs
  | SetConfigs
  | SetAchievementState
  | SetConfigsState
  | RingUnlockSound
  | AddPlayLog
  | AchievementReview
  | SetTouchedForPlay
  | ResumeAudioContext
  | SetUserAgent;

export const INITIAL_RUN = 'INITIAL_RUN';
export const SET_SYSTEM_READY = 'SET_PLAYER_READY';
export const LOAD_SYSTEM_SOUNDS = 'LOAD_SYSTEM_SOUNDS';
export const CREATE_SOUNDS_LINE = 'CREATE_SOUNDS_LINE';
export const SET_LOADING_CIRCLE_VISIBLE = 'SET_LOADING_CIRCLE_VISIBLE';
export const SET_DISPLAY_VERTICALLY = 'SET_DISPLAY_VERTICALLY';
export const REMAKE_SYSTEM_SOUNDS = 'REMAKE_SYSTEM_SOUNDS';
export const SET_SYSTEM_SOURCE = 'SET_SYSTEM_SOURCE';
export const SET_SAMPLE_SOURCE = 'SET_SAMPLE_SOURCE';
export const GET_ACHIEVEMENT = 'GET_ACHIEVEMENT';
export const SET_ACHIEVEMENT = 'SET_ACHIEVEMENT';
export const GET_CONFIGS = 'GET_CONFIGS';
export const SET_CONFIGS = 'SET_CONFIGS';
export const SET_ACHIEVEMENT_STATE = 'SET_ACHIEVEMENT_STATE';
export const SET_CONFIGS_STATE = 'SET_CONFIGS_STATE';
export const RING_UNLOCK_SOUND = 'RING_UNLOCK_SOUND';
export const ADD_PLAY_LOG = 'ADD_PLAY_LOG';
export const ACHIEVEMENT_REVIEW = 'ACHIEVEMENT_REVIEW';
export const SET_TOUCHED_FOR_PLAY = 'SET_TOUCHED_FOR_PLAY';
export const RESUME_AUDIO_CONTEXT = 'RESUME_AUDIO_CONTEXT';
export const SET_USER_AGENT = 'SET_USER_AGENT';

export interface InitialRun {
  type: typeof INITIAL_RUN;
}
export const initialRun = (): InitialRun => ({
  type: INITIAL_RUN,
});

export interface SetSystemReady {
  type: typeof SET_SYSTEM_READY;
  payload: {
    isSystemReady: boolean;
  };
}
export const setSystemReady = (isSystemReady: boolean): SetSystemReady => ({
  type: SET_SYSTEM_READY,
  payload: {
    isSystemReady,
  },
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

interface SetSampleSourcePayload {
  key: string;
  bufferNode: AudioBufferSourceNode;
}
export interface SetSampleSource {
  type: typeof SET_SAMPLE_SOURCE;
  payload: SetSampleSourcePayload;
}
export const setSampleSource = ({
  key,
  bufferNode,
}: SetSampleSourcePayload): SetSampleSource => ({
  type: SET_SAMPLE_SOURCE,
  payload: {
    key,
    bufferNode,
  },
});

export interface GetAchievement {
  type: typeof GET_ACHIEVEMENT;
}
export const getAchievement = (): GetAchievement => ({
  type: GET_ACHIEVEMENT,
});

export interface SetAchievement {
  type: typeof SET_ACHIEVEMENT;
  payload: {
    achievement: Achievement;
  };
}
export const setAchievement = (achievement: Achievement): SetAchievement => ({
  type: SET_ACHIEVEMENT,
  payload: {
    achievement,
  },
});

export interface GetConfigs {
  type: typeof GET_CONFIGS;
}
export const getConfigs = (): GetConfigs => ({
  type: GET_CONFIGS,
});

export interface SetConfigs {
  type: typeof SET_CONFIGS;
  payload: {
    configs: Configs;
  };
}
export const setConfigs = (configs: Configs): SetConfigs => ({
  type: SET_CONFIGS,
  payload: {
    configs,
  },
});

export interface SetAchievementStatePayload {
  musicId: string;
  status: AchievementState;
}
export interface SetAchievementState {
  type: typeof SET_ACHIEVEMENT_STATE;
  payload: SetAchievementStatePayload;
}
export const setAchievementState = ({
  musicId,
  status,
}: SetAchievementStatePayload): SetAchievementState => ({
  type: SET_ACHIEVEMENT_STATE,
  payload: {
    musicId,
    status,
  },
});

export interface SetConfigsState {
  type: typeof SET_CONFIGS_STATE;
  payload: {
    key: string;
    value: Partial<Configs>;
  };
}
export const setConfigsState = (
  key: string,
  value: Partial<Configs>
): SetConfigsState => ({
  type: SET_CONFIGS_STATE,
  payload: {
    key,
    value,
  },
});

export interface RingUnlockSound {
  type: typeof RING_UNLOCK_SOUND;
}
export const ringUnlockSound = (): RingUnlockSound => ({
  type: RING_UNLOCK_SOUND,
});

export interface AddPlayLog {
  type: typeof ADD_PLAY_LOG;
  payload: {
    musicId: string;
  };
}
export const addPlayLog = (musicId: string): AddPlayLog => ({
  type: ADD_PLAY_LOG,
  payload: {
    musicId,
  },
});

export interface AchievementReview {
  type: typeof ACHIEVEMENT_REVIEW;
}
export const achievementReview = (): AchievementReview => ({
  type: ACHIEVEMENT_REVIEW,
});

export interface SetTouchedForPlay {
  type: typeof SET_TOUCHED_FOR_PLAY;
  payload: {
    isTouchedForPlay: boolean;
  };
}
export const setTouchedForPlay = (
  isTouchedForPlay: boolean
): SetTouchedForPlay => ({
  type: SET_TOUCHED_FOR_PLAY,
  payload: {
    isTouchedForPlay,
  },
});

export interface ResumeAudioContext {
  type: typeof RESUME_AUDIO_CONTEXT;
}
export const resumeAudioContext = (): ResumeAudioContext => ({
  type: RESUME_AUDIO_CONTEXT,
});

export interface SetUserAgent {
  type: typeof SET_USER_AGENT;
}
export const setUserAgent = (): SetUserAgent => ({
  type: SET_USER_AGENT,
});
