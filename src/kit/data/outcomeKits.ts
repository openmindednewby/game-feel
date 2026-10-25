import { Beat } from '../beat';
import { KitId } from '../kitId';
import { between, exactly } from '../kitTypes';
import type { BeatSpec, KitDefinition } from '../kitTypes';

const COMMIT: BeatSpec = { beat: Beat.Commit };
const MAX_FULL_FLASH_ALPHA = 0.35;
const SOUND_AND_HAPTIC: readonly BeatSpec[] = [{ beat: Beat.Sound }, { beat: Beat.Haptic }];
const RETRY: BeatSpec = { beat: Beat.Retry, delayParams: ['retryMs'] };
const RESULTS_AND_TALLY: readonly BeatSpec[] = [
  { beat: Beat.Results, delayParams: ['resultsMs'] },
  { beat: Beat.Tally, after: Beat.Results, durationParams: ['tallyMs'] },
];

const REVEAL_TAIL: readonly BeatSpec[] = [
  { beat: Beat.Sound, after: Beat.Reveal, durationParams: ['soundMs'] },
  { beat: Beat.Sparkle, after: Beat.Reveal, durationParams: ['glowMs'] },
  { beat: Beat.Haptic, after: Beat.Reveal },
  { beat: Beat.Label, after: Beat.Reveal, delayParams: ['labelDelayMs'] },
  { beat: Beat.Focus, after: Beat.Reveal, atEnd: true },
];

export const UNLOCK_KIT: KitDefinition = {
  id: KitId.Unlock,
  tiers: {
    t1: {
      beats: [
        COMMIT,
        { beat: Beat.Anticipation, durationParams: ['anticipationMs'] },
        { beat: Beat.Reveal, after: Beat.Anticipation, atEnd: true, durationParams: ['revealMs'] },
        ...REVEAL_TAIL,
      ],
      reducedMotionBeats: [COMMIT, { beat: Beat.Reveal, durationParams: ['revealMs'] }, ...REVEAL_TAIL],
      params: {
        anticipationMs: between(150, 400),
        revealFrom: exactly(0.6),
        revealPeak: exactly(1.1),
        revealMs: between(200, 350),
        soundMs: between(0, 600),
        particleCount: between(0, 24),
        glowMs: between(300, 600),
        labelDelayMs: between(100, 200),
      },
      reducedMotion: { anticipationMs: exactly(0), revealFrom: exactly(1), revealPeak: exactly(1), revealMs: exactly(200), particleCount: between(0, 6) },
    },
  },
};

export const DEATH_KIT: KitDefinition = {
  id: KitId.Death,
  tiers: {
    t1: {
      beats: [
        COMMIT,
        { beat: Beat.Hitstop, durationParams: ['hitstopMs'] },
        { beat: Beat.Flash },
        { beat: Beat.Shake, durationParams: ['shakeMs'] },
        { beat: Beat.Particles },
        ...SOUND_AND_HAPTIC,
        { beat: Beat.SlowMo, after: Beat.Hitstop, atEnd: true, durationParams: ['slowMoMs'] },
        { beat: Beat.Hold, after: Beat.Hitstop, atEnd: true, durationParams: ['holdMs'] },
        RETRY,
      ],
      reducedMotionBeats: [COMMIT, { beat: Beat.Tint, durationParams: ['tintMs'] }, ...SOUND_AND_HAPTIC, { beat: Beat.Hold, durationParams: ['holdMs'] }, RETRY],
      params: {
        hitstopMs: between(60, 100),
        flashAlpha: between(0, MAX_FULL_FLASH_ALPHA),
        shakePct: between(0, 1),
        shakeMs: between(0, 250),
        particleCount: between(0, 24),
        duckDb: exactly(6),
        slowMoScale: between(0.2, 0.5),
        slowMoMs: between(0, 300),
        holdMs: between(300, 800),
        retryMs: between(0, 1000),
        tintMs: exactly(200),
      },
      reducedMotion: { hitstopMs: exactly(0), flashAlpha: exactly(0), shakePct: exactly(0), shakeMs: exactly(0), slowMoMs: exactly(0) },
    },
  },
};

export const WIN_KIT: KitDefinition = {
  id: KitId.Win,
  tiers: {
    t1: {
      beats: [
        COMMIT,
        { beat: Beat.Hitstop, durationParams: ['hitstopMs'] },
        { beat: Beat.Shake, durationParams: ['shakeMs'] },
        { beat: Beat.Flash },
        { beat: Beat.Particles },
        ...SOUND_AND_HAPTIC,
        { beat: Beat.Settle, after: Beat.Hitstop, atEnd: true, durationParams: ['settleMs'] },
        ...RESULTS_AND_TALLY,
      ],
      reducedMotionBeats: [COMMIT, ...SOUND_AND_HAPTIC, ...RESULTS_AND_TALLY],
      params: {
        hitstopMs: between(80, 120),
        shakePct: between(0, 0.6),
        shakeMs: between(0, 200),
        flashAlpha: between(0, MAX_FULL_FLASH_ALPHA),
        particleCount: between(0, 40),
        settleMs: between(300, 800),
        resultsMs: between(0, 1500),
        tallyMs: between(600, 2000),
      },
      reducedMotion: { hitstopMs: exactly(0), shakePct: exactly(0), shakeMs: exactly(0), flashAlpha: exactly(0), settleMs: exactly(0) },
    },
  },
};
