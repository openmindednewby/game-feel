import type { Beat } from './beat';
import type { KitId } from './kitId';
import type { KitCue } from './kitTypes';

export const FEEL_TRACE_GLOBAL = '__feelTrace';

/** Records every beat a kit fires so a test can assert order, timing and the reduced-motion variant. */
export class FeelTrace {
  readonly entries: KitCue[] = [];

  record(cue: KitCue): void {
    this.entries.push(cue);
  }

  clear(): void {
    this.entries.length = 0;
  }

  beats(kit?: KitId): Beat[] {
    return this.entries
      .filter((entry: KitCue): boolean => kit === undefined || entry.kit === kit)
      .map((entry: KitCue): Beat => entry.beat);
  }
}

/** `?feeltrace=1` asks the game to expose its trace. */
export const feelTraceRequested = (search: string): boolean => new URLSearchParams(search).get('feeltrace') === '1';

/** Publishes the trace entries as `target.__feelTrace`, usually on `window`. */
export function exposeFeelTrace(trace: FeelTrace, target: Record<string, unknown>): void {
  target[FEEL_TRACE_GLOBAL] = trace.entries;
}
