export type ActionTypes = GoToPlayer;

export const GO_TO_PLAYER = 'GO_TO_PLAYER';

export interface GoToPlayer {
  type: typeof GO_TO_PLAYER;
  payload: {
    musicId: string;
  };
}
export const goToPlayer = (musicId: string): GoToPlayer => ({
  type: GO_TO_PLAYER,
  payload: {
    musicId,
  },
});
