import { MusicInfo } from './player-interfaces';

export type ActionTypes =
  | SetSystemReady
  | LoadMusic
  | SetMusicSource
  | StartMusic
  | LoadMusicInfo
  | SetMusicInfo;

export const SET_SYSTEM_READY = 'SET_PLAYER_READY';
export const LOAD_MUSIC = 'LOAD_MUSIC';
export const SET_MUSIC_SOURCE = 'SET_MUSIC_SOURCE';
export const START_MUSIC = 'START_MUSIC';
export const LOAD_MUSIC_INFO = 'LOAD_SCORE';
export const SET_MUSIC_INFO = 'SET_MUSIC_INFO';

export interface SetSystemReady {
  type: typeof SET_SYSTEM_READY;
  payload: {
    isSystemReady: boolean;
  }
}
export const setSystemReady = (isSystemReady: boolean): SetSystemReady => ({
  type: SET_SYSTEM_READY,
  payload: {
    isSystemReady
  }
});

export interface LoadMusic {
  type: typeof LOAD_MUSIC;
  payload: {
    url: string;
  }
}
export const loadMusic = (url: string): LoadMusic => ({
  type: LOAD_MUSIC,
  payload: {
    url
  }
});

export interface SetMusicSource {
  type: typeof SET_MUSIC_SOURCE;
  payload: {
    musicSource: AudioBufferSourceNode;
  }
}
export const setMusicSource = (musicSource: AudioBufferSourceNode): SetMusicSource => ({
  type: SET_MUSIC_SOURCE,
  payload: {
    musicSource
  }
});

export interface StartMusic {
  type: typeof START_MUSIC;
}
export const startMusic = (): StartMusic => ({
  type: START_MUSIC
});

export interface LoadMusicInfo {
  type: typeof LOAD_MUSIC_INFO;
  payload: {
    musicId: string;
  }
}
export const loadMusicInfo = (musicId: string): LoadMusicInfo => ({
  type: LOAD_MUSIC_INFO,
  payload: {
    musicId
  }
});

export interface SetMusicInfo {
  type: typeof SET_MUSIC_INFO;
  payload: {
    musicInfo: MusicInfo;
  }
}
export const setMusicInfo = (musicInfo: MusicInfo): SetMusicInfo => ({
  type: SET_MUSIC_INFO,
  payload: {
    musicInfo
  }
});
