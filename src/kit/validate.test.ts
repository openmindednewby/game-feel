import { KIT_RANGES } from './data/kitRanges';
import { KitId } from './kitId';
import type { KitConfig, ParamRanges, Range } from './kitTypes';
import { Tier } from './tier';
import { checkKit, defineKit, expectKitInRange } from './validate';

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
    flyMs: 0,
    hapticGapMs: 80,
    streakWindowMs: 0,
    streakCapSemitones: 0,
    hitstopMs: 0,
    shakePct: 0,
    flashMs: 0,
  },
  reducedMotion: { magnetMs: 0, popPeak: 1, popUpMs: 0, popOutMs: 80, sparkleCount: 1, counterBump: 1, counterBumpMs: 120 },
};

const mid = (range: Range): number => (Number.isFinite(range.max) ? (range.min + range.max) / 2 : range.min);
const midValues = (ranges: ParamRanges): Record<string, number> =>
  Object.fromEntries(Object.entries(ranges).map(([name, range]) => [name, mid(range)]));
const everyMidConfig: [string, KitConfig][] = Object.values(KIT_RANGES).flatMap((kit) =>
  Object.entries(kit.tiers).map(([tier, ranges]): [string, KitConfig] => [
    `${kit.id}/${tier}`,
    { kit: kit.id, tier: tier as Tier, params: midValues(ranges.params), reducedMotion: midValues(ranges.reducedMotion) },
  ]),
);

describe('checkKit', () => {
  it('with every pickup T1 value inside its range, returns no violations', () => {
    const config = PICKUP_COMMON;

    const problems = checkKit(config);

    expect(problems).toEqual([]);
  });

  it.each(everyMidConfig)('%s at the middle of every range, returns no violations', (_label, config) => {
    const subject = config;

    const problems = checkKit(subject);

    expect(problems).toEqual([]);
  });

  it('with a T1 pop peak of 1.6, reports it outside 1.15..1.4', () => {
    const config = { ...PICKUP_COMMON, params: { ...PICKUP_COMMON.params, popPeak: 1.6 } };

    const problems = checkKit(config);

    expect(problems).toEqual(['pickup/t1 popPeak: 1.6 outside 1.15..1.4']);
  });

  it('with a fly-to-HUD of 100 ms, reports it outside 250..500 or 0', () => {
    const config = { ...PICKUP_COMMON, params: { ...PICKUP_COMMON.params, flyMs: 100 } };

    const problems = checkKit(config);

    expect(problems).toEqual(['pickup/t1 flyMs: 100 outside 250..500 or 0', 'pickup/t1 reduced motion flyMs: 100 outside 250..500 or 0']);
  });

  it('with T1 hitstop at 20 ms, reports it (T1 never hitstops)', () => {
    const config = { ...PICKUP_COMMON, params: { ...PICKUP_COMMON.params, hitstopMs: 20 } };

    const problems = checkKit(config);

    expect(problems).toContain('pickup/t1 hitstopMs: 20 outside 0..0');
  });

  it('with no reduced-motion magnet override, reports the 60 ms magnet under reduced motion', () => {
    const config = { ...PICKUP_COMMON, reducedMotion: { popPeak: 1, popUpMs: 0, popOutMs: 80, sparkleCount: 1, counterBump: 1, counterBumpMs: 120 } };

    const problems = checkKit(config);

    expect(problems).toEqual(['pickup/t1 reduced motion magnetMs: 60 outside 0..0']);
  });

  it('with a missing and a misspelt param, reports both', () => {
    const { soundMs: _dropped, ...rest } = PICKUP_COMMON.params;
    const config = { ...PICKUP_COMMON, params: { ...rest, soundMS: 180 } };

    const problems = checkKit(config);

    expect(problems.slice(0, 2)).toEqual(['pickup/t1 soundMs: missing', 'pickup/t1 soundMS: unknown']);
  });

  it('with a tier the kit does not have, reports the tier', () => {
    const config: KitConfig = { kit: KitId.Move, tier: Tier.Jackpot, params: {} };

    const problems = checkKit(config);

    expect(problems).toEqual(['move has no tier t3']);
  });
});

describe('expectKitInRange', () => {
  it('with an out-of-range sparkle count, throws naming it', () => {
    const config = { ...PICKUP_COMMON, params: { ...PICKUP_COMMON.params, sparkleCount: 30 } };

    const act = (): void => expectKitInRange(config);

    expect(act).toThrow('pickup/t1 sparkleCount: 30 outside 3..8');
  });
});

describe('defineKit', () => {
  it('with a valid config, merges reduced-motion overrides over the full values', () => {
    const config = PICKUP_COMMON;

    const kit = defineKit(config);

    expect([kit.reducedMotion.magnetMs, kit.reducedMotion.soundMs, kit.params.magnetMs]).toEqual([0, 180, 60]);
  });

  it('with an invalid config, throws', () => {
    const config = { ...PICKUP_COMMON, params: { ...PICKUP_COMMON.params, magnetMs: 500 } };

    const act = (): unknown => defineKit(config);

    expect(act).toThrow('pickup/t1 magnetMs: 500 outside 40..100');
  });
});
