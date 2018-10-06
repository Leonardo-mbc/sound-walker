export type ActionTypes = SetSystemReady;

export const SET_SYSTEM_READY = 'SET_PLAYER_READY';

export interface SetSystemReady {
  type: typeof SET_SYSTEM_READY;
  payload: {
    isSystemReady: boolean;
  };
}
export const setSystemReady = (isSystemReady: boolean): SetSystemReady => ({
  type: SET_SYSTEM_READY,
  payload: {
    isSystemReady,
  },
});
