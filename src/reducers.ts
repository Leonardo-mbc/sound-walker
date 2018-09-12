import { playerReducer } from "./components/pages/player/player-reducers";
import { titleReducer } from './components/pages/title/title-reducers';
import { systemReducer } from './systems/system-reducers';

export const reducer = {
  system: systemReducer,
  title: titleReducer,
  player: playerReducer,
};
