import { SystemState } from '../systems/system-interfaces';
import { TitleState } from '../components/pages/title/title-interfaces';
import { PlayerState } from '../components/pages/player/player-interfaces';
import { MusicSelectState } from '../components/pages/music-select/music-select-interfaces';

export interface State {
  system: SystemState;
  title: TitleState;
  player: PlayerState;
  musicSelect: MusicSelectState;
}

export const initialState: State = {
  system: {
    isTouchedForPlay: false,
    isSystemReady: false,
    sound: {
      sources: {
        title: null,
        unlocked: null,
        dummy: null,
        samples: {},
      },
      context: null,
      systemGainNode: null,
      cueAGainNode: null,
      cueBGainNode: null,
      analyzerNode: null,
      filterNode: null,
      analyzerParams: null,
    },
    display: {
      isPortrait: false,
      isLoadingCircleVisible: false,
      logoTransition: {
        isVisible: false,
        duration: 2000,
      },
    },
    achievement: null,
  },
  title: {
    loadingBarWidth: 0,
    isLoadComplete: false,
  },
  player: {
    isSourceReady: false,
    isMusicInfoReady: false,
    isMusicPlaying: false,
    source: null,
    offsetCurrentTime: 0,
    musicInfo: null,
    filterNode: null,
    gainNode: null,
    analyzerNode: null,
    analyzerParams: null,
  },
  musicSelect: {
    musicList: [],
    selectedMusicId: 'm1',
    discFaders: [],
    discSide: [],
    cursor: 0,
    isCursorLocked: false,
  },
};
