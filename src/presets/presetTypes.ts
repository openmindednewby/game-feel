import type { KitId } from '../kit/kitId';
import type { ParamValues } from '../kit/kitTypes';
import type { Tier } from '../kit/tier';
import type { PresetKey } from './presetKey';

export interface FeelPreset {
  readonly key: PresetKey;
  readonly line: string;
  readonly params: ParamValues;
  readonly reducedMotion: ParamValues;
  readonly sound?: string;
}

export interface EventPresets {
  readonly id: string;
  readonly kit: KitId;
  readonly tier: Tier;
  readonly shape?: string;
  readonly heavy?: boolean;
  readonly options: readonly FeelPreset[];
}
