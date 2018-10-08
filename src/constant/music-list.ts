// デバッグ用の const 文字列

import { DiscInfo } from '../components/commons/music-disc/music-disc-interface';

export type MusicList = DiscInfo[];

export const musicList: MusicList = [
  [
    {
      meta: {
        title: 'music1',
        artist: 'artist1',
        musicId: 'm1',
        bpm: 130.0,
        offsetTime: 0.0,
        level: 5,
        discImage: '',
      },
      scores: [[], []],
    },
    {
      meta: {
        title: 'music2',
        artist: 'artist2',
        musicId: 'r1',
        bpm: 130.0,
        offsetTime: 0.0,
        level: 5,
        discImage: '',
      },
      scores: [[], []],
    },
  ],
  [
    {
      meta: {
        title: 'music3',
        artist: 'artist3',
        musicId: 'm2',
        bpm: 130.0,
        offsetTime: 0.0,
        level: 5,
        discImage: '',
      },
      scores: [[], []],
    },
    {
      meta: {
        title: 'music4',
        artist: 'artist4',
        musicId: 'r2',
        bpm: 130.0,
        offsetTime: 0.0,
        level: 5,
        discImage: '',
      },
      scores: [[], []],
    },
  ],
];
