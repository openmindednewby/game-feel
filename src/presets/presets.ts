import type { KitConfig } from '../kit/kitTypes';
import { ACTION_PRESETS } from './data/actionPresets';
import { OUTCOME_PRESETS } from './data/outcomePresets';
import { PICKUP_PRESETS } from './data/pickupPresets';
import { PresetKey } from './presetKey';
import type { EventPresets } from './presetTypes';

/** Settle / Snap / Rush for every event class, ported from the Surge feel-kit options (FEEL-KIT-1). */
export const FEEL_PRESETS: readonly EventPresets[] = [...PICKUP_PRESETS, ...ACTION_PRESETS, ...OUTCOME_PRESETS];

/** The owner's recorded picks: Settle by default, Rush for the bump clank and the win tally. */
export const OWNER_DEFAULT_PICKS: Readonly<Record<string, PresetKey>> = Object.fromEntries(
  FEEL_PRESETS.map((event) => [event.id, event.id === 'bump' || event.id === 'win' ? PresetKey.Rush : PresetKey.Settle]),
);

/** The kit config for one event and preset, ready for `defineKit` / `playKit`; undefined when either is unknown. */
export function presetConfig(eventId: string, key: PresetKey = OWNER_DEFAULT_PICKS[eventId] ?? PresetKey.Settle): KitConfig | undefined {
  const event = FEEL_PRESETS.find((candidate) => candidate.id === eventId);
  const preset = event?.options.find((option) => option.key === key);
  if (event === undefined || preset === undefined) {
    return undefined;
  }
  return { kit: event.kit, tier: event.tier, params: preset.params, reducedMotion: preset.reducedMotion };
}
