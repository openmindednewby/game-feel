import { Beat } from './beat';
import { KitMode } from './kitMode';
import type { Phase } from './phase';
import type { BeatSpec, DefinedKit, KitCue, ParamValues } from './kitTypes';

export interface ScheduledBeat {
  readonly beat: Beat;
  readonly phase?: Phase;
  readonly atMs: number;
  readonly durationMs: number;
}

export interface KitHost {
  readonly onBeat?: (cue: KitCue) => void;
  readonly trace?: { record(cue: KitCue): void };
}

const NO_PARAMS: ParamValues = {};

const total = (params: ParamValues, names: readonly string[] = []): number =>
  names.reduce((sum: number, name: string): number => sum + (params[name] ?? 0), 0);

function paramsFor(kit: DefinedKit, mode: KitMode): ParamValues {
  if (mode === KitMode.Off) {
    return NO_PARAMS;
  }
  return mode === KitMode.ReducedMotion ? kit.reducedMotion : kit.params;
}

function place(spec: BeatSpec, params: ParamValues, placed: ReadonlyMap<Beat, ScheduledBeat>): ScheduledBeat {
  const anchor = spec.after === undefined ? undefined : placed.get(spec.after);
  const anchorMs = anchor === undefined ? 0 : anchor.atMs + (spec.atEnd === true ? anchor.durationMs : 0);
  return { beat: spec.beat, phase: spec.phase, atMs: anchorMs + total(params, spec.delayParams), durationMs: total(params, spec.durationParams) };
}

/** Beat start times in ms after the commit frame, in firing order; `Off` keeps only the commit. */
export function scheduleKit(kit: DefinedKit, mode: KitMode): readonly ScheduledBeat[] {
  if (mode === KitMode.Off) {
    return [{ beat: Beat.Commit, atMs: 0, durationMs: 0 }];
  }
  const specs = mode === KitMode.ReducedMotion ? kit.reducedMotionBeats : kit.beats;
  const params = paramsFor(kit, mode);
  const placed = new Map<Beat, ScheduledBeat>();
  const beats = specs.map((spec: BeatSpec): ScheduledBeat => {
    const scheduled = place(spec, params, placed);
    placed.set(spec.beat, scheduled);
    return scheduled;
  });
  return [...beats].sort((a: ScheduledBeat, b: ScheduledBeat): number => a.atMs - b.atMs);
}

/** One running kit on the game's clock; call `advance` every frame with the game time in ms. */
export class KitRun {
  private next = 0;
  private readonly beats: readonly ScheduledBeat[];

  constructor(
    private readonly kit: DefinedKit,
    private readonly host: KitHost,
    private readonly startMs: number,
    private readonly mode: KitMode,
  ) {
    this.beats = scheduleKit(kit, mode);
  }

  get done(): boolean {
    return this.next >= this.beats.length;
  }

  advance(nowMs: number): void {
    const elapsed = nowMs - this.startMs;
    for (;;) {
      const scheduled = this.beats[this.next];
      if (scheduled === undefined || scheduled.atMs > elapsed) {
        return;
      }
      this.next += 1;
      this.fire(scheduled, elapsed);
    }
  }

  private fire(scheduled: ScheduledBeat, elapsed: number): void {
    const cue: KitCue = {
      kit: this.kit.kit,
      tier: this.kit.tier,
      mode: this.mode,
      beat: scheduled.beat,
      phase: scheduled.phase,
      scheduledMs: scheduled.atMs,
      tMs: elapsed,
      durationMs: scheduled.durationMs,
      params: paramsFor(this.kit, this.mode),
    };
    this.host.trace?.record(cue);
    this.host.onBeat?.(cue);
  }
}

/** Starts a kit at the commit frame `startMs`; every beat due at 0 ms fires before this returns. */
export function playKit(kit: DefinedKit, host: KitHost, startMs: number, mode: KitMode = KitMode.Full): KitRun {
  const run = new KitRun(kit, host, startMs, mode);
  run.advance(startMs);
  return run;
}
