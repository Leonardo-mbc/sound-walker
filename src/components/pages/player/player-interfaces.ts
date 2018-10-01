export interface PlayerState {
  isSystemReady: boolean;
  isSourceReady: boolean;
  isMusicInfoReady: boolean;
  isMusicPlaying: boolean;
  source: AudioBufferSourceNode;
  offsetCurrentTime: number;
  musicInfo: MusicInfo;
}

export interface MusicInfo {
  meta: MusicMetaData;
  scores: MusicScore[][];
}

export interface MusicMetaData {
  title: string;
  musicId: string;
  bpm: number;
  offsetTime: number;
}

export interface MusicScore {
  time: number;
  signal: -1 | 0 | 1;
  position: number;
}
