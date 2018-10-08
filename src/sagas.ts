import { all, put } from 'redux-saga/effects';
import { initialRun } from './systems/system-actions';
import systemSaga from './systems/system-sagas';
import titleSaga from './components/pages/title/title-saga';
import playerSaga from './components/pages/player/player-saga';
import musicSelectSaga from './components/pages/music-select/music-select-saga';

export function* rootSaga() {
  yield all([...systemSaga, ...titleSaga, ...playerSaga, ...musicSelectSaga]);
  yield put(initialRun());
}
