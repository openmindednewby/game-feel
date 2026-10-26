import type { RankAxes, RankChain, RankSkip } from './rankTypes';

/** The FEEL-KIT-1 J-3 order, quietest first: a coin never out-shouts a death. */
export const DEFAULT_RANK_CHAIN: RankChain = [
  ['pickup-t1'],
  ['pickup-t2'],
  ['lock'],
  ['powerup'],
  ['pickup-t3'],
  ['hit-t1', 'hit-t2'],
  ['unlock'],
  ['death'],
  ['win'],
];

export const DEFAULT_RANK_AXES: RankAxes = {
  hitstop: ['hitstopMs'],
  shake: ['shakePct'],
  particles: ['sparkleCount', 'particleCount'],
};

export const DEFAULT_RANK_SKIP: RankSkip = {
  hitstop: ['pickup-t1', 'pickup-t2'],
  shake: ['pickup-t1', 'pickup-t2', 'powerup'],
  particles: ['hit-t1'],
};
