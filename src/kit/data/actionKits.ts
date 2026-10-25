import { Beat } from '../beat';
import { Phase } from '../phase';
import { KitId } from '../kitId';
import { between, exactly } from '../kitTypes';
import type { BeatSpec, KitDefinition, TierRanges } from '../kitTypes';

const COMMIT: BeatSpec = { beat: Beat.Commit };

const POWER_UP_TAIL: readonly BeatSpec[] = [
  { beat: Beat.Sound, phase: Phase.Action, after: Beat.Pop, durationParams: ['soundMs'] },
  { beat: Beat.Sparkle, phase: Phase.Action, after: Beat.Pop, durationParams: ['sparkleLifeMs'] },
  { beat: Beat.PlayerState, phase: Phase.FollowThrough, after: Beat.Pop, durationParams: ['auraMs'] },
  { beat: Beat.HudTimer, phase: Phase.Action },
];

const POWER_UP: TierRanges = {
  beats: [
    COMMIT,
    { beat: Beat.Magnet, phase: Phase.Anticipation, durationParams: ['magnetMs'] },
    { beat: Beat.Pop, phase: Phase.Action, after: Beat.Magnet, atEnd: true, durationParams: ['popMs'] },
    ...POWER_UP_TAIL,
    { beat: Beat.Camera, phase: Phase.FollowThrough, after: Beat.Pop, durationParams: ['fovKickMs'] },
    { beat: Beat.Haptic, phase: Phase.Action, after: Beat.Pop },
  ],
  reducedMotionBeats: [
    COMMIT,
    { beat: Beat.Pop, phase: Phase.Action, durationParams: ['popMs'] },
    ...POWER_UP_TAIL,
    { beat: Beat.Haptic, phase: Phase.Action, after: Beat.Pop },
  ],
  params: {
    magnetMs: between(40, 100),
    popPeak: between(1.3, 1.6),
    popMs: between(70, 150),
    soundMs: between(0, 400),
    sparkleCount: between(8, 16),
    sparkleLifeMs: between(200, 500),
    auraMs: between(100, 250),
    fovKickDeg: between(10, 30, true),
    fovKickMs: between(150, 300, true),
    warnFraction: between(0.2, 0.25),
    warnBlinkHz: between(2, 4),
    expireSoundMs: between(0, 300),
    auraOutMs: between(150, 300),
    hitstopMs: between(0, 50),
    shakePct: exactly(0),
  },
  reducedMotion: {
    magnetMs: exactly(0),
    popPeak: between(1, 1.05),
    sparkleCount: between(1, 4),
    fovKickDeg: exactly(0),
    fovKickMs: exactly(0),
    warnBlinkHz: exactly(0),
    hitstopMs: exactly(0),
  },
};

const HIT_SHARED: readonly BeatSpec[] = [
  { beat: Beat.Flash, phase: Phase.Action, durationParams: ['flashMs'] },
  { beat: Beat.Sound, phase: Phase.Action, durationParams: ['soundMs'] },
];
const HIT_TAIL: readonly BeatSpec[] = [
  { beat: Beat.Particles, phase: Phase.Action, durationParams: ['particleLifeMs'] },
  { beat: Beat.Hud, phase: Phase.Action, durationParams: ['ghostBarMs'] },
  { beat: Beat.Haptic, phase: Phase.Action, durationParams: ['hapticMs'] },
];

const HIT_LIGHT: TierRanges = {
  beats: [
    COMMIT,
    { beat: Beat.Hitstop, phase: Phase.Action, durationParams: ['hitstopMs'] },
    ...HIT_SHARED,
    { beat: Beat.Shake, phase: Phase.Action },
    ...HIT_TAIL,
    { beat: Beat.Squash, phase: Phase.FollowThrough, after: Beat.Hitstop, atEnd: true, durationParams: ['squashReturnMs'] },
    { beat: Beat.Grace, phase: Phase.FollowThrough, after: Beat.Hitstop, atEnd: true, durationParams: ['graceMs'] },
  ],
  reducedMotionBeats: [
    COMMIT,
    ...HIT_SHARED,
    ...HIT_TAIL,
    { beat: Beat.Squash, phase: Phase.FollowThrough, durationParams: ['squashReturnMs'] },
    { beat: Beat.Grace, phase: Phase.FollowThrough, durationParams: ['graceMs'] },
  ],
  params: {
    hitstopMs: between(30, 50),
    flashMs: between(33, 80),
    soundMs: between(0, 250),
    trauma: between(0.2, 0.3),
    shakePct: between(0, 1),
    shakeDecay: between(1, 2),
    particleCount: between(0, 12),
    particleLifeMs: between(150, 600),
    squashPct: between(8, 20),
    squashReturnMs: between(80, 160),
    knockback: between(0.25, 0.5),
    knockbackMs: between(100, 200),
    ghostBarMs: between(300, 600),
    graceMs: between(500, 1500),
    blinkHz: between(4, 8),
    hapticMs: between(40, 80),
  },
  reducedMotion: { hitstopMs: exactly(0), trauma: exactly(0), shakePct: exactly(0), blinkHz: exactly(0) },
};

export const POWER_UP_KIT: KitDefinition = { id: KitId.PowerUp, tiers: { t1: POWER_UP } };

export const HIT_KIT: KitDefinition = {
  id: KitId.Hit,
  tiers: {
    t1: HIT_LIGHT,
    t2: {
      ...HIT_LIGHT,
      params: { ...HIT_LIGHT.params, hitstopMs: between(50, 80), trauma: between(0.35, 0.5), particleCount: between(0, 24) },
    },
  },
};
