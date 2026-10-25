import { Beat } from './beat';
import { FEEL_TRACE_GLOBAL, FeelTrace, exposeFeelTrace, feelTraceRequested } from './feelTrace';
import { KitId } from './kitId';
import { KitMode } from './kitMode';
import type { KitCue } from './kitTypes';
import { Tier } from './tier';

const cue = (kit: KitCue['kit'], beat: KitCue['beat']): KitCue => ({
  kit,
  tier: Tier.Common,
  mode: KitMode.Full,
  beat,
  scheduledMs: 0,
  tMs: 0,
  durationMs: 0,
  params: {},
});

describe('FeelTrace.beats', () => {
  it('with two kits recorded, returns only the asked kit', () => {
    const trace = new FeelTrace();
    trace.record(cue(KitId.Pickup, Beat.Pop));
    trace.record(cue(KitId.Hit, Beat.Shake));

    const beats = trace.beats(KitId.Hit);

    expect(beats).toEqual([Beat.Shake]);
  });
});

describe('FeelTrace.clear', () => {
  it('with entries, empties the same array a page exposed', () => {
    const trace = new FeelTrace();
    const target: Record<string, unknown> = {};
    exposeFeelTrace(trace, target);
    trace.record(cue(KitId.Pickup, Beat.Pop));

    trace.clear();

    expect(target[FEEL_TRACE_GLOBAL]).toEqual([]);
  });
});

describe('exposeFeelTrace', () => {
  it('with a target, publishes the live entries as __feelTrace', () => {
    const trace = new FeelTrace();
    const target: Record<string, unknown> = {};

    exposeFeelTrace(trace, target);
    trace.record(cue(KitId.Pickup, Beat.Commit));

    expect((target.__feelTrace as KitCue[]).length).toBe(1);
  });
});

describe('feelTraceRequested', () => {
  it('with ?feeltrace=1, returns true', () => {
    const search = '?seed=4&feeltrace=1';

    const requested = feelTraceRequested(search);

    expect(requested).toBe(true);
  });

  it('without the flag, returns false', () => {
    const search = '?seed=4';

    const requested = feelTraceRequested(search);

    expect(requested).toBe(false);
  });
});
