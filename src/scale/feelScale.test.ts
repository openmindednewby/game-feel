import {
  FULL_FEEL,
  REDUCED_MOTION_PARTICLE_SCALE,
  REDUCED_MOTION_QUERY,
  feelScale,
  feelScaleFrom,
  juiceOn,
  reducedMotionRequested,
  scaleParticles,
} from './feelScale';

describe('juiceOn', () => {
  it('with ?juice=0, returns false', () => {
    const search = '?juice=0&level=3';

    const on = juiceOn(search);

    expect(on).toBe(false);
  });

  it('with no juice parameter, returns true', () => {
    const search = '?level=3';

    const on = juiceOn(search);

    expect(on).toBe(true);
  });
});

describe('reducedMotionRequested', () => {
  it('with ?reducedMotion=1 and no OS preference, returns true', () => {
    const signals = { search: '?reducedMotion=1', prefersReducedMotion: false };

    const reduced = reducedMotionRequested(signals);

    expect(reduced).toBe(true);
  });

  it('with neither the query nor the OS preference, returns false', () => {
    const signals = { search: '', prefersReducedMotion: false };

    const reduced = reducedMotionRequested(signals);

    expect(reduced).toBe(false);
  });
});

describe('feelScale', () => {
  it('with ?juice=0, turns every layer off including particles and squash', () => {
    const signals = { search: '?juice=0', prefersReducedMotion: false };

    const scale = feelScale(signals);

    expect(scale).toEqual({ shake: 0, hitStop: 0, flash: 0, particles: 0, squash: 0 });
  });

  it('with the OS reduced-motion preference, turns shake, hitstop and flash off and keeps 25% of particles', () => {
    const signals = { search: '', prefersReducedMotion: true };

    const scale = feelScale(signals);

    expect(scale).toEqual({ shake: 0, hitStop: 0, flash: 0, particles: REDUCED_MOTION_PARTICLE_SCALE, squash: 1 });
  });

  it('with no signals, returns full feel', () => {
    const signals = { search: '', prefersReducedMotion: false };

    const scale = feelScale(signals);

    expect(scale).toBe(FULL_FEEL);
  });
});

describe('feelScaleFrom', () => {
  it('with a host whose media query matches, returns the reduced scale', () => {
    const queries: string[] = [];
    const host = { location: { search: '' }, matchMedia: (q: string): { matches: boolean } => { queries.push(q); return { matches: true }; } };

    const scale = feelScaleFrom(host);

    expect([scale.shake, queries]).toEqual([0, [REDUCED_MOTION_QUERY]]);
  });

  it('with a host without matchMedia, returns full feel', () => {
    const host = { location: { search: '' } };

    const scale = feelScaleFrom(host);

    expect(scale).toBe(FULL_FEEL);
  });
});

describe('scaleParticles', () => {
  it('with reduced motion and 10 particles, rounds down to 2 so the cap is never exceeded', () => {
    const scale = feelScale({ search: '', prefersReducedMotion: true });

    const count = scaleParticles(10, scale);

    expect(count).toBe(2);
  });
});
