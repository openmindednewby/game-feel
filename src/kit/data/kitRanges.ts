import type { KitId } from '../kitId';
import type { KitDefinition } from '../kitTypes';
import { HIT_KIT, POWER_UP_KIT } from './actionKits';
import { DEATH_KIT, UNLOCK_KIT, WIN_KIT } from './outcomeKits';
import { PICKUP_KIT } from './pickupKit';
import { BUMP_KIT, LOCK_KIT, MOVE_KIT } from './smallKits';

/** FEEL-KIT-1 kits as data: ordered beats and allowed ranges per tier, full and reduced motion. */
export const KIT_RANGES: Readonly<Record<KitId, KitDefinition>> = {
  pickup: PICKUP_KIT,
  powerUp: POWER_UP_KIT,
  hit: HIT_KIT,
  lock: LOCK_KIT,
  bump: BUMP_KIT,
  unlock: UNLOCK_KIT,
  death: DEATH_KIT,
  win: WIN_KIT,
  move: MOVE_KIT,
};
