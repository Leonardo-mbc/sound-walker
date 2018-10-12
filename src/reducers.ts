import { systemReducer } from './systems/system-reducers';
import { playerReducer } from './components/pages/player/player-reducers';
import { titleReducer } from './components/pages/title/title-reducers';
import { musicSelectReducer } from './components/pages/music-select/music-select-reducers';

export const reducer = {
  system: systemReducer,
  title: titleReducer,
  player: playerReducer,
  musicSelect: musicSelectReducer,
};
