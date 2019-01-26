import * as TWEEN from 'tween.js';
import { put, takeEvery, select } from 'redux-saga/effects';
import * as TitleAction from './title-actions';
import * as SystemAction from '../../../systems/system-actions';
import { Sound } from '../../../systems/system-interfaces';
import { push } from 'react-router-redux';
import { delay } from '../../../utilities/delay';
import { TitleState } from './title-interfaces';

const titleSaga = [
  takeEvery(TitleAction.START_GAME_TITLE, function*(
    _action: TitleAction.StartGameTitle
  ) {
    const { system } = yield select();
    const { sources, context } = system.sound as Sound;

    if (!system.isTouchedForPlay) {
      yield put(SystemAction.createSoundsLine());
      yield put(SystemAction.setTouchedForPlay(true));
      yield delay(100);
    }

    sources.title.start(0, 0);
    yield put(TitleAction.setOffsetCurrentTime(context.currentTime));

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
    const { system, title } = yield select();
    const { sources, context } = system.sound as Sound;
    const { offsetCurrentTime } = title as TitleState;

    const STEP_START_TIME = 9.6;

    if (
      offsetCurrentTime === 0 ||
      context.currentTime - offsetCurrentTime < STEP_START_TIME
    ) {
      yield put(
        SystemAction.remakeSystemSounds({
          key: 'title',
          bufferNode: sources.title,
          startTime: STEP_START_TIME,
          soonToPlay: true,
        })
      );
    }

    yield put(TitleAction.setOffsetCurrentTime(0));
  }),

  takeEvery(TitleAction.GO_TO_MUSIC_SELECT, function*(
    _action: TitleAction.GoToMusicSelect
  ) {
    const { system } = yield select();
    const { systemGainNode, sources } = system.sound as Sound;

    new TWEEN.Tween(systemGainNode.gain)
      .to({ value: 0.0 }, 1000)
      .onComplete(() => {
        sources.title.stop();
        // 次 title を鳴らすときは remakeSystemSounds しなくてはならない

        systemGainNode.gain.value = 1.0;
      })
      .start();
    yield delay(800);
    yield put(push('/music-select'));
  }),

  takeEvery(TitleAction.GO_TO_DJ_MODE, function*(
    _action: TitleAction.GoToDJMode
  ) {
    const { system } = yield select();
    const { systemGainNode, sources } = system.sound as Sound;

    new TWEEN.Tween(systemGainNode.gain)
      .to({ value: 0.0 }, 1000)
      .onComplete(() => {
        sources.title.stop();
        // 次 title を鳴らすときは remakeSystemSounds しなくてはならない

        systemGainNode.gain.value = 1.0;
      })
      .start();
    yield delay(800);
    yield put(push('/dj-mode'));
  }),
];

export default titleSaga;
