import { Beat } from '../beat';
import { Phase } from '../phase';
import { KitId } from '../kitId';
import { between, exactly } from '../kitTypes';
import type { BeatSpec, KitDefinition } from '../kitTypes';

const COMMIT: BeatSpec = { beat: Beat.Commit };
const AFTER_SNAP: readonly BeatSpec[] = [
  { beat: Beat.Flash, phase: Phase.Action, after: Beat.Snap, atEnd: true, durationParams: ['flashMs'] },
  { beat: Beat.Sound, phase: Phase.Action, after: Beat.Snap, atEnd: true, durationParams: ['clickMs'] },
  { beat: Beat.Particles, phase: Phase.Action, after: Beat.Snap, atEnd: true },
  { beat: Beat.Haptic, phase: Phase.Action, after: Beat.Snap, atEnd: true },
];
const BUMP_FEEDBACK: readonly BeatSpec[] = [{ beat: Beat.Sound, phase: Phase.Action, durationParams: ['soundMs'] }, { beat: Beat.Haptic, phase: Phase.Action }];
const MOVE_BEATS: readonly BeatSpec[] = [COMMIT, { beat: Beat.Sound, phase: Phase.Action, durationParams: ['soundMs'] }, { beat: Beat.Camera, phase: Phase.FollowThrough }];

export const LOCK_KIT: KitDefinition = {
  id: KitId.Lock,
  tiers: {
    t1: {
      beats: [
        COMMIT,
        { beat: Beat.Snap, phase: Phase.Anticipation, durationParams: ['snapMs'] },
        { beat: Beat.Hitstop, phase: Phase.Action, after: Beat.Snap, atEnd: true, durationParams: ['hitstopMs'] },
        { beat: Beat.Shake, phase: Phase.Action, after: Beat.Snap, atEnd: true, durationParams: ['shakeMs'] },
        ...AFTER_SNAP,
      ],
      reducedMotionBeats: [COMMIT, { beat: Beat.Snap, phase: Phase.Anticipation }, ...AFTER_SNAP],
      params: {
        snapMs: between(60, 120),
        overshootPct: between(0, 5),
        hitstopMs: between(0, 80),
        shakePct: between(0, 0.4),
        shakeMs: between(0, 150),
        particleCount: between(0, 12),
        flashMs: between(33, 80),
        clickMs: between(0, 250),
      },
      reducedMotion: { snapMs: exactly(0), overshootPct: exactly(0), hitstopMs: exactly(0), shakePct: exactly(0), shakeMs: exactly(0) },
    },
  },
};

export const BUMP_KIT: KitDefinition = {
  id: KitId.Bump,
  playerInput: true,
  tiers: {
    t1: {
      beats: [COMMIT, { beat: Beat.Nudge, phase: Phase.Action, durationParams: ['nudgeMs'] }, ...BUMP_FEEDBACK],
      reducedMotionBeats: [COMMIT, { beat: Beat.Tint, phase: Phase.Action, durationParams: ['nudgeMs'] }, ...BUMP_FEEDBACK],
      params: {
        nudgeSize: between(0.1, 0.2),
        nudgeMs: between(80, 140),
        soundMs: between(0, 200),
        menuShakePx: between(2, 4),
        hitstopMs: exactly(0),
        shakePct: exactly(0),
        particleCount: exactly(0),
        flashMs: exactly(0),
      },
      reducedMotion: { nudgeSize: exactly(0), nudgeMs: exactly(120), menuShakePx: exactly(0) },
    },
  },
};

export const MOVE_KIT: KitDefinition = {
  id: KitId.Move,
  playerInput: true,
  tiers: {
    t1: {
      beats: MOVE_BEATS,
      reducedMotionBeats: MOVE_BEATS,
      params: { soundMs: between(0, 250), pitchJitterPct: between(0, 3), cameraLeadPct: between(10, 20) },
      reducedMotion: {},
    },
  },
};
