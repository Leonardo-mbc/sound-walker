import { takeEvery, put } from 'redux-saga/effects';
import * as MusicSelectAction from './music-select-actions';
import { delay } from '../../../utilities/delay';
import { push } from 'react-router-redux';

const musicSelectSaga = [
  takeEvery(MusicSelectAction.GO_TO_PLAYER, function*(
    action: MusicSelectAction.GoToPlayer
  ) {
    yield delay(800);
    yield put(push(`/player/${action.payload.musicId}`));
  }),
];

export default musicSelectSaga;
