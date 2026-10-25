export const KitId = {
  Pickup: 'pickup',
  PowerUp: 'powerUp',
  Hit: 'hit',
  Lock: 'lock',
  Bump: 'bump',
  Unlock: 'unlock',
  Death: 'death',
  Win: 'win',
  Move: 'move',
} as const;

export type KitId = (typeof KitId)[keyof typeof KitId];
