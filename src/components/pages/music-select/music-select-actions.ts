export type ActionTypes =
  | GoToPlayer
  | SampleMusicPlay
  | SampleMusicFadeOut
  | RemakeSampleSounds
  | FadeDiscMusic;

export const GO_TO_PLAYER = 'GO_TO_PLAYER';
export const SAMPLE_MUSIC_PLAY = 'SAMPLE_MUSIC_PLAY';
export const SAMPLE_MUSIC_FADE_OUT = 'SAMPLE_MUSIC_FADE_OUT';
export const REMAKE_SAMPLE_SOUNDS = 'REMAKE_SAMPLE_SOUNDS';
export const FADE_DISC_MUSIC = 'FADE_DISC_MUSIC';

export interface GoToPlayer {
  type: typeof GO_TO_PLAYER;
  payload: {
    musicId: string;
  };
}
export const goToPlayer = (musicId: string): GoToPlayer => ({
  type: GO_TO_PLAYER,
  payload: {
    musicId,
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
