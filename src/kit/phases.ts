import { Beat } from './beat';
import { KitMode } from './kitMode';
import type { BeatSpec, DefinedKit, KitDefinition } from './kitTypes';
import { PLAYER_INPUT_MAX_ANTICIPATION_MS, Phase } from './phase';
import { scheduleKit } from './sequencer';
import type { ScheduledBeat } from './sequencer';

const MODES: readonly KitMode[] = [KitMode.Full, KitMode.ReducedMotion];

const modeLabel = (label: string, mode: KitMode): string => (mode === KitMode.Full ? label : `${label} reduced motion`);

function unphased(kit: DefinedKit, label: string): string[] {
  const specs = [...kit.beats, ...kit.reducedMotionBeats];
  const missing = specs.filter((spec: BeatSpec): boolean => spec.beat !== Beat.Commit && spec.phase === undefined);
  return [...new Set(missing.map((spec: BeatSpec): Beat => spec.beat))].map((beat: Beat): string => `${label} ${beat}: no phase`);
}

function playerInputTiming(scheduled: readonly ScheduledBeat[], label: string): string[] {
  const late = scheduled
    .filter((beat: ScheduledBeat): boolean => beat.phase === Phase.Action && beat.atMs > 0)
    .map((beat: ScheduledBeat): string => `${label} ${beat.beat}: player-input action at ${beat.atMs} ms, must be 0`);
  const long = scheduled
    .filter((beat: ScheduledBeat): boolean => beat.phase === Phase.Anticipation && beat.atMs + beat.durationMs > PLAYER_INPUT_MAX_ANTICIPATION_MS)
    .map((beat: ScheduledBeat): string => `${label} ${beat.beat}: player-input anticipation ends at ${beat.atMs + beat.durationMs} ms, over ${PLAYER_INPUT_MAX_ANTICIPATION_MS}`);
  return [...late, ...long];
}

/** Phase violations: a beat with no phase; for a player-input kit an action after 0 ms or anticipation over 33 ms. */
export function checkPhases(definition: KitDefinition, kit: DefinedKit): string[] {
  const label = `${kit.kit}/${kit.tier}`;
  if (definition.playerInput !== true) {
    return unphased(kit, label);
  }
  const timing = MODES.flatMap((mode: KitMode): string[] => playerInputTiming(scheduleKit(kit, mode), modeLabel(label, mode)));
  return [...unphased(kit, label), ...timing];
}
