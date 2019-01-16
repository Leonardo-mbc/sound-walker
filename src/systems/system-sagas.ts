import { call, put, takeEvery, select } from 'redux-saga/effects';
import * as SystemAction from './system-actions';
import * as TitleAction from '../components/pages/title/title-actions';
import { AudioUtils } from '../utilities/audio-utils';
import { Sound, Achievement, Configs } from '../systems/system-interfaces';
import * as localStorage from '../utilities/local-storage';
import { STORAGE_KEYS, WEBSQL_TABLES } from '../constant/storage-keys';
import { delay } from '../utilities/delay';
import { WebSQL } from '../utilities/web-sql';
import { achievementReview } from '../utilities/achievement-review';

const systemSaga = [
  takeEvery(SystemAction.INITIAL_RUN, function*(
    _action: SystemAction.InitialRun
  ) {
    yield put(SystemAction.createSoundsLine());
    yield put(SystemAction.loadSystemSounds());
    yield put(SystemAction.setUserAgent());
    yield put(
      SystemAction.setDisplayVertically(window.innerWidth, window.innerHeight)
    );
    yield put(SystemAction.getAchievement());
    yield put(SystemAction.getConfigs());
  }),

  takeEvery(SystemAction.LOAD_SYSTEM_SOUNDS, function*(
    _action: SystemAction.LoadSystemSounds
  ) {
    yield put(SystemAction.setLoadingCircleVisible(true));
    const [titleSource, unlockedSource, dummySource] = yield call(async () => {
      const audioUtils = AudioUtils.instance;
      const titleBuffer = await audioUtils.loadAudioBufferFromUrl({
        url: '/assets/sounds/title.mp3',
        onProgress: (loaded: number) => {
          // どうしてもreducerを呼べないため妥協
          const loadingBar = document.getElementById('system-loading-bar');
          if (loadingBar) {
            loadingBar.style.width = `${loaded * 100.0}%`;
          }

          const playerSystemProgress = document.getElementById(
            'player-system-progress'
          );
          if (playerSystemProgress) {
            const progress = loaded < 1.0 ? Math.floor(loaded * 100.0) : 100;
            playerSystemProgress.innerText = `${progress}%`;
          }
        },
      });
      const unlockedBuffer = await audioUtils.loadAudioBufferFromUrl({
        url: '/assets/sounds/unlocked.mp3',
      });
      const dummyBuffer = await audioUtils.loadAudioBufferFromUrl({
        url: '/assets/sounds/dummy.mp3',
      });

      const titleSource = audioUtils.context.createBufferSource();
      titleSource.buffer = titleBuffer;
      titleSource.loop = true;

      const unlockedSource = audioUtils.context.createBufferSource();
      unlockedSource.buffer = unlockedBuffer;
      unlockedSource.loop = false;

      const dummySource = audioUtils.context.createBufferSource();
      dummySource.buffer = dummyBuffer;
      dummySource.loop = false;

      return [titleSource, unlockedSource, dummySource];
    });

    const { system } = yield select();
    const { systemGainNode } = system.sound as Sound;

    titleSource.connect(systemGainNode);
    unlockedSource.connect(systemGainNode);

    yield put(
      SystemAction.setSystemSource({
        key: 'title',
        bufferNode: titleSource,
      })
    );
    yield put(
      SystemAction.setSystemSource({
        key: 'unlocked',
        bufferNode: unlockedSource,
      })
    );
    yield put(
      SystemAction.setSystemSource({
        key: 'dummy',
        bufferNode: dummySource,
      })
    );

    yield put(TitleAction.setLoadComplete());
    yield put(SystemAction.setSystemReady(true));
    yield put(SystemAction.setLoadingCircleVisible(false));
  }),

  takeEvery(SystemAction.REMAKE_SYSTEM_SOUNDS, function*(
    action: SystemAction.RemakeSystemSounds
  ) {
    try {
      // タイトル以外の画面から入ってきたときに再生されてないためエラーとなるため
      action.payload.bufferNode.stop(0);
    } catch (e) {}

    const audioUtils = AudioUtils.instance;
    const buffer = action.payload.bufferNode.buffer;
    const bufferNode = audioUtils.context.createBufferSource();
    bufferNode.buffer = buffer;

    const { system } = yield select();
    const { systemGainNode } = system.sound as Sound;
    bufferNode.connect(systemGainNode);

    if (action.payload.soonToPlay) {
      bufferNode.start(0, action.payload.startTime);
    }

    yield put(
      SystemAction.setSystemSource({
        key: action.payload.key,
        bufferNode: bufferNode,
      })
    );
  }),

  takeEvery(SystemAction.GET_ACHIEVEMENT, function*(
    _action: SystemAction.GetAchievement
  ) {
    const achievement = yield call(() => {
      const data = localStorage.read({
        where: STORAGE_KEYS.ACHIEVEMENT,
      }) as Achievement;
      if (!data.scores) {
        const emptyScores = {
          scores: [
            {
              musicId: 'm1',
              status: 'UNLOCKED',
            },
          ],
        } as Achievement;
        localStorage.write({
          where: STORAGE_KEYS.ACHIEVEMENT,
          value: emptyScores,
        });
        return emptyScores;
      } else {
        return data;
      }
    });

    yield put(SystemAction.setAchievement(achievement));
  }),

  takeEvery(SystemAction.GET_CONFIGS, function*(
    _action: SystemAction.GetConfigs
  ) {
    const configs = yield call(() => {
      const data = localStorage.read({
        where: STORAGE_KEYS.CONFIGS,
      }) as Configs;
      if (Object.keys(data).length == 0) {
        const emptyConfigs = {
          skipTutorial: {
            playMode: false,
            djMode: false,
          },
        } as Configs;
        localStorage.write({
          where: STORAGE_KEYS.CONFIGS,
          value: emptyConfigs,
        });
        return emptyConfigs;
      } else {
        return data;
      }
    });

    yield put(SystemAction.setConfigs(configs));
  }),

  takeEvery(SystemAction.SET_ACHIEVEMENT_STATE, function*(
    action: SystemAction.SetAchievementState
  ) {
    const { musicId, status } = action.payload;
    const { scores } = localStorage.read({
      where: STORAGE_KEYS.ACHIEVEMENT,
    }) as Achievement;
    const scoresMusicIds = scores.map(({ musicId }) => musicId);

    let newScores;
    if (scoresMusicIds.indexOf(musicId) < 0) {
      newScores = [...scores, { musicId, status }];
    } else {
      newScores = scores.map((score) => {
        if (score.musicId === musicId) {
          return { ...score, status };
        }
        return score;
      });
    }

    const achievement = { scores: newScores };
    yield call(() => {
      localStorage.write({
        where: STORAGE_KEYS.ACHIEVEMENT,
        value: achievement,
      });
    });
    yield put(SystemAction.setAchievement(achievement));
  }),

  takeEvery(SystemAction.SET_CONFIGS_STATE, function*(
    action: SystemAction.SetConfigsState
  ) {
    const { key, value } = action.payload;
    const configs = localStorage.read({
      where: STORAGE_KEYS.CONFIGS,
    }) as Configs & { [index: string]: Partial<Configs> };

    const newConfigs = {
      ...configs,
      [key]:
        typeof value === 'object'
          ? {
              ...configs[key],
              ...value,
            }
          : value,
    };
    yield call(() => {
      localStorage.write({
        where: STORAGE_KEYS.CONFIGS,
        value: newConfigs,
      });
    });
    yield put(SystemAction.setConfigs(newConfigs));
  }),

  takeEvery(SystemAction.RING_UNLOCK_SOUND, function*(
    _action: SystemAction.RingUnlockSound
  ) {
    const { system } = yield select();
    const { systemGainNode, sources } = system.sound as Sound;
    const { unlocked } = sources;

    try {
      unlocked.start(0, 0);
      yield delay(2000);
      unlocked.stop();
    } catch {}

    const audioUtils = AudioUtils.instance;
    const buffer = unlocked.buffer;
    const bufferNode = audioUtils.context.createBufferSource();
    bufferNode.buffer = buffer;

    bufferNode.connect(systemGainNode);

    yield put(
      SystemAction.setSystemSource({
        key: 'unlocked',
        bufferNode: bufferNode,
      })
    );
  }),

  takeEvery(SystemAction.ADD_PLAY_LOG, function*(
    action: SystemAction.AddPlayLog
  ) {
    const db = new WebSQL();
    yield call(async () => {
      try {
        return await db.insert(WEBSQL_TABLES.PLAY_LOGS, {
          musicId: action.payload.musicId,
          datetime: +new Date(),
        });
      } catch (e) {
        console.error(e);
      }
    });
  }),

  takeEvery(SystemAction.ACHIEVEMENT_REVIEW, function*(
    _action: SystemAction.AchievementReview
  ) {
    const db = new WebSQL();
    const result = yield call(async () => {
      try {
        return await db.select(WEBSQL_TABLES.PLAY_LOGS);
      } catch (e) {
        console.error(e);
      }
    });

    let playLogs = [];
    for (let i = 0; i < result.rows.length; i++) {
      playLogs.push(result.rows.item(i));
    }

    const achievement = localStorage.read({
      where: STORAGE_KEYS.ACHIEVEMENT,
    }) as Achievement;
    const newArrivalIds = achievementReview({
      achievement,
      playLogs,
    });

    // FIXME: yield must to be in the generator function, can not use map
    if (newArrivalIds[0]) {
      yield put(
        SystemAction.setAchievementState({
          musicId: newArrivalIds[0],
          status: 'ARRIVAL',
        })
      );
    }
    if (newArrivalIds[1]) {
      yield put(
        SystemAction.setAchievementState({
          musicId: newArrivalIds[1],
          status: 'ARRIVAL',
        })
      );
    }
  }),

  takeEvery(SystemAction.RESUME_AUDIO_CONTEXT, function*(
    _action: SystemAction.ResumeAudioContext
  ) {
    const { system } = yield select();
    const { context } = system.sound as Sound;

    // AudioContext の作成を待つ
    yield delay(200);

    yield call(async () => {
      await context.resume();
    });
  }),
];

export default systemSaga;
