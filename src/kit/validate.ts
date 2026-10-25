import { KIT_RANGES } from './data/kitRanges';
import { checkPhases } from './phases';
import type { DefinedKit, KitConfig, ParamRanges, ParamValues, Range, TierRanges } from './kitTypes';

const inRange = (value: number, range: Range): boolean =>
  (range.orZero === true && value === 0) || (value >= range.min && value <= range.max);

const describeRange = (range: Range): string => `${range.min}..${range.max}${range.orZero === true ? ' or 0' : ''}`;

function checkParams(values: ParamValues, ranges: ParamRanges, label: string): string[] {
  const problems: string[] = [];
  for (const [name, range] of Object.entries(ranges)) {
    const value = values[name];
    if (value === undefined) {
      problems.push(`${label} ${name}: missing`);
    } else if (!inRange(value, range)) {
      problems.push(`${label} ${name}: ${value} outside ${describeRange(range)}`);
    }
  }
  for (const name of Object.keys(values)) {
    if (!(name in ranges)) {
      problems.push(`${label} ${name}: unknown`);
    }
  }
  return problems;
}

const tierRangesOf = (config: KitConfig): TierRanges | undefined => KIT_RANGES[config.kit].tiers[config.tier];

/** Every way a kit config breaks FEEL-KIT-1: out-of-range values, unphased beats, a late player-input action. */
export function checkKit(config: KitConfig): string[] {
  const tier = tierRangesOf(config);
  if (tier === undefined) {
    return [`${config.kit} has no tier ${config.tier}`];
  }
  const label = `${config.kit}/${config.tier}`;
  const reducedValues = { ...config.params, ...config.reducedMotion };
  const reducedRanges = { ...tier.params, ...tier.reducedMotion };
  return [
    ...checkParams(config.params, tier.params, label),
    ...checkParams(reducedValues, reducedRanges, `${label} reduced motion`),
    ...checkPhases(KIT_RANGES[config.kit], {
      kit: config.kit,
      tier: config.tier,
      beats: tier.beats,
      reducedMotionBeats: tier.reducedMotionBeats,
      params: config.params,
      reducedMotion: reducedValues,
    }),
  ];
}

/** Throws with every violation when the kit config is outside the FEEL-KIT-1 ranges. */
export function expectKitInRange(config: KitConfig): void {
  const problems = checkKit(config);
  if (problems.length > 0) {
    throw new Error(`Feel kit out of range:\n${problems.join('\n')}`);
  }
}

/** Validates a game's kit config and returns the kit `playKit` runs. */
export function defineKit(config: KitConfig): DefinedKit {
  expectKitInRange(config);
  const tier = tierRangesOf(config) as TierRanges;
  return {
    kit: config.kit,
    tier: config.tier,
    beats: tier.beats,
    reducedMotionBeats: tier.reducedMotionBeats,
    params: { ...config.params },
    reducedMotion: { ...config.params, ...config.reducedMotion },
  };
}
