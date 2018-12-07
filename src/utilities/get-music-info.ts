import { MusicList } from '../constant/music-list';
import { MusicMetaData } from '../components/pages/player/player-interfaces';

export const getMusicMetaByIds = (
  musicIds: string[],
  musicList: MusicList
): MusicMetaData[] => {
  let findInfo: MusicMetaData[] = [];
  musicList.map((disc) => {
    disc.map((musicInfo) => {
      if (0 <= musicIds.indexOf(musicInfo.meta.musicId)) {
        findInfo.push(musicInfo.meta);
      }
    });
  });
  return findInfo;
};

export interface MusicPosition {
  cursor: number;
  side: number;
}

export const getMusicPositionById = (
  musicId: string,
  musicList: MusicList
): MusicPosition => {
  let findPosition: MusicPosition = null;
  musicList.map((disc, listId) => {
    disc.map((musicInfo, sideId) => {
      if (musicInfo.meta.musicId === musicId) {
        findPosition = {
          cursor: listId,
          side: sideId,
        };
      }
    });
  });

  return findPosition;
};
