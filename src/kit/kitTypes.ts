import type { Beat } from './beat';
import type { KitId } from './kitId';
import type { KitMode } from './kitMode';
import type { Tier } from './tier';

export interface Range {
  readonly min: number;
  readonly max: number;
  readonly orZero?: boolean;
}

/** An inclusive range; `orZero` also accepts 0 for an optional beat a game leaves off. */
export const between = (min: number, max: number, orZero = false): Range => ({ min, max, orZero });

export const exactly = (value: number): Range => between(value, value);

export interface BeatSpec {
  readonly beat: Beat;
  readonly after?: Beat;
  readonly atEnd?: boolean;
  readonly delayParams?: readonly string[];
  readonly durationParams?: readonly string[];
}

export type ParamRanges = Readonly<Record<string, Range>>;
export type ParamValues = Readonly<Record<string, number>>;

export interface TierRanges {
  readonly beats: readonly BeatSpec[];
  readonly reducedMotionBeats: readonly BeatSpec[];
  readonly params: ParamRanges;
  readonly reducedMotion: ParamRanges;
}

export interface KitDefinition {
  readonly id: KitId;
  readonly tiers: Readonly<Partial<Record<Tier, TierRanges>>>;
}

export interface KitConfig {
  readonly kit: KitId;
  readonly tier: Tier;
  readonly params: ParamValues;
  readonly reducedMotion?: ParamValues;
}

export interface DefinedKit {
  readonly kit: KitId;
  readonly tier: Tier;
  readonly beats: readonly BeatSpec[];
  readonly reducedMotionBeats: readonly BeatSpec[];
  readonly params: ParamValues;
  readonly reducedMotion: ParamValues;
}

export interface KitCue {
  readonly kit: KitId;
  readonly tier: Tier;
  readonly mode: KitMode;
  readonly beat: Beat;
  readonly scheduledMs: number;
  readonly tMs: number;
  readonly durationMs: number;
  readonly params: ParamValues;
}
