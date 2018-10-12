import { SystemState } from '../systems/system-interfaces';
import { TitleState } from '../components/pages/title/title-interfaces';
import { PlayerState } from '../components/pages/player/player-interfaces';

export interface State {
  system: SystemState;
  title: TitleState;
  player: PlayerState;
}

export const initialState: State = {
  system: {
    sound: {
      sources: {
        title: null,
        samples: {},
      },
      context: null,
      systemGainNode: null,
      cueAGainNode: null,
      cueBGainNode: null,
      analyserNode: null,
      filterNode: null,
      analyserParams: null,
    },
    display: {
      isPortrait: false,
      isLoadingCircleVisible: false,
    },
  },
  title: {
    loadingBarWidth: 0,
    isLoadComplete: false,
  },
  player: {
    isSystemReady: false,
    isSourceReady: false,
    isMusicInfoReady: false,
    isMusicPlaying: false,
    source: null,
    offsetCurrentTime: 0,
    musicInfo: null,
  },
};
