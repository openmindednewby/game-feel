import { juiceOn, reducedMotionRequested } from '../scale/feelScale';
import type { FeelSignals } from '../scale/feelScale';

export const KitMode = {
  Full: 'full',
  ReducedMotion: 'reduced',
  Off: 'off',
} as const;

export type KitMode = (typeof KitMode)[keyof typeof KitMode];

/** `?juice=0` plays only the commit beat; reduced motion plays the kit's reduced-motion variant. */
export function kitModeFrom(signals: FeelSignals): KitMode {
  if (!juiceOn(signals.search)) {
    return KitMode.Off;
  }
  return reducedMotionRequested(signals) ? KitMode.ReducedMotion : KitMode.Full;
}
