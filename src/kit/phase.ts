export const Phase = {
  Anticipation: 'anticipation',
  Action: 'action',
  FollowThrough: 'followThrough',
} as const;

export type Phase = (typeof Phase)[keyof typeof Phase];

/** Longest anticipation overlap a player-input kit may have: 2 frames at 60 fps. */
export const PLAYER_INPUT_MAX_ANTICIPATION_MS = 33;
