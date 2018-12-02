import { FilterNode, AnalyserParams } from '../../../systems/system-interfaces';

export interface PlayerState {
  isSourceReady: boolean;
  isMusicInfoReady: boolean;
  isMusicPlaying: boolean;
  source: AudioBufferSourceNode;
  offsetCurrentTime: number;
  musicInfo: MusicInfo;
  filterNode: FilterNode;
  gainNode: GainNode;
  analyzerNode: AnalyserNode;
  analyzerParams: AnalyserParams;
}

export interface MusicInfo {
  meta: MusicMetaData;
  scores: MusicScore[][];
}

export interface MusicMetaData {
  title: string;
  artist: string;
  musicId: string;
  bpm: number;
  offsetTime: number;
  level: number;
  discImage: string;
}

export interface MusicScore {
  time: number;
  signal: -1 | 0 | 1;
  position: number;
}
