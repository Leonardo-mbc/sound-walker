import { DiscInfo } from '../../commons/music-disc/music-disc-interface';

export interface MusicSelectState {
  musicList: DiscInfo[];
  selectedMusicId: string;
  discFaders: number[][];
  discSide: number[];
  cursor: number;
}
