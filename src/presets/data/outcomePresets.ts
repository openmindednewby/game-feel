import { KitId } from '../../kit/kitId';
import { Tier } from '../../kit/tier';
import { PresetKey } from '../presetKey';
import type { EventPresets } from '../presetTypes';

export const OUTCOME_PRESETS: readonly EventPresets[] = [
  {
    id: 'unlock',
    kit: KitId.Unlock,
    tier: Tier.Common,
    options: [
      {
        key: PresetKey.Settle,
        line: 'A short glow, a clean reveal, a quiet ring.',
        params: { anticipationMs: 200, revealFrom: 0.6, revealPeak: 1.1, revealMs: 300, soundMs: 450, particleCount: 22, glowMs: 450, labelDelayMs: 150 },
        reducedMotion: { anticipationMs: 0, revealFrom: 1, revealPeak: 1, revealMs: 200, particleCount: 2 },
      },
      {
        key: PresetKey.Snap,
        line: 'Shortest tease, fast reveal, label right away.',
        params: { anticipationMs: 150, revealFrom: 0.6, revealPeak: 1.1, revealMs: 220, soundMs: 380, particleCount: 22, glowMs: 350, labelDelayMs: 100 },
        reducedMotion: { anticipationMs: 0, revealFrom: 1, revealPeak: 1, revealMs: 200, particleCount: 4 },
      },
      {
        key: PresetKey.Rush,
        line: 'A 400 ms tease, 24 sparks, the longest ring.',
        params: { anticipationMs: 400, revealFrom: 0.6, revealPeak: 1.1, revealMs: 350, soundMs: 600, particleCount: 22, glowMs: 600, labelDelayMs: 200 },
        reducedMotion: { anticipationMs: 0, revealFrom: 1, revealPeak: 1, revealMs: 200, particleCount: 6 },
      },
    ],
  },
  {
    id: 'death',
    kit: KitId.Death,
    tier: Tier.Common,
    options: [
      {
        key: PresetKey.Settle,
        line: 'Short freeze, faint flash, no slow-mo, Retry at 0.9 s.',
        params: { hitstopMs: 70, flashAlpha: 0.15, shakePct: 0.35, shakeMs: 150, particleCount: 22, duckDb: 6, slowMoScale: 0.5, slowMoMs: 0, holdMs: 600, retryMs: 900, tintMs: 200 },
        reducedMotion: { hitstopMs: 0, flashAlpha: 0, shakePct: 0, shakeMs: 0, slowMoMs: 0 },
      },
      {
        key: PresetKey.Snap,
        line: '80 ms freeze, 150 ms of slow-mo, Retry at 0.7 s.',
        params: { hitstopMs: 80, flashAlpha: 0.25, shakePct: 0.4, shakeMs: 200, particleCount: 22, duckDb: 6, slowMoScale: 0.35, slowMoMs: 150, holdMs: 450, retryMs: 700, tintMs: 200 },
        reducedMotion: { hitstopMs: 0, flashAlpha: 0, shakePct: 0, shakeMs: 0, slowMoMs: 0 },
      },
      {
        key: PresetKey.Rush,
        line: 'Slow-mo (signature): 300 ms at quarter speed before Retry; the rest mid-range.',
        params: { hitstopMs: 90, flashAlpha: 0.25, shakePct: 0.45, shakeMs: 250, particleCount: 24, duckDb: 6, slowMoScale: 0.25, slowMoMs: 300, holdMs: 550, retryMs: 1000, tintMs: 200 },
        reducedMotion: { hitstopMs: 0, flashAlpha: 0, shakePct: 0, shakeMs: 0, slowMoMs: 0 },
      },
    ],
  },
  {
    id: 'win',
    kit: KitId.Win,
    tier: Tier.Common,
    options: [
      {
        key: PresetKey.Settle,
        line: 'Glide: the camera settles slowly onto the finish, no flash, results at 1.3 s.',
        params: { hitstopMs: 90, shakePct: 0.45, shakeMs: 120, flashAlpha: 0, particleCount: 24, settleMs: 800, resultsMs: 1300, tallyMs: 1200 },
        reducedMotion: { hitstopMs: 0, shakePct: 0, shakeMs: 0, flashAlpha: 0, settleMs: 0 },
      },
      {
        key: PresetKey.Snap,
        line: 'Burst: a flash and a gold burst, results fast at 0.7 s.',
        params: { hitstopMs: 100, shakePct: 0.5, shakeMs: 160, flashAlpha: 0.3, particleCount: 34, settleMs: 300, resultsMs: 700, tallyMs: 800 },
        reducedMotion: { hitstopMs: 0, shakePct: 0, shakeMs: 0, flashAlpha: 0, settleMs: 0 },
      },
      {
        key: PresetKey.Rush,
        line: 'Tally (signature): results at 0.6 s and a 2 s score roll-up.',
        params: { hitstopMs: 110, shakePct: 0.55, shakeMs: 180, flashAlpha: 0.1, particleCount: 30, settleMs: 400, resultsMs: 600, tallyMs: 2000 },
        reducedMotion: { hitstopMs: 0, shakePct: 0, shakeMs: 0, flashAlpha: 0, settleMs: 0 },
      },
    ],
  },
  {
    id: 'move',
    kit: KitId.Move,
    tier: Tier.Common,
    options: [
      {
        key: PresetKey.Settle,
        line: 'A soft 60 ms tick, the camera leads 10%.',
        params: { soundMs: 60, pitchJitterPct: 2, cameraLeadPct: 10 },
        reducedMotion: {},
      },
      {
        key: PresetKey.Snap,
        line: 'A dry 40 ms tick, 15% lead.',
        params: { soundMs: 40, pitchJitterPct: 3, cameraLeadPct: 15 },
        reducedMotion: {},
      },
      {
        key: PresetKey.Rush,
        line: 'A longer 90 ms whoosh, 20% lead.',
        params: { soundMs: 90, pitchJitterPct: 3, cameraLeadPct: 20 },
        reducedMotion: {},
      },
    ],
  },
];
