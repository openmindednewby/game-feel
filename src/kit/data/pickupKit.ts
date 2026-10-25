import { Beat } from '../beat';
import { Phase } from '../phase';
import { KitId } from '../kitId';
import { between, exactly } from '../kitTypes';
import type { BeatSpec, KitDefinition, ParamRanges } from '../kitTypes';

const COMMIT: BeatSpec = { beat: Beat.Commit };
const MAGNET: BeatSpec = { beat: Beat.Magnet, phase: Phase.Anticipation, durationParams: ['magnetMs'] };
const POP_AFTER_MAGNET: BeatSpec = { beat: Beat.Pop, phase: Phase.Action, after: Beat.Magnet, atEnd: true, durationParams: ['popUpMs', 'popOutMs'] };
const POP_AT_COMMIT: BeatSpec = { beat: Beat.Pop, phase: Phase.Action, durationParams: ['popUpMs', 'popOutMs'] };
const SOUND_AND_SPARKLE: readonly BeatSpec[] = [
  { beat: Beat.Sound, phase: Phase.Action, after: Beat.Pop, durationParams: ['soundMs'] },
  { beat: Beat.Sparkle, phase: Phase.Action, after: Beat.Pop, durationParams: ['sparkleLifeMs'] },
];
const COUNTER_AND_HAPTIC: readonly BeatSpec[] = [
  { beat: Beat.Counter, phase: Phase.FollowThrough, after: Beat.Pop, delayParams: ['flyMs'], durationParams: ['counterBumpMs', 'counterRollMs'] },
  { beat: Beat.Haptic, phase: Phase.Action, after: Beat.Pop },
];
const LOCAL_FLASH: BeatSpec = { beat: Beat.Flash, phase: Phase.Action, after: Beat.Pop, durationParams: ['flashMs'] };

const BEATS: readonly BeatSpec[] = [COMMIT, MAGNET, POP_AFTER_MAGNET, ...SOUND_AND_SPARKLE, ...COUNTER_AND_HAPTIC];
const REDUCED_BEATS: readonly BeatSpec[] = [COMMIT, POP_AT_COMMIT, ...SOUND_AND_SPARKLE, ...COUNTER_AND_HAPTIC];
const JACKPOT_BEATS: readonly BeatSpec[] = [
  COMMIT,
  { beat: Beat.Hitstop, phase: Phase.Action, durationParams: ['hitstopMs'] },
  MAGNET,
  POP_AFTER_MAGNET,
  ...SOUND_AND_SPARKLE,
  LOCAL_FLASH,
  { beat: Beat.Shake, phase: Phase.Action, after: Beat.Pop },
  ...COUNTER_AND_HAPTIC,
];
const JACKPOT_REDUCED_BEATS: readonly BeatSpec[] = [COMMIT, POP_AT_COMMIT, ...SOUND_AND_SPARKLE, LOCAL_FLASH, ...COUNTER_AND_HAPTIC];

const COMMON: ParamRanges = {
  magnetMs: between(40, 100),
  magnetMaxTravel: between(0, 1.5),
  magnetEndScale: between(0.8, 1),
  popPeak: between(1.15, 1.4),
  popUpMs: between(30, 60),
  popOutMs: between(40, 90),
  soundMs: between(0, 250),
  sparkleCount: between(3, 8),
  sparkleLifeMs: between(150, 400),
  sparkleSize: between(0, 0.5),
  counterTickMs: between(0, 500),
  counterBump: between(1.1, 1.25),
  counterBumpMs: between(80, 160),
  counterRollMs: between(200, 600, true),
  flyMs: between(250, 500, true),
  hapticGapMs: between(80, Number.POSITIVE_INFINITY),
  streakWindowMs: between(400, 600, true),
  streakCapSemitones: between(7, 12, true),
  hitstopMs: exactly(0),
  shakePct: exactly(0),
  flashMs: exactly(0),
};

const REDUCED: ParamRanges = {
  magnetMs: exactly(0),
  popPeak: between(1, 1.05),
  popUpMs: exactly(0),
  popOutMs: between(60, 100),
  counterBump: exactly(1),
  counterBumpMs: between(100, 160),
};

export const PICKUP_KIT: KitDefinition = {
  id: KitId.Pickup,
  tiers: {
    t1: {
      beats: BEATS,
      reducedMotionBeats: REDUCED_BEATS,
      params: COMMON,
      reducedMotion: { ...REDUCED, sparkleCount: between(1, 2) },
    },
    t2: {
      beats: BEATS,
      reducedMotionBeats: REDUCED_BEATS,
      params: { ...COMMON, popPeak: between(1.3, 1.5), sparkleCount: between(8, 14), counterBump: between(1.2, 1.3), soundMs: between(0, 400) },
      reducedMotion: { ...REDUCED, sparkleCount: between(1, 3) },
    },
    t3: {
      beats: JACKPOT_BEATS,
      reducedMotionBeats: JACKPOT_REDUCED_BEATS,
      params: {
        ...COMMON,
        popPeak: between(1.4, 1.6),
        sparkleCount: between(3, 24),
        counterBump: between(1.2, 1.3),
        counterRollMs: between(400, 900, true),
        soundMs: between(0, 800),
        hitstopMs: between(0, 40),
        shakePct: between(0, 0.2),
        flashMs: between(33, 80),
      },
      reducedMotion: { ...REDUCED, sparkleCount: between(1, 6), hitstopMs: exactly(0), shakePct: exactly(0) },
    },
  },
};
