import { Beat } from '../beat';
import type { BeatSpec, Range, TierRanges } from '../kitTypes';
import { KIT_RANGES } from './kitRanges';

const everyTier = Object.values(KIT_RANGES).flatMap((kit) =>
  Object.entries(kit.tiers).map(([tier, ranges]) => [`${kit.id}/${tier}`, ranges as TierRanges] as const),
);

const anchorsComeFirst = (beats: readonly BeatSpec[]): boolean =>
  beats.every((spec, index) => spec.after === undefined || beats.slice(0, index).some((earlier) => earlier.beat === spec.after));

const paramsNamed = (beats: readonly BeatSpec[]): string[] =>
  beats.flatMap((spec) => [...(spec.delayParams ?? []), ...(spec.durationParams ?? [])]);

describe('KIT_RANGES', () => {
  it('with all nine kits, lists every kit of feel-kits.md', () => {
    const ids = Object.keys(KIT_RANGES);

    const count = ids.length;

    expect(count).toBe(9);
  });

  it.each(everyTier)('%s, starts both beat lists with the commit frame', (_label, ranges) => {
    const firsts = [ranges.beats[0]?.beat, ranges.reducedMotionBeats[0]?.beat];

    const allCommit = firsts.every((beat) => beat === Beat.Commit);

    expect(allCommit).toBe(true);
  });

  it.each(everyTier)('%s, anchors every beat on an earlier beat', (_label, ranges) => {
    const lists = [ranges.beats, ranges.reducedMotionBeats];

    const ordered = lists.every(anchorsComeFirst);

    expect(ordered).toBe(true);
  });

  it.each(everyTier)('%s, times beats only with params that have a range', (_label, ranges) => {
    const named = paramsNamed([...ranges.beats, ...ranges.reducedMotionBeats]);

    const unranged = named.filter((name) => !(name in ranges.params));

    expect(unranged).toEqual([]);
  });

  it.each(everyTier)('%s, keeps every min at or below its max', (_label, ranges) => {
    const all: Range[] = [...Object.values(ranges.params), ...Object.values(ranges.reducedMotion)];

    const inverted = all.filter((range) => range.min > range.max);

    expect(inverted).toEqual([]);
  });

  it.each(everyTier)('%s, overrides only params the full kit has', (_label, ranges) => {
    const overrides = Object.keys(ranges.reducedMotion);

    const strays = overrides.filter((name) => !(name in ranges.params));

    expect(strays).toEqual([]);
  });
});
