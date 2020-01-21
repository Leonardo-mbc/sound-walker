import { Achievement, PlayLogs } from '../systems/system-interfaces';

interface AchievementReview {
  achievement: Achievement;
  playLogs: PlayLogs;
}

export const achievementReview = ({
  achievement,
  playLogs,
}: AchievementReview) => {
  let newArrivalIds: string[] = [];
  const openedMusicIds = achievement.scores
    .filter(({ status }) => status === 'UNLOCKED' || status === 'ARRIVAL')
    .map(({ musicId }) => musicId);

  openedMusicIds
    .filter((musicId) => playLogs[musicId] && 1 <= playLogs[musicId])
    .map((musicId) => {
      // Played musicIds loop
      switch (musicId) {
        case 'm1': // Play m1
          // Arrival r1, m2
          openedMusicIds.indexOf('r1') < 0 ? newArrivalIds.push('r1') : null;
          openedMusicIds.indexOf('m2') < 0 ? newArrivalIds.push('m2') : null;
          break;
        case 'm2': // Play m2
          // Arrival r2, m3
          openedMusicIds.indexOf('r2') < 0 ? newArrivalIds.push('r2') : null;
          openedMusicIds.indexOf('m3') < 0 ? newArrivalIds.push('m3') : null;
          break;
        case 'm3': // Play m3
          // Arrival r3, m4
          openedMusicIds.indexOf('r3') < 0 ? newArrivalIds.push('r3') : null;
          openedMusicIds.indexOf('m4') < 0 ? newArrivalIds.push('m4') : null;
          break;
        case 'm4': // Play m4
          // Arrival r4, m5
          openedMusicIds.indexOf('r4') < 0 ? newArrivalIds.push('r4') : null;
          openedMusicIds.indexOf('m5') < 0 ? newArrivalIds.push('m5') : null;
          break;
        case 'm5': // Play m5
          // Arrival r5, m6
          openedMusicIds.indexOf('r5') < 0 ? newArrivalIds.push('r5') : null;
          openedMusicIds.indexOf('m6') < 0 ? newArrivalIds.push('m6') : null;
          break;
        case 'm6': // Play m6
          // Arrival r6, m7
          openedMusicIds.indexOf('r6') < 0 ? newArrivalIds.push('r6') : null;
          openedMusicIds.indexOf('m7') < 0 ? newArrivalIds.push('m7') : null;
          break;
        case 'm7': // Play m7
          // Arrival r7, m8
          openedMusicIds.indexOf('r7') < 0 ? newArrivalIds.push('r7') : null;
          openedMusicIds.indexOf('m8') < 0 ? newArrivalIds.push('m8') : null;
          break;
        case 'm8': // Play m8
          // Arrival r8, m9
          openedMusicIds.indexOf('r8') < 0 ? newArrivalIds.push('r8') : null;
          openedMusicIds.indexOf('m9') < 0 ? newArrivalIds.push('m9') : null;
          break;
        case 'm9': // Play m9
          // Arrival r9, m10
          openedMusicIds.indexOf('r9') < 0 ? newArrivalIds.push('r9') : null;
          openedMusicIds.indexOf('m10') < 0 ? newArrivalIds.push('m10') : null;
          break;
        case 'm10': // Play m10
          // Arrival r10
          openedMusicIds.indexOf('r10') < 0 ? newArrivalIds.push('r10') : null;
          break;
      }
    });

  return newArrivalIds;
};
