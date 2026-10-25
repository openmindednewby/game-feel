import { Beat } from './beat';
import { KitId } from './kitId';
import type { BeatSpec, DefinedKit, KitDefinition } from './kitTypes';
import { Phase } from './phase';
import { checkPhases } from './phases';
import { Tier } from './tier';

const COMMIT: BeatSpec = { beat: Beat.Commit };
const PLAYER: KitDefinition = { id: KitId.Move, playerInput: true, tiers: {} };
const WORLD: KitDefinition = { id: KitId.Pickup, tiers: {} };

const kitOf = (beats: readonly BeatSpec[], params: Record<string, number>): DefinedKit => ({
  kit: KitId.Move,
  tier: Tier.Common,
  beats,
  reducedMotionBeats: beats,
  params,
  reducedMotion: params,
});

describe('checkPhases', () => {
  it('with a beat that has no phase, names the beat', () => {
    const kit = kitOf([COMMIT, { beat: Beat.Sound }], {});

    const problems = checkPhases(WORLD, kit);

    expect(problems).toEqual(['move/t1 sound: no phase']);
  });

  it('with a player-input action 20 ms after the input frame, fails in full and reduced motion', () => {
    const kit = kitOf([COMMIT, { beat: Beat.Sound, phase: Phase.Action, delayParams: ['leadMs'] }], { leadMs: 20 });

    const problems = checkPhases(PLAYER, kit);

    expect(problems).toEqual([
      'move/t1 sound: player-input action at 20 ms, must be 0',
      'move/t1 reduced motion sound: player-input action at 20 ms, must be 0',
    ]);
  });

  it('with a player-input anticipation of 34 ms, fails over 33', () => {
    const kit = kitOf([COMMIT, { beat: Beat.Anticipation, phase: Phase.Anticipation, durationParams: ['windUpMs'] }], { windUpMs: 34 });

    const problems = checkPhases(PLAYER, kit);

    expect(problems).toEqual([
      'move/t1 anticipation: player-input anticipation ends at 34 ms, over 33',
      'move/t1 reduced motion anticipation: player-input anticipation ends at 34 ms, over 33',
    ]);
  });

  it('with a player-input anticipation of 33 ms and the action at 0 ms, returns no violations', () => {
    const beats: BeatSpec[] = [
      COMMIT,
      { beat: Beat.Anticipation, phase: Phase.Anticipation, durationParams: ['windUpMs'] },
      { beat: Beat.Sound, phase: Phase.Action },
    ];
    const kit = kitOf(beats, { windUpMs: 33 });

    const problems = checkPhases(PLAYER, kit);

    expect(problems).toEqual([]);
  });

  it('with a world kit whose action follows a 100 ms anticipation, returns no violations', () => {
    const beats: BeatSpec[] = [
      COMMIT,
      { beat: Beat.Magnet, phase: Phase.Anticipation, durationParams: ['magnetMs'] },
      { beat: Beat.Pop, phase: Phase.Action, after: Beat.Magnet, atEnd: true },
    ];
    const kit = kitOf(beats, { magnetMs: 100 });

    const problems = checkPhases(WORLD, kit);

    expect(problems).toEqual([]);
  });
});
