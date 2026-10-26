import { checkRanking } from './checkRanking';
import { DEFAULT_RANK_AXES } from './rankChain';
import type { RankableKit } from './rankTypes';

const kit = (id: string, a: Record<string, number>, c: Record<string, number> = a): RankableKit => ({
  id,
  options: [
    { key: 'A', params: a },
    { key: 'C', params: c },
  ],
});
const chain = [['coin'], ['hit-1', 'hit-2'], ['death']];

describe('checkRanking', () => {
  it('with each step at or above the one below, returns no breach', () => {
    const kits = [kit('coin', { hitstopMs: 0 }), kit('hit-1', { hitstopMs: 40 }), kit('hit-2', { hitstopMs: 60 }), kit('death', { hitstopMs: 60 })];

    const breaches = checkRanking(kits, {}, chain, {});

    expect(breaches).toEqual([]);
  });

  it('with a lower step picked louder than a higher one, names both and their values', () => {
    const kits = [kit('coin', { shakePct: 0 }, { shakePct: 0.9 }), kit('hit-1', { shakePct: 0.3 }), kit('hit-2', { shakePct: 0.5 }), kit('death', { shakePct: 0.6 })];

    const breaches = checkRanking(kits, { coin: 'C' }, chain, {});

    expect(breaches).toEqual([
      { axis: 'shake', low: { id: 'coin', key: 'C', value: 0.9 }, high: { id: 'hit-1', key: 'A', value: 0.3 } },
      { axis: 'shake', low: { id: 'coin', key: 'C', value: 0.9 }, high: { id: 'hit-2', key: 'A', value: 0.5 } },
      { axis: 'shake', low: { id: 'coin', key: 'C', value: 0.9 }, high: { id: 'death', key: 'A', value: 0.6 } },
    ]);
  });

  it('with the breaching event skipped on that axis, returns no breach', () => {
    const kits = [kit('coin', { shakePct: 0.9 }), kit('death', { shakePct: 0.6 })];

    const breaches = checkRanking(kits, {}, chain, { shake: ['coin'] });

    expect(breaches).toEqual([]);
  });

  it('with the louder event kept as today, does not rank it', () => {
    const kits = [kit('coin', { hitstopMs: 90 }), kit('death', { hitstopMs: 60 })];

    const breaches = checkRanking(kits, { coin: 'T' }, chain, {});

    expect(breaches).toEqual([]);
  });

  it('with the second param name of an axis, ranks on it', () => {
    const kits = [kit('coin', { sparkleCount: 30 }), kit('death', { particleCount: 20 })];

    const breaches = checkRanking(kits, {}, chain, {}, { particles: DEFAULT_RANK_AXES.particles ?? [] });

    expect(breaches).toEqual([{ axis: 'particles', low: { id: 'coin', key: 'A', value: 30 }, high: { id: 'death', key: 'A', value: 20 } }]);
  });

  it('with a chain id that has no kit or no picked option, skips it', () => {
    const kits = [kit('coin', { hitstopMs: 90 })];

    const breaches = checkRanking(kits, { coin: 'B' }, chain, {});

    expect(breaches).toEqual([]);
  });
});
