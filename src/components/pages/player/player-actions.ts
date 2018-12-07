import { MusicInfo } from './player-interfaces';
import { FilterNode, AnalyserParams } from '../../../systems/system-interfaces';

export type ActionTypes =
  | LoadMusic
  | SetMusicSource
  | StartMusic
  | LoadMusicInfo
  | SetMusicInfo
  | SetOffsetCurrentTime
  | LoadSoundNodes
  | SetSoundNodes
  | BackToDJMode
  | UnlockReview;

export const LOAD_MUSIC = 'LOAD_MUSIC';
export const SET_MUSIC_SOURCE = 'SET_MUSIC_SOURCE';
export const START_MUSIC = 'START_MUSIC';
export const LOAD_MUSIC_INFO = 'LOAD_SCORE';
export const SET_MUSIC_INFO = 'SET_MUSIC_INFO';
export const SET_OFFSET_CURRENT_TIME = 'SET_OFFSET_CURRENT_TIME';
export const LOAD_SOUND_NODES = 'LOAD_SOUND_NODES';
export const SET_SOUND_NODES = 'SET_SOUND_NODES';
export const BACK_TO_DJ_MODE = 'BACK_TO_DJ_MODE';
export const UNLOCK_REVIEW = 'UNLOCK_REVIEW';

export interface LoadMusic {
  type: typeof LOAD_MUSIC;
  payload: {
    url: string;
  };
}
export const loadMusic = (url: string): LoadMusic => ({
  type: LOAD_MUSIC,
  payload: {
    url,
  },
});

export interface SetMusicSource {
  type: typeof SET_MUSIC_SOURCE;
  payload: {
    musicSource: AudioBufferSourceNode;
  };
}
export const setMusicSource = (
  musicSource: AudioBufferSourceNode
): SetMusicSource => ({
  type: SET_MUSIC_SOURCE,
  payload: {
    musicSource,
  },
});

export interface StartMusic {
  type: typeof START_MUSIC;
}
export const startMusic = (): StartMusic => ({
  type: START_MUSIC,
});

export interface LoadMusicInfo {
  type: typeof LOAD_MUSIC_INFO;
  payload: {
    musicId: string;
  };
}
export const loadMusicInfo = (musicId: string): LoadMusicInfo => ({
  type: LOAD_MUSIC_INFO,
  payload: {
    musicId,
  },
});

export interface SetMusicInfo {
  type: typeof SET_MUSIC_INFO;
  payload: {
    musicInfo: MusicInfo;
  };
}
export const setMusicInfo = (musicInfo: MusicInfo): SetMusicInfo => ({
  type: SET_MUSIC_INFO,
  payload: {
    musicInfo,
  },
});

export interface SetOffsetCurrentTime {
  type: typeof SET_OFFSET_CURRENT_TIME;
  payload: {
    offsetCurrentTime: number;
  };
}
export const setOffsetCurrentTime = (
  offsetCurrentTime: number
): SetOffsetCurrentTime => ({
  type: SET_OFFSET_CURRENT_TIME,
  payload: {
    offsetCurrentTime,
  },
});

export interface LoadSoundNodes {
  type: typeof LOAD_SOUND_NODES;
}
export const loadSoundNodes = (): LoadSoundNodes => ({
  type: LOAD_SOUND_NODES,
});

export interface SoundNodes {
  filterNode: FilterNode;
  systemGainNode: GainNode;
  analyzerNode: AnalyserNode;
  analyzerParams: AnalyserParams;
}

export interface SetSoundNodes {
  type: typeof SET_SOUND_NODES;
  payload: SoundNodes;
}
export const setSoundNodes = ({
  filterNode,
  systemGainNode,
  analyzerNode,
  analyzerParams,
}: SoundNodes): SetSoundNodes => ({
  type: SET_SOUND_NODES,
  payload: {
    filterNode,
    systemGainNode,
    analyzerNode,
    analyzerParams,
  },
});

export interface BackToDJMode {
  type: typeof BACK_TO_DJ_MODE;
}
export const backToDJMode = (): BackToDJMode => ({
  type: BACK_TO_DJ_MODE,
});

export interface UnlockReview {
  type: typeof UNLOCK_REVIEW;
}
export const unlockReview = (): UnlockReview => ({
  type: UNLOCK_REVIEW,
});
