export interface FeelScale {
  readonly shake: number;
  readonly hitStop: number;
  readonly flash: number;
  readonly particles: number;
  readonly squash: number;
}

export interface FeelSignals {
  readonly search: string;
  readonly prefersReducedMotion: boolean;
}

export interface FeelHost {
  readonly location: { readonly search: string };
  readonly matchMedia?: (query: string) => { readonly matches: boolean };
}

export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
export const REDUCED_MOTION_PARTICLE_SCALE = 0.25;

export const FULL_FEEL: FeelScale = { shake: 1, hitStop: 1, flash: 1, particles: 1, squash: 1 };

const REDUCED_FEEL: FeelScale = { shake: 0, hitStop: 0, flash: 0, particles: REDUCED_MOTION_PARTICLE_SCALE, squash: 1 };

const JUICE_OFF: FeelScale = { shake: 0, hitStop: 0, flash: 0, particles: 0, squash: 0 };

/** GF-42: `?juice=0` turns every amplification layer off. */
export const juiceOn = (search: string): boolean => new URLSearchParams(search).get('juice') !== '0';

/** GF-41: the OS setting or `?reducedMotion=1` asks for reduced motion. */
export const reducedMotionRequested = (signals: FeelSignals): boolean =>
  signals.prefersReducedMotion || new URLSearchParams(signals.search).get('reducedMotion') === '1';

/** One multiplier set for every juice layer from the query string and the motion preference. */
export function feelScale(signals: FeelSignals): FeelScale {
  if (!juiceOn(signals.search)) {
    return JUICE_OFF;
  }
  return reducedMotionRequested(signals) ? REDUCED_FEEL : FULL_FEEL;
}

/** The feel scale for a browser-like host, usually `window`. */
export function feelScaleFrom(host: FeelHost): FeelScale {
  const prefersReducedMotion = host.matchMedia?.(REDUCED_MOTION_QUERY).matches === true;
  return feelScale({ search: host.location.search, prefersReducedMotion });
}

export function scaleParticles(count: number, scale: FeelScale): number {
  return Math.floor(count * scale.particles);
}
