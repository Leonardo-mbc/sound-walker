import * as TWEEN from 'tween.js';
import { takeEvery, put, call, select } from 'redux-saga/effects';
import * as MusicSelectAction from './music-select-actions';
import * as SystemAction from '../../../systems/system-actions';
import { delay } from '../../../utilities/delay';
import { push } from 'react-router-redux';
import { AudioUtils } from '../../../utilities/audio-utils';
import { Sound } from '../../../systems/system-interfaces';
import { musicList } from '../../../constant/music-list';
import { MusicSelectState } from './music-select-interfaces';
import {
  MUSIC_SELECT_PLAY,
  MUSIC_SELECT_DJ_MODE,
} from './music-select-container';

const musicSelectSaga = [
  takeEvery(MusicSelectAction.GO_TO_PLAYER, function*(
    action: MusicSelectAction.GoToPlayer
  ) {
    // yield delay(800);
    switch (action.payload.mode) {
      case MUSIC_SELECT_PLAY:
        yield put(push(`/player/${action.payload.musicId}`));
        break;
      case MUSIC_SELECT_DJ_MODE:
        yield put(push(`/dj-player/${action.payload.musicId}`));
        break;
    }
  }),

  takeEvery(MusicSelectAction.SAMPLE_MUSIC_PLAY, function*(
    action: MusicSelectAction.SampleMusicPlay
  ) {
    const { musicIds, faderGainValues } = action.payload;
    const [musicAId, musicBId] = musicIds;

    const { system } = yield select();
    const { sources, cueAGainNode, cueBGainNode } = system.sound as Sound;
    const audioUtils = AudioUtils.instance;

    // FIXME: put だと非同期を待ってくれないため愚直に２回書いてる
    if (!(musicAId in sources.samples)) {
      yield put(SystemAction.setLoadingCircleVisible(true));
      const sampleSource: AudioBufferSourceNode = yield call(async () => {
        const audioBuffer = await audioUtils.loadAudioBufferFromUrl({
          url: `/assets/sounds/music-samples/${musicAId}.mp3`,
        });

        const source = audioUtils.context.createBufferSource();

        source.buffer = audioBuffer;
        source.loop = true;

        return source;
      });

      sampleSource.connect(cueAGainNode);

      yield put(
        SystemAction.setSampleSource({
          key: musicAId,
          bufferNode: sampleSource,
        })
      );
      yield put(SystemAction.setLoadingCircleVisible(false));
    }

    if (!(musicBId in sources.samples)) {
      yield put(SystemAction.setLoadingCircleVisible(true));
      const sampleSource: AudioBufferSourceNode = yield call(async () => {
        const audioBuffer = await audioUtils.loadAudioBufferFromUrl({
          url: `/assets/sounds/music-samples/${musicBId}.mp3`,
        });

        const source = audioUtils.context.createBufferSource();

        source.buffer = audioBuffer;
        source.loop = true;

        return source;
      });

      sampleSource.connect(cueBGainNode);

      yield put(
        SystemAction.setSampleSource({
          key: musicBId,
          bufferNode: sampleSource,
        })
      );
      yield put(SystemAction.setLoadingCircleVisible(false));
    }

    const store = yield select();
    const sound = store.system.sound as Sound;
    const { samples } = sound.sources;

    cueAGainNode.gain.value = faderGainValues[0];
    cueBGainNode.gain.value = faderGainValues[1];

    for (let key in samples) {
      try {
        // 再生前にすべての samples を stop() する
        // このとき、正常に stop 出来た sample は 1度鳴ってしまっているので remakeSampleSounds する
        samples[key].stop();
        yield put(
          MusicSelectAction.remakeSampleSounds({
            key,
            bufferNode: sources.samples[key],
            gainNode: key.indexOf('r') < 0 ? cueAGainNode : cueBGainNode,
          })
        );
      } catch (e) {}
    }

    samples[musicAId].start(0, 0);
    samples[musicBId].start(0, 0);
  }),

  takeEvery(MusicSelectAction.SAMPLE_MUSIC_FADE_OUT, function*(
    action: MusicSelectAction.SampleMusicFadeOut
  ) {
    const { system } = yield select();
    const { sources, cueAGainNode, cueBGainNode } = system.sound as Sound;
    const [musicAId, musicBId] = action.payload.musicIds;

    const fadeTime = action.payload.duration || 250;
    new TWEEN.Tween(cueAGainNode.gain)
      .to({ value: 0.0 }, fadeTime)
      .onComplete(() => {
        try {
          sources.samples[musicAId].stop();
        } catch (e) {}
      })
      .start();

    new TWEEN.Tween(cueBGainNode.gain)
      .to({ value: 0.0 }, fadeTime)
      .onComplete(() => {
        try {
          sources.samples[musicBId].stop();
        } catch (e) {}
      })
      .start();

    yield delay(fadeTime);

    if (sources.samples[musicAId]) {
      // 高速にディスクを変えられると sources.samples にデータが入る前にここにきてしまう
      yield put(
        MusicSelectAction.remakeSampleSounds({
          key: musicAId,
          bufferNode: sources.samples[musicAId],
          gainNode: cueAGainNode,
        })
      );
    }

    if (sources.samples[musicBId]) {
      // 高速にディスクを変えられると sources.samples にデータが入る前にここにきてしまう、特に musicB
      yield put(
        MusicSelectAction.remakeSampleSounds({
          key: musicBId,
          bufferNode: sources.samples[musicBId],
          gainNode: cueBGainNode,
        })
      );
    }
  }),

  takeEvery(MusicSelectAction.REMAKE_SAMPLE_SOUNDS, function*(
    action: MusicSelectAction.RemakeSampleSounds
  ) {
    if (action.payload.bufferNode) {
      try {
        action.payload.bufferNode.stop(0);
      } catch (e) {}

      const audioUtils = AudioUtils.instance;
      const buffer = action.payload.bufferNode.buffer;
      const bufferNode = audioUtils.context.createBufferSource();

      bufferNode.buffer = buffer;
      bufferNode.loop = true;
      bufferNode.connect(action.payload.gainNode);

      if (action.payload.soonToPlay) {
        bufferNode.start(0, action.payload.startTime);
      }

      yield put(
        SystemAction.setSampleSource({
          key: action.payload.key,
          bufferNode,
        })
      );
    }
  }),

  takeEvery(MusicSelectAction.FADE_DISC_MUSIC, function*(
    action: MusicSelectAction.FadeDiscMusic
  ) {
    const { system } = yield select();
    const { cueAGainNode, cueBGainNode } = system.sound as Sound;
    const [cueAGainValue, cueBGainValue] = action.payload.values;

    cueAGainNode.gain.value = cueAGainValue;
    cueBGainNode.gain.value = cueBGainValue;
  }),

  takeEvery(MusicSelectAction.GET_MUSIC_LIST, function*(
    _action: MusicSelectAction.GetMusicList
  ) {
    // yield put(SystemAction.setLoadingCircleVisible(true));
    // yield delay(1000);
    // yield put(SystemAction.setLoadingCircleVisible(false));

    yield put(MusicSelectAction.setMusicList(musicList));

    const { musicSelect } = yield select();
    const { cursor, discFaders } = musicSelect as MusicSelectState;

    yield put(
      MusicSelectAction.sampleMusicPlay({
        musicIds: musicList[cursor].map((musicInfo) => {
          return musicInfo.meta.musicId;
        }),
        faderGainValues: discFaders[cursor] || [1, 0],
      })
    );
  }),
];

export default musicSelectSaga;
