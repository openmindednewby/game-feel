import { KitId } from '../../kit/kitId';
import { Tier } from '../../kit/tier';
import { PresetKey } from '../presetKey';
import type { EventPresets } from '../presetTypes';

export const ACTION_PRESETS: readonly EventPresets[] = [
  {
    id: 'hit-t1',
    kit: KitId.Hit,
    tier: Tier.Common,
    options: [
      {
        key: PresetKey.Settle,
        line: 'Weight: a deep squash on the player, little shake, few chips.',
        params: { hitstopMs: 40, flashMs: 40, soundMs: 180, trauma: 0.2, shakePct: 0.15, shakeDecay: 2, particleCount: 6, particleLifeMs: 300, squashPct: 18, squashReturnMs: 140, knockback: 0.25, knockbackMs: 120, ghostBarMs: 400, graceMs: 700, blinkHz: 4, hapticMs: 60 },
        reducedMotion: { hitstopMs: 0, trauma: 0, shakePct: 0, blinkHz: 0 },
      },
      {
        key: PresetKey.Snap,
        line: 'Crack: a bright white flash and a spray of chips, quick and dry.',
        params: { hitstopMs: 35, flashMs: 80, soundMs: 120, trauma: 0.25, shakePct: 0.2, shakeDecay: 2, particleCount: 12, particleLifeMs: 200, squashPct: 8, squashReturnMs: 80, knockback: 0.25, knockbackMs: 100, ghostBarMs: 300, graceMs: 800, blinkHz: 6, hapticMs: 40 },
        reducedMotion: { hitstopMs: 0, trauma: 0, shakePct: 0, blinkHz: 0 },
      },
      {
        key: PresetKey.Rush,
        line: 'Shove (signature): knocked back half a body, the health bar drains behind a ghost.',
        params: { hitstopMs: 45, flashMs: 33, soundMs: 200, trauma: 0.3, shakePct: 0.25, shakeDecay: 1.5, particleCount: 4, particleLifeMs: 400, squashPct: 10, squashReturnMs: 120, knockback: 0.5, knockbackMs: 200, ghostBarMs: 600, graceMs: 1200, blinkHz: 6, hapticMs: 70 },
        reducedMotion: { hitstopMs: 0, trauma: 0, shakePct: 0, blinkHz: 0 },
      },
    ],
  },
  {
    id: 'hit-t2',
    kit: KitId.Hit,
    tier: Tier.Rare,
    heavy: true,
    options: [
      {
        key: PresetKey.Settle,
        line: 'Weight: the deepest squash and a long low thud.',
        params: { hitstopMs: 70, flashMs: 50, soundMs: 220, trauma: 0.35, shakePct: 0.25, shakeDecay: 2, particleCount: 20, particleLifeMs: 400, squashPct: 20, squashReturnMs: 160, knockback: 0.3, knockbackMs: 140, ghostBarMs: 450, graceMs: 900, blinkHz: 4, hapticMs: 80 },
        reducedMotion: { hitstopMs: 0, trauma: 0, shakePct: 0, blinkHz: 0 },
      },
      {
        key: PresetKey.Snap,
        line: 'Crack: a full white flash and the most chips.',
        params: { hitstopMs: 55, flashMs: 80, soundMs: 160, trauma: 0.4, shakePct: 0.3, shakeDecay: 2, particleCount: 22, particleLifeMs: 300, squashPct: 10, squashReturnMs: 90, knockback: 0.3, knockbackMs: 120, ghostBarMs: 350, graceMs: 1000, blinkHz: 6, hapticMs: 60 },
        reducedMotion: { hitstopMs: 0, trauma: 0, shakePct: 0, blinkHz: 0 },
      },
      {
        key: PresetKey.Rush,
        line: 'Shove (signature): the longest knockback and ghost drain.',
        params: { hitstopMs: 60, flashMs: 40, soundMs: 250, trauma: 0.45, shakePct: 0.35, shakeDecay: 1.5, particleCount: 20, particleLifeMs: 500, squashPct: 12, squashReturnMs: 120, knockback: 0.5, knockbackMs: 200, ghostBarMs: 600, graceMs: 1300, blinkHz: 6, hapticMs: 80 },
        reducedMotion: { hitstopMs: 0, trauma: 0, shakePct: 0, blinkHz: 0 },
      },
    ],
  },
  {
    id: 'lock',
    kit: KitId.Lock,
    tier: Tier.Common,
    options: [
      {
        key: PresetKey.Settle,
        line: 'Ease: the piece glides into its slot and glows; no catch.',
        params: { snapMs: 110, overshootPct: 0, hitstopMs: 0, shakePct: 0, shakeMs: 0, particleCount: 10, flashMs: 33, clickMs: 120 },
        reducedMotion: { snapMs: 0, overshootPct: 0, hitstopMs: 0, shakePct: 0, shakeMs: 0 },
      },
      {
        key: PresetKey.Snap,
        line: 'Click: a fast snap that overshoots 5% and a 15 ms catch.',
        params: { snapMs: 60, overshootPct: 5, hitstopMs: 15, shakePct: 0, shakeMs: 0, particleCount: 11, flashMs: 40, clickMs: 80 },
        reducedMotion: { snapMs: 0, overshootPct: 0, hitstopMs: 0, shakePct: 0, shakeMs: 0 },
      },
      {
        key: PresetKey.Rush,
        line: 'Stamp (signature): a bright flash and a burst at the slot, 20 ms catch.',
        params: { snapMs: 90, overshootPct: 2, hitstopMs: 20, shakePct: 0, shakeMs: 0, particleCount: 12, flashMs: 80, clickMs: 220 },
        reducedMotion: { snapMs: 0, overshootPct: 0, hitstopMs: 0, shakePct: 0, shakeMs: 0 },
      },
    ],
  },
  {
    id: 'bump',
    kit: KitId.Bump,
    tier: Tier.Common,
    options: [
      {
        key: PresetKey.Settle,
        line: 'Soft rubber thud: a small nudge, the button shakes 2 px.',
        params: { nudgeSize: 0.1, nudgeMs: 120, soundMs: 120, menuShakePx: 2, hitstopMs: 0, shakePct: 0, particleCount: 0, flashMs: 0 },
        reducedMotion: { nudgeSize: 0, nudgeMs: 120, menuShakePx: 0 },
        sound: 'rubber',
      },
      {
        key: PresetKey.Snap,
        line: 'Dry click: a quick 0.15-body nudge, 3 px.',
        params: { nudgeSize: 0.15, nudgeMs: 90, soundMs: 90, menuShakePx: 3, hitstopMs: 0, shakePct: 0, particleCount: 0, flashMs: 0 },
        reducedMotion: { nudgeSize: 0, nudgeMs: 120, menuShakePx: 0 },
        sound: 'click',
      },
      {
        key: PresetKey.Rush,
        line: 'Metal clank: the widest nudge and a ringing hit, 4 px.',
        params: { nudgeSize: 0.2, nudgeMs: 140, soundMs: 160, menuShakePx: 4, hitstopMs: 0, shakePct: 0, particleCount: 0, flashMs: 0 },
        reducedMotion: { nudgeSize: 0, nudgeMs: 120, menuShakePx: 0 },
        sound: 'clank',
      },
    ],
  },
];
