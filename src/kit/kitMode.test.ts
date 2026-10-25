import { KitMode, kitModeFrom } from './kitMode';

describe('kitModeFrom', () => {
  it('with ?juice=0 and reduced motion, returns Off', () => {
    const signals = { search: '?juice=0', prefersReducedMotion: true };

    const mode = kitModeFrom(signals);

    expect(mode).toBe(KitMode.Off);
  });

  it('with the OS reduced-motion preference, returns ReducedMotion', () => {
    const signals = { search: '', prefersReducedMotion: true };

    const mode = kitModeFrom(signals);

    expect(mode).toBe(KitMode.ReducedMotion);
  });

  it('with no signal, returns Full', () => {
    const signals = { search: '?level=2', prefersReducedMotion: false };

    const mode = kitModeFrom(signals);

    expect(mode).toBe(KitMode.Full);
  });
});
