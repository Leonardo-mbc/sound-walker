import { put, takeEvery, select } from 'redux-saga/effects';
import * as TitleAction from './title-actions';
import { Sound } from '../../../systems/system-interfaces';
import { push } from 'react-router-redux';

const titleSaga = [
  takeEvery(TitleAction.START_GAME_TITLE, function* (_action: TitleAction.StartGameTitle) {
    const { system } = yield select();
    const { sources } = system.sound as Sound;
    sources.title.start(0, 0);

    yield put(push('title-intro'));
  })
];

export default titleSaga;
