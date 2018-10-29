import { DiscInfo } from '../../commons/music-disc/music-disc-interface';
import { MusicSelectMode } from './music-select-container';

export type ActionTypes =
  | GoToPlayer
  | SampleMusicLoad
  | SampleMusicPlay
  | SampleMusicFadeOut
  | RemakeSampleSounds
  | FadeDiscMusic
  | ChangeDiscSide
  | SetSelectedMusicId
  | GetMusicList
  | SetMusicList
  | SetCursor;

export const GO_TO_PLAYER = 'GO_TO_PLAYER';
export const SAMPLE_MUSIC_LOAD = 'SAMPLE_MUSIC_LOAD';
export const SAMPLE_MUSIC_PLAY = 'SAMPLE_MUSIC_PLAY';
export const SAMPLE_MUSIC_FADE_OUT = 'SAMPLE_MUSIC_FADE_OUT';
export const REMAKE_SAMPLE_SOUNDS = 'REMAKE_SAMPLE_SOUNDS';
export const FADE_DISC_MUSIC = 'FADE_DISC_MUSIC';
export const CHANGE_DISC_SIDE = 'CHANGE_DISC_SIDE';
export const SET_SELECTED_MUSIC_ID = 'SET_SELECTED_MUSIC_ID';
export const GET_MUSIC_LIST = 'GET_MUSIC_LIST';
export const SET_MUSIC_LIST = 'SET_MUSIC_LIST';
export const SET_CURSOR = 'SET_CURSOR';

export interface GoToPlayer {
  type: typeof GO_TO_PLAYER;
  payload: {
    mode: MusicSelectMode;
    musicId: string;
  };
}
export const goToPlayer = (
  mode: MusicSelectMode,
  musicId: string
): GoToPlayer => ({
  type: GO_TO_PLAYER,
  payload: {
    mode,
    musicId,
  },
});

export interface SampleMusicLoadPayload {
  musicId: string;
  gainNode: GainNode;
}
export interface SampleMusicLoad {
  type: typeof SAMPLE_MUSIC_LOAD;
  payload: SampleMusicLoadPayload;
}
export const sampleMusicLoad = ({
  musicId,
  gainNode,
}: SampleMusicLoadPayload): SampleMusicLoad => ({
  type: SAMPLE_MUSIC_LOAD,
  payload: {
    musicId,
    gainNode,
  },
});

export interface SampleMusicPlayPayload {
  musicIds: string[];
  faderGainValues: number[];
}
export interface SampleMusicPlay {
  type: typeof SAMPLE_MUSIC_PLAY;
  payload: SampleMusicPlayPayload;
}
export const sampleMusicPlay = ({
  musicIds,
  faderGainValues,
}: SampleMusicPlayPayload): SampleMusicPlay => ({
  type: SAMPLE_MUSIC_PLAY,
  payload: {
    musicIds,
    faderGainValues,
  },
});

export interface SampleMusicFadeOut {
  type: typeof SAMPLE_MUSIC_FADE_OUT;
  payload: {
    musicIds: string[];
  };
}
export const sampleMusicFadeOut = (musicIds: string[]): SampleMusicFadeOut => ({
  type: SAMPLE_MUSIC_FADE_OUT,
  payload: {
    musicIds,
  },
});

interface RemakeSampleSoundsPayload {
  key: string;
  bufferNode: AudioBufferSourceNode;
  gainNode: GainNode;
  startTime?: number;
  soonToPlay?: boolean;
}
export interface RemakeSampleSounds {
  type: typeof REMAKE_SAMPLE_SOUNDS;
  payload: RemakeSampleSoundsPayload;
}
export const remakeSampleSounds = ({
  key,
  bufferNode,
  gainNode,
  startTime,
  soonToPlay,
}: RemakeSampleSoundsPayload): RemakeSampleSounds => ({
  type: REMAKE_SAMPLE_SOUNDS,
  payload: {
    key,
    bufferNode,
    gainNode,
    startTime,
    soonToPlay,
  },
});

export interface FadeDiscMusic {
  type: typeof FADE_DISC_MUSIC;
  payload: {
    cursor: number;
    values: number[];
  };
}
export const fadeDiscMusic = (
  cursor: number,
  values: number[]
): FadeDiscMusic => ({
  type: FADE_DISC_MUSIC,
  payload: {
    cursor,
    values,
  },
});

export interface ChangeDiscSide {
  type: typeof CHANGE_DISC_SIDE;
  payload: {
    cursor: number;
    discSide: number;
  };
}
export const changeDiscSide = (
  cursor: number,
  discSide: number
): ChangeDiscSide => ({
  type: CHANGE_DISC_SIDE,
  payload: {
    cursor,
    discSide,
  },
});

export interface SetSelectedMusicId {
  type: typeof SET_SELECTED_MUSIC_ID;
  payload: {
    musicId: string;
  };
}
export const setSelectedMusicId = (musicId: string): SetSelectedMusicId => ({
  type: SET_SELECTED_MUSIC_ID,
  payload: {
    musicId,
  },
});

export interface GetMusicList {
  type: typeof GET_MUSIC_LIST;
}
export const getMusicList = (): GetMusicList => ({
  type: GET_MUSIC_LIST,
});

export interface SetMusicList {
  type: typeof SET_MUSIC_LIST;
  payload: {
    musicList: DiscInfo[];
  };
}
export const setMusicList = (musicList: DiscInfo[]): SetMusicList => ({
  type: SET_MUSIC_LIST,
  payload: {
    musicList,
  },
});

export interface SetCursor {
  type: typeof SET_CURSOR;
  payload: {
    cursor: number;
  };
}
export const setCursor = (cursor: number): SetCursor => ({
  type: SET_CURSOR,
  payload: {
    cursor,
  },
});
