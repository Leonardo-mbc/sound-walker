// デバッグ用の const 文字列

import { DiscInfo } from '../components/commons/music-disc/music-disc-interface';

export type MusicList = DiscInfo[];

export const musicList: MusicList = [
  [
    {
      meta: {
        title: '24 Hours Happiness (ONE! TWO! remix)',
        artist: 'Quickdrop feat. Toni Fox',
        musicId: 'm1',
        bpm: 130.0,
        offsetTime: 0.0,
        level: 5,
        discImage: 'm1/1.png',
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
        discImage: 'm1/2.png',
      },
      scores: [[], []],
    },
  ],
  [
    {
      meta: {
        title: 'My Heart',
        artist: 'Different Heaven & EH!DE',
        musicId: 'm2',
        bpm: 130.0,
        offsetTime: 0.0,
        level: 5,
        discImage: 'm2/1.png',
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
        discImage: 'm2/2.png',
      },
      scores: [[], []],
    },
  ],
];
