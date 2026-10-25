import { Beat } from './beat';
import { FeelTrace } from './feelTrace';
import { KitId } from './kitId';
import { KitMode } from './kitMode';
import type { DefinedKit, KitConfig, KitCue } from './kitTypes';
import { Phase } from './phase';
import { playKit, scheduleKit } from './sequencer';
import { Tier } from './tier';
import { defineKit } from './validate';

const PICKUP_COMMON: KitConfig = {
  kit: KitId.Pickup,
  tier: Tier.Common,
  params: {
    magnetMs: 60,
    magnetMaxTravel: 1.2,
    magnetEndScale: 0.9,
    popPeak: 1.25,
    popUpMs: 40,
    popOutMs: 60,
    soundMs: 180,
    sparkleCount: 6,
    sparkleLifeMs: 250,
    sparkleSize: 0.3,
    counterTickMs: 100,
    counterBump: 1.15,
    counterBumpMs: 120,
    counterRollMs: 0,
    flyMs: 300,
    hapticGapMs: 80,
    streakWindowMs: 0,
    streakCapSemitones: 0,
    hitstopMs: 0,
    shakePct: 0,
    flashMs: 0,
  },
  reducedMotion: { magnetMs: 0, popPeak: 1, popUpMs: 0, popOutMs: 80, sparkleCount: 1, counterBump: 1, counterBumpMs: 120 },
};

describe('playKit', () => {
  it('at the commit frame, fires commit and magnet before returning', () => {
    const trace = new FeelTrace();

    playKit(defineKit(PICKUP_COMMON), { trace }, 1000);

    expect(trace.beats()).toEqual([Beat.Commit, Beat.Magnet]);
  });

  it('with a 60 ms magnet and a 300 ms fly, fires the five beats in order on the game clock', () => {
    const trace = new FeelTrace();
    const run = playKit(defineKit(PICKUP_COMMON), { trace }, 1000);
    [1016, 1059, 1060, 1200].forEach((now) => run.advance(now));

    run.advance(1360);

    expect(trace.entries.map((cue) => [cue.beat, cue.scheduledMs, cue.tMs])).toEqual([
      [Beat.Commit, 0, 0],
      [Beat.Magnet, 0, 0],
      [Beat.Pop, 60, 60],
      [Beat.Sound, 60, 60],
      [Beat.Sparkle, 60, 60],
      [Beat.Haptic, 60, 60],
      [Beat.Counter, 360, 360],
    ]);
  });

  it('with reduced motion, drops the magnet and pops at the commit frame', () => {
    const trace = new FeelTrace();

    playKit(defineKit(PICKUP_COMMON), { trace }, 0, KitMode.ReducedMotion);

    expect(trace.beats()).toEqual([Beat.Commit, Beat.Pop, Beat.Sound, Beat.Sparkle, Beat.Haptic]);
  });

  it('with reduced motion, hands the beat the reduced-motion pop peak of 1', () => {
    const cues: KitCue[] = [];

    playKit(defineKit(PICKUP_COMMON), { onBeat: (cue) => cues.push(cue) }, 0, KitMode.ReducedMotion);

    expect(cues[1]?.params.popPeak).toBe(1);
  });

  it('with juice off, fires only the commit and ends', () => {
    const trace = new FeelTrace();

    const run = playKit(defineKit(PICKUP_COMMON), { trace }, 0, KitMode.Off);

    expect([trace.beats(), run.done, trace.entries[0]?.params]).toEqual([[Beat.Commit], true, {}]);
  });

  it('with no trace and no listener, still runs to the end', () => {
    const run = playKit(defineKit(PICKUP_COMMON), {}, 0);

    run.advance(10_000);

    expect(run.done).toBe(true);
  });
});

describe('scheduleKit', () => {
  it('with an anchor that never played and a missing param, starts at 0 with no duration', () => {
    const kit: DefinedKit = {
      kit: KitId.Bump,
      tier: Tier.Common,
      beats: [{ beat: Beat.Commit }, { beat: Beat.Nudge, after: Beat.Snap, durationParams: ['absentMs'] }],
      reducedMotionBeats: [],
      params: {},
      reducedMotion: {},
    };

    const beats = scheduleKit(kit, KitMode.Full);

    expect(beats[1]).toEqual({ beat: Beat.Nudge, atMs: 0, durationMs: 0 });
  });

  it('with a hit, starts squash and grace at the end of a 40 ms hitstop', () => {
    const kit: DefinedKit = {
      kit: KitId.Hit,
      tier: Tier.Common,
      beats: [
        { beat: Beat.Commit },
        { beat: Beat.Hitstop, durationParams: ['hitstopMs'] },
        { beat: Beat.Squash, after: Beat.Hitstop, atEnd: true },
      ],
      reducedMotionBeats: [],
      params: { hitstopMs: 40 },
      reducedMotion: {},
    };

    const beats = scheduleKit(kit, KitMode.Full);

    expect(beats.map((beat) => beat.atMs)).toEqual([0, 0, 40]);
  });
});

describe('playKit phases', () => {
  it('with pickup T1 played to the end, records each beat with its phase', () => {
    const trace = new FeelTrace();
    const run = playKit(defineKit(PICKUP_COMMON), { trace }, 0);

    run.advance(1000);

    expect(trace.entries.map((cue: KitCue) => [cue.beat, cue.phase])).toEqual([
      [Beat.Commit, undefined],
      [Beat.Magnet, Phase.Anticipation],
      [Beat.Pop, Phase.Action],
      [Beat.Sound, Phase.Action],
      [Beat.Sparkle, Phase.Action],
      [Beat.Haptic, Phase.Action],
      [Beat.Counter, Phase.FollowThrough],
    ]);
  });
});

