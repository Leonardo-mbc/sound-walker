import { put, takeEvery, select } from 'redux-saga/effects';
import * as TitleAction from './title-actions';
import * as SystemAction from '../../../systems/system-actions';
import { Sound } from '../../../systems/system-interfaces';
import { push } from 'react-router-redux';
import * as TWEEN from 'tween.js';

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const titleSaga = [
  takeEvery(TitleAction.START_GAME_TITLE, function*(
    _action: TitleAction.StartGameTitle
  ) {
    const { system } = yield select();
    const { sources } = system.sound as Sound;
    sources.title.start(0, 0);

    yield put(push('/title/intro'));
  }),

  takeEvery(TitleAction.GO_TO_MAIN_MENU, function*(
    _action: TitleAction.GoToMainMenu
  ) {
    const { system } = yield select();
    const { systemGainNode } = system.sound as Sound;
    new TWEEN.Tween(systemGainNode.gain).to({ value: 1.0 }, 1000).start();

    yield put(push('/title/menu'));
  }),

  takeEvery(TitleAction.JUMP_TITLE_SOUND, function*(
    _action: TitleAction.JumpTitleSound
  ) {
    const { system } = yield select();
    const { sources } = system.sound as Sound;

    yield put(
      SystemAction.remakeSystemSounds({
        key: 'title',
        bufferNode: sources.title,
        startTime: 11.65,
        soonToPlay: true,
      })
    );
  }),

  takeEvery(TitleAction.GO_TO_MUSIC_SELECT, function*(
    _action: TitleAction.GoToMusicSelect
  ) {
    const { system } = yield select();
    const { systemGainNode } = system.sound as Sound;

    new TWEEN.Tween(systemGainNode.gain).to({ value: 0.0 }, 1000).start();
    yield delay(800);
    yield put(push('/music-select'));
  }),
];

export default titleSaga;
