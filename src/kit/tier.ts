export const Tier = {
  Common: 't1',
  Rare: 't2',
  Jackpot: 't3',
} as const;

export type Tier = (typeof Tier)[keyof typeof Tier];
